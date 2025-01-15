import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "@/config/router";
import { UserProvider } from "@/context/UserContext";
import { OrderProvider } from "@/context/OrderContext";
import { ThemeProviderWrapper } from "@/context/ThemeContext";
import { SocketProvider } from "@/context/SocketContext";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <OrderProvider>
        <ThemeProviderWrapper>
          <SocketProvider>
            <RouterProvider router={router} />
          </SocketProvider>
        </ThemeProviderWrapper>
      </OrderProvider>
    </UserProvider>
  </React.StrictMode>
);
