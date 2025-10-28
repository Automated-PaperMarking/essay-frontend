import { QuestionResponseDTO } from "./QuestionResponseDTO";

export interface PaperResponseDTO {
    id: string;
    paperName: string;
    studentId: string;
    questions : QuestionResponseDTO[];
    createdAt: string;
    updatedAt: string;
}