import React, { useState } from "react";
import { PhoneIcon, UserIcon, LockIcon, ArrowRightIcon } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useAxios } from "../utils/axios";
import Spinner from "../components/Spinner";
interface AuthPageProps {
  navigate: (page: string) => void;
}
export function AuthPage({ navigate }: AuthPageProps) {
  const { currentStore, login } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!phone) {
      setError("Nomor HP wajib diisi");
      return;
    }
    if (!isLogin && !name) {
      setError("Nama wajib diisi");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setIsLoading(true);
    if (isLogin) {
      useAxios
        .post("/auth/login", {
          phone,
          password,
        })
        .then(async (response) => {
          const data = await response.data;

          if (data?.status) {
            login(data?.data?.user, data?.data?.access_token);

            if (data?.data?.user?.role === "admin") {
              navigate("admin");
            } else {
              navigate("home");
            }
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            setError("Username atau password salah");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      useAxios
        .post("/auth/register", {
          store_id: currentStore?.id,
          name,
          phone,
          password,
        })
        .then(async (response) => {
          const data = await response.data;

          if (data?.status) {
            login(data?.data?.user, data?.data?.access_token);
            navigate("home");
          }
        })
        .catch((e) => {
          if (e.response.status === 400) {
            if (e.response.data?.data?.name) {
              setError(e.response.data?.data?.name);
            }
            if (e.response.data?.data?.phone) {
              setError(e.response.data?.data?.phone);
            }
            if (e.response.data?.data?.password) {
              setError(e.response.data?.data?.password);
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  return (
    <div className="min-h-[calc(100vh-80px)] bg-warm-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-family-inter font-bold text-dark">
            {isLogin ? "Selamat Datang Kembali" : "Buat Akun Baru"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin
              ? "Silakan masuk untuk melanjutkan reservasi"
              : "Daftar untuk mulai memesan menu favorit Anda"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-xl">
          <button
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${isLogin ? "bg-white text-dark shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
          >
            Masuk
          </button>
          <button
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${!isLogin ? "bg-white text-dark shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
          >
            Daftar
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                    placeholder="Masukkan nama Anda"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor WhatsApp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  pattern="[0-9]+"
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="Contoh: 081234567890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="Minimal 6 karakter"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-dark bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-md"
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  {isLogin ? "Masuk Sekarang" : "Daftar Sekarang"}
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
