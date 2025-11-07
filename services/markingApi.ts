import { ApiResponseDTO } from "@/types/ApiResponeDTO";
import apiService from "./api";
import { MarkingResponeDTO } from "@/types/MarkingResponeDTO";

export const markingApi = {
  //get Marking
  getMarking: async (id: string): Promise<MarkingResponeDTO> => {
    try {
      const response: ApiResponseDTO = await apiService.get(`/marking/${id}`);
      return response.data as MarkingResponeDTO;
    } catch (error) {
      throw error;
    }
  },

  deleteMarking: async (id: string): Promise<void> => {
    try {
      await apiService.delete(`/marking/${id}`);
    } catch (error) {
      throw error;
    }
  },
};
