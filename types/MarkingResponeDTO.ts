import { MarkingQuestionDTO } from "./MarkingQuestionDTO";

export interface MarkingResponeDTO {
    id: string;
    markingName: string;
    markingQuestions: MarkingQuestionDTO[];
    createdAt: string;
    updatedAt: string;
}