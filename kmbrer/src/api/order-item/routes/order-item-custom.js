module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/order-item/:orderItemId/status',
        handler: 'order-item.updateOrderItemStatus',
        config: {
          policies: [],
          auth: false,
          middlewares:['api::table.seat']
        },
      },      
    ],
  };