"use client";
import MainComponent from "@/components/custom/MainComponent";

import { hasRole } from "@/helpers/checkAuthorization";
import { useEffect, useState } from "react";
import { MyTerritories } from "./components/MyTerritories";
import { TerritoriesWithCards } from "./components/TerritoriesWithCards";
export default function Designacoes() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(hasRole(["admin", "elder"])); // Garante que só roda no cliente
  }, []);
  return (
    <MainComponent className="gap-8 max-w-4xl mx-auto">
      <MyTerritories />
      {isAdmin && <TerritoriesWithCards />}
    </MainComponent>
  );
}
