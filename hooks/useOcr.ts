import { ocrApi } from "@/services/ocrApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useExtractStudentAnswerSheet = () => {
  return useMutation({
    mutationFn: (data: FormData) => ocrApi.extractStudentAnswerSheet(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Answer Paper extraction successful!");
        return data;
      }
    },
  });
};

export const useExtractMarkingScheme = ()  => {
  return useMutation({
    mutationFn: (data: FormData) => ocrApi.extractMarkingScheme(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Marking Scheme extraction successful!");
        return data;
      }
    },
  });
};
