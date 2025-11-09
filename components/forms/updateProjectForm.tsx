"use client";
import { useForm } from "@/hooks/useForm";
import z from "zod";
import { InputField } from "../ui/input";
import MutationButton from "../ui/mutationButton";
import { useUpdateProject } from "@/hooks/useProject";
import { ProjectResponseDTO } from "@/types/ProjectResponseDTO";
import { TextAreaField } from "../ui/textarea";
import { ChangeEvent } from "react";
import { toast } from "react-toastify";

const UpdateProjectSchema = z.object({
  projectName: z.string().min(1, "Name is required"),
  markingInstructions: z
    .string()
    .min(0, "Marking instructions cannot be empty"),
});

interface UpdateProjectFormProps {
  selectedProject: ProjectResponseDTO;
  closeDialog: () => void;
}

const UpdateProjectForm = ({
  selectedProject,
  closeDialog,
}: UpdateProjectFormProps) => {
  const { formData, handleChange, errors, validate } = useForm(
    {
      projectName: selectedProject ? selectedProject.projectName : "",
      markingInstructions: selectedProject
        ? selectedProject.markingInstructions
        : "",
    },
    UpdateProjectSchema
  );

  const updateProject = useUpdateProject();

  const submit = () => {
    if (validate()) {
      updateProject.mutate(
        {
          id: selectedProject.id,
          projectName: formData.projectName,
          markingInstructions: formData.markingInstructions,
        },
        {
          onSuccess: () => {
            toast.success("Project updated successfully!");
            closeDialog();
          },
        }
      );
    }
  };
  return (
    <div className="flex-col">
      <InputField
        label="Name"
        name="projectName"
        value={formData.projectName}
        onChange={handleChange}
        error={errors.projectName}
      />
      <TextAreaField
        name={"markingInstructions"}
        label={"Marking Instructions"}
        value={formData.markingInstructions}
        
        onChange={
          handleChange as unknown as (
            e: ChangeEvent<HTMLTextAreaElement>
          ) => void
        }
      />
      <div className="w-full flex justify-end mt-4">
        <MutationButton onClick={submit} loading={updateProject.isPending}>
          Submit
        </MutationButton>
      </div>
    </div>
  );
};

export default UpdateProjectForm;
