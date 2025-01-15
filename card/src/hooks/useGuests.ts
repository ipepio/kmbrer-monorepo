import { useEffect, useState, useCallback } from "react";
import useAxios from "@/hooks/useAxios";
import { GuestsWithOrders } from "@/types/types";
import { Guest } from "@/types/types";
import { useOrderContext } from "@/context/OrderContext";
import { useSocketContext } from "@/context/SocketContext";
export const useGuests = () => {
  const { orderId } = useOrderContext();
  const [guestsWithOrders, setGuestsWithOrders] = useState<GuestsWithOrders[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const axiosInstance = useAxios();
  const { socket } = useSocketContext();
  const fetchGuests = useCallback(async () => {
    if (!orderId) return;
    try {
      const response = await axiosInstance.get(`/api/orders/${orderId}/guests`);
      setGuests(response.data.guests || []);
      setGuestsWithOrders(response.data.guests || []);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  }, [orderId, axiosInstance]);
  useEffect(() => {
    fetchGuests();

    if (socket && orderId) {
      socket.emit("joinRoom", `order_${orderId}`);
      socket.on("orderUpdated", fetchGuests);

      return () => {
        socket.off("orderUpdated", fetchGuests);
      };
    }
  }, [socket, orderId, fetchGuests]);

  return { guests, guestsWithOrders, refreshGuests: fetchGuests };
};
