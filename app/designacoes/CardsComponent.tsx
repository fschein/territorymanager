"use client";

import { SelectMultiStatus } from "@/components/custom/SelectStatus";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTerritories } from "@/hooks/useTerritories";
import { statusMap } from "@/types/TerritoryProps";
import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleDotDashed,
  Eye,
  Forward,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ModalUsers } from "../main/ModalUsers";

const url = process.env.NEXT_PUBLIC_URL;

export const CardsComponent = () => {
  const router = useRouter();
  const [statusList, setStatusList] = useState<string[]>(["urgent", "ongoing", "assigned", "done"]);
  const [modalUserOpen, setModalUserOpen] = useState(false);

  const { data: territories } = useTerritories().getAll({ filters: { statusList } });
  const { data: cardTerritoriesData } = useTerritories().getCountStatus();

  return (
    <section className="flex gap-4 flex-col">
      <h2 className="font-medium text-center text-3xl sm:text-left sm:text-2xl ">Territórios</h2>
      <div className="flex flex-wrap gap-3">
        <div className=" flex-1 min-w-fit flex justify-between items-center gap-3 md:gap-10 rounded-md px-4 py-2 ring-slate-500 ring-2">
          <div className="flex gap-1 flex-col">
            <strong className="font-medium text text-slate-500 dark:text-slate-400">
              Designados
            </strong>
            <span className="text-3xl font-semibold text-slate-500">
              {cardTerritoriesData?.assigned || "0"}
            </span>
          </div>
          <CircleDashed size={40} className="text-slate-500 stroke-[1.5px]" />
        </div>
        <div className=" flex-1 min-w-fit flex justify-between items-center gap-3 md:gap-10 rounded-md px-4 py-2 ring-warning ring-2">
          <div className="flex gap-1 flex-col">
            <strong className="font-medium text text-warning">Parciais</strong>
            <span className="text-3xl font-semibold text-warning">
              {cardTerritoriesData?.ongoing || "0"}
            </span>
          </div>
          <CircleDotDashed size={40} className="text-warning stroke-[1.5px]" />
        </div>
        <div className=" flex-1 min-w-fit flex justify-between items-center gap-3 md:gap-10 rounded-md px-4 py-2 ring-success ring-2">
          <div className="flex gap-1 flex-col">
            <strong className="font-medium text text-success">Feitos</strong>
            <span className="text-3xl font-semibold text-success">
              {cardTerritoriesData?.done || "0"}
            </span>
          </div>
          <CircleCheck size={40} className="text-success stroke-[1.5px]" />
        </div>
        <div className=" flex-1 min-w-fit flex justify-between items-center gap-3 md:gap-10 rounded-md px-4 py-2 ring-destructive ring-2">
          <div className="flex gap-1 flex-col">
            <strong className="font-medium text text-destructive">Urgentes</strong>
            <span className="text-3xl font-semibold text-destructive">
              {cardTerritoriesData?.urgent || "0"}
            </span>
          </div>
          <CircleAlert size={40} className="text-destructive stroke-[1.5px]" />
        </div>
      </div>
      <SelectMultiStatus
        maxCount={Infinity}
        value={statusList}
        onChange={(status) => setStatusList(status)}
      />
      <div className="grid">
        <Table divClassname="border max-h-[50vh] scroll-thin rounded-md">
          <TableHeader className="sticky top-0 bg-secondary uppercase">
            <TableRow>
              <TableHead>Ações</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Responsável</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {territories?.map((territory) => {
              async function sendTerritory() {
                const number = territory?.number;
                const mensagem =
                  `${url}/?id=${territory._id}\n\n` +
                  `*Olá!* 😁\n` +
                  `Você foi designado para o território *${number}*.\n` +
                  `Acesse o link acima para conferir todos os detalhes.\n` +
                  `Se precisar de algo, estou à disposição!\n\n` +
                  `⚠️ _Ao finalizar o território, lembre-se de marcá-lo como concluído._`;

                navigator.clipboard
                  .writeText(mensagem)
                  .then(() => toast("Mensagem copiada!"))
                  .catch((err) => toast.error("Erro ao copiar a mensagem:", err));
                setModalUserOpen(true);
              }
              return (
                <TableRow key={`territories-${territory._id}`}>
                  <TableCell className="flex gap-2">
                    <Button
                      className="border-0 px-2 py-1 text-xs"
                      size={"xs"}
                      variant={"tertiary"}
                      title="Ver o território"
                      onClick={() => router.push(`/?id=${territory._id}`)}
                    >
                      <Eye size={16} />
                    </Button>
                    <span>
                      <Button
                        variant={"secondary"}
                        className="bg-slate-300 dark:text-slate-600"
                        title="Designar"
                        size={"xs"}
                        onClick={sendTerritory}
                      >
                        <Forward size={20} />
                      </Button>
                    </span>
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
                    {territory?.responsible?.name || "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <ModalUsers modalOpen={modalUserOpen} closeModal={() => setModalUserOpen(false)} />
    </section>
  );
};
