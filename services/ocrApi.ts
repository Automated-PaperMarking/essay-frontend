import { ApiResponseDTO } from "@/types/ApiResponeDTO";
import apiService from "./api";

export const ocrApi = {
  extractStudentAnswerSheet: async (file: FormData): Promise<ApiResponseDTO> => {
    const response: ApiResponseDTO = await apiService.post(
      "/ocr/student-answer-sheet",
      file
    );
    return response;
  },
  extractMarkingScheme: async (file: FormData): Promise<ApiResponseDTO> => {
    const response: ApiResponseDTO = await apiService.post(
      "/ocr/marking-scheme",
      file
    );
    return response;
  }
};
