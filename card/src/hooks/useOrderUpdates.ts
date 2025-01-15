import { useEffect, useState, useCallback } from "react";
import { Guest } from "@/types/types";
import useAxios from "@/hooks/useAxios";
import { useSocketContext } from "@/context/SocketContext";

export const useOrderUpdates = (orderId: string | undefined) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const axiosInstance = useAxios();
  const { socket } = useSocketContext();

  const fetchGuests = useCallback(async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/orders/${orderId}/guests`);
      setGuests(response.data.guests || []);
    } catch (error) {
      console.error("Error fetching guests:", error);
    } finally {
      setLoading(false);
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

  return { guests, loading, refreshGuests: fetchGuests };
};
