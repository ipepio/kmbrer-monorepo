import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const useSocket = (url: string, room: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!room) return;

    const socketInstance = io(url, {
      transports: ['websocket'],
      reconnectionAttempts: 100,
      reconnectionDelay: 100,
    });

    socketInstance.on('connect', () => {
      console.log('WebSocket conectado:', socketInstance.id, "room:", room);
      socketInstance.emit('joinRoom', room);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('WebSocket desconectado:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Error en la conexión WebSocket:', error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [url, room]);

  return socket;
};

export default useSocket;
