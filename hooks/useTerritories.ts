import { TerritoryProps } from "@/types/TerritoryProps";
import api from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
      });
    },
  };
};
