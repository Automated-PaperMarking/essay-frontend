import { PaperResponseDTO } from "./PaperResponseDTO";

export interface MarkingProcess{
  status:"extracted" | "graded" | "completed" | "error";
  paperId:string;
  markingId:string;
  paper: PaperResponseDTO;
}