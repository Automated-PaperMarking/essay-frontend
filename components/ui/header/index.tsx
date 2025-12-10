"use client";

import { useProjectContext } from "@/contexts/projectContext";
import { useRouter } from "next/navigation";
import { useDialog } from "@/hooks/useDialog";
import UpdateProjectForm from "@/components/forms/updateProjectForm";
import { useGetProjectById } from "@/hooks/useProject";
import SideView from "../sideview";

const Header = () => {
  const { projectData } = useProjectContext();
  const router = useRouter();
  const updateProjectFormDialog = useDialog();
  const getProjectById = useGetProjectById(projectData?.id ?? "");

  return (
    <header className="w-full border-b border-border bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
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
      <div className="mx-auto px-6 py-5">
        <div className="flex items-center justify-between space-x-4">
          {/* Logo Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-accent/20 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-border">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-md">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="font-bold text-2xl text-foreground">
                Essay Grading
              </span>
            </div>
          </div>

          {/* Project Section with Modern Card Design */}
          <div className="relative flex items-center gap-3">
            {projectData?.projectName ? (
              <>
                <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground font-medium">
                      Active Project
                    </span>
                  </div>
                  <div className="w-px h-6 bg-border"></div>
                  <h1 className="font-semibold text-lg text-foreground max-w-xs truncate">
                    {projectData.projectName}
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push("/projects")}
                    className="px-4 py-2 bg-white hover:bg-muted text-accent font-medium rounded-lg border border-border hover:border-accent transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                    Change
                  </button>
                  <button
                    onClick={() => updateProjectFormDialog.open()}
                    className="px-4 py-2 bg-primary hover:bg-secondary text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-xl shadow-sm border border-border">
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                <span className="text-muted-foreground font-medium">
                  No Project Selected
                </span>
                <button
                  onClick={() => router.push("/projects")}
                  className="ml-2 px-4 py-1.5 bg-primary hover:bg-secondary text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                >
                  Select Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
