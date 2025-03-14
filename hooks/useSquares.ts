import { SquareProps } from "@/types/SquareProps";
import api from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSquares = () => {
  const queryClient = useQueryClient();

  return {
    getOne: ({ id, enabled }: { id: string; enabled: boolean }) => {
      return useQuery({
        enabled,
        queryKey: ["squares", "detail", id],
        queryFn: async () => {
          const response = await api.get<SquareProps>(`/squares/${id}`);
          return response.data;
        },
      });
    },
    insertOne: () => {
      return useMutation({
        mutationFn: async (square: Omit<SquareProps, "_id">) => {
          const response = await api.post<SquareProps>("/squares", square);
          return response.data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["squares"] });
          queryClient.invalidateQueries({ queryKey: ["territories"] });
        },
        onError: (error: any) => {
          const message = error?.response?.data?.error;
          toast.error("Erro ao criar quadra", {
            description: message,
          });
        },
      });
    },
    update: () => {
      return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<SquareProps> }) => {
          const response = await api.put<SquareProps>(`/squares/${id}`, data);
          return response.data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["squares"] });
          queryClient.invalidateQueries({ queryKey: ["territories"] });
        },
        onError: (error: any) => {
          const message = error?.response?.data?.error;
          toast.error("Erro ao atualizar quadra", {
            description: message,
          });
        },
      });
    },
    deleteOne: () => {
      return useMutation({
        mutationFn: async (id: string) => {
          await api.delete(`/squares/${id}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["squares"] });
          queryClient.invalidateQueries({ queryKey: ["tertitories"] });
        },
        onError: (error: any) => {
          const message = error?.response?.data?.error;
          toast.error(message);
        },
      });
    },
  };
};
