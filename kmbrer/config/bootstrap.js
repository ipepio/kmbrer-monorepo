// const { Server } = require('socket.io');

// module.exports = async ({ strapi }) => {
//   // Asegúrate de que el servidor HTTP está listo
//   strapi.server.httpServer.on('listening', () => {
//     const io = new Server(strapi.server.httpServer, {
//       cors: {
//         origin: '*', // Ajusta según tus necesidades
//         methods: ['GET', 'POST'],
//       },
//     });

//     io.on('connection', (socket) => {
//       console.log('Nuevo cliente conectado:', socket.id);

//       socket.on('message', (data) => {
//         console.log('Mensaje recibido:', data);
//       });

//       socket.on('disconnect', () => {
//         console.log('Cliente desconectado:', socket.id);
//       });
//     });

//     // Hacer que `io` esté disponible globalmente
//     strapi.io = io;
//     console.log('Socket.IO está listo');
//   });
// };
