import axios from "axios";

const API_URL = "https://65d7a16b27d9a3bc1d7b85cd.mockapi.io/";

export const api = axios.create({
  baseURL: API_URL,
});
