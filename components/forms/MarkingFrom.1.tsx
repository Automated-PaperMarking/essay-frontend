import { useForm } from "@/hooks/useForm";
import React from "react";
import { OcrSchema } from "./markingFrom";

export const MarkingFrom = () => {
  const { formData } = useForm(
    { markingScheme: null, studentAnswerSheet: null },
    OcrSchema
  );
  return (
    <div>
      <InputField />
    </div>
  );
};
