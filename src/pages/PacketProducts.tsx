import React, { useState } from "react";
import {
  SearchIcon,
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
  ArrowRightIcon,
  XCircleIcon,
  UtensilsIcon,
  XIcon,
} from "lucide-react";
import { menuData, categories } from "../data/menuData";
import { formatRupiah, formatDate } from "../utils/format";
import { useAppContext } from "../context/AppContext";
import { MenuItem } from "../types";
interface MenuPageProps {
  navigate: (page: string) => void;
}
const SEAFOOD_IMAGE = "/image.png";

const FISH_IMAGE = "/gurame,kerapu,kakakap_putih,_kakap_merah.png";

const LELE_IMAGE = "/lele,_ayam,_bebek,_ayam_hantaran_1_ekor.png";

const SIDES_IMAGE = "/tumisan,_minuman,lain-lain.png";

const menuCatalog = [
  {
    id: "lele",
    name: "Lele",
    categories: ["Lele"],
    image: LELE_IMAGE,
    tab: "satuan",
  },
  {
    id: "ayam",
    name: "Ayam",
    categories: ["Ayam"],
    image: LELE_IMAGE,
    tab: "satuan",
  },
  {
    id: "bebek",
    name: "Bebek",
    categories: ["Bebek"],
    image: LELE_IMAGE,
    tab: "satuan",
  },
  {
    id: "hantaran",
    name: "Ayam Hantaran",
    categories: ["Ayam Hantaran"],
    image: LELE_IMAGE,
    tab: "satuan",
  },
  {
    id: "kerang",
    name: "Kerang Ijo",
    categories: ["Kerang Ijo"],
    image: SEAFOOD_IMAGE,
    tab: "satuan",
  },
  {
    id: "udang",
    name: "Udang",
    categories: ["Udang Tanpa Tepung", "Udang Tepung"],
    image: SEAFOOD_IMAGE,
    tab: "satuan",
  },
  {
    id: "cumi",
    name: "Cumi",
    categories: ["Cumi Tanpa Tepung", "Cumi Tepung"],
    image: SEAFOOD_IMAGE,
    tab: "satuan",
  },
  {
    id: "gurame",
    name: "Gurame",
    categories: ["Gurame"],
    image: FISH_IMAGE,
    tab: "satuan",
  },
  {
    id: "kerapu",
    name: "Kerapu",
    categories: ["Kerapu"],
    image: FISH_IMAGE,
    tab: "satuan",
  },
  {
    id: "kakap-putih",
    name: "Kakap Putih",
    categories: ["Kakap Putih"],
    image: FISH_IMAGE,
    tab: "satuan",
  },
  {
    id: "kakap-merah",
    name: "Kakap Merah",
    categories: ["Kakap Merah"],
    image: FISH_IMAGE,
    tab: "satuan",
  },
  {
    id: "tumisan",
    name: "Tumisan",
    categories: ["Tumisan"],
    image: SIDES_IMAGE,
    tab: "satuan",
  },
  {
    id: "minuman",
    name: "Minuman",
    categories: ["Minuman"],
    image: SIDES_IMAGE,
    tab: "satuan",
  },
  {
    id: "lain-lain",
    name: "Lain-lain",
    categories: ["Lain-lain"],
    image: SIDES_IMAGE,
    tab: "satuan",
  },
  {
    id: "paket",
    name: "Paket Ramadhan Kareem",
    categories: ["Paket Ramadhan Kareem"],
    image: SEAFOOD_IMAGE,
    tab: "ramadhan",
  },
];

