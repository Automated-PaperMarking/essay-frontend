import { PaperResponseDTO } from "./PaperResponseDTO";

export interface MarkingProcess{
  status: "idle" | "extracted" | "graded" | "completed" | "error";
  paperId:string;
  markingId:string;
  paper: PaperResponseDTO | null;
}