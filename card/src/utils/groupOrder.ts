import { GuestsWithOrders } from "@/types/types";

export const groupOrdersByGuest = (orders: any[], currentUserId: number, currentUserName: string): GuestsWithOrders[] => {
  const guestMap = new Map<number, GuestsWithOrders>();

  orders.forEach((item) => {
    if (!guestMap.has(currentUserId)) {
      guestMap.set(currentUserId, {
        guest: { id: currentUserId, name: currentUserName, isUser: true },
        orderItems: [],
        selected: true,
      });
    }

    guestMap.get(currentUserId)?.orderItems.push({
      id: Number(item.uniqueId),
      name: item.name,
      price: item.price,
    });

    item.sharedWith?.forEach((guest: any) => {
      const guestId = Number(guest.id);
      if (!guestMap.has(guestId)) {
        guestMap.set(guestId, {
          guest: { id: guestId, name: guest.name, isUser: guest.isUser },
          orderItems: [],
          selected: false,
        });
      }
      guestMap.get(guestId)?.orderItems.push({
        id: Number(item.uniqueId),
        name: item.name,
        price: item.price,
      });
    });
  });

  return Array.from(guestMap.values());
};
