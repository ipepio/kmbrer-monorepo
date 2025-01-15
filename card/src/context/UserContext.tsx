import React, { createContext, useState, useEffect, useContext } from "react";

interface UserContextType {
  user: { id: string; seatName: string; token: string } | null;
  setUser: (user: { id: string; seatName: string; token: string } | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedUser = localStorage.getItem("userData");
  const [user, setUser] = useState<UserContextType["user"]>(
    storedUser ? JSON.parse(storedUser) : null
  );
  useEffect(() => {
    const syncUserWithLocalStorage = () => {
      const updatedUser = localStorage.getItem("userData");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };
    window.addEventListener("storage", syncUserWithLocalStorage);

    return () => {
      window.removeEventListener("storage", syncUserWithLocalStorage);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
