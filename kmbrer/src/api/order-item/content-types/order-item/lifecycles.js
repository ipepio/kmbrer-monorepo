const orderItemServices = require('../../services/orderItem.services.js')
const tableServices = require('../../../table/services/table.services.js')
const seatServices = require('../../../seat/services/seat.services.js')
module.exports = {
    async afterCreate(event) {
        const updatedItem = await orderItemServices.getOrderItem(
            { id: event.result.id },
            { order: {populate:{ table:{populate:{restaurant: true}} }} }
        );
        const order = updatedItem.order
        if (strapi.io) {
            const room = `order_${order.id}`
            strapi.io.to(room).emit('orderUpdated', { message: 'Item has been updated' });
            const restaurant = `restaurant_${order.table.restaurant.id}`
            strapi.io.to(restaurant).emit('orderUpdate', { message: 'Item has been updated' });
        }
    },
    async afterUpdate(event) {
        const updatedItem = await orderItemServices.getOrderItem(
            { id: event.params.where.id },
            { order: {populate:{ table:{populate:{restaurant: true}} }} }
        );
        const order = updatedItem.order
        if (strapi.io) {
            const room = `order_${order.id}`
            strapi.io.to(room).emit('orderUpdated', { message: 'Item has been updated' });
            const restaurant = `restaurant_${order.table.restaurant.id}`
            strapi.io.to(restaurant).emit('orderUpdate', { message: 'Item has been updated' });
        }
    },

};