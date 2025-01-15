export interface OrderItem {
    quantity: number
    name: string
    price: number
    delivered: boolean
    product: {
        id: number;
        documentId: string;
        name: string;
      }
  }
  
  export interface Order {
    orderId: number;
    orderItemId: number;
    name: string;
    comments: string;
    complements: string[];
    tableId: number;
    status: 'pedido' | 'preparacion' | 'listo';
  }
  
  
  export interface OrderCardProps {
    order: Order
    onEdit?: () => void
    onClose?: () => void
    onPayBill?: () => void
    onGuest?: () => void
    onModal?: () => void
  }
  
  