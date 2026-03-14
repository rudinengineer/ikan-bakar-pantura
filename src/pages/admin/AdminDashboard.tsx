import React, { useState } from "react";
import {
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  EditIcon,
  CheckIcon,
  BellIcon,
  EyeIcon,
  XIcon,
  SearchIcon,
  PlusIcon,
  MinusIcon,
  Trash2Icon,
  MessageSquareIcon,
  ImageIcon,
  CreditCardIcon,
  MapPinIcon,
  CalendarIcon,
  PhoneIcon,
  UserIcon,
  UtensilsIcon,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useAppContext } from "../../context/AppContext";
import { formatRupiah, formatDate } from "../../utils/format";
import { menuData, categories } from "../../data/menuData";
import { Reservation, MenuItem, CartItem } from "../../types";
import { useAxios } from "../../utils/axios";
import Spinner from "../../components/Spinner";

interface Props {
  navigate: (page: string) => void;
}

export function AdminDashboard({ navigate }: Props) {
  const [customerTotal, setCustomerTotal] = React.useState<number>(0);
  const [loadingCustomerTotal, setLoadingCustomerTotal] =
    React.useState<boolean>(true);

  const [orderPendingTotal, setOrderPendingTotal] = React.useState<number>(0);
  const [loadingOrderPendingTotal, setLoadingOrderPendingTotal] =
    React.useState<boolean>(true);

  const [orderConfirmedTotal, setOrderConfirmedTotal] =
    React.useState<number>(0);
  const [loadingOrderConfirmedTotal, setLoadingOrderConfirmedTotal] =
    React.useState<boolean>(true);

  const [orderDayTotal, setOrderDayTotal] = React.useState<number>(0);
  const [loadingOrderDayTotal, setLoadingOrderDayTotal] =
    React.useState<boolean>(true);

  const { logout, currentUser, reservations, updateReservation } =
    useAppContext();
  const [activeTab, setActiveTab] = useState("Semua");
  const [toast, setToast] = useState<string | null>(null);
  // Detail Modal State
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [detailTab, setDetailTab] = useState<"info" | "payment" | "items">(
    "info",
  );
  // Edit states within modal
  const [editingPayment, setEditingPayment] = useState(false);
  const [editPaymentAmount, setEditPaymentAmount] = useState<number>(0);
  const [tableNumber, setTableNumber] = useState<string>("");
  const [showTableInput, setShowTableInput] = useState(false);
  // Add Menu Item states
  const [menuSearch, setMenuSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [showImagePreview, setShowImagePreview] = useState(false);

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const columns = [
    {
      accessorKey: "id",
      header: "NO",
      cell: ({ row }) =>
        row.index + 1 + pagination.pageIndex * pagination.pageSize,
    },
    {
      accessorKey: "order_id",
      header: "ID PESANAN",
    },
    {
      accessorKey: "name",
      header: "PELANGGAN",
      cell: ({ row }) => {
        return (
          <div>
            <h1 className="font-semibold">{row?.original?.customer_name}</h1>
            <h1>{row?.original?.customer_phone}</h1>
          </div>
        );
      },
    },
    {
      accessorKey: "booking_date",
      header: "TANGGAL",
    },
    {
      accessorKey: "booking_time",
      header: "WAKTU",
    },
    {
      accessorKey: "customer_total",
      header: "TAMU",
    },
    {
      accessorKey: "total",
      header: "TOTAL",
      cell: ({ row }) => {
        return (
          <span>
            Rp{" "}
            {new Intl.NumberFormat("id-ID", {
              currency: "IDR",
            }).format(row?.original?.total ?? 0)}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => {
        return (
          <div>
            {row?.original?.status === "pending" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                Pending
              </span>
            )}

            {row?.original?.status === "confirmed" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Dikonfirmasi
              </span>
            )}

            {row?.original?.status === "completed" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Selesai
              </span>
            )}

            {row?.original?.status === "canceled" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Dibatalkan
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: "Action",
      cell: ({ row }) => {
        return (
          <div>
            <button
              onClick={() => openDetail(row?.original)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-dark text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              <EyeIcon className="w-3.5 h-3.5" />
              Detail
            </button>
          </div>
        );
      },
    },
  ];

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  React.useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(inputSearch);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 500);

    return () => clearTimeout(delay);
  }, [inputSearch]);

  const fetchDatatables = () => {
    useAxios
      .get("/order/datatables", {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search,
        },
        headers: {
          Authorization: `Bearer ${currentUser?.access_token ?? ""}`,
        },
      })
      .catch((e) => {
        if (e.response.status === 401) {
          logout();
          navigate("auth");
          return;
        }
      })
      .then(async (response) => {
        const data = await response.data;

        if (data?.status) {
          setData(data?.data?.orders);
          setTotalData(data?.data?.data_total);
        } else {
          setData([]);
          setTotalData(0);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetchDatatables();
  }, [pagination.pageIndex, pagination.pageSize, search]);

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalData / pagination.pageSize),
  });

  // Stats
  const totalRes = reservations.length;
  const pendingRes = reservations.filter((r) => r.status === "pending").length;
  const confirmedRes = reservations.filter(
    (r) => r.status === "confirmed",
  ).length;
  const todayRes = reservations.filter(
    (r) => r.date === new Date().toISOString().split("T")[0],
  ).length;
  // Filtered list
  const filteredReservations = reservations.filter((res) => {
    if (activeTab === "Semua") return true;
    if (activeTab === "Pending") return res.status === "pending";
    if (activeTab === "Dikonfirmasi") return res.status === "confirmed";
    if (activeTab === "Selesai")
      return ["arrived", "completed"].includes(res.status);
    return true;
  });
  // Filtered menu for add items
  const filteredMenu = menuData.filter((item) => {
    const matchesCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(menuSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
            Pending
          </span>
        );

      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Dikonfirmasi
          </span>
        );

      case "arrived":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Selesai
          </span>
        );

      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Dibatalkan
          </span>
        );

      default:
        return null;
    }
  };
  const openDetail = (res: Reservation) => {
    setSelectedReservation(res);
    setDetailTab("info");
    setEditingPayment(false);
    setShowTableInput(false);
    setTableNumber(res.tableNumber?.toString() || "");
    setMenuSearch("");
    setSelectedCategory("Semua");
  };
  const closeDetail = () => {
    setSelectedReservation(null);
  };
  // Refresh selected reservation from state
  const currentRes = selectedReservation
    ? reservations.find((r) => r.id === selectedReservation.id) ||
      selectedReservation
    : null;
  const handleConfirm = () => {
    if (!currentRes) return;
    if (!tableNumber) {
      setShowTableInput(true);
      return;
    }
    updateReservation(currentRes.id, {
      status: "confirmed",
      tableNumber: parseInt(tableNumber),
    });
    showToast(
      "Reservasi dikonfirmasi. Notifikasi WhatsApp terkirim ke pelanggan.",
    );
    setShowTableInput(false);
  };
  const handleVerifyArrival = () => {
    if (!currentRes) return;
    updateReservation(currentRes.id, {
      status: "completed",
    });
    showToast("Kedatangan diverifikasi. Reservasi selesai.");
  };
  const savePaymentEdit = () => {
    if (!currentRes) return;
    updateReservation(currentRes.id, {
      paymentAmount: editPaymentAmount,
    });
    setEditingPayment(false);
    showToast("Nominal pembayaran diperbarui");
  };
  const handleAddMenuItem = (menuItem: MenuItem) => {
    if (!currentRes) return;
    const existingIndex = currentRes.items.findIndex(
      (i) => i.menuItem.id === menuItem.id,
    );
    let newItems: CartItem[];
    if (existingIndex >= 0) {
      newItems = currentRes.items.map((item, idx) =>
        idx === existingIndex
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      );
    } else {
      newItems = [
        ...currentRes.items,
        {
          menuItem,
          quantity: 1,
        },
      ];
    }
    const newTotal = newItems.reduce(
      (sum, i) => sum + i.menuItem.price * i.quantity,
      0,
    );
    updateReservation(currentRes.id, {
      items: newItems,
      totalAmount: newTotal,
    });
    showToast(`${menuItem.name} ditambahkan ke pesanan`);
  };
  const handleUpdateItemQty = (menuItemId: string, newQty: number) => {
    if (!currentRes) return;
    let newItems: CartItem[];
    if (newQty <= 0) {
      newItems = currentRes.items.filter((i) => i.menuItem.id !== menuItemId);
    } else {
      newItems = currentRes.items.map((item) =>
        item.menuItem.id === menuItemId
          ? {
              ...item,
              quantity: newQty,
            }
          : item,
      );
    }
    const newTotal = newItems.reduce(
      (sum, i) => sum + i.menuItem.price * i.quantity,
      0,
    );
    updateReservation(currentRes.id, {
      items: newItems,
      totalAmount: newTotal,
    });
  };
  const handleRemoveItem = (menuItemId: string) => {
    if (!currentRes) return;
    const newItems = currentRes.items.filter(
      (i) => i.menuItem.id !== menuItemId,
    );
    const newTotal = newItems.reduce(
      (sum, i) => sum + i.menuItem.price * i.quantity,
      0,
    );
    updateReservation(currentRes.id, {
      items: newItems,
      totalAmount: newTotal,
    });
    showToast("Item dihapus dari pesanan");
  };

  React.useEffect(() => {
    useAxios
      .get("/customer/report-total", {
        headers: {
          Authorization: `Bearer ${currentUser?.access_token ?? ""}`,
        },
      })
      .then(async (response) => {
        const data = await response.data;

        if (data?.status) {
          setCustomerTotal(data?.data);
        }
      })
      .finally(() => {
        setLoadingCustomerTotal(false);
      });
  }, []);

  React.useEffect(() => {
    useAxios
      .get("/order/pending-report-total", {
        headers: {
          Authorization: `Bearer ${currentUser?.access_token ?? ""}`,
        },
      })
      .then(async (response) => {
        const data = await response.data;

        if (data?.status) {
          setOrderPendingTotal(data?.data);
        }
      })
      .finally(() => {
        setLoadingOrderPendingTotal(false);
      });
  }, []);

  React.useEffect(() => {
    useAxios
      .get("/order/confirmed-report-total", {
        headers: {
          Authorization: `Bearer ${currentUser?.access_token ?? ""}`,
        },
      })
      .then(async (response) => {
        const data = await response.data;

        if (data?.status) {
          setOrderConfirmedTotal(data?.data);
        }
      })
      .finally(() => {
        setLoadingOrderConfirmedTotal(false);
      });
  }, []);

  React.useEffect(() => {
    useAxios
      .get("/order/order-report-day", {
        headers: {
          Authorization: `Bearer ${currentUser?.access_token ?? ""}`,
        },
      })
      .then(async (response) => {
        const data = await response.data;

        if (data?.status) {
          setOrderDayTotal(data?.data);
        }
      })
      .finally(() => {
        setLoadingOrderDayTotal(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-14">
      {/* Admin Header */}
      <div className="bg-dark text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-family-inter font-bold mb-2">
            Dashboard Admin
          </h1>
          <p className="text-gray-400">
            Kelola reservasi dan pesanan pelanggan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total</p>
              {loadingCustomerTotal ? (
                <Spinner color="primary" />
              ) : (
                <p className="text-2xl font-bold text-dark">{customerTotal}</p>
              )}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className="w-11 h-11 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <ClockIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Pending</p>
              {loadingOrderPendingTotal ? (
                <Spinner color="primary" />
              ) : (
                <p className="text-2xl font-bold text-dark">
                  {orderPendingTotal}
                </p>
              )}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className="w-11 h-11 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <CheckCircleIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Konfirmasi</p>
              {loadingOrderConfirmedTotal ? (
                <Spinner color="primary" />
              ) : (
                <p className="text-2xl font-bold text-dark">
                  {orderConfirmedTotal}
                </p>
              )}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className="w-11 h-11 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <BellIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Hari Ini</p>
              {loadingOrderDayTotal ? (
                <Spinner color="primary" />
              ) : (
                <p className="text-2xl font-bold text-dark">{orderDayTotal}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-2xl border-b border-gray-200 px-6 pt-4 flex space-x-6">
          {["Semua", "Pending", "Dikonfirmasi", "Selesai"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-medium text-sm transition-colors relative ${activeTab === tab ? "text-primary-dark" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-dark rounded-t-md"></div>
              )}
            </button>
          ))}
        </div>

        {/* Datatable */}
        <div className="mt-3">
          <div className="mb-3 flex w-full justify-end">
            <input
              type="text"
              placeholder="Search"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="w-full overflow-x-auto rounded-md border border-gray-200 shadow-sm">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-primary">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left font-semibold text-white"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t odd:bg-gray-50 even:bg-white hover:bg-gray-100"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-gray-600">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Halaman{" "}
              <span className="font-medium">
                {table.getState().pagination.pageIndex + 1}
              </span>{" "}
              dari{" "}
              <span className="font-medium">{table.getPageCount() || 1}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage() || loading}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sebelumnya
              </button>

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage() || loading}
                className="rounded-md bg-primary px-3 py-1.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 border-t-0 overflow-hidden">
          {filteredReservations.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <ClockIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">
                Tidak ada data reservasi untuk filter ini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3.5 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                      No
                    </th>
                    <th className="text-left py-3.5 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                      ID
                    </th>
                    <th className="text-left py-3.5 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                      Pelanggan
                    </th>
                    <th className="text-left py-3.5 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="text-left py-3.5 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                      Waktu
                    </th>
                    <th className="text-center py-3.5 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                      Tamu
                    </th>
                    <th className="text-right py-3.5 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                      Total
                    </th>
                    <th className="text-center py-3.5 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-center py-3.5 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredReservations.map((res, index) => (
                    <tr
                      key={res.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-gray-500 font-medium">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-dark text-xs">
                        {res.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-semibold text-dark">
                            {res.userName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {res.userPhone}
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 whitespace-nowrap">
                        {formatDate(res.date)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700">{res.time}</td>
                      <td className="py-3.5 px-4 text-center font-medium text-dark">
                        {res.numberOfPeople}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-dark whitespace-nowrap">
                        {formatRupiah(res.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {getStatusBadge(res.status)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => openDetail(res)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-dark text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <EyeIcon className="w-3.5 h-3.5" />
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ===== DETAIL MODAL ===== */}
      {currentRes && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDetail}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mb-8">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-dark">
                  Detail Reservasi
                </h3>
                <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {currentRes.id}
                </span>
                {getStatusBadge(currentRes.status)}
              </div>
              <button
                onClick={closeDetail}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Detail Tabs */}
            <div className="border-b border-gray-200 px-6 flex space-x-1 bg-gray-50">
              {[
                {
                  id: "info" as const,
                  label: "Informasi",
                  icon: UserIcon,
                },
                {
                  id: "payment" as const,
                  label: "Pembayaran",
                  icon: CreditCardIcon,
                },
                {
                  id: "items" as const,
                  label: "Pesanan & Tambah Menu",
                  icon: UtensilsIcon,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${detailTab === tab.id ? "text-primary-dark bg-white rounded-t-lg border-t border-x border-gray-200 -mb-px" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* INFO TAB */}
              {detailTab === "info" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-dark flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-primary-dark" /> Data
                        Pelanggan
                      </h4>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                        <div className="flex justify-between">
                          <span className="text-gray-500 text-sm">Nama</span>
                          <span className="font-semibold text-dark text-sm">
                            {currentRes.userName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 text-sm">
                            WhatsApp
                          </span>
                          <span className="font-semibold text-dark text-sm">
                            {currentRes.userPhone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-dark flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-primary-dark" />{" "}
                        Detail Kunjungan
                      </h4>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                        <div className="flex justify-between">
                          <span className="text-gray-500 text-sm">Tanggal</span>
                          <span className="font-semibold text-dark text-sm">
                            {formatDate(currentRes.date)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 text-sm">Jam</span>
                          <span className="font-semibold text-dark text-sm">
                            {currentRes.time} WIB
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 text-sm">
                            Jumlah Orang
                          </span>
                          <span className="font-semibold text-dark text-sm">
                            {currentRes.numberOfPeople} Orang
                          </span>
                        </div>
                        {currentRes.tableNumber && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">
                              Nomor Meja
                            </span>
                            <span className="font-bold text-primary-dark text-sm">
                              Meja {currentRes.tableNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer Notes */}
                  {currentRes.customerNotes && (
                    <div>
                      <h4 className="font-bold text-dark flex items-center gap-2 mb-3">
                        <MessageSquareIcon className="w-4 h-4 text-amber-600" />{" "}
                        Catatan Pelanggan
                      </h4>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-sm text-amber-900 italic">
                          "{currentRes.customerNotes}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Ringkasan Pesanan */}
                  <div>
                    <h4 className="font-bold text-dark mb-3">
                      Ringkasan Pesanan ({currentRes?.items?.length ?? 0} item)
                    </h4>
                    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-100/50">
                            <th className="text-left py-2.5 px-4 font-semibold text-gray-600 text-xs">
                              Menu
                            </th>
                            <th className="text-center py-2.5 px-4 font-semibold text-gray-600 text-xs">
                              Qty
                            </th>
                            <th className="text-right py-2.5 px-4 font-semibold text-gray-600 text-xs">
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {currentRes?.order_items?.map((item, i) => (
                            <tr key={i}>
                              <td className="py-2.5 px-4 text-dark">
                                {item.menuItem.name}
                              </td>
                              <td className="py-2.5 px-4 text-center text-gray-600">
                                {item.quantity}x
                              </td>
                              <td className="py-2.5 px-4 text-right font-medium text-dark">
                                {formatRupiah(
                                  item.menuItem.price * item.quantity,
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-gray-200 bg-gray-100/50">
                            <td
                              colSpan={2}
                              className="py-3 px-4 font-bold text-dark"
                            >
                              Total
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-primary-dark text-base">
                              {formatRupiah(currentRes.totalAmount)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    {currentRes.status === "pending" && (
                      <>
                        {showTableInput ? (
                          <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-xl border border-yellow-200">
                            <label className="text-xs font-bold text-yellow-800 whitespace-nowrap">
                              No. Meja:
                            </label>
                            <input
                              type="number"
                              value={tableNumber}
                              onChange={(e) => setTableNumber(e.target.value)}
                              className="w-20 p-2 border border-yellow-300 rounded-lg text-sm text-center"
                              placeholder="12"
                              autoFocus
                            />

                            <button
                              onClick={() => setShowTableInput(false)}
                              className="px-3 py-2 text-xs text-gray-500 bg-white rounded-lg border border-gray-200"
                            >
                              Batal
                            </button>
                            <button
                              onClick={handleConfirm}
                              className="px-3 py-2 text-xs text-white bg-green-600 rounded-lg font-bold hover:bg-green-700"
                            >
                              Konfirmasi
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={handleConfirm}
                            className="bg-primary hover:bg-primary-dark text-dark font-bold py-2.5 px-6 rounded-xl transition-colors text-sm flex items-center gap-2"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            Konfirmasi Reservasi
                          </button>
                        )}
                      </>
                    )}
                    {currentRes.status === "confirmed" && (
                      <button
                        onClick={handleVerifyArrival}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors text-sm flex items-center gap-2"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Verifikasi Kedatangan
                      </button>
                    )}
                    {["arrived", "completed"].includes(currentRes.status) && (
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl text-sm font-medium">
                        <CheckCircleIcon className="w-4 h-4" />
                        Reservasi telah selesai
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PAYMENT TAB */}
              {detailTab === "payment" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-dark flex items-center gap-2">
                        <CreditCardIcon className="w-4 h-4 text-primary-dark" />{" "}
                        Informasi Pembayaran
                      </h4>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-sm">Metode</span>
                          <span className="font-semibold text-dark text-sm px-2.5 py-1 bg-white rounded-lg border border-gray-200">
                            {currentRes.paymentMethod === "full"
                              ? "Bayar Lunas"
                              : "DP 50%"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-sm">
                            Total Tagihan
                          </span>
                          <span className="font-bold text-dark">
                            {formatRupiah(currentRes.totalAmount)}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">
                              Jumlah Dibayar
                            </span>
                            {editingPayment ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={editPaymentAmount}
                                  onChange={(e) =>
                                    setEditPaymentAmount(Number(e.target.value))
                                  }
                                  className="w-32 p-2 border border-gray-300 rounded-lg text-sm text-right"
                                />

                                <button
                                  onClick={savePaymentEdit}
                                  className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                                >
                                  <CheckIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingPayment(false)}
                                  className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200"
                                >
                                  <XIcon className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-primary-dark text-lg">
                                  {formatRupiah(currentRes.paymentAmount || 0)}
                                </span>
                                {currentRes.status === "pending" && (
                                  <button
                                    onClick={() => {
                                      setEditingPayment(true);
                                      setEditPaymentAmount(
                                        currentRes.paymentAmount || 0,
                                      );
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-primary-dark hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Edit nominal"
                                  >
                                    <EditIcon className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {currentRes.paymentMethod === "dp" && (
                          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                            <p className="text-xs text-orange-800 font-medium">
                              Sisa pembayaran:{" "}
                              {formatRupiah(
                                currentRes.totalAmount -
                                  (currentRes.paymentAmount || 0),
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-dark flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary-dark" />{" "}
                        Bukti Transfer
                      </h4>
                      {currentRes.paymentProof ? (
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                          <img
                            src={currentRes.paymentProof}
                            alt="Bukti Transfer"
                            className="w-full h-64 object-contain bg-gray-100 cursor-pointer"
                            onClick={() => setShowImagePreview(true)}
                          />

                          <div className="p-3 bg-gray-50 text-center">
                            <button
                              onClick={() => setShowImagePreview(true)}
                              className="text-sm text-primary-dark font-medium hover:underline"
                            >
                              Klik untuk memperbesar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200 border-dashed">
                          <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            Belum ada bukti transfer
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ITEMS TAB - with Add Menu */}
              {detailTab === "items" && (
                <div className="space-y-6">
                  {/* Current Items */}
                  <div>
                    <h4 className="font-bold text-dark mb-3">
                      Pesanan Saat Ini ({currentRes.items.length} item)
                    </h4>
                    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-100/50">
                            <th className="text-left py-2.5 px-4 font-semibold text-gray-600 text-xs">
                              Menu
                            </th>
                            <th className="text-left py-2.5 px-4 font-semibold text-gray-600 text-xs">
                              Harga
                            </th>
                            <th className="text-center py-2.5 px-4 font-semibold text-gray-600 text-xs">
                              Qty
                            </th>
                            <th className="text-right py-2.5 px-4 font-semibold text-gray-600 text-xs">
                              Subtotal
                            </th>
                            <th className="text-center py-2.5 px-4 font-semibold text-gray-600 text-xs w-20">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {currentRes.items.map((item, i) => (
                            <tr key={i}>
                              <td className="py-2.5 px-4">
                                <p className="font-medium text-dark">
                                  {item.menuItem.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.menuItem.category}
                                </p>
                              </td>
                              <td className="py-2.5 px-4 text-gray-600">
                                {formatRupiah(item.menuItem.price)}
                              </td>
                              <td className="py-2.5 px-4">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() =>
                                      handleUpdateItemQty(
                                        item.menuItem.id,
                                        item.quantity - 1,
                                      )
                                    }
                                    className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary-dark hover:border-primary/50"
                                  >
                                    <MinusIcon className="w-3 h-3" />
                                  </button>
                                  <span className="w-8 text-center font-bold text-dark">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleUpdateItemQty(
                                        item.menuItem.id,
                                        item.quantity + 1,
                                      )
                                    }
                                    className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary-dark hover:border-primary/50"
                                  >
                                    <PlusIcon className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                              <td className="py-2.5 px-4 text-right font-medium text-dark">
                                {formatRupiah(
                                  item.menuItem.price * item.quantity,
                                )}
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                <button
                                  onClick={() =>
                                    handleRemoveItem(item.menuItem.id)
                                  }
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2Icon className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-gray-200 bg-gray-100/50">
                            <td
                              colSpan={3}
                              className="py-3 px-4 font-bold text-dark"
                            >
                              Total
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-primary-dark text-base">
                              {formatRupiah(currentRes.totalAmount)}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Add Menu Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-bold text-dark mb-4 flex items-center gap-2">
                      <PlusIcon className="w-4 h-4 text-primary-dark" />
                      Tambah Menu ke Pesanan
                    </h4>

                    {/* Search & Category Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                      <div className="flex-1 relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Cari menu..."
                          value={menuSearch}
                          onChange={(e) => setMenuSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-primary focus:border-primary"
                      >
                        <option value="Semua">Semua Kategori</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Menu Grid */}
                    <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-xl">
                      <div className="divide-y divide-gray-100">
                        {filteredMenu.slice(0, 20).map((item) => {
                          const existingItem = currentRes.items.find(
                            (i) => i.menuItem.id === item.id,
                          );
                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-dark text-sm truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.category} • {formatRupiah(item.price)}
                                </p>
                              </div>
                              {existingItem ? (
                                <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-lg font-medium border border-green-100 flex-shrink-0 ml-3">
                                  Sudah ada ({existingItem.quantity}x)
                                </span>
                              ) : null}
                              <button
                                onClick={() => handleAddMenuItem(item)}
                                className="ml-3 flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary-dark flex items-center justify-center hover:bg-primary hover:text-dark transition-colors"
                              >
                                <PlusIcon className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                        {filteredMenu.length === 0 && (
                          <div className="p-6 text-center text-gray-500 text-sm">
                            Menu tidak ditemukan
                          </div>
                        )}
                        {filteredMenu.length > 20 && (
                          <div className="p-3 text-center text-gray-400 text-xs">
                            Menampilkan 20 dari {filteredMenu.length} menu.
                            Gunakan pencarian untuk mempersempit.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && currentRes?.paymentProof && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80"
          onClick={() => setShowImagePreview(false)}
        >
          <button
            onClick={() => setShowImagePreview(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20"
          >
            <XIcon className="w-6 h-6" />
          </button>
          <img
            src={currentRes.paymentProof}
            alt="Bukti Transfer"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-dark text-white px-6 py-3 rounded-lg shadow-xl z-[70] flex items-center">
          <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
          {toast}
        </div>
      )}
    </div>
  );
}
