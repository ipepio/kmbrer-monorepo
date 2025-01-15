// context/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_URL } from "@/config/config";

interface SocketContextProps {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(API_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 100,
      reconnectionDelay: 100,
    });

    socketInstance.on("connect", () => {
      console.log("WebSocket conectado:", socketInstance.id);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("WebSocket desconectado:", reason);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Error en la conexión WebSocket:", error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
