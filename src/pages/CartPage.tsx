import React from "react";
import {
  ArrowLeftIcon,
  Trash2Icon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { formatRupiah } from "../utils/format";
interface CartPageProps {
  navigate: (page: string) => void;
}
export function CartPage({ navigate }: CartPageProps) {
  const { cart, updateQuantity, removeFromCart, cartTotal, currentUser } =
    useAppContext();
  const [checkoutModal, setCheckoutModal] = React.useState<boolean>(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-warm-50 flex flex-col items-center justify-center p-4 sm:mt-10">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-family-inter font-bold text-dark mb-2">
          Keranjang Kosong
        </h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Anda belum memilih menu apapun. Silakan lihat katalog menu kami untuk
          mulai memesan.
        </p>
        <button
          onClick={() => navigate("menu")}
          className="bg-primary hover:bg-primary-dark text-dark font-bold py-3 px-8 rounded-full transition-colors shadow-sm"
        >
          Lihat Menu
        </button>
      </div>
    );
  }
  const handleProceed = () => {
    navigate("reservation");

    // if (!currentUser) {
    //   navigate("auth");
    // } else {
    //   navigate("reservation");
    // }
  };
  return (
    <div className="min-h-screen bg-warm-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("menu")}
          className="flex items-center text-gray-600 hover:text-primary-dark mb-6 transition-colors font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Kembali ke Menu
        </button>

        <h1 className="text-xl sm:text-3xl font-family-inter font-bold text-dark mb-8">
          Keranjang Pesanan
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-2">
            {cart.map((item) => (
              <div
                key={item.menuItem.id}
                className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="flex-grow">
                  {false && (
                    <span className="hidden sm:inline-block text-xs font-bold text-primary-dark bg-primary/10 px-2 py-1 rounded mb-2">
                      {item.menuItem.category}
                    </span>
                  )}
                  <h3 className="text-lg font-family-inter font-bold text-dark">
                    {item.menuItem.name}
                  </h3>
                  <p className="hidden sm:block text-gray-500 font-medium mt-1">
                    {formatRupiah(item.menuItem.price)}
                  </p>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-0 sm:mt-0">
                  <div className="flex items-center bg-warm-50 rounded-lg border border-warm-200">
                    <button
                      onClick={() =>
                        updateQuantity(item.menuItem.id, item.quantity - 1)
                      }
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary-dark"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-dark">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.menuItem.id, item.quantity + 1)
                      }
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary-dark"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right sm:w-32">
                    <p className="font-bold text-dark">
                      {formatRupiah(item.menuItem.price * item.quantity)}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.menuItem.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 rounded-lg"
                    title="Hapus item"
                  >
                    <Trash2Icon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => navigate("menu")}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-medium hover:border-primary hover:text-primary-dark transition-colors flex items-center justify-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Tambah Menu Lainnya
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-family-inter font-bold text-dark mb-6 pb-4 border-b border-gray-100">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Total Item</span>
                  <span className="font-medium text-dark">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)} item
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-dark">
                    {formatRupiah(cartTotal)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-dark">Total</span>
                  <span className="text-2xl font-bold text-primary-dark">
                    {formatRupiah(cartTotal)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  *Sudah termasuk pajak & layanan
                </p>
              </div>

              <button
                onClick={() => setCheckoutModal(true)}
                className="w-full bg-primary hover:bg-primary-dark text-dark font-bold py-4 rounded-xl transition-colors shadow-md flex justify-center items-center"
              >
                Lanjut ke Reservasi
              </button>

              {/* {!currentUser && (
                <p className="text-xs text-center text-gray-500 mt-4">
                  Anda akan diminta untuk masuk/daftar pada langkah selanjutnya.
                </p>
              )} */}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Checkout */}
      {checkoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setCheckoutModal(false);
            }}
          ></div>
          <div className="relative bg-[#FDFBF7] w-full h-full md:h-auto md:max-h-[85vh] md:max-w-2xl md:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-fade-in">
            <div
              className={`flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar relative`}
            >
              <h1 className="text-xl font-family-inter text-center text-primary font-bold">
                Pilih Metode
              </h1>

              <div className="mt-4">
                <button
                  onClick={handleProceed}
                  className="w-full bg-primary hover:bg-primary-dark text-dark font-bold py-4 rounded-xl transition-colors shadow-md flex justify-center items-center"
                >
                  Reservasi
                </button>

                <button
                  onClick={() => navigate("delivery")}
                  className="mt-4 w-full bg-gray-400 hover:bg-gray-500 text-dark font-bold py-4 rounded-xl transition-colors shadow-md flex justify-center items-center"
                >
                  Delivery Order
                </button>

                {/* <button className="mt-4 w-full bg-gray-400 hover:bg-gray-500 text-dark font-bold py-4 rounded-xl transition-colors shadow-md flex justify-center items-center">
                  Delivery Order (Coming Soon)
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
