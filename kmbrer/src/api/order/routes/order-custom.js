module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/orders/open',
      handler: 'order.getOpenOrders',
      config: {
        policies: [],        
      },
    },
    {
      method: 'GET',
      path: '/orders/:orderId/guests',
      handler: 'order.getSeats',
      config: {
        policies: [],
        auth: false,
        middlewares:['api::table.seat']
      },
    },
    {
      method: 'GET',
      path: '/orders/:orderId/details',
      handler: 'order.getOrderDetails',
      config: {
        policies: [],
        auth: false,
        middlewares:['api::table.seat']
      },
    },
    {
      method: 'GET',
      path: '/orders/items',
      handler: 'order.getItems',
      config: {
        policies: [],
        auth: false,
        middlewares:['api::table.seat']
      },
    },
    {
      method: 'POST',
      path: '/orders/:orderId/add-items',
      handler: 'order.addOrderItems',
      config: {
        policies: [],
        auth: false,
        middlewares:['api::table.seat']
      },
    },
    {
      method: 'POST',
      path: '/orders/:orderId/cancel-items',
      handler: 'order.cancelOrderItems',
      config: {
        policies: [],
        auth: false,
        middlewares:['api::table.seat']
      },
    },
    {
      method: 'POST',
      path: '/orders/:orderId/pay',
      handler: 'order.payOrder',
      config: {
        policies: [],
        auth: false,
        middlewares:['api::table.seat']
      },
    },
    {
      method: 'GET',
      path: '/orders/:orderId/restaurant',
      handler: 'order.getRestaurantData',
      config: {
        policies: [],
        auth: false,
        middlewares:['api::table.seat']
      },
    },        
  ],
};