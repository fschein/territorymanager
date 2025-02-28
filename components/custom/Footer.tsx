"use client";
import { useAuthStore } from "@/context/auth-store";
import { useTheme } from "@/providers/theme-provider";
import { LogOut, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import AlertPopUp from "./AlertPopUp";

export function Footer() {
  const router = useRouter();

  const { theme, setTheme } = useTheme();
  const logout = useAuthStore().logout;

  return (
    <footer className="flex justify-between ">
      <AlertPopUp
        title={"Deseja sair?"}
        description="Você será deslogado da sua conta."
        action={() => {
          router.push("/login");
          logout();
        }}
      >
        <Button variant="secondary" size="icon" title="Sair" onClick={() => {}}>
          <LogOut size={16} />
        </Button>
      </AlertPopUp>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      </Button>
    </footer>
  );
}
