"use client";
import MarkingForm from "@/components/forms/markingFrom";
import Loading from "@/components/ui/loading";
import { DataTable } from "@/components/ui/table";
import { useGetPapersByProjectId } from "@/hooks/usePaper";
import { useGetProjectById } from "@/hooks/useProject";
import { PaperResponseDTO } from "@/types/PaperResponseDTO";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { use } from "react";

const ProjectView = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  const { data, isLoading, isError, error } = useGetPapersByProjectId(id);
  const getProjectById = useGetProjectById(id || "");

  const columns: ColumnDef<PaperResponseDTO>[] = [
    {
      id: "index",
      header: "Index",
      cell: ({ row }) => row.index + 1,
      size: 70,
      enableSorting: false,
    },
    {
      accessorKey: "paperName",
      header: "Name",
      cell: (info) => info.getValue(),
      size: 300,
    },
    {
      accessorKey: "studentId",
      header: "Student ID",
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
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Link
              className="flex cursor-pointer items-center justify-center gap-2 my-2 px-4 py-2 rounded-md text-white font-medium transition
              bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed"
              href={`/papers/${row.original.id}`}
            >
              View
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <MarkingForm projectId={id} />
      {isLoading && <Loading />}
      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error loading papers</p>
          <p>{error?.message || "Failed to fetch papers"}</p>
        </div>
      )}
      {!isLoading && !isError && (!data || data.length === 0) && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>No papers found for this project.</p>
        </div>
      )}
      <h1 className="py-3 font-bold text-2xl">Stuents Answer Sheets</h1>
      <DataTable columns={columns} data={data ?? []} />
    </div>
  );
};

export default ProjectView;
