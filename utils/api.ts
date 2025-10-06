import axios from "axios";

function resolveApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL;

  if (raw && raw.trim() !== "") {
    const trimmed = raw.replace(/\/+$/, "");
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }

  // Cliente: usa a própria origem
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin.replace(/\/+$/, "")}/api`;
  }

  // Vercel SSR
  const vercel = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) {
    const url = vercel.startsWith("http") ? vercel : `https://${vercel}`;
    return `${url.replace(/\/+$/, "")}/api`;
  }

  // Dev SSR: respeita PORT se você iniciar o Next em outra porta
  const port = process.env.PORT || "3000";
  return `http://localhost:${port}/api`;
}

const api = axios.create();

api.interceptors.request.use((config) => {
  // **Sempre** recalcula a base a cada request
  config.baseURL = resolveApiBase();

  // Token só no cliente
  if (typeof window !== "undefined") {
    const objectStorage = localStorage.getItem("auth-storage");
    const json = objectStorage && JSON.parse(objectStorage);
    const token = json && json.state && json.state.token;
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
