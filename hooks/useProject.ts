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
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      projectName,
      markingInstructions,
    }: {
      id: string;
      projectName: string;
      markingInstructions: string;
    }) => projectApi.updateProject(id, projectName, markingInstructions),
    onSuccess: () => {
      // Invalidate all project queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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
    retry: 2,
  });
};
export const useGetProjectById = (id: string) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => projectApi.getProjectById(id),
    retry: 2,
  });
};
