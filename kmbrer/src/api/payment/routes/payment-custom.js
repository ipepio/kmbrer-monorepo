module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/payment/:orderId/pending-items',
        handler: 'payment.getPendingItems',
        config: {
          policies: [],
          auth: false,
          middlewares:['api::table.seat']
        },
      },
      {
        method: 'POST',
        path: '/payment/:orderId/card',
        handler: 'payment.payCardItems',
        config: {
          policies: [],
          auth: false,
          middlewares:['api::table.seat']
        },
      },
      {
        method: 'POST',
        path: '/payment/:orderId/own-order',
        handler: 'payment.payCardItemsFromOrder',
        config: {
          policies: [],
          auth: false,
          middlewares:['api::table.seat']
        },
      },      
      {
        method: 'POST',
        path: '/payment/:paymentId/complete',
        handler: 'payment.markTransactionComplete',
        config: {
          policies: [],
          auth: false,
          middlewares:['api::table.seat']
        },
      },
    ],
  };