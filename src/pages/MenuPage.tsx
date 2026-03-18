import React, { useState } from "react";
import {
  SearchIcon,
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon,
  XIcon,
  ArrowUpRight,
} from "lucide-react";
import { menuData } from "../data/menuData";
import { formatRupiah, formatDate } from "../utils/format";
import { useAppContext } from "../context/AppContext";
import { MenuItem } from "../types";
import { categoryType } from "../types/category";
import { useAxios } from "../utils/axios";
import { packetType } from "../types/packet";
import { assetUrl } from "../constants/app";
import { menuType } from "../types/menu";
import Spinner from "../components/Spinner";
import logo from "../assets/logo.png";
import background from "../assets/cabang-bogorejo.jpeg";

interface MenuPageProps {
  navigate: (page: string) => void;
}

export function MenuPage({ navigate }: MenuPageProps) {
  const {
    cart,
    addToCart,
    updateQuantity,
    cartTotal,
    cartItemCount,
    currentUser,
    reservations,
  } = useAppContext();
  const [categories, setCategories] = React.useState<categoryType[]>([]);
  const [activeCategory, setActiveCategory] = React.useState<string>("");
  const [categoryLoading, setCategoryLoading] = React.useState<boolean>(true);

  const [packets, setPackets] = React.useState<packetType[]>([]);
  const [packetLoading, setPacketLoading] = React.useState<boolean>(true);

  const [selectedPacket, setSelectedPacket] = React.useState<packetType>();
  const [packetMenus, setPacketMenus] = React.useState<menuType[]>([]);
  const [loadingPacketMenus, setLoadingPacketMenus] =
    React.useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
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
  const getQuantityInCart = (itemId: any) => {
    const item = cart.find((c) => c.menuItem.id === itemId);
    return item ? item.quantity : 0;
  };
  const handleAdd = (item: any) => {
    addToCart(item, 1);
    // showToast(`${item.name} ditambahkan ke keranjang`);
  };
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000);
  };

  React.useEffect(() => {
    /* Fetch Category */
    useAxios
      .get("/categories")
      .then(async (response) => {
        const data = await response.data;
        if (data?.status) {
          setCategories(data?.data);
          setActiveCategory(data?.data[0]?.slug);
        }
      })
      .finally(() => {
        setCategoryLoading(false);
      });
  }, []);

  React.useEffect(() => {
    if (activeCategory) {
      setPacketLoading(true);

      useAxios
        .get("/packet/" + activeCategory)
        .then(async (response) => {
          const data = await response.data;
          if (data?.status) {
            setPackets(data?.data);
          }
        })
        .finally(() => {
          setPacketLoading(false);
        });
    }
  }, [activeCategory]);

  React.useEffect(() => {
    if (selectedPacket?.id) {
      useAxios
        .get("/product/" + selectedPacket.slug)
        .then(async (response) => {
          const data = await response.data;

          if (data?.status) {
            setPacketMenus(data?.data);
          }
        })
        .finally(() => {
          setLoadingPacketMenus(false);
        });
    }
  }, [selectedPacket?.id]);

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

  React.useEffect(() => {
    const handleBack = () => {
      const targetPath = window.location.hash.replace("#", "") || "home";

      if (selectedPacket?.id && targetPath !== "cart") {
        navigate("home");
        setSelectedPacket(undefined);
      }
    };

    window.addEventListener("popstate", handleBack);

    return () => window.removeEventListener("popstate", handleBack);
  }, [selectedPacket]);

  return (
    <div className="min-h-screen pb-24">
      {/* Header Section */}
      <div className="bg-dark text-white pt-20 py-12 px-4 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={background}
            alt="Background"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-dark/70 bg-gradient-to-t from-dark/90 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* <h1 className="text-4xl md:text-5xl font-family-inter font-bold mb-4">
            Katalog Menu
          </h1> */}
          <div className="w-full flex justify-center">
            <img src={logo} alt="Ikan Bakar Pantura" width={280} />
          </div>
          <span className="mt-4 inline-block py-3 px-6 rounded-full bg-primary/20 text-primary border border-primary/30 text-[10px] sm:text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
            Spesialis Seafood Tuban
          </span>
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
            <div className="mt-6 mb-6 flex justify-center space-x-2">
              {/* Category Skeleton */}
              {categoryLoading &&
                [1, 2].map((_, index) => (
                  <div
                    key={index}
                    className="w-36 h-10 rounded-full skeleton"
                  ></div>
                ))}

              {!categoryLoading &&
                categories.map((value, index) => (
                  <button
                    onClick={() => setActiveCategory(value.slug)}
                    className={`${activeCategory === value.slug ? "border-primary bg-primary hover:bg-yellow-500" : "border-[#E5E7EB] hover:bg-slate-200"} p-3 px-8 font-semibold text-xs rounded-full border-[1px] shrink-0 transition ease-in-out`}
                    key={index}
                  >
                    {value.name}
                  </button>
                ))}
            </div>

            <div className="mt-6 mb-4 w-full flex justify-center">
              <h1 className="font-family-inter font-semibold text-center text-primary">
                Click gambar untuk memesan
              </h1>
            </div>

            {/* Packet Skeleton */}
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {packetLoading &&
                [1, 2, 3, 4, 5].map((_, index) => (
                  <div
                    key={index}
                    className="h-48 w-full rounded-sm skeleton"
                  ></div>
                ))}
            </div>

            {/* Packets Not Found */}
            {!packetLoading && !packets.length && (
              <div className="w-full flex justify-center">
                <h1 className="text-center">Data tidak ditemukan.</h1>
              </div>
            )}

            {/* Packet Cards */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-4">
              {!packetLoading &&
                packets.map((value, index) => (
                  <a
                    onClick={() => {
                      setSelectedPacket(value);
                      setLoadingPacketMenus(true);
                    }}
                    key={index}
                    className="cursor-pointer p-4 rounded-xl transition ease-in-out hover:shadow-2xl hover:-translate-y-1"
                  >
                    {activeCategory === categories[0].slug && (
                      <h1 className="text-center font-light mb-2 font-family-inter">
                        {value.name}
                      </h1>
                    )}
                    <img
                      src={assetUrl + "assets/images/" + value.image}
                      alt={value.name}
                      className="w-full sm:h-52 rounded-xl"
                    />
                  </a>
                ))}
            </div>

            {!packetLoading &&
            categories.length > 1 &&
            activeCategory !== categories[1].slug ? (
              <div className="mt-10 w-full flex justify-center">
                <div>
                  <h1 className="font-light font-family-inter">
                    Ingin Menu Lebih Banyak Lagi?
                  </h1>
                  <div className="w-full flex justify-center">
                    <button
                      onClick={() => setActiveCategory(categories[1].slug)}
                      className="mt-1.5 group relative flex items-center justify-center gap-1.5 rounded-full border border-transparent bg-primary p-3 px-5 text-sm font-semibold text-dark shadow-md transition-all hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <span>Kunjungi Menu Basic</span>
                      <ArrowUpRight className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </div>

      {/* Category Detail Modal (Menu Book Style) */}
      {selectedPacket?.id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setSelectedPacket(undefined);
              setLoadingPacketMenus(true);
            }}
          ></div>
          <div className="relative bg-[#FDFBF7] w-full h-full md:h-auto md:max-h-[85vh] md:max-w-2xl md:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="bg-primary px-6 py-4 flex items-center justify-between border-b-4 border-primary-dark/20 shadow-sm z-10">
              <h2 className="text-base sm:text-2xl font-family-inter font-bold text-dark tracking-wide uppercase">
                {selectedPacket.name}
              </h2>
              <button
                onClick={() => {
                  setSelectedPacket(undefined);
                  setLoadingPacketMenus(true);
                }}
                className="p-2 bg-black/10 hover:bg-black/20 rounded-full text-dark transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            {!loadingPacketMenus && packetMenus.length <= 0 ? (
              <div className="w-full flex justify-center items-center p-4">
                <h1>Menu masih kosong.</h1>
              </div>
            ) : (
              <></>
            )}

            {loadingPacketMenus ? (
              <div className="p-4 w-full flex justify-center">
                <Spinner color="primary" size="lg" />
              </div>
            ) : (
              <div
                className={`flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar relative ${cartItemCount > 0 ? "pb-28" : ""}`}
              >
                {/* Decorative background pattern (subtle) */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(#000 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>

                <div className="relative z-10 space-y-10">
                  {packetMenus.map((value, index) => (
                    <div key={index} className="menu-group">
                      <div className="space-y-6">
                        <div key={value.id} className="flex flex-col group">
                          <div className="flex items-center justify-between">
                            {/* Name and Price Row */}
                            <div className="flex items-center justify-between w-full mb-1">
                              <div className="flex items-center gap-2">
                                <img
                                  src={
                                    assetUrl + "assets/images/" + value.image
                                  }
                                  alt={value.name}
                                  className="size-14 rounded-md"
                                />

                                <div>
                                  <h1 className="font-bold font-family-inter text-dark text-base sm:text-lg leading-none">
                                    {value.name}
                                  </h1>
                                  <h1 className="mt-1 font-family-inter font-bold text-primary-dark text-base sm:text-lg whitespace-nowrap leading-none">
                                    {formatRupiah(value.price)}
                                  </h1>
                                </div>
                              </div>
                              {/* <div className="flex-grow border-b-2 border-dotted border-gray-400/60 mx-3 relative top-[-6px] opacity-50 group-hover:opacity-100 transition-opacity"></div> */}
                            </div>

                            {/* Add to Cart Controls */}
                            <div className="flex justify-end mt-2">
                              {getQuantityInCart(value.id) > 0 ? (
                                <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        value.id,
                                        getQuantityInCart(value.id) - 1,
                                      )
                                    }
                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary-dark hover:bg-gray-50 rounded-l-lg"
                                  >
                                    <MinusIcon className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center font-bold text-dark text-sm">
                                    {getQuantityInCart(value.id)}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        value.id,
                                        getQuantityInCart(value.id) + 1,
                                      )
                                    }
                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary-dark hover:bg-gray-50 rounded-r-lg"
                                  >
                                    <PlusIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAdd(value)}
                                  className="px-4 py-1.5 rounded-lg bg-white border border-gray-200 text-dark text-sm font-bold flex items-center hover:bg-primary hover:border-primary hover:shadow-sm transition-all"
                                >
                                  <PlusIcon className="w-4 h-4 mr-1" /> Tambah
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {activeCategory === categories[0].slug && (
                    <div className="w-full flex justify-center">
                      <img
                        src={assetUrl + "assets/images/" + selectedPacket.image}
                        alt={selectedPacket.name}
                        className="w-full rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

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
                      navigate("cart");
                      setSelectedPacket(undefined);
                      setLoadingPacketMenus(true);
                    }}
                    className="bg-dark text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-xs sm:text-sm shadow-md"
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
                <p className="text-sm sm:text-xl font-bold text-dark leading-none">
                  {formatRupiah(cartTotal)}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("cart")}
              className="bg-dark text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-xs sm:text-sm flex items-center shadow-md"
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
