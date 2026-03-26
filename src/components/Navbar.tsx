import React, { useState } from "react";
import {
  ShoppingCartIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  LogOutIcon,
  ChevronDown,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { storeType } from "../types/store";
import { useAxios } from "../utils/axios";
interface NavbarProps {
  currentPage: string;
  navigate: (page: string) => void;
}
export function Navbar({ currentPage, navigate }: NavbarProps) {
  const { setCurrentStore, currentStore, currentUser, cartItemCount, logout } =
    useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [stores, setStores] = React.useState<storeType[]>([]);

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
          // {
          //   id: "admin",
          //   label: "Dashboard Admin",
          // },
          // {
          //   id: "admin-category",
          //   label: "Kelola Kategori",
          // },
          // {
          //   id: "admin-packet",
          //   label: "Kelola Paket",
          // },
          // {
          //   id: "admin-menu",
          //   label: "Kelola Menu",
          // },
          // {
          //   id: "admin-setting",
          //   label: "Pengaturan",
          // },
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
                {
                  id: "delivery-order",
                  label: "Delivery Order",
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

  React.useEffect(() => {
    useAxios.get("/store").then(async (response) => {
      const data = await response.data;

      if (data?.status) {
        setStores(data?.data);
        setCurrentStore(data?.data[0]);
      }
    });
  }, []);

  return (
    <nav
      className={`${(isScrolled || isMobileMenuOpen) && "bg-warm-50 shadow-sm"} fixed w-full top-0 z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer">
            <div className="flex flex-col">
              <span
                onClick={() => handleNavigate("home")}
                className={`${isScrolled || isMobileMenuOpen ? "text-dark" : "text-white"} font-family-inter font-bold text-base sm:text-2xl tracking-tight leading-none`}
              >
                Ikan <span className="text-primary">Bakar</span> Pantura
              </span>
              <div
                className={`${isScrolled || isMobileMenuOpen ? "text-dark" : "text-[#A8A8A8]"} text-xs font-light tracking-widest uppercase mt-1 flex items-center gap-1`}
              >
                <span>
                  {currentStore?.name} - {currentStore?.area}
                </span>
                <ChevronDown className="size-4" />
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavigate(link.id)}
                className={`text-sm sm:text-xs font-medium transition-colors duration-200 ${currentPage === link.id ? "text-primary-dark border-b-2 border-primary pb-1" : `${isScrolled ? "text-gray-600" : "text-white"} hover:text-primary`}`}
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

      {/* Switch Store */}
      {false && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => {}}
          ></div>
          <div className="relative bg-[#FDFBF7] w-full h-full md:h-auto md:max-h-[85vh] md:max-w-2xl md:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="bg-primary px-6 py-4 flex items-center justify-between border-b-4 border-primary-dark/20 shadow-sm z-10">
              <h2 className="text-base sm:text-2xl font-family-inter font-bold text-dark tracking-wide uppercase">
                Pilih Cabang
              </h2>
              <button
                onClick={() => {}}
                className="p-2 bg-black/10 hover:bg-black/20 rounded-full text-dark transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div
              className={`flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar relative ${cartItemCount > 0 ? "pb-28" : ""}`}
            >
              {/* Decorative background pattern (subtle) */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>

              <div className="relative z-10 space-y-10">
                <div className="menu-group">
                  <div className="space-y-6">
                    <div className="flex flex-col group">
                      <div className="flex items-center justify-between">
                        {/* Name and Price Row */}
                        <div className="flex items-center justify-between w-full mb-1">
                          <div className="flex items-center gap-2">
                            <div>
                              <h1 className="font-bold font-family-inter text-dark text-base sm:text-lg leading-none">
                                Cabang Merakurak
                              </h1>
                            </div>
                          </div>

                          <button
                            onClick={() => {}}
                            className="px-4 py-1.5 rounded-lg bg-white border border-gray-200 text-dark text-sm font-bold flex items-center hover:bg-primary hover:border-primary hover:shadow-sm transition-all"
                          >
                            Pilih Cabang
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
