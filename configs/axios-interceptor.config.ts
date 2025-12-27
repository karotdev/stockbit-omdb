import axios from "axios";
import { API_KEY } from "@/constants";

const axiosInstance = axios.create({
  baseURL: "https://www.omdbapi.com",
  params: { apikey: API_KEY },
});

export default axiosInstance;
