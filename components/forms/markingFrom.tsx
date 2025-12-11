"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useExtractMarkingScheme,
  useExtractStudentAnswerSheet,
} from "@/hooks/useOcr";
import {
  FileIcon,
  Upload,
  CheckCircle2,
  Sparkles,
  Trash2,
  Eye,
} from "lucide-react";
import { useGetPapersByProjectId } from "@/hooks/usePaper";
import { useGetProjectById } from "@/hooks/useProject";
import Link from "next/link";
import { useDeleteMarkingById } from "@/hooks/useMarking";
import { useProjectContext } from "@/contexts/projectContext";
import Loading from "../ui/loading";

interface MarkingFormProps {
  projectId?: string;
}

const MarkingForm: React.FC<MarkingFormProps> = ({ projectId }) => {
  const extractStudentAnswerSheet = useExtractStudentAnswerSheet();
  const extractMarkingScheme = useExtractMarkingScheme();
  const getPapersByProjectId = useGetPapersByProjectId(projectId || "");
  const getProjectById = useGetProjectById(projectId || "");
  const deleteMarking = useDeleteMarkingById();
  const { updateProjectData } = useProjectContext();

  const [markingScheme, setMarkingScheme] = useState<File | null>(null);
  const [studentAnswerSheet, setStudentAnswerSheet] = useState<File | null>(
    null
  );

  const [markingSchemeUploaded, setMarkingSchemeUploaded] = useState(false);
  const [studentAnswerSheetUploaded, setStudentAnswerSheetUploaded] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadMarkingScheme = async () => {
    setLoading(true);
    if (!markingScheme) {
      toast.error("Please select a marking scheme file first.");
      setLoading(false);
      return;
    }

    try {
      const markingSchemeFormData = new FormData();
      markingSchemeFormData.append("file", markingScheme);
      markingSchemeFormData.append("projectId", projectId || "");
      const markingSchemeResponse = await extractMarkingScheme.mutateAsync(
        markingSchemeFormData
      );

      if (markingSchemeResponse?.data) {
        // Refetch the project data and wait for it to complete
        const { data: updatedProject } = await getProjectById.refetch();
        if (updatedProject) {
          updateProjectData(updatedProject);
        }
        setMarkingScheme(null);
        setMarkingSchemeUploaded(true);
        toast.success("Marking scheme uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload marking scheme. Please try again.");
      console.error("Marking scheme upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadStudentAnswerSheet = async () => {
    setLoading(true);
    if (!studentAnswerSheet) {
      toast.error("Please select a student answer sheet file first.");
      setLoading(false);
      return;
    }

    try {
      const studentAnswerSheetFormData = new FormData();
      studentAnswerSheetFormData.append("file", studentAnswerSheet);
      studentAnswerSheetFormData.append("projectId", projectId || "");
      const studentAnswerResponse = await extractStudentAnswerSheet.mutateAsync(
        studentAnswerSheetFormData,
        {
          onSuccess: () => {
            getPapersByProjectId.refetch();
            setStudentAnswerSheet(null);
          },
        }
      );

      if (studentAnswerResponse?.data) {
        setStudentAnswerSheetUploaded(true);
        toast.success("Student answer sheet uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload student answer sheet. Please try again.");
      console.error("Student answer sheet upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMarking = () => {
    if (!getProjectById.data?.markingId) {
      toast.error("No marking ID found.");
      return;
    }
    console.log("Deleting marking with ID:", getProjectById.data.markingId);

    setLoading(true);
    deleteMarking
      .mutateAsync(getProjectById.data.markingId)
      .then(async () => {
        // Refetch the project data and wait for it to complete
        const { data: updatedProject } = await getProjectById.refetch();
        if (updatedProject) {
          updateProjectData(updatedProject);
        }
        // Reset local state
        setMarkingSchemeUploaded(false);
        setMarkingScheme(null);
        toast.success("Marking deleted successfully!");
      })
      .catch((error) => {
        toast.error("Failed to delete marking. Please try again.");
        console.error("Delete marking error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form className="w-full mx-auto mt-10 px-4">
      {loading && <Loading />}

      {/* Header Section with Animation */}
      <div className="mb-8 text-center animate-fade-in">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Document Upload Center
        </h2>
        <p className="text-gray-600">
          Upload your marking schemes and student answer sheets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Marking Scheme Upload */}
        {!getProjectById.data?.markingId ? (
          <div className="group relative">
            {/* Card with gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl opacity-75 group-hover:opacity-100 transition duration-300 blur"></div>

            <div className="relative bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Marking Scheme
                </h3>
              </div>

              {/* Upload Area */}
              <label
                className="group/upload flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer 
                bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100
                transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
              >
                {markingScheme ? (
                  <div className="flex flex-col items-center space-y-3 animate-bounce-in">
                    <div className="p-3 bg-blue-500 rounded-full shadow-lg">
                      <FileIcon className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 px-4 text-center break-all">
                      {markingScheme.name}
                    </p>
                    <span className="text-xs text-blue-600 font-semibold">
                      Ready to upload ✨
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-4 bg-white rounded-full shadow-md group-hover/upload:shadow-lg transition-shadow">
                      <Upload className="w-10 h-10 text-blue-500 group-hover/upload:scale-110 transition-transform" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX (Max 10MB)
                      </p>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, setMarkingScheme)}
                />
              </label>

              {/* Upload Button */}
              <button
                type="button"
                onClick={handleUploadMarkingScheme}
                disabled={
                  !markingScheme ||
                  extractMarkingScheme.isPending ||
                  markingSchemeUploaded
                }
                className="w-full mt-4 px-6 py-3 rounded-xl text-white font-semibold text-sm
                  bg-gradient-to-r from-blue-500 to-blue-600 
                  hover:from-blue-600 hover:to-blue-700
                  disabled:from-gray-300 disabled:to-gray-400
                  transform transition-all duration-200 
                  hover:scale-[1.02] hover:shadow-lg
                  disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                  active:scale-95
                  flex items-center justify-center gap-2"
              >
                {extractMarkingScheme.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : markingSchemeUploaded ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Uploaded Successfully</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Upload Marking Scheme</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="group relative">
            {/* Card with gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl opacity-75 group-hover:opacity-100 transition duration-300 blur"></div>

            <div className="relative bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col items-center justify-center h-full py-8 space-y-4">
                <div className="p-4 bg-green-100 rounded-full animate-pulse">
                  <CheckCircle2 className="w-16 h-16 text-green-600" />
                </div>

                <h3 className="text-xl font-bold text-gray-800">
                  Marking Scheme Active
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  Your marking scheme has been successfully uploaded and is
                  ready for use
                </p>

                <div className="flex gap-3 mt-4">
                  <Link
                    href={`/projects/${projectId}/marking`}
                    className="flex-1"
                  >
                    <button
                      className="w-full px-6 py-3 rounded-xl text-white font-semibold text-sm
                      bg-gradient-to-r from-green-500 to-emerald-600 
                      hover:from-green-600 hover:to-emerald-700
                      transform transition-all duration-200 
                      hover:scale-[1.02] hover:shadow-lg
                      active:scale-95
                      flex items-center justify-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      <span>View Scheme</span>
                    </button>
                  </Link>

                  <button
                    type="button"
                    onClick={handleDeleteMarking}
                    className="px-6 py-3 rounded-xl text-white font-semibold text-sm
                      bg-gradient-to-r from-red-500 to-rose-600 
                      hover:from-red-600 hover:to-rose-700
                      transform transition-all duration-200 
                      hover:scale-[1.02] hover:shadow-lg
                      active:scale-95
                      flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Answer Sheet Upload */}
        <div className="group relative">
          {/* Card with gradient border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl opacity-75 group-hover:opacity-100 transition duration-300 blur"></div>

          <div className="relative bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Student Answer Sheet
              </h3>
            </div>

            {/* Upload Area */}
            <label
              className="group/upload flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-green-300 rounded-xl cursor-pointer 
              bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100
              transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
            >
              {studentAnswerSheet ? (
                <div className="flex flex-col items-center space-y-3 animate-bounce-in">
                  <div className="p-3 bg-green-500 rounded-full shadow-lg">
                    <FileIcon className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 px-4 text-center break-all">
                    {studentAnswerSheet.name}
                  </p>
                  <span className="text-xs text-green-600 font-semibold">
                    Ready to upload ✨
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-4 bg-white rounded-full shadow-md group-hover/upload:shadow-lg transition-shadow">
                    <Upload className="w-10 h-10 text-green-500 group-hover/upload:scale-110 transition-transform" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX (Max 10MB)
                    </p>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFileChange(e, setStudentAnswerSheet)}
              />
            </label>

            {/* Upload Button */}
            <button
              type="button"
              onClick={handleUploadStudentAnswerSheet}
              disabled={
                !studentAnswerSheet ||
                extractStudentAnswerSheet.isPending ||
                studentAnswerSheetUploaded
              }
              className="w-full mt-4 px-6 py-3 rounded-xl text-white font-semibold text-sm
                bg-gradient-to-r from-green-500 to-emerald-600 
                hover:from-green-600 hover:to-emerald-700
                disabled:from-gray-300 disabled:to-gray-400
                transform transition-all duration-200 
                hover:scale-[1.02] hover:shadow-lg
                disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                active:scale-95
                flex items-center justify-center gap-2"
            >
              {extractStudentAnswerSheet.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </>
              ) : studentAnswerSheetUploaded ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Uploaded Successfully</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Upload Answer Sheet</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Add custom animations with inline style tag */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce-in {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }

          .animate-bounce-in {
            animation: bounce-in 0.4s ease-out;
          }
        `,
        }}
      />
    </form>
  );
};

export default MarkingForm;
