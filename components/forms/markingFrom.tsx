"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useExtractMarkingScheme,
  useExtractStudentAnswerSheet,
} from "@/hooks/useOcr";
import { FileIcon, Upload } from "lucide-react";
import { MarkingProcess } from "@/types/MarkingProcess";
import { PaperResponseDTO } from "@/types/PaperResponseDTO";
import { MarkingResponeDTO } from "@/types/MarkingResponeDTO";
import { useGetPapersByProjectId } from "@/hooks/usePaper";
import { useGetProjectById } from "@/hooks/useProject";

interface MarkingFormProps {
  setMarkingProcess?: (markingProcess: MarkingProcess) => void;
  projectId?: string;
}

const MarkingForm: React.FC<MarkingFormProps> = ({
  setMarkingProcess,
  projectId,
}) => {
  const extractStudentAnswerSheet = useExtractStudentAnswerSheet();
  const extractMarkingScheme = useExtractMarkingScheme();
  const getPapersByProjectId = useGetPapersByProjectId(projectId || "");
  const getProjectById = useGetProjectById(projectId || "");

  const [markingScheme, setMarkingScheme] = useState<File | null>(null);
  const [studentAnswerSheet, setStudentAnswerSheet] = useState<File | null>(
    null
  );

  const [markingSchemeUploaded, setMarkingSchemeUploaded] = useState(false);
  const [studentAnswerSheetUploaded, setStudentAnswerSheetUploaded] =
    useState(false);
  const [markingData, setMarkingData] = useState<MarkingResponeDTO | null>(
    null
  );
  const [paperData, setPaperData] = useState<PaperResponseDTO | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadMarkingScheme = async () => {
    if (!markingScheme) {
      toast.error("Please select a marking scheme file first.");
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
        const marking = markingSchemeResponse.data as MarkingResponeDTO;
        setMarkingData(marking);
        setMarkingSchemeUploaded(true);
        toast.success("Marking scheme uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload marking scheme. Please try again.");
      console.error("Marking scheme upload error:", error);
    }
  };

  const handleUploadStudentAnswerSheet = async () => {
    if (!studentAnswerSheet) {
      toast.error("Please select a student answer sheet file first.");
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
        const paper = studentAnswerResponse.data as PaperResponseDTO;
        setPaperData(paper);
        setStudentAnswerSheetUploaded(true);
        toast.success("Student answer sheet uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload student answer sheet. Please try again.");
      console.error("Student answer sheet upload error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!markingSchemeUploaded || !studentAnswerSheetUploaded) {
      toast.error("Please upload both files before submitting.");
      return;
    }

    if (markingData && paperData) {
      const markingProcess: MarkingProcess = {
        status: "extracted",
        paperId: paperData.id,
        markingId: markingData.id,
        paper: paperData,
      };

      setMarkingProcess?.(markingProcess);
      toast.success("Files processed successfully!");
    } else {
      toast.error("Missing data. Please re-upload the files.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full  mx-auto mt-10 ">
      <div className="space-y-6 grid grid-cols-2 gap-4">
        {/* Marking Scheme Upload */}
        {!getProjectById.data?.markingId ? (
          <div className="flex flex-col mb-4">
            <label className="font-medium mb-2 text-gray-700">
              Upload Marking Scheme
            </label>

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-400 rounded-xl cursor-pointer hover:bg-blue-50 transition">
              <span className="text-sm text-gray-600">
                {markingScheme ? (
                  <center className="">
                    <FileIcon className="w-24" size={48} />
                    {markingScheme.name}
                  </center>
                ) : (
                  <center>
                    <Upload className="w-8 h-8 text-blue-500 mb-2" />
                  </center>
                )}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFileChange(e, setMarkingScheme)}
              />
            </label>

            <button
              type="button"
              onClick={handleUploadMarkingScheme}
              disabled={
                !markingScheme ||
                extractMarkingScheme.isPending ||
                markingSchemeUploaded
              }
              className="flex cursor-pointer items-center justify-center gap-2 mt-3 px-4 py-2 rounded-md text-white text-sm transition
            bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {extractMarkingScheme.isPending
                ? "Uploading..."
                : markingSchemeUploaded
                ? "Uploaded ✓"
                : "Upload Marking Scheme"}
            </button>
          </div>
        ) : <center className="">Marking is Already Uploaded</center>}

        {/* Student Answer Sheet Upload */}
        <div className="flex flex-col mb-6">
          <label className="font-medium mb-2 text-gray-700">
            Upload Student New Answer Sheet
          </label>

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-green-400 rounded-xl cursor-pointer hover:bg-green-50 transition">
            <Upload className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-sm text-gray-600">
              {studentAnswerSheet ? (
                <center className="">
                  <FileIcon className="w-24" size={48} />
                  {studentAnswerSheet.name}
                </center>
              ) : (
                "Click or drag file here"
              )}
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFileChange(e, setStudentAnswerSheet)}
            />
          </label>

          <button
            type="button"
            onClick={handleUploadStudentAnswerSheet}
            disabled={
              !studentAnswerSheet ||
              extractStudentAnswerSheet.isPending ||
              studentAnswerSheetUploaded
            }
            className="flex cursor-pointer items-center justify-center gap-2 mt-3 px-4 py-2 rounded-md text-white text-sm transition
            bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {extractStudentAnswerSheet.isPending
              ? "Uploading..."
              : studentAnswerSheetUploaded
              ? "Uploaded ✓"
              : "Upload Answer Sheet"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default MarkingForm;
