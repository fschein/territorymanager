"use client";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { hasRole } from "@/helpers/checkAuthorization";
import { useTerritories } from "@/hooks/useTerritories";
import { statusMap } from "@/types/TerritoryProps";
import {
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleDotDashed,
  Eye,
  Forward,
  Trash,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useStoreTerritory } from "../../../stores/store";
import { ModalUsers } from "../../main/ModalUsers";
import { CardComponent } from "./CardComponent";

const url = process.env.NEXT_PUBLIC_URL;

export const TerritoriesWithCards = () => {
  const router = useRouter();
  const [statusList, setStatusList] = useState<string[]>([]);
  const [modalUserOpen, setModalUserOpen] = useState(false);
  const [message, setMessage] = useState("");
  const setIdTerritory = useStoreTerritory().setIdTerritory;

  const { data: territories } = useTerritories().getAll({ filters: { statusList } });
  const { data: cardTerritoriesData } = useTerritories().getCountStatus();
  const { mutate: deleteTerritory } = useTerritories().deleteOne();
  const { mutate: deleteAssigned } = useTerritories().deleteAssigned();

  const [isAdmin, setIsAdmin] = useState(false);

  const selectStatus = useCallback(
    (status: string) => {
      setStatusList((prev) => {
        // Verifica se o status já existe na lista
        if (prev.includes(status)) {
          // Se existir, remove ele da lista (filtra a lista mantendo apenas os diferentes)
          return prev.filter((item) => item !== status);
        } else {
          // Se não existir, adiciona à lista
          return [...prev, status];
        }
      });
    },
    [setStatusList]
  );

  useEffect(() => {
    setIsAdmin(hasRole(["admin"])); // Garante que só roda no cliente
  }, []);

  return (
    <section className="flex gap-4 flex-col">
      <h2 className="font-medium text-center text-3xl sm:text-left sm:text-2xl ">Territórios</h2>
      <div className="flex flex-wrap gap-3">
        <CardComponent
          title="Designados"
          qtde={cardTerritoriesData?.assigned || "0"}
          value="assigned"
          selectStatus={selectStatus}
          icon={CircleDashed}
          variant="secondary"
          checked={statusList.includes("assigned")}
        />
        <CardComponent
          title="Parciais"
          qtde={cardTerritoriesData?.ongoing || "0"}
          value="ongoing"
          selectStatus={selectStatus}
          icon={CircleDotDashed}
          variant="warning"
          checked={statusList.includes("ongoing")}
        />
        <CardComponent
          title="Feitos"
          qtde={cardTerritoriesData?.done || "0"}
          value="done"
          selectStatus={selectStatus}
          icon={CircleCheck}
          variant="success"
          checked={statusList.includes("done")}
        />
        <CardComponent
          title="Urgentes"
          qtde={cardTerritoriesData?.urgent || "0"}
          value="urgent"
          selectStatus={selectStatus}
          icon={CircleAlert}
          variant="destructive"
          checked={statusList.includes("urgent")}
        />
      </div>
      {/* <SelectMultiStatus
        maxCount={Infinity}
        value={statusList}
        onChange={(status: string[]) => setStatusList(status)}
      /> */}
      <div className="grid">
        <Table divClassname="border max-h-[50vh] scroll-thin rounded-md">
          <TableHeader className="sticky top-0 bg-secondary uppercase z-50">
            <TableRow>
              <TableHead>Ações</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Responsáveis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {territories?.map((territory) => {
              async function sendTerritory() {
                setIdTerritory(territory._id || "");
                const number = territory?.number;
                const mensagem =
                  `*Território ${number} - Designação*\n\n` +
                  `Olá, irmão!\n` +
                  `Você foi designado(a) para trabalhar o território *${number}*.\n\n` +
                  `*Link para acessar:*\n${url}/?number=${number}\n\n` +
                  `*Instruções importantes:*\n` +
                  `- Acesse o link para ver o mapa e detalhes\n` +
                  `- Ao concluir o trabalho, marque como "concluído" no sistema\n` +
                  `- Qualquer dúvida, estarei à disposição\n\n` +
                  `Que Jeová abençoe seu serviço!`;

                navigator.clipboard.writeText(mensagem);
                setMessage(mensagem);
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
                      onClick={() => router.push(`/?number=${territory.number}`)}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant={"secondary"}
                      title="Designar"
                      size={"xs"}
                      onClick={sendTerritory}
                    >
                      <Forward size={20} />
                    </Button>
                    {isAdmin && (
                      <AlertPopUp
                        title={`Deseja realmente remover esse território?`}
                        description="Esse terrítório será definitivamente removido do servidor."
                        action={() => deleteTerritory(territory._id || "")}
                      >
                        <Button
                          className="border-0 px-2 py-1 text-xs"
                          size={"xs"}
                          variant={"destructive"}
                          title="Ver o território"
                        >
                          <Trash size={16} />
                        </Button>
                      </AlertPopUp>
                    )}
                  </TableCell>
                  <TableCell className="text-nowrap text-sm">
                    <span className={`${statusMap.get(territory.status || "")?.style} font-medium`}>
                      {statusMap.get(territory.status || "")?.value}
                    </span>
                  </TableCell>
                  <TableCell className="text-nowrap text-sm">
                    Território {territory.number}
                  </TableCell>
                  <TableCell className="flex gap-2 text-nowrap text-sm">
                    {territory?.responsibles?.map((res) => (
                      <Badge
                        variant={"outline"}
                        className="relative"
                        key={`responsible-${res._id}-${territory._id}`}
                      >
                        {res.name}
                        <AlertPopUp
                          title={`Deseja realmente retirar essa designação?`}
                          description="Esse irmão não será mais o resposável por esse terriório."
                          action={() =>
                            deleteAssigned({
                              id_responsible: res._id,
                              id_territory: territory._id || "",
                            })
                          }
                        >
                          <span className="flex justify-center items-center bg-destructive rounded-full w-3.5 h-3.5 absolute -top-1 -right-1 cursor-pointer hover:opacity-85">
                            <X size={10} className="m-auto text-destructive-foreground" />
                          </span>
                        </AlertPopUp>
                      </Badge>
                    )) || "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <ModalUsers
        message={message}
        modalOpen={modalUserOpen}
        closeModal={() => setModalUserOpen(false)}
      />
    </section>
  );
};
