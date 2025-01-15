import { useState, useCallback } from "react";
import useAxios from "@/hooks/useAxios";
import { MenuItem } from "@/types/types";

export const useMenuData = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const axiosInstance = useAxios();
  // const parseData = (products: any[]): MenuItem[] => {
  //   return products.map((product) => ({
  //     id: product.id.toString(),
  //     category: product.category,
  //     name: product.name,
  //     description: product.description,
  //     price: product.basePrice,
  //     allergens: product.allergens || [],
  //     hasComplements: false,
  //     complements: [],
  //     image: product?.image ? product?.image : undefined,
  //   }));
  // };
  const parseData = (products: any[]): MenuItem[] => {
    return products.map((product) => {
      const hasComplements = Array.isArray(product.complement) && product.complement.length > 0;
      return {
        id: product.id.toString(),
        category: product.category,
        name: product.name,
        description: product.description,
        price: product.basePrice,
        allergens: product.allergens || [],
        hasComplements: hasComplements,
        complements: hasComplements
          ? product.complement.map((complement: any) => ({
              id: complement.id.toString(),
              name: complement.name,
              price: complement.price || 0,
            }))
          : [],
        image: product?.image ? product?.image : undefined,
      };
    });
  };
  
  const fetchMenuData = useCallback(async () => {
    
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/api/tables/validate");
      const parsedMenuItems = parseData(response.data.products || []);
      setMenuItems(parsedMenuItems);
      setOrderId(response.data.orderId || null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching menu data.");
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]);

  return { menuItems, orderId, loading, error, fetchMenuData };
};
