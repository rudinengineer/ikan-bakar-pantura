import React, { useState } from "react";
import {
  ShoppingCartIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  LogOutIcon,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
interface NavbarProps {
  currentPage: string;
  navigate: (page: string) => void;
}
export function Navbar({ currentPage, navigate }: NavbarProps) {
  const { currentUser, cartItemCount, logout } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleNavigate = (page: string) => {
    navigate(page);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleNavigate("home");
  };

  const navLinks =
    currentUser?.role === "admin"
      ? [
          {
            id: "admin",
            label: "Dashboard Admin",
          },
          {
            id: "admin-category",
            label: "Kelola Kategori",
          },
          {
            id: "admin-packet",
            label: "Kelola Paket",
          },
          {
            id: "admin-menu",
            label: "Kelola Menu",
          },
          {
            id: "admin-setting",
            label: "Pengaturan",
          },
        ]
      : [
          {
            id: "home",
            label: "Beranda",
          },
          // {
          //   id: 'menu',
          //   label: 'Menu'
          // },
          ...(currentUser || true
            ? [
                {
                  id: "order-status",
                  label: "Reservasi Saya",
                },
              ]
            : []),
        ];

  React.useEffect(() => {
    if (currentPage !== "home") {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    window.addEventListener("scroll", function () {
      if (currentPage === "home") {
        if (this.window.scrollY > 0) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      } else {
        setIsScrolled(true);
      }
    });
  }, [currentPage]);

  return (
    <nav
      className={`${(isScrolled || isMobileMenuOpen) && "bg-warm-50 shadow-sm"} fixed w-full top-0 z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigate("home")}
          >
            <div className="flex flex-col">
              <span
                className={`${isScrolled || isMobileMenuOpen ? "text-dark" : "text-white"} font-family-inter font-bold text-base sm:text-2xl tracking-tight leading-none`}
              >
                Ikan <span className="text-primary">Bakar</span> Pantura
              </span>
              <span
                className={`${isScrolled || isMobileMenuOpen ? "text-dark" : "text-[#A8A8A8]"} text-xs font-light tracking-widest uppercase mt-1`}
              >
                Bogorejo - Tuban
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavigate(link.id)}
                className={`text-sm sm:text-xs font-medium transition-colors duration-200 ${currentPage === link.id ? "text-primary-dark border-b-2 border-primary pb-1" : "text-gray-600 hover:text-primary"}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {currentUser?.role !== "admin" && (
              <button
                onClick={() => handleNavigate("cart")}
                className={`${isScrolled ? "text-primary" : "text-white hover:text-primary"} relative p-2 transition-colors`}
                aria-label="Keranjang"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("profile")}
                  className={`text-primary flex items-center space-x-2 text-sm font-medium bg-gray-50 px-3 py-1.5 rounded-full cursor-pointer`}
                >
                  <UserIcon className="w-4 h-4 text-primary-dark" />
                  <span>{currentUser.name}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOutIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigate("auth")}
                className="bg-primary hover:bg-primary-dark text-dark font-semibold py-2 px-6 rounded-full transition-colors duration-200 shadow-sm"
              >
                Masuk
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-4">
            {currentUser?.role !== "admin" && (
              <button
                onClick={() => handleNavigate("cart")}
                className={`${isScrolled || isMobileMenuOpen ? "text-dark" : "text-white"} relative p-2`}
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${isScrolled || isMobileMenuOpen ? "text-dark hover:text-gray-900" : "text-white text-slate-100"} focus:outline-none p-2`}
            >
              {isMobileMenuOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavigate(link.id)}
                className={`block w-full text-left px-3 py-4 rounded-md text-base font-medium ${currentPage === link.id ? "bg-primary/10 text-primary-dark" : "text-gray-700 hover:bg-gray-50"}`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-gray-100">
              {currentUser ? (
                <div className="space-y-4">
                  <button
                    onClick={() => navigate("profile")}
                    className="flex items-center px-3 text-gray-700 cursor-pointer"
                  >
                    <UserIcon className="w-5 h-5 mr-3 text-primary-dark" />
                    <span className="font-medium">{currentUser.name}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-md font-medium"
                  >
                    <LogOutIcon className="w-5 h-5 mr-3" />
                    Keluar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavigate("auth")}
                  className="w-full bg-primary text-dark font-semibold py-3 px-4 rounded-lg text-center"
                >
                  Masuk / Daftar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
