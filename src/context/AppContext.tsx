import React, { useEffect, useState, createContext, useContext } from "react";
import { User, CartItem, Reservation, MenuItem } from "../types";
interface AppContextType {
  currentUser: User | null;
  users: User[];
  cart: CartItem[];
  reservations: Reservation[];
  login: (user: User, token: string) => void;
  logout: () => void;
  addToCart: (menuItem: MenuItem, quantity: number) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: any, quantity: number) => void;
  clearCart: () => void;
  createReservation: (
    reservation: Omit<Reservation, "id" | "status" | "createdAt">,
  ) => string;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  cartTotal: number;
  cartItemCount: number;
}
const AppContext = createContext<AppContextType | undefined>(undefined);
const ADMIN_USER: User = {
  id: "admin-1",
  name: "Admin",
  username: "admin",
  phone: "082331699919",
  role: "admin",
};
export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or defaults
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : [ADMIN_USER];
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem("reservations");
    return saved ? JSON.parse(saved) : [];
  });
  // Persist state changes
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("reservations", JSON.stringify(reservations));
  }, [reservations]);
  // Auth actions
  const login = (user: User, token: string) => {
    user.access_token = token;
    setCurrentUser(user);

    // if (phone === ADMIN_USER.phone) {
    //   setCurrentUser(ADMIN_USER);
    //   return;
    // }
    // let user = users.find((u) => u.phone === phone);
    // if (!user) {
    //   user = {
    //     id: `user-${Date.now()}`,
    //     name: name || 'Pelanggan',
    //     phone,
    //     role: 'customer'
    //   };
    //   setUsers([...users, user]);
    // }
    // setCurrentUser(user);
  };
  const logout = () => {
    setCurrentUser(null);
    setCart([]); // Clear cart on logout
  };
  // Cart actions
  const addToCart = (menuItem: MenuItem, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.menuItem.id === menuItem.id,
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.menuItem.id === menuItem.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item,
        );
      }
      return [
        ...prevCart,
        {
          menuItem,
          quantity,
        },
      ];
    });
  };
  const removeFromCart = (menuItemId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.menuItem.id !== menuItemId),
    );
  };
  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.menuItem.id === menuItemId
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  };
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce(
    (total, item) => total + item.menuItem.price * item.quantity,
    0,
  );
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  // Reservation actions
  const createReservation = (
    reservationData: Omit<Reservation, "id" | "status" | "createdAt">,
  ) => {
    const newReservation: Reservation = {
      ...reservationData,
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [newReservation, ...prev]);
    return newReservation.id;
  };
  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.id === id
          ? {
              ...res,
              ...updates,
            }
          : res,
      ),
    );
  };
  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        cart,
        reservations,
        login,
        logout,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        createReservation,
        updateReservation,
        cartTotal,
        cartItemCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
