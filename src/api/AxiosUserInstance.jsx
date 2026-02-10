import axios from "axios";
const token = localStorage.getItem("token");
const AxiosUserInstance = axios.create({
  baseURL: "https://localhost:7160/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default AxiosUserInstance;
