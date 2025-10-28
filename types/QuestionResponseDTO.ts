export interface QuestionResponseDTO {
    id: string;
    questionId: string;
    questionName: string;
    parentQuestionId?: string;
    studentAnswer: string;
    allocatedMarks:number;
    graderComments:string;
    orderIndex:number;
    paperId:string;
}