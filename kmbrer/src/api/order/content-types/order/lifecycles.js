const orderServices = require('../../services/order.services.js')
const tableServices = require('../../../table/services/table.services.js')
const seatServices = require('../../../seat/services/seat.services.js')
module.exports = {
  async beforeCreate(event) {
    const data = event.params.data
    await orderServices.checkTable(data);
  },
  async beforeUpdate(event) {
    const currentOrder = await orderServices.getOrder({ id: event.params.where.id }, { table: true })
    if (currentOrder.isActive !== event.params.data.isActive)
      await tableServices.update(currentOrder.table.id, { isOpen: true })
  },
  async afterUpdate(event) {
    const updatedOrder = await orderServices.getOrder(
      { id: event.params.where.id },
      { table: {populate:{restaurant: true}} }
    );
    if (strapi.io) {
      const room = `order_${updatedOrder.id}`
      strapi.io.to(room).emit('orderUpdated', { message: 'Order has been updated' });
      const restaurant = `restaurant_${updatedOrder.table.restaurant.id}`
      strapi.io.to(restaurant).emit('orderUpdate', { message: 'Item has been updated' });
    }
  },

};