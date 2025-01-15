'use strict';

/**
 * order controller
 */

// @ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;
const { handleErrorResponse } = require("../../../utils/handleErrorResponse")
const userServices = require("../../../extensions/users-permissions/services/user.services");
const seatServices = require("../../seat/services/seat.services")
const tableServices = require("../../table/services/table.services")
const orderServices = require("../../order/services/order.services")
const productServices = require("../../product/services/product.services")
const orderItemServices = require("../../order-item/services/orderItem.services")

// @ts-ignore
const { z } = require("zod");
const product = require("../../product/controllers/product");

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async getOpenOrders(ctx) {
    try {
      const user = await userServices.getUser({ id: ctx.state.user.id }, { restaurant: true });
      const openTables = await tableServices.getTables(
        { restaurant: user.restaurant, isOpen: false },
        { restaurant: true }
      );

      const result = [];

      for (const table of openTables) {
        const orders = await orderServices.getOrders(
          { table: table.id, isActive: true },
          { order_items: { populate: { product: true } }, seats: true }
        );
        if (orders.length === 0) {
          result.push({
            table_uuid: table.uuid,
            table_number: table.number,
            order_code: null,
            order_num_of_seats: null,
            order_is_paid: null,
            order_items: null,
            order_seats: null,
          });
        } else {
          for (const order of orders) {
            result.push({
              uuid: table.uuid,
              number: table.number,
              code: order.code,
              num_of_seats: order.numOfSeats,
              is_paid: order.isPaid,
              items: order.order_items,
              seats: order.seats,
              date: order.createdAt
            });
          }
        }
      }

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
  async getSeats(ctx) {
    try {
      const paramsSchema = z.object({
        orderId: z.string().nonempty("The 'orderId' parameter is required."),
      });

      const { orderId } = paramsSchema.parse(ctx.params);

      const user = ctx.state.user;
      if (!user) {
        return ctx.badRequest("You are not authenticated.");
      }

      const order = await orderServices.getOrder({ id: orderId }, { seats: true });
      if (!order) {
        return ctx.notFound("The specified order was not found.");
      }

      let guests = [];
      if (user.userType === "guest") {
        guests = order.seats
          .filter(seat => seat.id !== user.id)
          .map(({ id, name }) => ({ id, name }));
      } else if (await orderServices.canGetGuests(order, user)) {
        guests = order.seats.map(({ id, name }) => ({ id, name }));
      }
      ctx.body = { guests };
    } catch (error) {
      console.error("Error retrieving guests:", error);
      ctx.internalServerError("An error occurred while processing the request.");
    }
  },
  async getOrderDetails(ctx) {
    try {
      const paramsSchema = z.object({
        orderId: z.string().nonempty("The 'orderId' parameter is required."),
      });
      const { orderId } = paramsSchema.parse(ctx.params);
      const user = ctx.state.user;
      if (!user) {
        return ctx.badRequest("You are not authenticated.");
      }
      const order = await orderServices.getOrder({ id: orderId }, { seats: true, order_items: { populate: { product: true, seat: true, sharedWith: true, complement: true } } });
      if (!order) {
        return ctx.notFound("The specified order was not found.");
      }
      order.order_items = order.order_items.filter(item => item.state !== "cancelled");
      if (user.userType === "guest") {
        order.order_items = order.order_items.filter(item => {
          const isOwnedByUser = item.seat.id === user.id;
          const isSharedWithUser = item.sharedWith.some(shared => shared.id === user.id);
          return isOwnedByUser || isSharedWithUser;
        });
      }
      for (const item of order.order_items) {
        if (item.isPaid === "true") {
          item.price = 0;
        } else if (item.isPaid === "partial") {
          const relatedPaymentItems = await strapi.entityService.findMany(
            'api::payment-item.payment-item',
            {
              filters: {
                orderItem: item.id,
                payment: { transactionComplete: true },
              },
            }
          );
          const paidAmount = relatedPaymentItems.reduce((sum, paymentItem) => sum + paymentItem.amount, 0);
          item.price = Math.max(0, item.price - paidAmount);
        }
      }

      ctx.body = { order };
    } catch (error) {
      console.error("Error retrieving order details:", error);
      ctx.internalServerError("An error occurred while processing the request.");
    }
  },
  
  async getItems(ctx) {
    try {
      const user = ctx.state.user;
      if (!user) {
        return ctx.badRequest("You are not authenticated.");
      }
      const userWithRestaurant = await strapi.query("plugin::users-permissions.user").findOne({
        where: { id: user.id },
        populate: {
          restaurant: true,
        },
      });
  
      if (!userWithRestaurant || !userWithRestaurant.restaurant) {
        return ctx.notFound("Restaurant not found for the authenticated user.");
      }
      const restaurantId = userWithRestaurant.restaurant.id;
      const activeOrders = await orderServices.getOrders(
        {
          isActive: true,
          table: {
            restaurant: restaurantId,
          },
        },
        {
          table: true,
          order_items: {
            populate: {
              product: true,
              complement: true,
            },
          },
        },
      );
  
      if (!activeOrders || activeOrders.length === 0) {
        return ctx.notFound("No active orders found for the restaurant.");
      }
  
      const orderItems = activeOrders.flatMap((order) =>
        order.order_items.map((item) => ({
          orderId: order.id,
          orderItemId: item.id,
          name: item.product?.name || "Unknown Product",
          comments: item.comments || "",
          complements: item.complement?.map((comp) => comp.name) || [],
          tableId: order.table?.id || null,
          status: item.state || "pending",
        }))
      );  
      const sortedOrderItems = orderItems.sort((a, b) => b.orderItemId - a.orderItemId);
      ctx.body = {
        order_items: sortedOrderItems,
      };
    } catch (error) {
      console.error("Error retrieving order items:", error);
      ctx.internalServerError("An error occurred while processing the request.");
    }
  },
  
  async addOrderItems(ctx) {
    try {
      const bodySchema = z.object({
        items: z
          .array(
            z.object({
              menuItemId: z.string().nonempty("The 'menuItemId' field is required."),
              name: z.string().nonempty("The 'name' field is required."),
              sharedWith: z
                .array(
                  z.object({
                    id: z.number().nullable(),
                    name: z.string().nullable(),
                  })
                )
                .nullable()
                .optional(),
              price: z.number().nullable().optional(),
              seatId: z.string().nullable().optional(),
              quantity: z.number().positive("The 'quantity' field must be greater than 0.").default(1),
              comments: z.string().nullable().optional(),
            })
          )
          .nonempty("The 'items' array must not be empty."),
      });

      const paramsSchema = z.object({
        orderId: z.string().nonempty("The 'orderId' field is required."),
      })
      const { items } = bodySchema.parse(ctx.request.body);
      const { orderId } = paramsSchema.parse(ctx.params);

      const user = ctx.state.user;
      if (!user) {
        return ctx.badRequest("You are not authenticated.");
      }

      const order = await orderServices.getOrder({ id: orderId });
      if (!order) {
        return ctx.notFound("The specified order was not found.");
      }

      const createdItems = [];
      for (const item of items) {
        const { menuItemId, sharedWith, seatId, price: specifiedPrice, quantity, comments, complement } = item;
        const seat = user.userType === "guest" ? await seatServices.getSeat({ id: user.id }) : await seatServices.getSeat({ id: seatId })
        let finalPrice = specifiedPrice;
        const productData = await productServices.getProduct({ id: menuItemId });
        if (!specifiedPrice || !(await orderServices.canSetPrice(user))) {
          if (!productData) {
            return ctx.badRequest(`The product with ID ${product} does not exist.`);
          }
          finalPrice = productData.price * quantity;
        }

        const orderItemData = {
          product: productData,
          sharedWith: sharedWith || [],
          seat,
          price: finalPrice,
          quantity,
          comments: comments || "",
          order: order,
          state: "pending",
          complement: complement || []
        };

        const createdItem = await orderItemServices.create(orderItemData, { product: true, seat: true, order: true, sharedWith: true, complement: true });
        createdItems.push(createdItem);
      }

      ctx.body = { success: true, createdItems };
    } catch (error) {
      console.error("Error adding order items:", error);
      ctx.internalServerError("An error occurred while processing the request.");
    }
  },
  async cancelOrderItems(ctx) {
    try {
      const bodySchema = z.object({
        itemId: z.string().nonempty("The 'orderId' field is required.")
      })

      const paramsSchema = z.object({
        orderId: z.string().nonempty("The 'orderId' field is required."),
      })
      const { itemId } = (ctx.request.body);
      const { orderId } = paramsSchema.parse(ctx.params);

      const user = ctx.state.user;
      if (!user) {
        return ctx.badRequest("You are not authenticated.");
      }

      const order = await orderServices.getOrder({ id: orderId });
      if (!order) {
        return ctx.notFound("The specified order was not found.");
      }
      const currentItem = await orderItemServices.getOrderItem({ id: itemId })
      currentItem.state = "cancelled"
      await orderItemServices.update(currentItem.id, currentItem)
      ctx.body = { success: true };
    } catch (error) {
      console.error("Error adding order items:", error);
      ctx.internalServerError("An error occurred while processing the request.");
    }
  },
  async payOrder(ctx) {
    try {
      const paramsSchema = z.object({
        orderId: z.string().nonempty("The 'orderId' field is required."),
      })
      const { orderId } = paramsSchema.parse(ctx.params);
      const user = ctx.state.user;
      if (!user) {
        return ctx.badRequest("You are not authenticated.");
      }
      const order = await orderServices.getOrder({ id: orderId });
      if (!order) {
        return ctx.notFound("The specified order was not found.");
      }
      ctx.body = { success: true };
    } catch (error) {
      console.error("Error adding order items:", error);
      ctx.internalServerError("An error occurred while processing the request.");
    }
  },
  async getRestaurantData(ctx) {
    const paramsSchema = z.object({
      orderId: z.string().nonempty("The 'orderId' field is required."),
    })
    const { orderId } = paramsSchema.parse(ctx.params);
    const user = ctx.state.user;
    if (!user) {
      return ctx.badRequest("You are not authenticated.");
    }
    const order = await orderServices.getOrder({ id: orderId }, { table: { populate: { restaurant: { populate: { logo: true } } } } });
    if (!order) {
      return ctx.notFound("The specified order was not found.");
    }
    return {
      restaurant: {
        name: order.table.restaurant.name,
        imageUrl: order.table.restaurant.logo?.url || null,
        tableNumber: order.table.number, 
      },
    };
    
  }
}));
