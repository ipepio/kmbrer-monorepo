// src/types/props.ts
import { MenuItem, CartItem, Complement, Guest, GuestsWithOrders } from "./types";

// Props de MenuItemCard
export interface MenuItemCardProps {
  item: MenuItem;
  cartItems: CartItem[];
  onAddToCart: (item: MenuItem, complements?: Complement[], sharedWith?: Guest[]) => void;
  onRemoveFromCart: () => void;
  onItemClick: () => void;
  guests: Guest[];
}

export interface ComplementModalProps {
  isOpen: boolean;
  onClose: () => void;
  complements: Complement[];
  onSelect: (complements: Complement[]) => void;
}

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: Guest[];
  onShare: (selectedGuests: Guest[]) => void;
}

export interface MenuItemCardContainerProps {
  item: MenuItem;
  cartItems: CartItem[];
  onAddToCart: (item: MenuItem, complements?: Complement[], sharedWith?: Guest[]) => void;
  onRemoveFromCart: (uniqueId: string) => void;
  onItemClick: () => void;
  guests: Guest[];
}
export interface MenuItemCardViewProps {
  item: MenuItem;
  itemCount: number;
  onItemClick: () => void;
  onAddClick: () => void;
  onRemoveClick: () => void;
  onShareClick: () => void;
  guests: Guest[];
}
export interface RemoveItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onConfirm: (selectedItem: string) => void;
}


export interface OrderViewProps {
  menuItems: MenuItem[];
  guests: Guest[];
}

export interface MenuItemCardProps {
  item: MenuItem;
  cartItems: CartItem[];
  onAddToCart: (item: MenuItem, complement?: Complement[], sharedWith?: Guest[]) => void;
  onRemoveFromCart: () => void;
  onItemClick: () => void;
  guests: Guest[];
}


export interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onConfirmOrder: () => void;
  onRemoveItem: (uniqueId: string) => void;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: (name: string) => void;
}
export interface PaymentOptionsModalProps {
  open: boolean;
  onClose: () => void;
  selectedOption: "full" | "split" | "specific";
  setSelectedOption: (value: "full" | "split" | "specific") => void;
  setSelectedGuests: React.Dispatch<React.SetStateAction<number[]>>;
  guests: GuestsWithOrders[];
  onConfirm: (type: "full" | "split" | "specific", options?: any) => void;
}

// types/props.ts
export interface OrderItemsSummaryModalProps {
  open: boolean;
  onClose: () => void;
  guests: Array<{
    guest: {
      id: number;
      name: string;
      isUser: boolean;
    };
    selected: boolean;
    orderItems: Array<{
      id: string;
      name: string;
      price: number | string;
    }>;
  }>;
  selectedOption: "full" | "split" | "specific";
}
export interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: (name: string) => void;
}
export interface BillViewProps {
  orders: CartItem[];
  onClose: () => void;
  onCancelItem: (itemId: string) => void;
  toggleModal: (type: "personal" | "full" | "split" | "specific", options?: any) => void;
  handlePayAccount: () => void;
  numOfGuests: number;
}

export interface RedsysForm {
  action: string;
  Ds_SignatureVersion: string;
  Ds_MerchantParameters: string;
  Ds_Signature: string;
}
