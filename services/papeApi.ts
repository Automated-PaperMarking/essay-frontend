import { PaperResponseDTO } from "@/types/PaperResponseDTO";
import apiService from "./api";
import { ApiResponseDTO } from "@/types/ApiResponeDTO";

export const paperApi = {
  //get paper
  getPaper: async (id: string): Promise<PaperResponseDTO> => {
    try {
      const response: ApiResponseDTO = await apiService.get(`/paper/${id}`);
      return response.data as PaperResponseDTO;
    } catch (error) {
      throw error;
    }
  },

  getPapersByProjectId: async (
    projectId: string
  ): Promise<PaperResponseDTO[]> => {
    const response: ApiResponseDTO = await apiService.get(
      `/paper/project/${projectId}`
    );

    return response.data as PaperResponseDTO[];
  },

  deletePaper: async (paperId: string): Promise<void> => {
    await apiService.delete(`/paper/${paperId}`);
  },
};
