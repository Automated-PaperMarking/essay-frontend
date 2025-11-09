"use client";
import ProjectForm from "@/components/forms/createProjectForm";
import UpdateProjectForm from "@/components/forms/updateProjectForm";
import Dialog from "@/components/ui/dialog";
import Loading from "@/components/ui/loading";
import StaticButton from "@/components/ui/staticButton";
import { DataTableSearch } from "@/components/ui/table/DataTableSearch";
import { useProjectContext } from "@/contexts/projectContext";
import { useDialog } from "@/hooks/useDialog";
import { useGetAllProjects } from "@/hooks/useProject";
import { useUrlParams } from "@/hooks/useUrlParams";
import { ProjectResponseDTO } from "@/types/ProjectResponseDTO";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

const ProjectPage = () => {
  const { getParam, setParam, setParams } = useUrlParams();

  // Get params from URL or use defaults (useMemo to avoid recalculation)
  const search = useMemo(() => getParam("search") || "", [getParam]);
  const page = useMemo(() => parseInt(getParam("page") || "0"), [getParam]);
  const size = useMemo(() => parseInt(getParam("size") || "10"), [getParam]);
  const sort = useMemo(() => getParam("sort") || "createdAt", [getParam]);
  const sortOrder = useMemo(() => getParam("order") || "asc", [getParam]);

  const projectFormDialog = useDialog();
  const updateProjectFormDialog = useDialog();
  const router = useRouter();
  const { updateProjectData } = useProjectContext();

  const [selectedProject, setSelectedProject] =
    useState<ProjectResponseDTO | null>(null);
  // Fetch projects data
  const { data, isLoading } = useGetAllProjects(
    search,
    page,
    size,
    sort,
    sortOrder
  );

  // Handle search change with URL update
  const handleSearchChange = useCallback(
    (newSearch: string) => {
      setParams({
        search: newSearch,
        page: "0", // Reset to first page on search
        size: size.toString(),
        sort,
        order: sortOrder,
      });
    },
    [size, sort, sortOrder, setParams]
  );

  // Handle page change with URL update
  const handlePageChange = useCallback(
    (newPage: number) => {
      setParam("page", newPage.toString());
    },
    [setParam]
  );

  // Handle sort change with URL update
  const handleSortChange = useCallback(
    (newSort: string, newOrder: string) => {
      setParams({
        search,
        page: page.toString(),
        size: size.toString(),
        sort: newSort,
        order: newOrder,
      });
    },
    [search, page, size, setParams]
  );

  const columns: ColumnDef<ProjectResponseDTO>[] = [
    {
      id: "index",
      header: "Index",
      cell: ({ row }) => page * size + row.index + 1,
      size: 70,
      enableSorting: false,
    },
    {
      accessorKey: "projectName",
      header: "Name",
      cell: (info) => info.getValue(),
      size: 300,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
      size: 200,
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
      size: 200,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <StaticButton
            onClick={function (): void {
              setSelectedProject(row.original);
              updateProjectFormDialog.open();
            }}
          >
            Edit
          </StaticButton>
          <StaticButton
            onClick={function (): void {
              setSelectedProject(row.original);
            }}
            className="flex cursor-pointer items-center justify-center gap-2 my-2 px-4 py-2 rounded-md text-white font-medium transition
        bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Delete
          </StaticButton>
          <button
            className="flex cursor-pointer items-center justify-center gap-2 my-2 px-4 py-2 rounded-md text-white font-medium transition
        bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => {
              setSelectedProject(row.original);
              updateProjectData(row.original);
              router.push(`/projects/${row.original.id}`);
            }}
          >
            Select
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      {isLoading && <Loading />}

      <Dialog
        isOpen={projectFormDialog.isOpen}
        onClose={projectFormDialog.close}
        title={selectedProject ? "Edit" : "Create"}
      >
        <ProjectForm
          selectedProject={selectedProject}
          closeDialog={projectFormDialog.close}
        />
      </Dialog>
      <Dialog
        isOpen={updateProjectFormDialog.isOpen}
        onClose={updateProjectFormDialog.close}
        title={selectedProject ? "Edit Project" : "Create Project"}
        width="xl"
      >
        <UpdateProjectForm
          selectedProject={selectedProject!}
          closeDialog={updateProjectFormDialog.close}
        />
      </Dialog>
      <DataTableSearch
        columns={columns}
        data={data?.content ?? []}
        totalPages={data?.totalPages ?? 1}
        currentPage={page}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        searchValue={search}
        isLoading={isLoading}
        pageSize={size}
        buttons={[
          <StaticButton
            key="add-addon"
            onClick={() => {
              setSelectedProject(null);
              projectFormDialog.open();
            }}
          >
            Add Project
          </StaticButton>,
        ]}
      />
    </div>
  );
};

export default ProjectPage;
