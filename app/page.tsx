"use client";
import MainComponent from "@/components/custom/MainComponent";
import { UserProps } from "@/types/UserProps";
import api from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import MapWithoutDraw from "./main/MapWithDraw";
export default function Home() {
  const queryClient = useQueryClient();
  queryClient.prefetchQuery({
    queryKey: ["settings", "neighborhoods", "list"],
    queryFn: async () =>
      await api.get<UserProps[]>("/settings/neighborhoods").then((response) => response.data),
  });
  queryClient.prefetchQuery({
    queryKey: ["settings", "groups", "list"],
    queryFn: async () =>
      await api.get<UserProps[]>("/settings/groups").then((response) => response.data),
  });
  return (
    <MainComponent>
      <MapWithoutDraw canEdit={true} />
    </MainComponent>
  );
}
