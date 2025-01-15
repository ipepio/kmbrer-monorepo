'use strict';

module.exports = {
  register({ strapi }) {
    // console.log('Inicializando strapi')
    // require('./extensions/socket')({ strapi }); // Inicializar Socket.IO
  },
  bootstrap({ strapi }) {},
};

// const { Server } = require('socket.io');

// module.exports = async ({ strapi }) => {
//   console.log('Inicializando strapi');

//   const httpServer = strapi.server.httpServer; // Obtener el servidor HTTP principal
//   const io = new Server(httpServer, {
//     cors: {
//       origin: '*', // Configura CORS según tus necesidades
//     },
//   });

//   io.on('connection', (socket) => {
//     console.log('Nuevo cliente conectado:', socket.id);

//     socket.on('joinOrderRoom', (orderId) => {
//       socket.join(`order_${orderId}`);
//       console.log(`Cliente ${socket.id} unido al room de order ${orderId}`);
//     });

//     socket.on('disconnect', () => {
//       console.log('Cliente desconectado:', socket.id);
//     });
//   });

//   // Adjuntar Socket.IO a Strapi
//   strapi.io = io;
// };
