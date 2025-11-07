import { markingApi } from "@/services/markingApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

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
  return useMutation({
    mutationFn: (id:string) => markingApi.deleteMarking(id),
    onSuccess: () => {
      toast.success("Marking deleted successfully!");
    },
  });
};
