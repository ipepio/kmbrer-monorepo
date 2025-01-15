import { useCallback } from "react";
import useAxios from "@/hooks/useAxios";
export const useCancelOrderItem = (orderId: string | null) => {
  const axiosInstance = useAxios();
  const cancelOrderItem = useCallback(async (itemId: string) => {
      if (!orderId)return;      
      try {
        const response = await axiosInstance.post(`/api/orders/${orderId}/cancel-items`, { itemId });
        if (response.status === 200) {
          console.log(`Item ${itemId} from order ${orderId} cancelled successfully`);
          // Notifica al backend o realiza otras tareas si es necesario
        } else {
          console.error(`Failed to cancel item ${itemId}. Response status:`, response.status);
          alert("Error cancelling the item. Please try again.");
        }
      } catch (error) {
        console.error("Error cancelling item:", error);
        alert("An error occurred while cancelling the item.");
      }
    },
    [orderId, axiosInstance]
  );

  return { cancelOrderItem };
};