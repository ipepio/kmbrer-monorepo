  export interface Table {
    uuid: string;
    number: number;
    maxCapacity: number;
    isOpen: boolean
  }
  
  export interface OrderCardProps {
    order: Table
    onEdit?: () => void
    onClose?: () => void
    onPayBill?: () => void
    onGuest?: () => void
    onModal?: () => void
  }
  
  