'use client';
import { PaperResponseDTO } from "@/types/PaperResponseDTO";
import { QuestionResponseDTO } from "@/types/QuestionResponseDTO";
import React, { useState } from "react";

interface QuestionHierarchy {
  question: QuestionResponseDTO;
  children: QuestionHierarchy[];
}

const PaperViewer = ({ paper }: { paper: PaperResponseDTO }) => {
  // Function to build hierarchical structure from flat questions array
  const [selectedQuestion,setSelectedQuestion]=useState<QuestionResponseDTO|null>(null);

  const buildQuestionHierarchy = (
    questions: QuestionResponseDTO[]
  ): QuestionHierarchy[] => {
    // First, sort by orderIndex to maintain proper order
    const sortedQuestions = [...questions].sort(
      (a, b) => a.orderIndex - b.orderIndex
    );

    // Create a map for quick lookup
    const questionMap = new Map<string, QuestionHierarchy>();
    const rootQuestions: QuestionHierarchy[] = [];

    // Initialize all questions in the map
    sortedQuestions.forEach((question) => {
      questionMap.set(question.questionId, {
        question,
        children: [],
      });
    });

    // Build the hierarchy
    sortedQuestions.forEach((question) => {
      const questionNode = questionMap.get(question.questionId)!;

      if (!question.parentQuestionId || question.parentQuestionId === "") {
        // This is a root question
        rootQuestions.push(questionNode);
      } else {
        // This is a child question
        const parentNode = questionMap.get(question.parentQuestionId);
        if (parentNode) {
          parentNode.children.push(questionNode);
        }
      }
    });

    return rootQuestions;
  };

  // Recursive component to render questions
  const QuestionRenderer: React.FC<{
    questionNode: QuestionHierarchy;
    depth: number;
  }> = ({ questionNode, depth }) => {
    const { question, children } = questionNode;
    const hasAnswer =
      question.studentAnswer && question.studentAnswer.trim() !== "";

    return (
      <div
        className={`question-container   ${
          depth > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : ""
        }`}
      >
        <div className="question-header bg-gray-50 p-4 rounded-t-lg border ">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                {question.questionName}
              </h3>
              <span className="text-sm text-gray-600">
                ID: {question.questionId}
              </span>
            </div>
           {question.studentAnswer !== "" && <div className="text-right">
              <div className="text-sm text-gray-600">
                Marks: {question.allocatedMarks}
              </div>
            </div>}
          </div>
        </div>

        <div className="question-content border-x border-b rounded-b-lg  ">
          {hasAnswer ? (
            <div className="p-4">
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2 text-left">
                  Student Answer:
                </h4>
                <div className="bg-gray-50 p-3 rounded border">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 overflow-x-auto text-left">
                    {question.studentAnswer}
                  </pre>
                </div>
              </div>

              {question.graderComments && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2 text-left">
                    Grader Comments:
                  </h4>
                  <div className="bg-green-50 p-3 rounded border border-green-200">
                    <p className="text-gray-700 text-left">{question.graderComments}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="g">
             
            </div>
          )}
        </div>

        {/* Render child questions */}
        {children.length > 0 && (
          <div className="mt-4">
            {children.map((childNode) => (
              <div key={childNode.question.id} onClick={() => setSelectedQuestion(childNode.question)} className="mb-4  hover:scale-[1.01] cursor-pointer transition-transform">
                <QuestionRenderer questionNode={childNode} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const questionHierarchy = buildQuestionHierarchy(paper.questions);

  return (
    <div className="paper-viewer mx-auto p-6">
      {/* Paper Header */}
      <div className="paper-header bg-white shadow-sm border rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {paper.paperName}
            </h1>
            <p className="text-gray-600">Student ID: {paper.studentId}</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>Created: {new Date(paper.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(paper.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="questions-section space-y-6">
        {questionHierarchy.length > 0 ? (
          questionHierarchy.map((questionNode) => (
            <div key={questionNode.question.id} className="question-wrapper">
              <QuestionRenderer questionNode={questionNode} depth={0} />
            </div>
          ))
        ) : (
          <div className="no-questions text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No questions found in this paper.</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="paper-summary mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Paper Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-700 font-medium">Total Questions: </span>
            <span className="text-blue-900">{paper.questions.length}</span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Total Marks: </span>
            <span className="text-blue-900">
              {paper.questions.reduce((sum, q) => sum + q.allocatedMarks, 0)}
            </span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">
              Answered Questions:{" "}
            </span>
            <span className="text-blue-900">
              {
                paper.questions.filter(
                  (q) => q.studentAnswer && q.studentAnswer.trim() !== ""
                ).length
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperViewer;
