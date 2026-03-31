import React, { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  UploadIcon,
  CheckCircleIcon,
  FileIcon,
  XIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  MessageSquareIcon,
  ClipboardIcon,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { formatRupiah, formatDate } from "../utils/format";
import swal from "sweetalert2";
import { useAxios } from "../utils/axios";
import Spinner from "../components/Spinner";
import { apiurl, assetUrl, baseurl } from "../constants/app";
import axios from "axios";

interface ReservationPageProps {
  navigate: (page: string) => void;
}

export function DeliveryPage({ navigate }: ReservationPageProps) {
  const {
    currentStore,
    currentUser,
    cart,
    cartTotal,
    createReservation,
    clearCart,
  } = useAppContext();
  const [step, setStep] = useState(1);
  // Form State
  const [customerName, setCustomerName] = React.useState<any>(
    currentUser?.name ?? localStorage.getItem("customer_name"),
  );
  const [customerPhone, setCustomerPhone] = React.useState<any>(
    currentUser?.phone ?? localStorage.getItem("customer_phone"),
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState("2");
  const [customerNotes, setCustomerNotes] = useState("");
  const [place, setPlace] = React.useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"full" | "dp" | "custom">(
    "full",
  );
  const [paymentProof, setPaymentProof] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = React.useState<boolean>(false);
  const [setting, setSetting] = React.useState<any>();
  const [nominalDp, setNominalDp] = React.useState<number>(0);
  const [showSelectTimeModal, setShowSelectTimeModal] =
    React.useState<boolean>(false);
  const [timesAvailable, setTimesAvailable] = React.useState<Array<any>>();

  const dpAmount = cartTotal * 0.5;
  const [amountToPay, setAmountToPay] = React.useState<number>(
    paymentMethod === "full"
      ? cartTotal
      : paymentMethod === "dp"
        ? dpAmount
        : nominalDp,
  );

  // Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Redirect if empty cart or not logged in
  // useEffect(() => {
  //   if (cart.length === 0 && !successId) {
  //     navigate("order-status");
  //   }

  //   // if (!currentUser) {
  //   //   navigate("auth");
  //   // } else if (cart.length === 0 && !successId) {
  //   //   navigate("order-status");
  //   // }
  // }, [currentUser, cart, navigate, successId]);
  // if (!currentUser) return null;
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleOpenConfirm = () => {
    if (!date || !time) {
      alert("Mohon lengkapi detail delivery order");
      return;
    }
    if (!paymentProof) {
      alert("Mohon unggah bukti pembayaran");
      return;
    }
    setShowConfirmModal(true);
  };

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  };

  const handleSubmit = () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setLoadingCheckout(true);

    const orderItems: any = [];
    cart.map((value) => {
      orderItems.push({
        product_id: value.menuItem.id,
        qty: value.quantity,
        name: value.menuItem.name,
        price: value.menuItem.price,
      });
    });

    let deviceId = localStorage.getItem("device_id");
    if (!deviceId) {
      deviceId = generateUUID();
      localStorage.setItem("device_id", deviceId);
    }

    useAxios
      .post(
        "/checkout",
        {
          store_id: currentStore?.id,
          customer_name: customerName,
          customer_phone: customerPhone,
          order_items: JSON.stringify(orderItems),
          totalAmount: cartTotal,
          booking_date: date,
          booking_time: time,
          customer_total: parseInt(people),
          payment_method: paymentMethod,
          payment_image: paymentProof,
          paymentAmount: amountToPay,
          nominal_dp: nominalDp,
          note: customerNotes,
          device_id: deviceId,
          type: "delivery-order",
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
          localStorage.setItem("customer_name", customerName);
          localStorage.setItem("customer_phone", customerPhone);

          clearCart();
          setSuccessId(data?.data?.order_id);
          setIsSubmitting(false);

          let orderItemsMessage = ``;
          orderItems.map((item: any) => {
            orderItemsMessage += `- *${item.name}*: ${item.qty} x Rp. ${new Intl.NumberFormat("id-ID", { currency: "IDR" }).format(item.price)} = Rp. ${new Intl.NumberFormat("id-ID", { currency: "IDR" }).format(item.price * item.qty)}\n`;
          });

          const formattedDate = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(date));
          const message = `~ Terimakasih kak *${customerName}* telah memesan delivery order.

~ *Detail Pelanggan* :
- *Cabang* : ${currentStore?.area}
- *Nama* : ${customerName}
- *No. WA* : ${customerPhone}
- *Tanggal Antar* : ${formattedDate}
- *Waktu Antar* : ${time}
- *Metode Pembayaran* : ${paymentMethod === "full" ? "Lunas" : "DP"}
- *Total Pembayaran* : Rp ${new Intl.NumberFormat("id-ID", { currency: "IDR" }).format(amountToPay)}
- *Catatan* : ${customerNotes}

~ *Detail Pesanan* :
${orderItemsMessage}

*Total* : Rp. ${new Intl.NumberFormat("id-ID", { currency: "IDR" }).format(cartTotal)}
*Total dibayar* : Rp. ${new Intl.NumberFormat("id-ID", { currency: "IDR" }).format(amountToPay)}
*Kekurangan* : Rp. ${new Intl.NumberFormat("id-ID", { currency: "IDR" }).format(cartTotal - amountToPay)}

Cek detail pesanan di sini:
${baseurl}#order-detail/${data?.data?.order_id}

~ Terimakasih. Ditunggu ya kak konfirmasinya…`;

          const encodedMessage = encodeURIComponent(message);

          window.open(
            `https://api.whatsapp.com/send?phone=${currentStore?.whatsapp}&text=${encodedMessage}`,
            "_blank",
          );
          navigate("order-status");
          // setShowSuccessModal(true);
        }
      })
      .catch((e) => {
        swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal membuat delivery order. Silahkan coba lagi!",
          timer: 2500,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
        setLoadingCheckout(false);
      });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentStore?.account_number ?? "");
      swal.fire({
        icon: "success",
        title: "Success",
        text: "Nomor rekening berhasil disalin",
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // React.useEffect(() => {
  //   useAxios
  //     .get("/setting", {
  //       headers: {
  //         Authorization: `Bearer ${currentUser?.access_token ?? ""}`,
  //       },
  //     })
  //     .then(async (response) => {
  //       const data = await response.data;

  //       if (data?.status) {
  //         setSetting(data?.data);
  //       }
  //     });
  // }, []);

  React.useEffect(() => {
    if (date) {
      setTime("");
      useAxios
        .get("time-available", {
          params: {
            date: date,
          },
        })
        .then(async (response) => {
          const data = await response.data;

          if (data?.status) {
            setTimesAvailable(data?.data);
          }
        });
    }
  }, [date]);

  return (
    <div className="min-h-screen bg-warm-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : navigate("cart"))}
          className="flex items-center text-gray-600 hover:text-primary-dark mb-6 transition-colors font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          {step === 1 ? "Kembali ke Keranjang" : "Kembali"}
        </button>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-300"
              style={{
                width: `${((step - 1) / 2) * 100}%`,
              }}
            ></div>
            {[1, 2].map((i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= i ? "bg-primary text-dark shadow-md" : "bg-white text-gray-400 border-2 border-gray-200"}`}
                >
                  {i}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${step >= i ? "text-dark" : "text-gray-400"}`}
                >
                  {i === 1 ? "Detail" : i === 2 ? "Ringkasan" : "Pembayaran"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Step 1: Detail Reservasi */}
          {step === 1 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-family-inter font-bold text-dark mb-6">
                Detail Delivery Order
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cabang
                  </label>
                  <input
                    type="text"
                    value={"Cabang " + currentStore?.area}
                    disabled={true}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Pemesan
                    </label>
                    <input
                      type="text"
                      onChange={(e) => setCustomerName(e.target.value)}
                      value={customerName}
                      disabled={Boolean(currentUser?.id)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="number"
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      value={customerPhone}
                      disabled={Boolean(currentUser?.id)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jam Antar
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowSelectTimeModal(true)}
                        className="w-full p-3 border border-gray-300 rounded-xl text-start flex items-center gap-2 focus:border-primary"
                      >
                        <ClockIcon className="size-5 text-gray-400" />
                        <span className="text-gray-700">
                          {time ? time : "Pilih Jam"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer Notes Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquareIcon className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                    Catatan / Permintaan Khusus
                    <span className="text-gray-400 font-normal ml-1">
                      (opsional)
                    </span>
                  </label>
                  <textarea
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    rows={3}
                    placeholder="Contoh: Meja dekat jendela, alergi kacang, ulang tahun anak, dll."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary resize-none text-sm"
                  />
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => {
                    if (!date || !time)
                      swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Mohon lengkapi semua field",
                        timer: 2500,
                      });
                    else {
                      setStep(3);
                      window.scrollTo({
                        top: 0,
                      });
                    }
                  }}
                  className="bg-primary hover:bg-primary-dark text-dark font-bold py-3 px-8 rounded-xl transition-colors"
                >
                  Lanjut ke Ringkasan
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Ringkasan */}
          {step === 2 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-family-inter font-bold text-dark mb-6">
                Ringkasan Pesanan
              </h2>
              <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Tanggal & Waktu</p>
                    <p className="font-semibold text-dark">
                      {date} • {time} WIB
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Jumlah Tamu</p>
                    <p className="font-semibold text-dark">{people} Orang</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tempat Duduk</p>
                    <p className="font-semibold text-dark">{}</p>
                  </div>
                </div>
                {customerNotes && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <p className="text-sm font-family-inter text-gray-500 mb-1">
                      Catatan Pelanggan
                    </p>
                    <p className="text-dark text-sm bg-white p-3 rounded-lg border border-gray-100 italic">
                      "{customerNotes}"
                    </p>
                  </div>
                )}
                <h3 className="font-bold text-dark mb-4">Daftar Menu</h3>
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div
                      key={item.menuItem.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="flex items-center">
                        <span className="w-6 font-medium text-gray-500">
                          {item.quantity}x
                        </span>
                        <span className="text-dark">{item.menuItem.name}</span>
                      </div>
                      <span className="font-medium text-dark">
                        {formatRupiah(item.menuItem.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-dark">Total Pembayaran</span>
                  <span className="text-2xl font-bold text-primary-dark">
                    {formatRupiah(cartTotal)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-600 hover:text-dark font-medium py-3 px-6"
                >
                  Kembali
                </button>
                <button
                  onClick={() => {
                    setStep(3);
                    window.scrollTo({
                      top: 0,
                    });
                  }}
                  className="bg-primary hover:bg-primary-dark text-dark font-bold py-3 px-8 rounded-xl transition-colors"
                >
                  Pilih Pembayaran
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Pembayaran */}
          {step === 3 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-family-inter font-bold text-dark mb-6">
                Pembayaran
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div
                  onClick={() => {
                    setPaymentMethod("full");
                    setAmountToPay(cartTotal);
                  }}
                  className={`cursor-pointer border-2 rounded-2xl p-5 transition-all ${paymentMethod === "full" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold font-family-inter text-dark">
                      Bayar Lunas
                    </h3>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "full" ? "border-primary" : "border-gray-300"}`}
                    >
                      {paymentMethod === "full" && (
                        <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary-dark">
                    {formatRupiah(cartTotal)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Bayar penuh sekarang, tinggal datang dan nikmati.
                  </p>
                </div>
                <div
                  onClick={() => {
                    setPaymentMethod("dp");
                    setAmountToPay(cartTotal / 2);
                  }}
                  className={`cursor-pointer border-2 rounded-2xl p-5 transition-all ${paymentMethod === "dp" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold font-family-inter text-dark">
                      Bayar DP 50%
                    </h3>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "dp" ? "border-primary" : "border-gray-300"}`}
                    >
                      {paymentMethod === "dp" && (
                        <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary-dark">
                    Rp
                    {new Intl.NumberFormat("id-ID", { currency: "IDR" }).format(
                      cartTotal / 2,
                    )}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Sisa pembayaran bisa Rp
                    {new Intl.NumberFormat("id-ID", { currency: "IDR" }).format(
                      cartTotal / 2,
                    )}{" "}
                    dibayar di kasir.
                  </p>
                </div>

                <div
                  onClick={() => setPaymentMethod("custom")}
                  className={`cursor-pointer border-2 rounded-2xl p-5 transition-all ${paymentMethod === "custom" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold font-family-inter text-dark">
                      DP Suka-Suka
                    </h3>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "custom" ? "border-primary" : "border-gray-300"}`}
                    >
                      {paymentMethod === "custom" && (
                        <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary-dark">
                    Bebas Nominal
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    DP suka-suka, Sisa pembayaran bisa dibayar di kasir.
                  </p>
                </div>
              </div>

              {paymentMethod === "custom" && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Masukkan Nominal DP
                  </label>
                  <input
                    type="text"
                    name="nominal_dp"
                    pattern="[0-9]+"
                    className="outline-none block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                    placeholder="Masukkan nominal"
                    onInput={(e) => {
                      setNominalDp(e.currentTarget.value);
                      setAmountToPay(e.currentTarget.value);
                    }}
                  />
                  <div className="mt-2 w-full flex justify-between items-center">
                    <h1 className="font-family-inter font-semibold">Nominal</h1>
                    <h1 className="font-family-inter font-semibold">
                      Rp{" "}
                      {new Intl.NumberFormat("id-ID", {
                        currency: "IDR",
                      }).format(nominalDp)}
                    </h1>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
                <h3 className="font-bold font-family-inter text-blue-900 mb-4">
                  Transfer ke Rekening Berikut:
                </h3>
                <div className="space-y-4">
                  <div className="sm:flex justify-between items-center bg-white p-4 rounded-xl border border-blue-100">
                    <div>
                      <p className="font-bold text-dark">
                        {currentStore?.bank}
                      </p>
                      <div className="flex gap-2 items-center">
                        <p className="text-gray-600 font-mono">
                          {currentStore?.account_number}
                        </p>
                        <button
                          onClick={() => copyToClipboard()}
                          className="flex text-xs items-center gap-1 bg-primary px-3 py-1 rounded-md text-white"
                        >
                          <ClipboardIcon className="size-4" />
                          <span>copy</span>
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">
                        {currentStore?.account_name}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 sm:text-right">
                      <p className="text-sm text-gray-500 mb-1">
                        Nominal Transfer
                      </p>
                      <p className="font-bold text-lg text-primary-dark">
                        {formatRupiah(amountToPay)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* QRIS */}
                {currentStore?.qris && (
                  <div className="mt-3 space-y-4">
                    <div className="flex justify-center items-center bg-white p-4 rounded-xl border border-blue-100">
                      <div>
                        {/* <div className="size-52 sm:size-60 bg-gray-400 flex justify-center items-center rounded-md">
                        <h1 className="text-white font-family-inter font-bold text-center">
                          QRIS Coming Soon
                        </h1>
                      </div> */}

                        <img
                          src={assetUrl + "uploads/" + currentStore?.qris}
                          alt="QRIS"
                          className="w-full h-full sm:h-60"
                        />

                        <a href={apiurl + "download-qris"} target="_blank">
                          <button className="mt-3 group relative w-full flex justify-center py-3.5 sm:px-4 border border-transparent text-sm font-bold rounded-xl text-dark bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-md">
                            Download
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h3 className="font-bold font-family-inter text-dark mb-4">
                  Unggah Bukti Transfer
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  {paymentProof ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                        <FileIcon className="w-8 h-8" />
                      </div>
                      <p className="font-medium text-dark">{fileName}</p>
                      <p className="text-sm text-primary mt-2">
                        Klik untuk mengganti file
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-3">
                        <UploadIcon className="w-8 h-8" />
                      </div>
                      <p className="font-medium text-dark">
                        Klik atau drag file ke sini
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Format JPG, PNG (Max. 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-gray-100">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-600 hover:text-dark font-medium py-3 px-6"
                  disabled={isSubmitting}
                >
                  Kembali
                </button>
                <button
                  onClick={handleOpenConfirm}
                  disabled={!paymentProof || isSubmitting}
                  className={`font-bold py-3 px-8 rounded-xl transition-colors flex items-center ${!paymentProof || isSubmitting ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark text-dark shadow-md"}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    "Selesaikan Delivery Order"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== CONFIRMATION MODAL ===== */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          ></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-3xl flex justify-between items-center">
              <h3 className="text-xl font-family-inter font-bold text-dark">
                Konfirmasi Delivery Order
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <p className="text-gray-600 text-sm">
                Pastikan semua detail di bawah ini sudah benar sebelum
                melanjutkan.
              </p>

              {/* Reservation Details */}
              <div className="bg-gray-50 rounded-2xl p-5 space-y-4 border border-gray-100">
                <h4 className="font-bold font-family-inter text-dark text-sm uppercase tracking-wider flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2 text-primary-dark" />
                  Detail Delivery Order ({currentStore?.name})
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Cabang</p>
                    <p className="font-semibold text-dark text-sm">
                      {currentStore?.area}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Nama</p>
                    <p className="font-semibold text-dark text-sm">
                      {customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">WhatsApp</p>
                    <p className="font-semibold text-dark text-sm">
                      {customerPhone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tanggal</p>
                    <p className="font-semibold text-dark text-sm">
                      {date ? formatDate(date) : date}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Jam Antar</p>
                    <p className="font-semibold text-dark text-sm">
                      {time} WIB
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Notes in Confirm Modal */}
              {customerNotes && (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                  <h4 className="font-bold font-family-inter text-dark text-sm uppercase tracking-wider flex items-center mb-2">
                    <MessageSquareIcon className="w-4 h-4 mr-2 text-amber-600" />
                    Catatan Pelanggan
                  </h4>
                  <p className="text-sm text-amber-900 italic">
                    "{customerNotes}"
                  </p>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
                <h4 className="font-bold font-family-inter text-dark text-sm uppercase tracking-wider flex items-center">
                  <ShoppingBagIcon className="w-4 h-4 mr-2 text-primary-dark" />
                  Pesanan ({cart.length} item)
                </h4>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.menuItem.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-700">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      <span className="font-medium text-dark">
                        {formatRupiah(item.menuItem.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-primary/5 rounded-2xl p-5 space-y-3 border border-primary/20">
                <h4 className="font-bold font-family-inter text-dark text-sm uppercase tracking-wider flex items-center">
                  <CreditCardIcon className="w-4 h-4 mr-2 text-primary-dark" />
                  Pembayaran
                </h4>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Metode</span>
                  <span className="font-semibold text-dark text-sm">
                    {paymentMethod === "full"
                      ? "Bayar Lunas"
                      : paymentMethod === "dp"
                        ? "DP"
                        : "DP BEBAS"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Total Tagihan</span>
                  <span className="font-semibold text-dark text-sm">
                    {formatRupiah(cartTotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-primary/20">
                  <span className="font-bold text-dark">Jumlah Dibayar</span>
                  <span className="text-xl font-bold text-primary-dark">
                    {formatRupiah(amountToPay)}
                  </span>
                </div>
                {paymentMethod === "dp" && (
                  <p className="text-xs text-gray-500 bg-white/60 p-2 rounded-lg">
                    Sisa {formatRupiah(cartTotal - dpAmount)} dibayar saat
                    kedatangan di kasir.
                  </p>
                )}
              </div>

              {/* Bukti Transfer */}
              <div className="flex items-center gap-3 bg-green-50 p-3 rounded-xl border border-green-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Bukti transfer terlampir
                  </p>
                  <p className="text-xs text-green-600">{fileName}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 rounded-b-3xl flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Periksa Lagi
              </button>
              <button
                disabled={loadingCheckout}
                onClick={handleSubmit}
                className="flex-1 py-3 px-4 bg-primary hover:bg-primary-dark text-dark font-bold rounded-xl transition-colors shadow-md"
              >
                {loadingCheckout ? (
                  <Spinner />
                ) : (
                  <div className="flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Konfirmasi & Kirim
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SUCCESS MODAL ===== */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full text-center overflow-hidden">
            {/* Decorative top band */}
            <div className="h-2 bg-gradient-to-r from-green-400 via-green-500 to-emerald-500"></div>

            <div className="p-8">
              {/* Animated success icon */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                <div className="relative w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-12 h-12 text-green-500" />
                </div>
              </div>

              <h2 className="text-2xl font-family-inter font-bold text-dark mb-2">
                🎉 Reservasi Berhasil!
              </h2>
              <p className="text-gray-600 mb-6">
                Terima kasih! Pembayaran Anda sedang kami verifikasi. Kami akan
                mengirimkan konfirmasi melalui WhatsApp.
              </p>

              {/* Reservation ID Card */}
              <div className="bg-gray-50 p-5 rounded-2xl mb-6 border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">ID Reservasi Anda</p>
                <p className="text-2xl font-mono font-bold text-dark tracking-wider">
                  {successId}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-3 text-left">
                  <div>
                    <p className="text-xs text-gray-400">Tanggal</p>
                    <p className="text-sm font-semibold text-dark">
                      {date ? formatDate(date) : date}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Waktu</p>
                    <p className="text-sm font-semibold text-dark">
                      {time} WIB
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Jumlah Tamu</p>
                    <p className="text-sm font-semibold text-dark">
                      {people} Orang
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Pembayaran</p>
                    <p className="text-sm font-semibold text-dark">
                      {formatRupiah(amountToPay)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status indicator */}
              {/* <div className="flex items-center justify-center gap-2 mb-8 bg-yellow-50 py-2.5 px-4 rounded-full border border-yellow-200 inline-flex mx-auto">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-yellow-800">
                  Menunggu Konfirmasi Admin
                </span>
              </div> */}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate("delivery-order");
                  }}
                  className="w-full bg-primary hover:bg-primary-dark text-dark font-bold py-3.5 rounded-xl transition-colors shadow-sm"
                >
                  Lihat Status Delivery
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate("menu");
                  }}
                  className="w-full py-3 text-gray-600 hover:text-dark font-medium transition-colors"
                >
                  Kembali ke Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Select Time */}
      {showSelectTimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setShowSelectTimeModal(false);
            }}
          ></div>
          <div className="relative bg-[#FDFBF7] w-full h-full md:h-auto md:max-h-[85vh] md:max-w-2xl md:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="bg-primary px-6 py-4 flex items-center justify-between border-b-4 border-primary-dark/20 shadow-sm z-10">
              <h2 className="text-base sm:text-2xl font-family-inter font-bold text-dark tracking-wide uppercase">
                Pilih Jam Antar
              </h2>
              <button
                onClick={() => {
                  setShowSelectTimeModal(false);
                }}
                className="p-2 bg-black/10 hover:bg-black/20 rounded-full text-dark transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div
              className={`flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar relative pb-28`}
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
                    {date ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {timesAvailable?.map((value, index) => (
                          <button
                            onClick={() => {
                              setTime(value?.time);
                              setShowSelectTimeModal(false);
                            }}
                            disabled={Boolean(value?.available) ? false : true}
                            className={`${time === value && "bg-primary text-white"} px-4 py-2 rounded-md border-2 border-primary transition ease-in-out hover:bg-slate-200 disabled:bg-slate-300`}
                            key={index}
                          >
                            <h1 className="font-semibold font-family-inter">
                              {value?.time}
                            </h1>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <h1 className="text-center font-family-inter">
                        Harap memilih tanggal pengantaran
                      </h1>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
