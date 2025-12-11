import { markingApi } from "@/services/markingApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetMarkingById = (id: string) => {
  return useQuery({
    queryKey: ["marking", id],
    queryFn: () => markingApi.getMarking(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useDeleteMarkingById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markingApi.deleteMarking(id),
    onSuccess: () => {
      // Invalidate all marking-related queries
      queryClient.invalidateQueries({ queryKey: ["marking"] });
      // Invalidate all project queries to refresh project data
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      // Invalidate papers as they might be affected
      queryClient.invalidateQueries({ queryKey: ["papers"] });
    },
  });
};
