import { PaperResponseDTO } from "@/types/PaperResponseDTO";
import apiService from "./api";
import { ApiResponseDTO } from "@/types/ApiResponeDTO";

export const paperApi = {
  //get paper
  getPaper: async (id: string): Promise<PaperResponseDTO> => {
    const response: ApiResponseDTO = await apiService.get(`/paper/${id}`);

    return response.data as PaperResponseDTO;
  },
};
