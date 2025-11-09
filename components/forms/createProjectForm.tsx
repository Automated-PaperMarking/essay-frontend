"use client";
import { useForm } from "@/hooks/useForm";
import z from "zod";
import { InputField } from "../ui/input";
import MutationButton from "../ui/mutationButton";
import { useCreateProject, useGetAllProjects } from "@/hooks/useProject";
import { ProjectResponseDTO } from "@/types/ProjectResponseDTO";


const ProjectSchema = z.object({
  projectName: z.string().min(1, "Name is required"),
});

interface ProjectFormProps {
  selectedProject?: ProjectResponseDTO | null;
  closeDialog: () => void;
}

const ProjectForm = ({ selectedProject, closeDialog }: ProjectFormProps) => {
  const getProjects = useGetAllProjects("", 0, 10, "projectName", "asc");

  const { formData, handleChange, errors, validate } = useForm(
    {
      projectName: selectedProject ? selectedProject.projectName : "",
    },
    ProjectSchema
  );

  const createProject = useCreateProject();

  const submit = () => {
    if (validate()) {
      createProject.mutate(formData.projectName, {
        onSuccess: () => {
          getProjects.refetch();
          closeDialog();
        },
      });
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
      <div className="w-full flex justify-end mt-4">
        <MutationButton onClick={submit} loading={createProject.isPending}>
          Submit
        </MutationButton>
      </div>
    </div>
  );
};

export default ProjectForm;
