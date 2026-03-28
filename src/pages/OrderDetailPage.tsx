import React from "react";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UtensilsIcon,
  MessageSquareIcon,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { formatRupiah, formatDate } from "../utils/format";
import { useAxios } from "../utils/axios";
import Spinner from "../components/Spinner";
import { assetUrl } from "../constants/app";
import swal from "sweetalert2";

interface Props {
  navigate: (page: string) => void;
  currentPage: string;
}

export function OrderDetailPage({ navigate, currentPage }: Props) {
  const [order, setOrder] = React.useState<any>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isLoadingConfirm, setLoadingConfirm] = React.useState<boolean>(false);
  const [isRefreshed, setRefreshed] = React.useState<number>(0);

  const { logout, currentUser } = useAppContext();
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
    const extractParams = currentPage.split("/");

    useAxios
      .post(
        "/order/" + extractParams[extractParams.length - 1],
        {
          device_id: localStorage.getItem("device_id"),
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.access_token ?? ""}`,
          },
        },
      )
      .then(async (response) => {
        const data = await response.data;

        if (data?.status) {
          setOrder(data?.data);
        }
      })
      .catch((e) => {
        if (e.response.status === 401) {
          logout();
          navigate("auth");
          return;
        }

        // navigate("home");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isRefreshed]);

  const confirmOrder = () => {
    swal
      .fire({
        icon: "question",
        title: "Anda yakin?",
        text: "Pesanan akan dikonfirmasi",
        showCancelButton: true,
      })
      .then((e) => {
        if (e.isConfirmed) {
          setLoadingConfirm(true);
          const extractParams = currentPage.split("/");
          useAxios
            .get("/order/confirm/" + extractParams[extractParams.length - 1], {
              headers: {
                Authorization: `Bearer ${currentUser?.access_token ?? ""}`,
              },
            })
            .then(async (response) => {
              const data = await response.data;

              if (data?.status) {
                setRefreshed(Math.random());
                swal.fire({
                  icon: "success",
                  title: "Success",
                  text: "Pesanan berhasil dikonfirmasi",
                  timer: 2500,
                });
              }
            })
            .catch((e) => {
              if (e.response.status === 401) {
                logout();
                navigate("auth");
                return;
              }

              swal.fire({
                icon: "error",
                title: "Error",
                text: "Pesanan gagal dikonfirmasi",
                timer: 2500,
              });
            })
            .finally(() => {
              setLoadingConfirm(true);
            });
        }
      });
  };

  return (
    <div className="min-h-screen bg-warm-50 py-12 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-family-inter font-bold text-dark mb-8">
          Detail Reservasi
        </h1>

        {isLoading && (
          <div className="w-full flex justify-center">
            <Spinner color="primary" />
          </div>
        )}

        {!isLoading && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    ID Reservasi:{" "}
                    <span className="font-mono font-medium text-dark">
                      {order?.order_id}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Dibuat: {formatDate(order?.created_at)}
                  </p>
                </div>
                <div>{getStatusBadge(order?.status)}</div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-dark mb-4">Detail Kunjungan</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <ClockIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-dark">
                          {formatDate(order?.booking_date)}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Jam {order?.booking_time} WIB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <UtensilsIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-dark">
                          {order?.customer_total} Orang
                        </p>
                      </div>
                    </div>
                    {order?.note && (
                      <div className="flex items-start">
                        <MessageSquareIcon className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium text-dark text-sm">
                            Catatan
                          </p>
                          <p className="text-gray-600 text-sm italic">
                            "{order?.note}"
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
                      {order?.order_items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
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
                        {formatRupiah(order?.total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Status Pembayaran</span>
                    <span className="font-medium text-dark">
                      {order?.payment_method === "full"
                        ? "Lunas"
                        : order?.payment_method === "dp"
                          ? "DP"
                          : "DP suka-suka"}
                      <span className="text-gray-400 ml-1">
                        ({formatRupiah(order?.payment_total || 0)})
                      </span>
                    </span>
                  </div>

                  <div className="mt-6">
                    <span className="text-dark">Bukti Pembayaran</span>
                    <div className="p-4">
                      <img
                        src={assetUrl + "uploads/" + order?.payment_image}
                        alt="Bukti Pembayaran"
                        className="mt-4 w-full sm:w-48"
                      />
                    </div>
                  </div>

                  {order?.status === "pending" &&
                    currentUser?.role === "admin" && (
                      <div className="mt-8">
                        <button
                          onClick={confirmOrder}
                          disabled={isLoadingConfirm}
                          className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-md"
                        >
                          {isLoadingConfirm ? (
                            <Spinner />
                          ) : (
                            <span>Konfirmasi Pesanan</span>
                          )}
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
