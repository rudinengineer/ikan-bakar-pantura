import axios from "axios";

export const useAxios = axios.create({
  baseURL: "https://app.tubanweb.my.id/ikan-bakar-pantura/api/api/",
  headers: {
    Accept: "application/json",
  },
});

// export const useAxios = axios.create({
//   baseURL: "http://localhost:8000/api/",
//   headers: {
//     Accept: "application/json",
//   },
// });
