import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "@/config/router";
import { UserProvider } from "@/context/UserContext";
import { ThemeProviderWrapper } from "@/context/ThemeContext";
import { SocketProvider } from "@/context/SocketContext";
import { OrdersProvider } from '@/context/OrderContext';
import { RestaurantProvider } from "./context/RestaurantContext";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <ThemeProviderWrapper>
        <SocketProvider>
          <RestaurantProvider>
            <OrdersProvider>
              <RouterProvider router={router} />
            </OrdersProvider>
          </RestaurantProvider>
        </SocketProvider>
      </ThemeProviderWrapper>
    </UserProvider>
  </React.StrictMode>
);
