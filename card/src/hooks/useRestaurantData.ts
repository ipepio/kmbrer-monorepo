import { useState, useEffect } from "react";
import useAxios from "@/hooks/useAxios";

interface RestaurantData {
  name: string;
  imageUrl: string;
  tableNumber: string;
}

export function useRestaurantData(orderId: string | null) {
  const axiosInstance = useAxios();
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);

  useEffect(() => {
    if (!orderId) return;
    async function fetchRestaurantData() {
      try {
        const { data } = await axiosInstance.get(`/api/orders/${orderId}/restaurant`);
        setRestaurantData(data?.restaurant || null);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    }
    fetchRestaurantData();
  }, [orderId, axiosInstance]);

  return { restaurantData };
}
