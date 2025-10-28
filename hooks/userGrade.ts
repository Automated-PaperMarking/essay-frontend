import { graderApi } from "@/services/graderApi";
import { useMutation } from "@tanstack/react-query";

export const useGrade = () => {
  return useMutation({
    mutationFn: ({ markingId, paperId }: { markingId: string; paperId: string }) =>
      graderApi.grade({ markingId, paperId }),
  });
};
