"use client";

import { useProjectContext } from "@/contexts/projectContext";
import StaticButton from "../staticButton";
import { useRouter } from "next/navigation";
import { useDialog } from "@/hooks/useDialog";
import Dialog from "../dialog";
import UpdateProjectForm from "@/components/forms/updateProjectForm";
import { useGetProjectById } from "@/hooks/useProject";
import SideView from "../sideview";

const Header = () => {
  const { projectData } = useProjectContext();
  const router = useRouter();
  const updateProjectFormDialog = useDialog();
  const getProjectById = useGetProjectById(projectData?.id ?? "");

  return (
    <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      {getProjectById.data && (
        <SideView
          isOpen={updateProjectFormDialog.isOpen}
          onClose={updateProjectFormDialog.close}
          title={"Edit Project"}
          width="xl"
        >
          <UpdateProjectForm
            selectedProject={getProjectById!.data}
            closeDialog={updateProjectFormDialog.close}
          />
        </SideView>
      )}
      <div className=" mx-auto px-6 py-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="relative w-40 font-bold text-2xl text-gray-800">
            Essay Grading
          </div>
          {/* show project name */}
          <div className="relative flex items-center gap-2 font-semibold text-xl text-gray-800">
            <h1>{projectData?.projectName || "No Project Selected"}</h1>
            <StaticButton
              onClick={function (): void {
                router.push("/projects");
              }}
            >
              Change Project
            </StaticButton>
            <StaticButton
              onClick={function (): void {
                updateProjectFormDialog.open();
              }}
            >
              Edit
            </StaticButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