export function PacketProducts({ navigate }: MenuPageProps) {
  const {
    cart,
    addToCart,
    updateQuantity,
    cartTotal,
    cartItemCount,
    currentUser,
    reservations,
  } = useAppContext();
  const [activeTab, setActiveTab] = useState<"satuan" | "ramadhan">("satuan");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCategoryCard, setSelectedCategoryCard] = useState<
    (typeof menuCatalog)[0] | null
  >(null);
  // Get user's reservations
  const userReservations = currentUser
    ? reservations.filter((res) => res.userId === currentUser.id)
    : [];
  const isSearching = searchQuery.trim().length > 0;
  // Filter menu items for search
  const searchResults = isSearching
    ? menuData.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      })
    : [];
  // Filter catalog cards based on active tab
  const visibleCatalog = menuCatalog.filter((card) => card.tab === activeTab);
  const getQuantityInCart = (itemId: string) => {
    const item = cart.find((c) => c.menuItem.id === itemId);
    return item ? item.quantity : 0;
  };
  const handleAdd = (item: MenuItem) => {
    addToCart(item, 1);
    showToast(`${item.name} ditambahkan ke keranjang`);
  };
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000);
  };
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Menunggu",
          icon: ClockIcon,
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          dot: "bg-yellow-500",
        };
      case "confirmed":
        return {
          label: "Dikonfirmasi",
          icon: CheckCircleIcon,
          bg: "bg-green-100",
          text: "text-green-800",
          dot: "bg-green-500",
        };
      case "arrived":
      case "completed":
        return {
          label: "Selesai",
          icon: UtensilsIcon,
          bg: "bg-blue-100",
          text: "text-blue-800",
          dot: "bg-blue-500",
        };
      case "cancelled":
        return {
          label: "Dibatalkan",
          icon: XCircleIcon,
          bg: "bg-red-100",
          text: "text-red-800",
          dot: "bg-red-500",
        };
      default:
        return {
          label: status,
          icon: ClockIcon,
          bg: "bg-gray-100",
          text: "text-gray-800",
          dot: "bg-gray-500",
        };
    }
  };
  const renderItemCard = (item: MenuItem) => {
    const qty = getQuantityInCart(item.id);
    return (
      <div
        key={item.id}
        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full"
      >
        <div className="mb-3">
          <span className="inline-block px-2.5 py-1 bg-warm-50 text-warm-900 text-xs font-bold rounded-md mb-2">
            {item.category}
          </span>
          <h3 className="text-lg font-bold text-dark leading-tight">
            {item.name}
          </h3>
        </div>

        {item.description && (
          <p className="text-sm text-gray-500 mb-4 flex-grow">
            {item.description}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
          <div className="font-bold text-primary-dark text-lg">
            {formatRupiah(item.price)}
            {item.priceMax && (
              <span className="text-sm text-gray-500 font-normal">
                {" "}
                - {formatRupiah(item.priceMax)}
              </span>
            )}
          </div>

          {qty > 0 ? (
            <div className="flex items-center bg-warm-50 rounded-lg border border-warm-200">
              <button
                onClick={() => updateQuantity(item.id, qty - 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary-dark"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-bold text-dark text-sm">
                {qty}
              </span>
              <button
                onClick={() => updateQuantity(item.id, qty + 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary-dark"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleAdd(item)}
              className="w-10 h-10 rounded-full bg-primary/10 text-primary-dark flex items-center justify-center hover:bg-primary hover:text-dark transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-warm-50 pb-24">
      {/* Header Section */}
      <div className="bg-dark text-white py-12 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#FFC907 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-family-inter font-bold mb-4">
            Katalog Menu
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Pilih hidangan favorit Anda. Kami menyajikan seafood segar dengan
            bumbu rempah pilihan.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Search Bar */}
        <div className="bg-white p-2 rounded-2xl shadow-lg flex items-center max-w-2xl mx-auto border border-gray-100">
          <div className="pl-4 text-gray-400">
            <SearchIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Cari menu spesifik (ex: Gurame, Udang...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 px-4 outline-none text-gray-700 bg-transparent"
          />
        </div>

        {/* Reservation History Banner */}
        {currentUser && userReservations.length > 0 && !isSearching && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary-dark" />
                <h3 className="font-bold text-dark text-sm">
                  Histori Reservasi Anda
                </h3>
                <span className="bg-primary/15 text-primary-dark text-xs font-bold px-2 py-0.5 rounded-full">
                  {userReservations.length}
                </span>
              </div>
              <button
                onClick={() => navigate("order-status")}
                className="text-sm text-primary-dark hover:text-primary font-medium flex items-center gap-1 transition-colors"
              >
                Lihat Semua <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-x-auto">
              <div className="flex gap-3 min-w-max">
                {userReservations.slice(0, 5).map((res) => {
                  const statusConfig = getStatusConfig(res.status);
                  return (
                    <div
                      key={res.id}
                      onClick={() => navigate("order-status")}
                      className="flex-shrink-0 w-64 bg-gray-50 rounded-xl p-4 border border-gray-100 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-bold text-gray-500">
                          {res.id}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}
                          ></span>
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                          {formatDate(res.date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <ClockIcon className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                          {res.time} WIB • {res.numberOfPeople} Orang
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
                          <span className="text-xs text-gray-500">
                            {res.items.length} menu
                          </span>
                          <span className="font-bold text-sm text-dark">
                            {formatRupiah(res.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {isSearching /* Search Results View (Flat Grid) */ ? (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-dark mb-6">
              Hasil Pencarian: "{searchQuery}"
            </h2>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map(renderItemCard)}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">
                  Menu tidak ditemukan
                </h3>
                <p className="text-gray-500">
                  Coba gunakan kata kunci pencarian yang lain.
                </p>
              </div>
            )}
          </div> /* Catalog View (Cards) */
        ) : (
          <>
            {/* Tabs */}
            <div className="mt-8 mb-6 flex space-x-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("satuan")}
                className={`px-6 py-3 font-bold text-sm sm:text-base transition-colors relative ${activeTab === "satuan" ? "text-primary-dark" : "text-gray-500 hover:text-gray-800"}`}
              >
                Menu Satuan
                {activeTab === "satuan" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("ramadhan")}
                className={`px-6 py-3 font-bold text-sm sm:text-base transition-colors relative ${activeTab === "ramadhan" ? "text-primary-dark" : "text-gray-500 hover:text-gray-800"}`}
              >
                Ramadhan Kareem
                {activeTab === "ramadhan" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>
                )}
              </button>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {visibleCatalog.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedCategoryCard(card)}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 aspect-[4/3]"
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-5">
                    <h3 className="text-white font-family-inter font-bold text-lg sm:text-xl tracking-wide">
                      {card.name}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      Lihat Menu →
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Category Detail Modal (Menu Book Style) */}
      {selectedCategoryCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedCategoryCard(null)}
          ></div>
          <div className="relative bg-[#FDFBF7] w-full h-full md:h-auto md:max-h-[85vh] md:max-w-2xl md:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="bg-primary px-6 py-4 flex items-center justify-between border-b-4 border-primary-dark/20 shadow-sm z-10">
              <h2 className="text-2xl font-family-inter font-bold text-dark tracking-wide uppercase">
                {selectedCategoryCard.name}
              </h2>
              <button
                onClick={() => setSelectedCategoryCard(null)}
                className="p-2 bg-black/10 hover:bg-black/20 rounded-full text-dark transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
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
                {selectedCategoryCard.categories.map((catName) => {
                  const items = menuData.filter(
                    (item) => item.category === catName,
                  );
                  if (items.length === 0) return null;
                  return (
                    <div key={catName} className="menu-group">
                      {selectedCategoryCard.categories.length > 1 && (
                        <div className="flex items-center justify-center mb-6">
                          <div className="h-px bg-gray-300 flex-grow"></div>
                          <h3 className="font-bold text-dark text-lg px-4 uppercase tracking-widest bg-[#FDFBF7]">
                            {catName}
                          </h3>
                          <div className="h-px bg-gray-300 flex-grow"></div>
                        </div>
                      )}

                      <div className="space-y-6">
                        {items.map((item) => {
                          const qty = getQuantityInCart(item.id);
                          return (
                            <div key={item.id} className="flex flex-col group">
                              {/* Name and Price Row */}
                              <div className="flex items-end justify-between w-full mb-1">
                                <span className="font-bold text-dark text-base sm:text-lg leading-none">
                                  {item.name}
                                </span>
                                <div className="flex-grow border-b-2 border-dotted border-gray-400/60 mx-3 relative top-[-6px] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                <span className="font-bold text-primary-dark text-base sm:text-lg whitespace-nowrap leading-none">
                                  {formatRupiah(item.price)}
                                  {item.priceMax && (
                                    <span className="text-sm font-normal text-gray-600">
                                      {" "}
                                      - {formatRupiah(item.priceMax)}
                                    </span>
                                  )}
                                </span>
                              </div>

                              {/* Description (if any) */}
                              {item.description && (
                                <p className="text-sm text-gray-600 italic mb-2 w-[85%]">
                                  {item.description}
                                </p>
                              )}

                              {/* Add to Cart Controls */}
                              <div className="flex justify-end mt-2">
                                {qty > 0 ? (
                                  <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <button
                                      onClick={() =>
                                        updateQuantity(item.id, qty - 1)
                                      }
                                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary-dark hover:bg-gray-50 rounded-l-lg"
                                    >
                                      <MinusIcon className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-bold text-dark text-sm">
                                      {qty}
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateQuantity(item.id, qty + 1)
                                      }
                                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary-dark hover:bg-gray-50 rounded-r-lg"
                                    >
                                      <PlusIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleAdd(item)}
                                    className="px-4 py-1.5 rounded-lg bg-white border border-gray-200 text-dark text-sm font-bold flex items-center hover:bg-primary hover:border-primary hover:shadow-sm transition-all"
                                  >
                                    <PlusIcon className="w-4 h-4 mr-1" /> Tambah
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Cart Bar inside Modal */}
            {cartItemCount > 0 && (
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.08)] z-10">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-dark">
                        <ShoppingCartIcon className="w-5 h-5" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {cartItemCount}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Total</p>
                      <p className="text-lg font-bold text-dark leading-none">
                        {formatRupiah(cartTotal)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategoryCard(null);
                      navigate("cart");
                    }}
                    className="bg-dark text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-sm shadow-md"
                  >
                    Lihat Keranjang
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sticky Cart Bar */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative mr-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-dark shadow-inner">
                  <ShoppingCartIcon className="w-6 h-6" />
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {cartItemCount}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Pesanan
                </p>
                <p className="text-xl font-bold text-dark leading-none">
                  {formatRupiah(cartTotal)}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("cart")}
              className="bg-dark text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center shadow-md"
            >
              Lihat Keranjang
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-dark text-white px-6 py-3 rounded-full shadow-xl z-[60] flex items-center animate-fade-in">
          <ShoppingCartIcon className="w-4 h-4 mr-2 text-primary" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
