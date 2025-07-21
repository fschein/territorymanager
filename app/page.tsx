import MainComponent from "@/components/custom/MainComponent";
import { UserProps } from "@/types/UserProps";
import api from "@/utils/api";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import MapWithoutDraw from "./main/MapWithDraw";

type Props = {
  searchParams: Promise<{ number?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const territoryNumber = params.number;

  if (territoryNumber) {
    return {
      title: `Território ${territoryNumber} - Territory Manager`,
      description: `Visualize e gerencie o território número ${territoryNumber}`,
      openGraph: {
        title: `Território ${territoryNumber}`,
        description: `Território de serviço de campo número ${territoryNumber}`,
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_URL}/api/og?number=${params.number}`,
            width: 1200,
            height: 630,
            alt: `Território ${territoryNumber}`,
          },
        ],
      },
      twitter: {
        title: `Território ${territoryNumber}`,
        description: `Território de serviço de campo número ${territoryNumber}`,
      },
    };
  }

  return {};
}

export default async function Home() {
  const queryClient = new QueryClient();

  // Prefetch no servidor
  await queryClient.prefetchQuery({
    queryKey: ["settings", "neighborhoods", "list"],
    queryFn: async () =>
      await api.get<UserProps[]>("/settings/neighborhoods").then((response) => response.data),
  });

  await queryClient.prefetchQuery({
    queryKey: ["settings", "groups", "list"],
    queryFn: async () =>
      await api.get<UserProps[]>("/settings/groups").then((response) => response.data),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainComponent>
        <MapWithoutDraw canEdit={false} />
      </MainComponent>
    </HydrationBoundary>
  );
}
