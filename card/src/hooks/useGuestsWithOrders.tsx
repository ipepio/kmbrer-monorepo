import { useEffect, useState, useCallback } from "react";
import useAxios from "@/hooks/useAxios";
import { useSocketContext } from "@/context/SocketContext";
import { GuestsWithOrders } from "@/types/types";

export const useGuestsWithOrders = (orderId: string | null) => {
  const [guestsWithOrders, setGuestsWithOrders] = useState<GuestsWithOrders[]>([]);
  const axiosInstance = useAxios();
  const { socket } = useSocketContext();

  const fetchGuestsWithOrders = useCallback(async () => {
    if (!orderId) return;
    try {
      const response = await axiosInstance.get(`/api/payment/${orderId}/pending-items`);
      if (response.data.pendingItems.length > 0) {
        setGuestsWithOrders(response.data.pendingItems);
      }
    } catch (error) {
      console.error("Error fetching guests with orders:", error);
    }
  }, [orderId, axiosInstance]);

  useEffect(() => {
    fetchGuestsWithOrders();

    if (socket && orderId) {
      socket.emit("joinRoom", `order_${orderId}`);
      socket.on("orderUpdated", fetchGuestsWithOrders);

      return () => {
        socket.off("orderUpdated", fetchGuestsWithOrders);
      };
    }
  }, [socket, orderId, fetchGuestsWithOrders]);

  return { guestsWithOrders, refreshGuestsWithOrders: fetchGuestsWithOrders };
};
