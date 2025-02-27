import { UserProps } from "@/types/UserProps";
import api from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Interface para os usuários

export const useUsers = () => {
  const queryClient = useQueryClient();

  return {
    getAll: () => {
      return useQuery({
        queryKey: ["users", "list"],
        queryFn: async () => {
          const response = await api.get<UserProps[]>("/users");
          return response.data;
        },
      });
    },
    getOne: (id: string) => {
      return useQuery({
        enabled: !!id,
        queryKey: ["users", "detail", id],
        queryFn: async () => {
          const response = await api.get<UserProps>(`/users/${id}`);
          return response.data;
        },
      });
    },
    insertOne: () => {
      return useMutation({
        mutationFn: async (user: Omit<UserProps, "_id">) => {
          const response = await api.post<UserProps>("/users", user);
          return response.data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
      });
    },
    update: () => {
      return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<UserProps> }) => {
          const response = await api.put<UserProps>(`/users/${id}`, data);
          return response.data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
      });
    },
    deleteOne: () => {
      return useMutation({
        mutationFn: async (id: string) => {
          await api.delete(`/users/${id}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
      });
    },
  };
};
