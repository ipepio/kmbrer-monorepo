'use strict';
const { handleErrorResponse } = require("../../../utils/handleErrorResponse");
const userServices = require("../../../extensions/users-permissions/services/user.services");
const tableServices = require("../services/table.services");
const orderServices = require("../../order/services/order.services");
const seatServices = require("../../seat/services/seat.services");
const restaurantServices = require("../../restaurant/services/restaurant.services");
const productServices = require("../../product/services/product.services");
const jwt = require('jsonwebtoken');

// @ts-ignore
const { z } = require("zod");
const { randomTransactionId } = require("redsys-easy");

// @ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;

const openTableSchema = z.object({
  restaurant: z.number()
    .int("Restaurant must be an integer.")
    .min(1, "Restaurant ID must be at least 1."),
  table: z.number()
    .int("Restaurant must be an integer.")
    .min(1, "Restaurant ID must be at least 1."),
  numOfSeats: z.number()
    .int("Number of seats must be an integer.")
    .min(1, "Number of seats must be at least 1."),
});

module.exports = createCoreController('api::table.table', ({ strapi }) => ({
  async openTable(ctx) {
    try {
      const { restaurant, table, numOfSeats } = openTableSchema.parse(ctx.request.body);
      const user = await userServices.getUser({ id: ctx.state.user.id }, { restaurant: true });
      if (user.restaurant.id !== restaurant) {
        ctx.status = 403;
        return (ctx.body = { error: "You do not have permission to access this restaurant." });
      }
      const currentTable = await tableServices.getTable({ id: table });
      if (!currentTable) {
        ctx.status = 404;
        return (ctx.body = { error: "The specified table does not exist." });
      }
      const orderData = {
        table: currentTable,
        numOfSeats,
      };
      const currentOrder = await orderServices.create(orderData);
      if (currentOrder) {
        ctx.status = 200;
        return (ctx.body = {
          message: "Table opened successfully.",
          orderCode: currentOrder.code,
        });
      } else {
        ctx.status = 500;
        return (ctx.body = {
          error: "Failed to open table due to an unknown issue. Please contact support.",
        });
      }
    } catch (e) {
      if (e.name === 'ValidationError') {
        ctx.status = 400;
        return (ctx.body = {
          error: e.message || "Validation error occurred during table creation.",
        });
      }
      handleErrorResponse(e, ctx, `Error opening the table: ${e}`);
    }
  },
  async getOpenTables(ctx) {
    try {
      const user = await userServices.getUser({ id: ctx.state.user.id }, { restaurant: true });
      const openTables = await tableServices.getTables(
        { restaurant: user.restaurant },
        { restaurant: true }
      );

      const result = openTables.map(table => ({
        code: table.code,
        number: table.number,
        isOpen: table.isOpen,
      }));

      return ctx.send({ tables: result, restaurantName: user.restaurant.name });
    } catch (e) {
      if (e.name === 'ValidationError') {
        ctx.status = 400;
        return (ctx.body = {
          error: e.message || "Validation error occurred during table retrieval.",
        });
      }
      handleErrorResponse(e, ctx, `Error retrieving open tables: ${e.message}`);
    }
  },
  async checkTable(ctx) {
    const { tableId } = ctx.request.params;

    if (ctx.state.user) {
      const { id } = ctx.state.user;
      const seat = await seatServices.getSeat(
        { id: id },
        { order: { populate: { table: { populate: { restaurant: true } } } } }
      );

      if (seat && seat.order) {
        const table = seat.order.table;

        if (seat.order.isActive) {
          if (tableId && table && table.code !== tableId) {
            return ctx.unauthorized('Invalid token or table does not match');
          }
          const productsFromDB = await productServices.getProducts(
            { restaurants: table.restaurant },
            {
              restaurant: true, image: true,
              complement: true
            }
          );
          const products = productsFromDB.map(product => {
            return {
              ...product,
              image: product.image ? product.image.url : null
            };
          });
          return ctx.send({
            status: 'success',
            products,
            seat: seat,
            orderId: seat.order.id
          });
        } else {
          if (tableId) {
            const newOrder = await orderServices.getOrder(
              { isActive: true, table: { code: tableId } },
              { table: true }
            );

            if (newOrder && await orderServices.canAddSeat(newOrder)) {
              await seatServices.update(seat.id, { order: newOrder });

              if (!seat.name || seat.name.trim() === "") {
                const token = jwt.sign({ id: seat.id, userType: "guest" }, process.env.JWT_SECRET, { expiresIn: '1d' });
                return ctx.send({
                  status: 'confirmation_required',
                  confirmation_required: true,
                  seat: { id: seat.id, tableId: newOrder.table.code },
                  newToken: true,
                  token,
                });
              }
              const productsFromDB = await productServices.getProducts(
                { restaurants: table.restaurant },
                {
                  restaurant: true, image: true,
                  complement: true
                }
              );
              const products = productsFromDB.map(product => {
                return {
                  ...product,
                  image: product.image ? product.image.url : null
                };
              });
              return ctx.send({
                status:
                  'success',
                products,
                seat: seat,
                orderId: newOrder.id
              });
            }
          }

          return ctx.unauthorized('No active order associated with the user');
        }
      }

      return ctx.unauthorized('Invalid token or no order found for user');
    }

    if (!tableId) {
      return ctx.badRequest('Table code is required when no token is provided');
    }
    const table = await tableServices.getTable({ code: tableId })
    if (table.canOpenOrder) {

    }
    const order = await orderServices.getOrder(
      { isActive: true, table: { code: tableId } },
      { table: true }
    );

    if (!order) {
      if (table.canOpenOrder && table.isOpen) {
        const orderData = {
          table: table,
          numOfSeats: 99,
        };
        const newOrder = await orderServices.create(orderData)
        const newSeat = await seatServices.create({ name: "", order: newOrder });
        const token = jwt.sign({ id: newSeat.id, userType: "guest" }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return ctx.send({
          status: 'confirmation_required',
          confirmation_required: true,
          seat: { id: newSeat.id, tableId: newOrder.table.code },
          newToken: true,
          token,
        });
      }
      return ctx.notFound('Table has no open orders');
    }

    if (await orderServices.canAddSeat(order)) {
      const newSeat = await seatServices.create({ name: "", order });
      const token = jwt.sign({ id: newSeat.id, userType: "guest" }, process.env.JWT_SECRET, { expiresIn: '1d' });

      return ctx.send({
        status: 'confirmation_required',
        confirmation_required: true,
        seat: { id: newSeat.id, tableId: order.table.code },
        newToken: true,
        token,
      });
    }

    return ctx.notFound('Cannot assign a seat to the order');
  },
  async callWaiter(ctx) {
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.badRequest('You are not authenticated.');
      }
      const seat = await seatServices.getSeat({ id: user.id }, { order: { populate: { table: { populate: { restaurant: true } } } } })

      const restaurant = seat?.order?.table?.restaurant || null
      const table = seat?.order?.table || null
      if (!restaurant) {
        return ctx.notFound('Restaurant not found.');
      }

      const notification = {
        id : Math.floor(Math.random() * 9999),
        message: `Han llamado de la mesa ${table.id}`,
      };
      const room = `restaurant_${restaurant.id}`;
      strapi.io.to(room).emit('callWaiter', notification);
      ctx.body = { success: true };
    } catch (error) {
      console.error('Error calling waiter:', error);
      ctx.internalServerError('An error occurred while processing the request.');
    }
  }
}));
