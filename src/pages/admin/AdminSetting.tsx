import React, { FormEvent } from "react";
import { useAxios } from "../../utils/axios";
import { SaveIcon } from "lucide-react";
import swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import { useAppContext } from "../../context/AppContext";
import { assetUrl } from "../../constants/app";

interface AuthPageProps {
  navigate: (page: string) => void;
}

export default function AdminSetting({ navigate }: AuthPageProps) {
  const { currentUser, logout } = useAppContext();

  const [setting, setSetting] = React.useState();
  const [formLoading, setFormLoading] = React.useState<boolean>(false);
  const [isRefreshed, setIsRefreshed] = React.useState<number>(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    setFormLoading(true);
    useAxios
      .post("/setting", formData, {
        headers: {
          Authorization: `Bearer ${currentUser?.access_token ?? ""}`,
        },
      })
      .then(async (response) => {
        const data = await response.data;

        if (data?.status) {
          setIsRefreshed(Math.random());
          swal.fire({
            icon: "success",
            title: "Success",
            text: "Pengaturan berhasil disimpan!",
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
          text: "Pengaturan gagal disimpan!",
          timer: 2500,
        });
      })
      .finally(() => {
        setFormLoading(false);
      });
  };

  React.useEffect(() => {
    useAxios
      .get("/setting", {
        headers: {
          Authorization: `Bearer ${currentUser?.access_token ?? ""}`,
        },
      })
      .then(async (response) => {
        const data = await response.data;

        if (data?.status) {
          setSetting(data?.data);
        }
      });
  }, [isRefreshed]);

  return (
    <>
      <div className="space-y-4 px-4 py-14">
        <div className="w-full flex justify-center">
          <form
            onSubmit={handleSubmit}
            action=""
            method="post"
            className="mt-6 sm:w-1/2"
            encType="multipart/form-data"
          >
            <div className="py-10">
              <h1 className="text-3xl font-family-inter font-bold text-dark">
                Kelola Pengaturan
              </h1>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Bank
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="outline-none block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="Masukkan nama bank"
                  name="bank"
                  autoComplete="off"
                  value={setting?.bank}
                  onInput={(e) =>
                    setSetting((prev) =>
                      prev
                        ? {
                            ...prev,
                            bank: e.target.value,
                          }
                        : prev,
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Rekening
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="outline-none block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="Masukkan nomor rekening"
                  name="account_number"
                  autoComplete="off"
                  value={setting?.account_number}
                  onInput={(e) =>
                    setSetting((prev) =>
                      prev
                        ? {
                            ...prev,
                            account_number: e.target.value,
                          }
                        : prev,
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Akun Rekening
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="outline-none block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="Masukkan nama akun rekening"
                  name="account_name"
                  autoComplete="off"
                  value={setting?.account_name}
                  onInput={(e) =>
                    setSetting((prev) =>
                      prev
                        ? {
                            ...prev,
                            account_name: e.target.value,
                          }
                        : prev,
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                QRIS
              </label>
              <div className="relative">
                <input
                  type="file"
                  className="outline-none block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  name="qris"
                  autoComplete="off"
                  accept="image/*"
                />
              </div>

              {setting?.qris && (
                <div className="mt-4">
                  <img
                    src={assetUrl + "assets/images/" + setting?.qris}
                    alt="QRIS"
                    className="size-full sm:h-60 rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="mt-4 w-full flex justify-end">
              <button
                disabled={formLoading}
                className="group relative flex items-center justify-center gap-1.5 rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {formLoading && <Spinner />}

                {!formLoading && (
                  <>
                    <SaveIcon className="size-5" />
                    <span>Simpan Data</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
