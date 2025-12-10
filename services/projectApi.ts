import { ApiResponseDTO } from "@/types/ApiResponeDTO";
import apiService from "./api";
import { ProjectResponseDTO } from "@/types/ProjectResponseDTO";
import { PageResponseDTO } from "@/types/PageResponeDTO";
import axios from "axios";
import Cookies from "js-cookie";

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
  ): Promise<PageResponseDTO<ProjectResponseDTO>> => {
    const result = await apiService.get<ApiResponseDTO>(
      `projects/all?search=${search}&page=${page}&size=${size}&sort=${sort},${sortOrder}`
    );

    const apiResponse = result as unknown as ApiResponseDTO;
    const responseData = apiResponse?.data;

    if (!responseData) {
      return {
        data: [],
        totalPages: 0,
        page: 0,
      };
    }

    // Otherwise return as paginated response
    return responseData as PageResponseDTO<ProjectResponseDTO>;
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

  //generate report
  generateReport: async (projectId: string): Promise<Blob> => {
    const token = Cookies.get("accessToken");

    const response = await axios({
      method: "GET",
      url: `http://localhost:8000/api/paper/report/${projectId}`,
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/octet-stream",
      },
    });

    // Create blob from arraybuffer with correct MIME type for .xls files
    const blob = new Blob([response.data], {
      type: "application/vnd.ms-excel",
    });

    return blob;
  },
};
