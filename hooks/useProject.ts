import { projectApi } from "@/services/projectApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => projectApi.createProject(name),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Project created successfully!");
        // Invalidate and refetch projects list
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      }
    },
  });
};

export const useGetAllProjects = (
  search: string,
  page: number,
  size: number,
  sort: string,
  sortOrder: string
) => {
  return useQuery({
    queryKey: ["projects", search, page, size, sort, sortOrder],
    queryFn: () =>
      projectApi.getAllProjects(search, page, size, sort, sortOrder),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
