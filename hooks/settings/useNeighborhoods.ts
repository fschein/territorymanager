import { NeighborhoodProps } from "@/types/NeighborhoodProps";
import api from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useNeighborhoods = () => {
  const queryClient = useQueryClient();

  return {
    getAll: () => {
      return useQuery({
        queryKey: ["settings", "neighborhoods", "list"],
        staleTime: Infinity,
        queryFn: async () => {
          const response = await api.get<NeighborhoodProps[]>("/settings/neighborhoods");
          return response.data;
        },
      });
    },
    getOne: (id: string) => {
      return useQuery({
        enabled: !!id,
        queryKey: ["settings", "neighborhoods", "detail", id],
        queryFn: async () => {
          const response = await api.get<NeighborhoodProps>(`/settings/neighborhoods/${id}`);
          return response.data;
        },
      });
    },
    insertOne: () => {
      return useMutation({
        mutationFn: async (neighborhood: Omit<NeighborhoodProps, "_id">) => {
          const response = await api.post<NeighborhoodProps>(
            "/settings/neighborhoods",
            neighborhood
          );
          return response.data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: (error: any) => {
          const message = error?.response?.data?.error;
          toast.error(message);
        },
      });
    },
    update: () => {
      return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<NeighborhoodProps> }) => {
          const response = await api.put<NeighborhoodProps>(`/settings/neighborhoods/${id}`, data);
          return response.data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: (error: any) => {
          const message = error?.response?.data?.error;
          toast.error(message);
        },
      });
    },
    deleteOne: () => {
      return useMutation({
        mutationFn: async (id: string) => {
          await api.delete(`/settings/neighborhoods/${id}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: (error: any) => {
          const message = error?.response?.data?.error;
          toast.error(message);
        },
      });
    },
  };
};
