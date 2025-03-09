import { GroupProps } from "@/types/GroupProps";
import api from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGroups = () => {
  const queryClient = useQueryClient();

  return {
    getAll: () => {
      return useQuery({
        queryKey: ["settings", "groups", "list"],
        staleTime: Infinity,
        queryFn: async () => {
          const response = await api.get<GroupProps[]>("/settings/groups");
          return response.data;
        },
      });
    },
    getOne: (id: string) => {
      return useQuery({
        enabled: !!id,
        queryKey: ["settings", "groups", "detail", id],
        queryFn: async () => {
          const response = await api.get<GroupProps>(`/settings/groups/${id}`);
          return response.data;
        },
      });
    },
    insertOne: () => {
      return useMutation({
        mutationFn: async (group: Omit<GroupProps, "_id">) => {
          const response = await api.post<GroupProps>("/settings/groups", group);
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
        mutationFn: async ({ id, data }: { id: string; data: Partial<GroupProps> }) => {
          const response = await api.put<GroupProps>(`/settings/groups/${id}`, data);
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
          await api.delete(`/settings/groups/${id}`);
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
