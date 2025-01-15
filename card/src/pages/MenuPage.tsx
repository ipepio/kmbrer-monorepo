import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrderView from "@/components/OrderView/OrderView";
import { useMenuData } from "@/hooks/useMenuData";
import { useGuests } from "@/hooks/useGuests";
import { useUserContext } from "@/context/UserContext";
import { Header } from "@/components/Layout/Header";
import { useRestaurantData } from "@/hooks/useRestaurantData"

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { menuItems,
    fetchMenuData } = useMenuData();
  const { guests } = useGuests();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const orderId = userData.orderId || null;
  const { restaurantData } = useRestaurantData(orderId);

  useEffect(() => {
    if (user === null) return;

    if (!user) {
      navigate("/scan");
      return;
    }
    fetchMenuData();
  }, [user, fetchMenuData, navigate]);
  useEffect(() => {
    console.log("guests updated:", guests);
  }, [guests]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", paddingBottom: "3vh" }}>
      <Header restaurantData={restaurantData} user={user} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <OrderView menuItems={menuItems} guests={guests} />
      </div>
    </div>
  );
};

export default MenuPage;
