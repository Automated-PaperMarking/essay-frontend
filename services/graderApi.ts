import { ApiResponseDTO } from "@/types/ApiResponeDTO";
import apiService from "./api";

export const graderApi = {
  grade: async ({
    markingId,
    paperId,
  }: {
    markingId: string;
    paperId: string;
  }): Promise<ApiResponseDTO> => {
    const response: ApiResponseDTO = await apiService.put(
      `/grade?markingId=${markingId}&paperId=${paperId}`
    );
    return response;
  },

  gradeAll: async (projectId: string): Promise<ApiResponseDTO> => {
    const response: ApiResponseDTO = await apiService.put(
      `/grade/all?projectId=${projectId}`
    );
    return response;
  }
};
