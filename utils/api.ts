import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5173/api",
});

// Interceptor para adicionar o token automaticamente às requisições autenticadas
api.interceptors.request.use((config) => {
  // Obtenha o token do localStorage
  const objectStorage = localStorage.getItem("auth-storage");
  // console.log(objectStorage);
  const json = objectStorage && JSON.parse(objectStorage);

  // const storageToken = useAuthStore.getState().token
  // const token = storageToken || null;
  const token = json && json.state && json.state.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
