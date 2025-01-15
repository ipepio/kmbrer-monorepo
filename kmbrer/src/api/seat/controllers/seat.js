'use strict';
const seatServices = require("../services/seat.services")
const orderServices = require("../../order/services/order.services")

/**
 * seat controller
 */

// @ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::seat.seat', ({ strapi }) => ({
    async confirmSeat(ctx) {
        // console.log(ctx)
        if (ctx.state.user) {
            // console.log(ctx.state.user)
            const seat = await seatServices.getSeat({id : ctx.state.user.id}, {order : true})
            if (seat)
            {
                seat.name = ctx.request.body.dinerName;
                await seatServices.update(seat.id, seat)
            }
            return ctx.send({
                status: 'success',
                seat: seat,
                orderId : seat.order.id
              });
        }
    }
}))