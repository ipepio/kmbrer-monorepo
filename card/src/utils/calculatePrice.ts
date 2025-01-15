import { CartItem } from "@/types/types";

export const calculateItemPrice = (item: CartItem): number => {
  const basePrice = item.price;
  const complementPrice = item.complement?.reduce((total, complement) => total + (complement.price || 0), 0) || 0;
  const totalPrice = basePrice + complementPrice;
  const sharedCount = (item.sharedWith?.length || 0) + 1;
  return totalPrice / sharedCount;
};
