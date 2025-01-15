module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/tables/open',
        handler: 'table.openTable',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/tables/open',
        handler: 'table.getOpenTables',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/tables/open/:tableId',
        handler: 'table.checkTable',
        config: {
          policies: [],
          auth: false,
          middlewares:['api::table.seat']
        },
      },
      {
        method: 'GET',
        path: '/tables/validate',
        handler: 'table.checkTable',
        config: {
          policies: [],
          auth: false,
          middlewares:['api::table.seat']
        },
      },
      {
        method: 'POST',
        path: '/tables/call-waiter',
        handler: 'table.callWaiter',
        config: {
          policies: [],
          auth: false,
          middlewares:['api::table.seat']
        },
      }
    ]
  }
  