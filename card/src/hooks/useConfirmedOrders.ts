import { useEffect, useState, useCallback } from "react";
import useAxios from "@/hooks/useAxios";
import { useSocketContext } from "@/context/SocketContext";
import { CartItem } from "@/types/types";
import statusMapper from "@/utils/statusMapper";

export const useConfirmedOrders = (orderId: string | null) => {
  const [confirmedOrders, setConfirmedOrders] = useState<CartItem[]>([]);
  const axiosInstance = useAxios();
  const { socket } = useSocketContext();

  const parseData = (items: any[]): CartItem[] => {
    return items.map((item) => ({
      uniqueId: item.id,
      menuItemId: item?.product?.id || "",
      name: item?.product?.name,
      price: item?.price,
      complement: item?.complement || [],
      sharedWith: item?.sharedWith || [],
      status: statusMapper[item?.state] || "pendiente",
    }));
  };

  const fetchConfirmedOrders = useCallback(async () => {
    if (!orderId) return;
    try {
      const response = await axiosInstance.get(`api/orders/${orderId}/details`);
      const parsedData = parseData(response.data.order.order_items || []);
      setConfirmedOrders(parsedData);
    } catch (error) {
      console.error("Error fetching confirmed orders:", error);
    }
  }, [orderId, axiosInstance]);

  useEffect(() => {
    fetchConfirmedOrders();

    if (socket && orderId) {
      socket.emit("joinRoom", `order_${orderId}`);
      socket.on("orderUpdated", fetchConfirmedOrders);

      return () => {
        socket.off("orderUpdated", fetchConfirmedOrders);
      };
    }
  }, [socket, orderId, fetchConfirmedOrders]);

  return { confirmedOrders, setConfirmedOrders, refreshConfirmedOrders: fetchConfirmedOrders };
};
