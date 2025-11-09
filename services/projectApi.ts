import { ApiResponseDTO } from "@/types/ApiResponeDTO";
import apiService from "./api";
import { ProjectResponseDTO } from "@/types/ProjectResponseDTO";

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const projectApi = {
  createProject: async (name: string): Promise<ApiResponseDTO> => {
    const result: ApiResponseDTO = await apiService.post("/projects/create", {
      projectName: name,
    });

    return result;
  },

  getAllProjects: async (
    search: string,
    page: number,
    size: number,
    sort: string,
    sortOrder: string
  ): Promise<PaginatedResponse<ProjectResponseDTO>> => {
    const result = await apiService.get<ApiResponseDTO>(
      `projects/all?search=${search}&page=${page}&size=${size}&sort=${sort},${sortOrder}`
    );

    const apiResponse = result as unknown as ApiResponseDTO;
    const responseData = apiResponse?.data;

    if (!responseData) {
      return {
        content: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        number: 0,
        numberOfElements: 0,
        first: true,
        last: true,
        empty: true,
      };
    }

    // If it's an array, wrap it in pagination structure
    if (Array.isArray(responseData)) {
      return {
        content: responseData,
        totalPages: 1,
        totalElements: responseData.length,
        size: responseData.length,
        number: 0,
        numberOfElements: responseData.length,
        first: true,
        last: true,
        empty: responseData.length === 0,
      };
    }

    // Otherwise return as paginated response
    return responseData as PaginatedResponse<ProjectResponseDTO>;
  },

  //get by id
  getProjectById: async (id: string): Promise<ProjectResponseDTO> => {
    const result: ApiResponseDTO = await apiService.get(`/projects/${id}`);
    return result.data as ProjectResponseDTO;
  },

  //update project
  updateProject: async (
    id: string,
    projectName: string,
    markingInstructions: string
  ): Promise<void> => {
    const result: ApiResponseDTO = await apiService.patch(`/projects/update`, {
      id: id,
      projectName: projectName,
      markingInstructions: markingInstructions,
    });
  },
};
