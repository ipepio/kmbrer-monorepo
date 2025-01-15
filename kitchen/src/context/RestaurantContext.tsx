import React, { createContext, useState, useContext } from 'react';

interface RestaurantContextType {
  restaurantId: string | null; // Acepta null para inicializar sin un valor
  setRestaurantId: React.Dispatch<React.SetStateAction<string | null>>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurantId, setRestaurantId] = useState<string | null>(null); // Inicializa como null

  return (
    <RestaurantContext.Provider value={{ restaurantId, setRestaurantId }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurantContext = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurantContext debe usarse dentro de un RestaurantProvider');
  }
  return context;
};
