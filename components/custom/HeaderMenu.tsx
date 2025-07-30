"use client";
import { hasRole } from "@/helpers/checkAuthorization";
import { usePathname, useRouter } from "next/navigation"; // Usando o hook do next/navigation
import { useEffect, useState } from "react";
import { Menubar, MenubarMenu, MenubarTrigger } from "../ui/menubar";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export function HeaderMenu() {
  const pathname = usePathname(); // Acessa o pathname atual
  const router = useRouter(); // Para navegar para uma nova rota

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(hasRole(["admin"])); // Garante que só roda no cliente
  }, []);
  // Verifique a rota atual para aplicar a classe "active"
  const isTerritoriesActive = pathname === "/";
  const isCadastrosActive = pathname === "/cadastros";
  const isDesignacoesActive = pathname === "/designacoes";
  const isPerfilActive = pathname === "/perfil";

  const handleNavigation = (path: string) => {
    router.push(path); // Navega para o caminho desejado
  };

  return (
    <ScrollArea>
      <Menubar className="max-w-fit mx-auto">
        <MenubarMenu>
          <MenubarTrigger
            className="cursor-pointer"
            data-state={isTerritoriesActive ? "open" : "closed"}
            onClick={() => handleNavigation("/")}
          >
            Territórios
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger
            className="cursor-pointer"
            data-state={isDesignacoesActive ? "open" : "closed"}
            onClick={() => handleNavigation("/designacoes")}
          >
            Designações
          </MenubarTrigger>
        </MenubarMenu>

        {isAdmin && (
          <MenubarMenu>
            <MenubarTrigger
              className="cursor-pointer"
              data-state={isCadastrosActive ? "open" : "closed"}
              onClick={() => handleNavigation("/cadastros")}
            >
              Cadastros
            </MenubarTrigger>
          </MenubarMenu>
        )}
        <MenubarMenu>
          <MenubarTrigger
            className="cursor-pointer"
            data-state={isPerfilActive ? "open" : "closed"}
            onClick={() => handleNavigation("/perfil")}
          >
            Perfil
          </MenubarTrigger>
        </MenubarMenu>
        <ScrollBar orientation="horizontal" />
      </Menubar>
    </ScrollArea>
  );
}
