import { TerritoryProps } from "@/types/TerritoryProps";
import api from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useTerritories = () => {
  const queryClient = useQueryClient();

  return {
    getAll: (params?: { filters?: unknown }) => {
      return useQuery({
        queryKey: ["territories", "list", [params]],
        queryFn: async () => {
          const response = await api.get<TerritoryProps[]>("/territories", { params });
          return response.data;
        },
      });
    },
    getOne: (id: string) => {
      return useQuery({
        enabled: !!id,
        queryKey: ["territories", "detail", id],
        queryFn: async () => {
          const response = await api.get<TerritoryProps>(`/territories/${id}`);
          return response.data;
        },
      });
    },
    insertOne: () => {
      return useMutation({
        mutationFn: async (territory: Omit<TerritoryProps, "_id">) => {
          const response = await api.post<TerritoryProps>("/territories", territory);
          return response.data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["territories"] });
        },
        onError: (error: any) => {
          const message = error?.response?.data?.error;
          toast.error("Erro ao criar território", {
            description: message,
          });
        },
      });
    },
    update: () => {
      return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<TerritoryProps> }) => {
          const response = await api.put<TerritoryProps>(`/territories/${id}`, data);
          return response.data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["territories"] });
        },
        onError: (error: any) => {
          const message = error?.response?.data?.error;
          toast.error("Erro ao atualizar território", {
            description: message,
          });
        },
      });
    },
    setStatus: () => {
      return useMutation({
        mutationFn: async (data: {
          id: string;
          status: string;
          information?: string;
          id_responsible?: string;
          data?: Date;
        }) => {
          const response = await api.put<TerritoryProps>(`/territories/status`, data);
          return response.data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["territories"] });
        },
        onError: (error: any) => {
          const message = error?.response?.data?.error;
          toast.error("Erro ao atualizar o status do território", {
            description: message,
          });
        },
      });
    },
    getCountStatus: () => {
      return useQuery({
        queryKey: ["territories", "status", "list"],
        queryFn: async () => {
          const response = await api.get("/territories/status");
          return response.data;
        },
      });
    },
    deleteOne: () => {
      return useMutation({
        mutationFn: async (id: string) => {
          await api.delete(`/territories/${id}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["territories"] });
        },
        onError: (error: any) => {
          const message = error?.response?.data?.error;
          toast.error(message);
        },
      });
    },
    deleteAssigned: () => {
      return useMutation({
        mutationFn: async (data: { id_territory: string; id_responsible: string }) => {
          await api.put(`/territories/assigned`, data);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["territories"] });
        },
        onError: (error: any) => {
          const message = error?.response?.data?.error;
          toast.error(message);
        },
      });
    },
  };
};
