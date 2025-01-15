import React, { createContext, useContext, useState } from 'react';

export interface Order {
  orderId: number;
  orderItemId: number;
  name: string;
  comments: string;
  complements: string[];
  tableId: number;
  status: 'pedido' | 'preparacion' | 'listo';
}

interface Notification {
  id: number;
  message: string;
}

interface OrdersContextType {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  return (
    <OrdersContext.Provider value={{ orders, setOrders, notifications, setNotifications }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrdersContext = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrdersContext must be used within an OrdersProvider');
  }
  return context;
};
