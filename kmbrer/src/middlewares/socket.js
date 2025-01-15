const { Server } = require('socket.io');

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (!strapi.io) {
      const httpServer = strapi.server.httpServer;

      // Asegúrate de que el servidor HTTP esté inicializado
      if (httpServer) {
        const io = new Server(httpServer, {
          cors: {
            origin: '*', // Cambia según sea necesario
            methods: ['GET', 'POST'],
          },
        });

        io.on('connection', (socket) => {
          console.log('Nuevo cliente conectado:', socket.id);

          // Manejo del evento para unirse a una "room"
          socket.on('joinRoom', (room) => {
            console.log(`Cliente ${socket.id} se une a la room: ${room}`);
            socket.join(room);
          });

          // Manejo del evento "disconnect"
          socket.on('disconnect', (reason) => {
            console.log(`Cliente desconectado: ${socket.id}, razón: ${reason}`);
          });

          // Manejo de otros eventos según sea necesario
          socket.on('message', (data) => {
            console.log('Mensaje recibido:', data);
          });
        });

        // Hacer `io` accesible globalmente
        strapi.io = io;
        console.log('Socket.IO inicializado');
      }
    }

    await next();
  };
};
