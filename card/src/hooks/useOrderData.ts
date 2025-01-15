import { useState, useEffect, useCallback } from "react";
import useAxios from "@/hooks/useAxios";
import { useSocketContext } from "@/context/SocketContext";

export const useOrderData = (orderId: string | null) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const axiosInstance = useAxios();
  const { socket } = useSocketContext();

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return;
    try {
      const response = await axiosInstance.get(`/api/orders/${orderId}/details`);
      setOrderDetails(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  }, [orderId, axiosInstance]);

  useEffect(() => {
    fetchOrderDetails();

    if (socket && orderId) {
      socket.emit("joinRoom", `order_${orderId}`);
      socket.on("orderUpdated", fetchOrderDetails);

      return () => {
        socket.off("orderUpdated", fetchOrderDetails);
      };
    }
  }, [socket, orderId, fetchOrderDetails]);

  return { orderDetails, fetchOrderDetails };
};
