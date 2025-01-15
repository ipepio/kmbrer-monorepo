import useAxios from "@/hooks/useAxios";

export const fetchOrderDetails = async (orderId: string) => {
    const axiosInstance = useAxios();
  const response = await axiosInstance.get(`/api/orders/${orderId}/details`);
  return response.data;
};
