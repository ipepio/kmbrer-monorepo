import useAxios from "@/hooks/useAxios";

export const fetchMenuItems = async () => {
    const axiosInstance = useAxios();
    const response = await axiosInstance.get("/api/tables/menu");
  return response.data.products;
};
