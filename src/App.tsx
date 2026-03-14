import React, { useEffect, useState } from "react";
import { AppProvider, useAppContext } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { MenuPage } from "./pages/MenuPage";
import { CartPage } from "./pages/CartPage";
import { AuthPage } from "./pages/AuthPage";
import { ReservationPage } from "./pages/ReservationPage";
import { OrderStatusPage } from "./pages/OrderStatusPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import AdminCategory from "./pages/admin/AdminCategory";
import AdminPacket from "./pages/admin/AdminPacket";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminPacketMenu from "./pages/admin/AdminPacketMenu";
import { PacketProducts } from "./pages/PacketProducts";
import { OrderDetailPage } from "./pages/OrderDetailPage";

function AppContent() {
  const { currentUser } = useAppContext();
  const [currentPage, setCurrentPage] = useState("home");
  const mainRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") || "home";
      setCurrentPage(hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      mainRef.current?.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
    }, 0);

    return () => clearTimeout(t);
  }, [currentPage]);

  const navigate = (page: string) => {
    window.location.hash = page;
  };

  useEffect(() => {
    if (currentPage === "admin" && currentUser?.role !== "admin") {
      navigate("home");
    }
  }, [currentPage, currentUser]);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <MenuPage navigate={navigate} />;
      case "cart":
        return <CartPage navigate={navigate} />;
      case "auth":
        return <AuthPage navigate={navigate} />;
      case "reservation":
        return <ReservationPage navigate={navigate} />;
      case "order-status":
        return <OrderStatusPage navigate={navigate} />;
      case "admin":
        return <AdminDashboard navigate={navigate} />;
      case "admin-category":
        return <AdminCategory navigate={navigate} />;
      case "admin-packet":
        return <AdminPacket navigate={navigate} />;
      case "admin-menu":
        return <AdminMenu navigate={navigate} />;
      default:
        if (currentPage.includes("packet-menu")) {
          return (
            <AdminPacketMenu navigate={navigate} currentPage={currentPage} />
          );
        }

        if (currentPage.includes("packet-product")) {
          return <PacketProducts navigate={navigate} />;
        }

        if (currentPage.includes("order-detail")) {
          return <OrderDetailPage navigate={navigate} />;
        }

        return <MenuPage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navbar currentPage={currentPage} navigate={navigate} />
      <main ref={mainRef} className="flex-grow">
        {renderPage()}
      </main>
      <Footer currentPage={currentPage} />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
