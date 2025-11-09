"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paperApi } from "@/services/papeApi";
import { PaperResponseDTO } from "@/types/PaperResponseDTO";

// Query keys for paper-related queries
export const paperQueryKeys = {
  all: ["papers"] as const,
  paper: (id: string) => ["papers", id] as const,
  byStudent: (studentId: string) => ["papers", "student", studentId] as const,
};

// Hook to get paper by ID
export const useGetPaperById = (id: string) => {
  return useQuery({
    queryKey: paperQueryKeys.paper(id),
    queryFn: () => paperApi.getPaper(id),
    enabled: !!id, // Only run query if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

//get Papers by project id
export const useGetPapersByProjectId = (projectId: string) => {
  return useQuery({
    queryKey: paperQueryKeys.byStudent(projectId),
    queryFn: () => paperApi.getPapersByProjectId(projectId),
  });
};

// Hook for prefetching a paper (useful for performance optimization)
export const usePrefetchPaper = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: paperQueryKeys.paper(id),
      queryFn: () => paperApi.getPaper(id),
      staleTime: 5 * 60 * 1000,
    });
  };


};

  //delete paper by id
  export const useDeletePaperById = () => {
    return useMutation({
      mutationFn: (id: string) => paperApi.deletePaper(id),
  
    });
  }

// Hook to invalidate paper queries (useful after mutations)
export const useInvalidatePaperQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: paperQueryKeys.all }),
    invalidatePaper: (id: string) =>
      queryClient.invalidateQueries({ queryKey: paperQueryKeys.paper(id) }),
    invalidateStudentPapers: (studentId: string) =>
      queryClient.invalidateQueries({
        queryKey: paperQueryKeys.byStudent(studentId),
      }),
  };
};

// Custom hook with error handling wrapper
export const useGetPaperByIdWithErrorHandling = (id: string) => {
  const query = useGetPaperById(id);

  // You can add custom error handling logic here
  // For example, logging errors or showing specific error messages

  return {
    ...query,
    hasError: !!query.error,
    errorMessage: query.error?.message || "Failed to fetch paper",
  };
};

// Hook to get paper data with loading states
export const usePaperData = (id: string) => {
  const { data, isLoading, error, isError, refetch } = useGetPaperById(id);

  return {
    paper: data,
    isLoading,
    error: error?.message || "Failed to fetch paper",
    isError,
    refetch,
    isEmpty: !isLoading && !data,
  };
};

// Utility hook for managing multiple paper queries
export const usePaperQueries = () => {
  const queryClient = useQueryClient();

  return {
    // Check if a paper is cached
    isPaperCached: (id: string) => {
      return queryClient.getQueryData(paperQueryKeys.paper(id)) !== undefined;
    },

    // Get cached paper data without triggering a fetch
    getCachedPaper: (id: string) => {
      return queryClient.getQueryData(paperQueryKeys.paper(id));
    },

    // Remove paper from cache
    removePaperFromCache: (id: string) => {
      queryClient.removeQueries({ queryKey: paperQueryKeys.paper(id) });
    },

    // Set paper data in cache
    setPaperInCache: (id: string, data: PaperResponseDTO) => {
      queryClient.setQueryData(paperQueryKeys.paper(id), data);
    },
  };
};

// Alternative export with the typo corrected (for backward compatibility)
export const userGetPaperById = useGetPaperById;
