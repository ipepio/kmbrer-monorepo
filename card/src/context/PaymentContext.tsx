import React, { createContext, useContext, useState } from "react";

type PaymentContextType = {
    selectedOption: "split" | "specific" | "full";
    setSelectedOption: React.Dispatch<React.SetStateAction<"split" | "specific" | "full">>;
    selectedGuests: string[];
    setSelectedGuests: React.Dispatch<React.SetStateAction<string[]>>;
  };
  
  const PaymentContext = createContext<PaymentContextType | null>(null);
  
  export const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedOption, setSelectedOption] = useState<"split" | "specific" | "full">("full");
    const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  
    return (
      <PaymentContext.Provider
        value={{ selectedOption, setSelectedOption, selectedGuests, setSelectedGuests }}
      >
        {children}
      </PaymentContext.Provider>
    );
  };
  
  export const usePayment = () => {
    const context = useContext(PaymentContext);
    if (!context) {
      throw new Error("usePayment debe usarse dentro de un PaymentProvider");
    }
    return context;
  };
  