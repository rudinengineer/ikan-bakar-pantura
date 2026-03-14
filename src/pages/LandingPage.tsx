import React from "react";
import {
  ArrowRightIcon,
  UtensilsIcon,
  CalendarCheckIcon,
  CreditCardIcon,
  CheckCircleIcon,
} from "lucide-react";
import { menuData } from "../data/menuData";
import { formatRupiah } from "../utils/format";
interface LandingPageProps {
  navigate: (page: string) => void;
}
export function LandingPage({ navigate }: LandingPageProps) {
  // Get a few popular items for the featured section
  const featuredItems = menuData.filter((item) =>
    ["Gurame Bakar Manis", "Udang Saus Padang", "Mubarok 1 (5 Orang)"].includes(
      item.name,
    ),
  );
  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Grilled Seafood"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-dark/70 bg-gradient-to-t from-dark/90 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
            Spesialis Seafood Tuban
          </span>
          <h1 className="text-5xl md:text-7xl font-family-inter font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Ikan Bakar Pantura <br />
            <span className="text-primary">Merakurak</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Cita Rasa Seafood Tradisional Terbaik di Tuban. Nikmati sajian segar
            dengan bumbu rempah rahasia keluarga.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("menu")}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-dark font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,201,7,0.4)] flex items-center justify-center"
            >
              Lihat Menu Kami
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("auth")}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold rounded-full transition-all backdrop-blur-sm"
            >
              Reservasi Tempat
            </button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-family-inter font-bold text-dark mb-4">
              Cara Mudah Reservasi
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Pesan tempat dan menu favorit Anda tanpa antre. Cukup ikuti 4
              langkah mudah ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: UtensilsIcon,
                title: "Pilih Menu",
                desc: "Eksplorasi katalog menu kami dan masukkan ke keranjang.",
              },
              {
                icon: CalendarCheckIcon,
                title: "Tentukan Waktu",
                desc: "Pilih tanggal, jam kedatangan, dan jumlah orang.",
              },
              {
                icon: CreditCardIcon,
                title: "Pembayaran",
                desc: "Bayar DP atau Lunas via transfer bank dan unggah bukti.",
              },
              {
                icon: CheckCircleIcon,
                title: "Datang & Nikmati",
                desc: "Tunjukkan bukti reservasi saat tiba, hidangan siap disajikan.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl hover:bg-warm-50 transition-colors group"
              >
                <div className="w-16 h-16 bg-primary/10 text-primary-dark rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-primary group-hover:text-dark">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/4 -right-4 w-8 border-t-2 border-dashed border-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-20 bg-warm-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-family-inter font-bold text-dark mb-4">
                Menu Favorit
              </h2>
              <div className="w-24 h-1 bg-primary rounded-full"></div>
            </div>
            <button
              onClick={() => navigate("menu")}
              className="mt-6 md:mt-0 text-primary-dark font-semibold hover:text-primary flex items-center transition-colors"
            >
              Lihat Semua Menu <ArrowRightIcon className="ml-2 w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group"
              >
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {/* Placeholder for actual food images */}
                  <div className="absolute inset-0 bg-gradient-to-br from-warm-100 to-warm-200 flex items-center justify-center text-warm-800/20 group-hover:scale-105 transition-transform duration-500">
                    <UtensilsIcon className="w-16 h-16" />
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-primary-dark shadow-sm">
                    {item.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-dark mb-2">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <span className="text-lg font-bold text-primary-dark">
                      {formatRupiah(item.price)}
                    </span>
                    <button
                      onClick={() => navigate("menu")}
                      className="w-10 h-10 rounded-full bg-warm-50 text-primary-dark flex items-center justify-center hover:bg-primary hover:text-dark transition-colors"
                    >
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dark relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#FFC907 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-family-inter font-bold text-white mb-6">
            Siap Menikmati Hidangan Kami?
          </h2>
          <p className="text-gray-300 mb-10 text-lg">
            Jangan biarkan perut Anda menunggu. Pesan sekarang dan pastikan meja
            Anda tersedia saat kedatangan.
          </p>
          <button
            onClick={() => navigate("menu")}
            className="px-8 py-4 bg-primary hover:bg-primary-dark text-dark font-bold rounded-full transition-all transform hover:scale-105 text-lg shadow-lg"
          >
            Mulai Pesanan Anda
          </button>
        </div>
      </section>
    </div>
  );
}
