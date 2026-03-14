import React, { FormEvent, useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useAxios } from "../../utils/axios";
import { SaveIcon, XIcon } from "lucide-react";
import swal from "sweetalert2";
import Spinner from "../../components/Spinner";
import { useAppContext } from "../../context/AppContext";

interface AuthPageProps {
  navigate: (page: string) => void;
}

export default function AdminCategory({ navigate }: AuthPageProps) {
  const { currentUser, logout } = useAppContext();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [modalShow, setModalShow] = React.useState<boolean>(false);

  const [formId, setFormId] = React.useState();
  const [formName, setFormName] = React.useState();
  const [formLoading, setFormLoading] = React.useState<boolean>(false);

  const columns = [
    {
      accessorKey: "id",
      header: "No",
      cell: ({ row }) =>
        row.index + 1 + pagination.pageIndex * pagination.pageSize,
    },
    { accessorKey: "name", header: "Nama" },
    {
      accessorKey: "id",
      header: "Action",
      cell: ({ row }) => {
        return (
          <button
            onClick={() => {
              setModalShow(true);
              setFormId(row?.original?.id);
              setFormName(row?.original?.name);
            }}
            className="group relative flex items-center justify-center gap-1.5 rounded-md border border-transparent bg-primary px-2 py-1 text-xs font-bold text-white shadow-md transition-all hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Edit
          </button>
        );
      },
    },
  ];

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearch(inputSearch);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 500);

    return () => clearTimeout(delay);
  }, [inputSearch]);

  const fetchDatatables = () => {
    useAxios
      .get("/category/datatables", {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search,
        },
        headers: {
          Authorization: `Bearer ${currentUser?.access_token ?? ""}`,
        },
      })
      .then(async (response) => {
        const data = await response.data;

        if (data?.status) {
          setData(data?.data?.categories);
          setTotalData(data?.data?.data_total);
        } else {
          setData([]);
          setTotalData(0);
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
        setLoading(false);
      });
  };

  useEffect(() => {
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setFormLoading(true);
    useAxios
      .post(
        "/category/" + formId,
        {
          name: formName,
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
          setModalShow(false);
          fetchDatatables();
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
          text: "Data gagal disimpan!",
          timer: 2500,
        });
      })
      .finally(() => {
        setFormLoading(false);
      });
  };

  return (
    <>
      {/* Form Modal */}
      {modalShow && (
        <div className="w-full h-screen flex justify-center items-center fixed top-0 left-0 z-[90] p-4">
          <div
            onClick={() => setModalShow(false)}
            className="absolute top-0 left-0 w-full h-full bg-black/25 inset-0"
          ></div>

          <div className="w-[500px] bg-white p-4 px-6 rounded-xl relative">
            <div className="w-full flex justify-between items-center">
              <h1 className="text-xl font-bold">Ubah Data</h1>
              <button type="button" onClick={() => setModalShow(false)}>
                <XIcon className="size-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              action=""
              method="post"
              className="mt-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kategori
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="outline-none block w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                    placeholder="Masukkan nama kategori"
                    value={formName}
                    required
                    onChange={(e) => setFormName(e.target.value)}
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
          </div>
        </div>
      )}

      <div className="space-y-4 px-4 py-14">
        <div className="py-10">
          <h1 className="text-3xl font-family-inter font-bold text-dark">
            Kelola Kategori
          </h1>
        </div>

        <div className="flex w-full justify-end">
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

        <div className="flex items-center justify-between">
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
    </>
  );
}
