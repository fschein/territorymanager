import axios from "axios";

// Normaliza a BASE, acrescentando /api se faltar
function resolveApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL;

  if (raw && raw.trim() !== "") {
    const trimmed = raw.replace(/\/+$/, ""); // remove barras finais
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }

  // Sem ENV: no browser, usa o origin atual (Vercel/localhost)
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/api`;
  }

  // Fallback para dev/SSR
  return "http://localhost:3000/api";
}

const api = axios.create({
  baseURL: resolveApiBase(),
});

// Interceptor para adicionar o token automaticamente às requisições autenticadas
api.interceptors.request.use((config) => {
  const objectStorage = localStorage.getItem("auth-storage");
  const json = objectStorage && JSON.parse(objectStorage);
  const token = json && json.state && json.state.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
