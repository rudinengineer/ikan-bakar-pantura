import axios from "axios";
import { apiurl } from "../constants/app";

export const useAxios = axios.create({
  baseURL: apiurl,
  headers: {
    Accept: "application/json",
  },
});
