import React from "react";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UtensilsIcon,
  MapPinIcon,
  MessageSquareIcon,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { formatRupiah, formatDate } from "../utils/format";
import { useAxios } from "../utils/axios";
import Spinner from "../components/Spinner";

interface Props {
  navigate: (page: string) => void;
}

export function DeliveryOrderPage({ navigate }: Props) {
  const [orders, setOrders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { logout, currentUser, reservations } = useAppContext();
  // if (!currentUser) return null;
  const userReservations = reservations.filter(
    (res) => res.userId === currentUser?.id,
  );
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="w-4 h-4 mr-1" /> Menunggu Konfirmasi
          </span>
        );

      case "confirmed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" /> Dikonfirmasi
          </span>
        );

      case "arrived":
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <UtensilsIcon className="w-4 h-4 mr-1" /> Selesai
          </span>
        );

      case "cancelled":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-4 h-4 mr-1" /> Dibatalkan
          </span>
        );

      default:
        return null;
    }
  };

  React.useEffect(() => {
    useAxios
      .get("/order/history", {
        headers: {
          Authorization: `Bearer ${currentUser?.access_token ?? ""}`,
          "X-DEVICE-ID": localStorage.getItem("device_id"),
        },
        params: {
          type: "delivery-order",
        },
      })
      .then(async (response) => {
        const data = await response.data;

        if (data?.status) {
          setOrders(data?.data);
        }
      })
      .catch((e) => {
        if (e.response.status === 401) {
          logout();
          navigate("auth");
          return;
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-warm-50 py-12 sm:pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-family-inter font-bold text-dark mb-8">
          History Delivery Order
        </h1>

        {isLoading && (
          <div className="w-full flex justify-center">
            <Spinner color="primary" />
          </div>
        )}

        {!isLoading && (
          <div className="space-y-6">
            {orders.map((value: any, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      ID Delivery Order:{" "}
                      <span className="font-mono font-medium text-dark">
                        {value.order_id}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Dibuat: {formatDate(value.created_at)}
                    </p>
                  </div>
                  <div>{getStatusBadge(value.status)}</div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-family-inter font-bold text-dark mb-4">
                      Detail Pengantaran
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <ClockIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium text-dark">
                            {formatDate(value.booking_date)}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Jam {value.booking_time} WIB
                          </p>
                        </div>
                      </div>
                      {value.note && (
                        <div className="flex items-start">
                          <MessageSquareIcon className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium text-dark text-sm">
                              Catatan
                            </p>
                            <p className="text-gray-600 text-sm italic">
                              "{value.note}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-dark mb-4">
                      Pesanan & Pembayaran
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <div className="space-y-2 mb-3 pb-3 border-b border-gray-200">
                        {value.order_items.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">
                              {item.quantity}x {item.product_name}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-dark">
                          Total Tagihan
                        </span>
                        <span className="font-bold text-dark">
                          {formatRupiah(value.total)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Status Pembayaran</span>
                      <span className="font-medium text-dark">
                        {value.payment_method === "full" ? "Lunas" : "DP"}
                        <span className="text-gray-400 ml-1">
                          ({formatRupiah(value.payment_total || 0)})
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && orders.length <= 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">
              Belum ada delivery order
            </h3>
            <p className="text-gray-500">
              Anda belum memesan delivery order apapun.
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
