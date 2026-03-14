import React from "react";
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  InstagramIcon,
  FacebookIcon,
} from "lucide-react";

interface Props {
  currentPage: string;
}

export function Footer({ currentPage }: Props) {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!["reservation", "cart"].includes(currentPage) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand Info */}
            <div>
              <h3 className="font-family-inter font-bold text-2xl text-primary mb-4">
                Ikan Bakar Pantura
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Menyajikan cita rasa seafood tradisional terbaik dengan bumbu
                rempah pilihan khas Pantura. Segar, nikmat, dan menggugah
                selera.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-dark transition-colors"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-dark transition-colors"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-family-inter font-semibold text-xl mb-6 flex items-center">
                <span className="w-8 h-1 bg-primary mr-3 rounded-full"></span>
                Kontak & Lokasi
              </h4>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <MapPinIcon className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span>Jl. Raya Merakurak, Tuban, Jawa Timur</span>
                </li>
                <li className="flex items-center">
                  <PhoneIcon className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  <span>0852-9060-3309</span>
                </li>
                <li className="flex items-start">
                  <ClockIcon className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p>Senin - Minggu</p>
                    <p className="text-gray-400">10:00 - 22:00 WIB</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-family-inter font-semibold text-xl mb-6 flex items-center">
                <span className="w-8 h-1 bg-primary mr-3 rounded-full"></span>
                Layanan Kami
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors flex items-center"
                  >
                    <span className="text-primary mr-2">›</span> Makan di Tempat
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors flex items-center"
                  >
                    <span className="text-primary mr-2">›</span> Bawa Pulang
                    (Takeaway)
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors flex items-center"
                  >
                    <span className="text-primary mr-2">›</span> Reservasi
                    Tempat
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors flex items-center"
                  >
                    <span className="text-primary mr-2">›</span> Pesanan Jumlah
                    Besar
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()} Ikan Bakar Pantura Merakurak -
            Tuban. Hak Cipta Dilindungi.
          </p>
          <p className="mt-2 md:mt-0">
            Dibuat dengan ❤️ untuk pecinta seafood.
          </p>
        </div>
      </div>
    </footer>
  );
}
