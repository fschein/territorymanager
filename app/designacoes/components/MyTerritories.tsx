"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/context/auth-store";
import { useTerritories } from "@/hooks/useTerritories";
import { statusMap } from "@/types/TerritoryProps";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
export const MyTerritories = () => {
  const user = useAuthStore().user;
  const router = useRouter();

  const { data: territories } = useTerritories().getAll({ filters: { id_responsible: user?._id } });
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-medium text-center text-3xl sm:text-left sm:text-2xl ">
        Minhas Designações
      </h2>
      <div className="grid">
        <Table divClassname="border max-h-[50vh] scroll-thin rounded-md">
          <TableHeader className="sticky top-0 bg-secondary uppercase">
            <TableRow>
              <TableHead>Ações</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Responsáveis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {territories?.map((territory) => {
              return (
                <TableRow key={`territories-${territory._id}`}>
                  <TableCell className="flex gap-2">
                    <Button
                      className="border-0 px-2 py-1 text-xs"
                      size={"xs"}
                      variant={"tertiary"}
                      title="Ver o território"
                      onClick={() => router.push(`/?number=${territory.number}`)}
                    >
                      <Eye size={16} />
                    </Button>
                  </TableCell>
                  <TableCell className="text-nowrap text-sm">
                    <span className={`${statusMap.get(territory.status || "")?.style} font-medium`}>
                      {statusMap.get(territory.status || "")?.value}
                    </span>
                  </TableCell>
                  <TableCell className="text-nowrap text-sm">
                    Território {territory.number}
                  </TableCell>
                  <TableCell className="text-nowrap text-sm">
                    {territory?.responsibles?.map((res) => res.name).join(", ") || "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
