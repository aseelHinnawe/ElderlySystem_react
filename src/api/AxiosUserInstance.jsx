import axios from "axios";

const AxiosUserInstance = axios.create({
  baseURL: "https://localhost:7160/api",
});

AxiosUserInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token)
     config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default AxiosUserInstance;