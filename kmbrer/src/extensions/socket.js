// const http = require('http');
// const { Server } = require('socket.io');

// module.exports = ({ strapi }) => {
//   const server = http.createServer(strapi.server.app.callback());
//   // const io = new Server(server, {
//   //   cors: {
//   //     origin: "*",
//   //     methods: ["GET", "POST"],
//   //   },
//   // });
//   // strapi.io = io;
//   // io.on('connection', (socket) => {
//   //   console.log('Nuevo cliente conectado:', socket.id);

//   //   socket.on('joinOrderRoom', (orderId) => {
//   //     socket.join(`order_${orderId}`);
//   //     console.log(`Cliente ${socket.id} unido al room de order ${orderId}`);
//   //   });

//   //   socket.on('disconnect', () => {
//   //     console.log('Cliente desconectado:', socket.id);
//   //   });
//   // });
//   // const port = process.env.PORT || 1337;
//   // server.listen(port, () => {
//   //   console.log(`Servidor con Socket.IO escuchando en el puerto ${port}`);
//   // });
//   console.log("Pasando por socket")
// };
