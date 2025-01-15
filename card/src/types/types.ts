export interface MenuItem {
  id: string
  category: string
  name: string
  description: string
  price: number
  image?: string
  allergens?: string[]
  hasComplements?: boolean
  complements?: Complement[]
}

export interface Complement {
  id: string
  name: string
  price?: number
}

export interface TableInfo {
  salon: string
  table: string
}

export interface Guest {
  id: number
  name: string
  isUser: boolean
}

export interface CartItem {
  uniqueId: string;
  menuItemId: string;
  name: string;
  price: number;
  complement: Complement[] | null;
  sharedWith: Guest[] | null;
  status: "pendiente" | "en proceso" | "servido";
}

export interface OrderContextType {
  orderState: any | null;
  fetchOrderState: () => Promise<void>;
  guests: any[];
  menuItems: MenuItem[];
  fetchMenuItems: () => Promise<void>;
  loading: boolean;
  error: string | null;
}
export interface OrderItem {
  id: number;
  name: string;
  price: number;
}
export interface GuestsWithOrders {
  guest: Guest,
  orderItems: OrderItem[],
  selected: boolean
}