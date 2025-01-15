import { CartItem } from "@/types/types";
const statusMapper: Record<string, CartItem["status"]> = {
    pending: "pendiente",
    confirmed: "en proceso",
    delivered: "servido",
  };
  
  export default statusMapper;
  