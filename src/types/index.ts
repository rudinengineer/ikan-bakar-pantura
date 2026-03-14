export interface User {
  id: string;
  name: string;
  username: string;
  phone: string;
  role: "user" | "admin";
  access_token: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  priceMax?: number;
  category: string;
  description?: string;
  image?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  customer_name: string;
  customer_phone: string;
  order_items: CartItem[];
  total: number;
  booking_date: string;
  booking_time: string;
  customer_total: number;
  payment_method: "full" | "dp";
  payment_image?: string;
  payment_total?: number;
  status: "pending" | "confirmed" | "arrived" | "completed" | "cancelled";
  tableNumber?: number;
  adminNotes?: string;
  note?: string;
  created_at: string;
}
