"use client";
import { useForm } from "@/hooks/useForm";
import z, { set } from "zod";
import { InputField } from "../ui/input";
import MutationButton from "../ui/mutationButton";
import { TextAreaField } from "../ui/textarea";
import { ChangeEvent } from "react";
import { toast } from "react-toastify";
import { QuestionResponseDTO } from "@/types/QuestionResponseDTO";
import { useUpdateQuestionMarks } from "@/hooks/usePaper";

const UpdateQuestionSchema = z.object({
  id: z.string().min(1, "ID is required"),
  allocatedMarks: z.string().min(0, "Allocated marks must be non-negative"),
  comments: z.string().min(0, "Comments cannot be empty"),
});

interface UpdateQuestionMarksProps {
  selectedQuestion: QuestionResponseDTO;
  closeDialog: () => void;
}

const UpdateQuestionMarks = ({
  selectedQuestion,
  closeDialog,
}: UpdateQuestionMarksProps) => {
  const { formData, handleChange, errors, validate } = useForm(
    {
      id: selectedQuestion ? selectedQuestion.id : "",
      allocatedMarks: selectedQuestion
        ? selectedQuestion.allocatedMarks.toString()
        : "0",
      comments: selectedQuestion ? selectedQuestion.graderComments : "",
    },
    UpdateQuestionSchema
  );

  const updateQuestion = useUpdateQuestionMarks();

  const submit = () => {
    if (validate()) {
      updateQuestion.mutate(
        {
          paperId: selectedQuestion.paperId,
          id: selectedQuestion.id,
          allocatedMarks: Number(formData.allocatedMarks),
          comments: formData.comments,
        },
        {
          onSuccess: () => {
            toast.success("Question updated successfully!");
            closeDialog();
          },
        }
      );
    }
  };
  return (
    <div className="flex-col">
      <InputField
        label="Allocated Marks"
        name="allocatedMarks"
        type="number"
        value={formData.allocatedMarks}
        onChange={handleChange}
        error={errors.allocatedMarks}
      />
      <TextAreaField
        name={"comments"}
        label={"Comments"}
        value={formData.comments}
        onChange={
          handleChange as unknown as (
            e: ChangeEvent<HTMLTextAreaElement>
          ) => void
        }
      />
      <div className="w-full flex justify-end mt-4">
        <MutationButton onClick={submit} loading={updateQuestion.isPending}>
          Submit
        </MutationButton>
      </div>
    </div>
  );
};

export default UpdateQuestionMarks;
