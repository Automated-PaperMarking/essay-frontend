"use client";

import { ProjectResponseDTO } from "@/types/ProjectResponseDTO";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface ProjectContextValue {
  projectData: ProjectResponseDTO | undefined;
  updateProjectData: (newProjectData: ProjectResponseDTO) => void;
  isLodingProject: boolean;
}

interface ProjectContextProps {
  children: React.ReactNode;
  project?: ProjectResponseDTO;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export const ProjectProvider = ({ children, project }: ProjectContextProps) => {
  const [projectData, setProjectData] = useState<
    ProjectResponseDTO | undefined
  >(project);

  const [isLodingProject, setIsLodingProject] = useState<boolean>(true);
  useEffect(() => {
    const getProject = async () => {
      try {
        const storedProject = localStorage.getItem("currentProject");
        if (storedProject) {
          const parsedProject: ProjectResponseDTO = JSON.parse(storedProject);
          setProjectData(parsedProject);
          setIsLodingProject(false);
        }
      } catch (error) {
        console.error("Error retrieving project from localStorage:", error);
        setIsLodingProject(false);
      }
    };

    getProject();
  }, []);

  const updateProjectData = (newProjectData: ProjectResponseDTO) => {
    setProjectData(newProjectData);
    localStorage.setItem("currentProject", JSON.stringify(newProjectData));
  };
  const value = useMemo(
    () => ({
      projectData,
      updateProjectData,
      isLodingProject,
    }),
    [projectData, isLodingProject]
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};
