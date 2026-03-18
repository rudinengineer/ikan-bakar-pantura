import React, { FormEvent } from "react";
import { SaveIcon } from "lucide-react";
import swal from "sweetalert2";
import { useAppContext } from "../context/AppContext";
import { useAxios } from "../utils/axios";
import Spinner from "../components/Spinner";

interface AuthPageProps {
  navigate: (page: string) => void;
}

export default function Profile({ navigate }: AuthPageProps) {
  const { currentUser, logout } = useAppContext();

  const [user, setUser] = React.useState();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [formLoading, setFormLoading] = React.useState<boolean>(false);
  const [isRefreshed, setIsRefreshed] = React.useState<number>(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    setFormLoading(true);
    useAxios
      .post("/profile", formData, {
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
      .get("/profile", {
        headers: {
          Authorization: `Bearer ${currentUser?.access_token ?? ""}`,
        },
      })
      .then(async (response) => {
        const data = await response.data;

        if (data?.status) {
          setUser(data?.data);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isRefreshed]);

  return (
    <>
      <div className="space-y-4 px-4 py-14">
        <div className="w-full flex justify-center">
          {isLoading ? (
            <Spinner color="primary" size="lg" />
          ) : (
            <form
              onSubmit={handleSubmit}
              action=""
              method="post"
              className="mt-6 sm:w-1/2"
              encType="multipart/form-data"
            >
              <div className="py-10">
                <h1 className="text-3xl font-family-inter font-bold text-dark">
                  Ubah Profile
                </h1>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="outline-none block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                    placeholder="Masukkan nama"
                    name="name"
                    autoComplete="off"
                    value={user?.name}
                    onInput={(e) =>
                      setUser((prev) =>
                        prev
                          ? {
                              ...prev,
                              name: e.target.value,
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
                  Nomor WhatsApp
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="outline-none block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                    placeholder="Masukkan nomor whatsapp"
                    name="phone"
                    autoComplete="off"
                    value={user?.phone}
                    onInput={(e) =>
                      setUser((prev) =>
                        prev
                          ? {
                              ...prev,
                              phone: e.target.value,
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
                  Password (Optional)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    className="outline-none block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                    placeholder="Masukkan password baru"
                    name="password"
                    autoComplete="off"
                    onInput={(e) =>
                      setUser((prev) =>
                        prev
                          ? {
                              ...prev,
                              password: e.target.value,
                            }
                          : prev,
                      )
                    }
                  />
                </div>
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
          )}
        </div>
      </div>
    </>
  );
}
