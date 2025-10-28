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

interface MarkingFormProps {
  setMarkingProcess?: (markingProcess: MarkingProcess) => void;
}

interface OcrResponseData {
  paperId: string;
  markingId: string;
}
const MarkingForm: React.FC<MarkingFormProps> = ({ setMarkingProcess }) => {
  const extractStudentAnswerSheet = useExtractStudentAnswerSheet();
  const extractMarkingScheme = useExtractMarkingScheme();

  const [markingScheme, setMarkingScheme] = useState<File | null>(null);
  const [studentAnswerSheet, setStudentAnswerSheet] = useState<File | null>(
    null
  );

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!markingScheme || !studentAnswerSheet) {
      toast.error("Please upload both files before submitting.");
      return;
    }

    try {
      const markingSchemeFormData = new FormData();
      markingSchemeFormData.append("file", markingScheme);
      const markingSchemeResponse = await extractMarkingScheme.mutateAsync(
        markingSchemeFormData
      );

      const studentAnswerSheetFormData = new FormData();
      studentAnswerSheetFormData.append("file", studentAnswerSheet);
      const studentAnswerResponse = await extractStudentAnswerSheet.mutateAsync(
        studentAnswerSheetFormData
      );

      if (markingSchemeResponse?.data && studentAnswerResponse?.data) {
        const paper = studentAnswerResponse.data as PaperResponseDTO;
        const marking = markingSchemeResponse.data as MarkingResponeDTO;

        const markingProcess: MarkingProcess = {
          status: "extracted",
          paperId: paper.id,
          markingId: marking.id,
          paper: paper,
        };

        setMarkingProcess?.(markingProcess);
      }
    } catch (error) {
      toast.error("An error occurred during processing. Please try again.");
      console.error("Marking form error:", error);
    }
  };

  const loading =
    extractMarkingScheme.isPending || extractStudentAnswerSheet.isPending;

  return (
    <form onSubmit={handleSubmit} className="w-full  mx-auto mt-10 ">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Automated Essay Marking
      </h2>
      <div className="space-y-6 grid grid-cols-2 gap-4">
        {/* Marking Scheme Upload */}
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
        </div>

        {/* Student Answer Sheet Upload */}
        <div className="flex flex-col mb-6">
          <label className="font-medium mb-2 text-gray-700">
            Upload Student Answer Sheet
          </label>

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-green-400 rounded-xl cursor-pointer hover:bg-green-50 transition">
            <Upload className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-sm text-gray-600">
              {studentAnswerSheet
                ? studentAnswerSheet.name
                : "Click or drag file here"}
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFileChange(e, setStudentAnswerSheet)}
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex cursor-pointer items-center justify-center gap-2 my-2 px-4 py-2 rounded-sm text-white text-base transition bg-primary hover:bg-secondary disabled:opacity-60 disabled:cursor-not-allowed w-full"
      >
        {loading ? "Processing..." : "Submit for Marking"}
      </button>
    </form>
  );
};

export default MarkingForm;
