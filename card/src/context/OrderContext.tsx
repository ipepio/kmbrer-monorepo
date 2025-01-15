import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUserData } from "@/utils/localStorage"; // Si estás obteniendo datos de localStorage

interface OrderContextProps {
  orderId: string | null;
  setOrderId: (id: string) => void;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {  
    const storedOrderId = getUserData()?.orderId || null;
    if (storedOrderId) {
      setOrderId(storedOrderId);
    }
  }, []);

  return (
    <OrderContext.Provider value={{ orderId, setOrderId }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext debe ser usado dentro de un OrderProvider");
  }

  const { orderId, setOrderId } = context;

  // Si orderId es null, intenta recuperarlo del localStorage
  if (!orderId) {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      if (parsedUserData.orderId) {
        setOrderId(parsedUserData.orderId); // Actualiza el contexto con el orderId recuperado
        return { ...context, orderId: parsedUserData.orderId }; // Devuelve el contexto actualizado
      }
    }
  }

  return context;
};
