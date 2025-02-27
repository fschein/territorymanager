import { useAuthStore } from "@/context/auth-store";

export const hasRole = (role: string | string[]) => {
  const user = useAuthStore.getState().user;
  const tipo = typeof role;

  if (!user) return false;
  if (tipo !== "string" && tipo !== "number" && !(role instanceof Array)) return false;
  if (!user.role || user.role?.length === 0) {
    return false;
  }

  if (tipo === "string") {
    return role == user.role;
  }
  if (role instanceof Array) {
    return role.includes(user.role);
  }
  return false;
};
