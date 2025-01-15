import { useState, useCallback } from "react";
import { fetchMenuItems } from "@/services/menuService";
import { MenuItem } from "@/types/types";

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchMenuItems();
      setMenuItems(items);
    } catch (err: any) {
      setError(err.message || "Error fetching menu items");
    } finally {
      setLoading(false);
    }
  }, []);

  return { menuItems, fetchItems, loading, error };
};
