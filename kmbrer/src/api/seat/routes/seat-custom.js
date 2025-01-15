module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/seat/confirm',
      handler: 'seat.confirmSeat',
      config: {
        policies: [],
        auth: false,
        middlewares: ['api::table.seat']
      },
    }
  ]
}
