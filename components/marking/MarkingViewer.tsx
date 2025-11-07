"use client";
import { MarkingResponeDTO } from "@/types/MarkingResponeDTO";
import { MarkingQuestionDTO } from "@/types/MarkingQuestionDTO";
import React, { useState } from "react";

const MarkingViewer = ({ marking }: { marking: MarkingResponeDTO }) => {
  const [selectedQuestion, setSelectedQuestion] =
    useState<MarkingQuestionDTO | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set()
  );

  // Toggle question expansion
  const toggleExpand = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Recursive component to render marking questions
  const QuestionRenderer: React.FC<{
    question: MarkingQuestionDTO;
    index: number;
  }> = ({ question, index }) => {
    const isExpanded = expandedQuestions.has(question.id);
    const isSelected = selectedQuestion?.id === question.id;

    return (
      <div
        className={`marking-question-container mb-4 transition-all ${
          isSelected ? "ring-2 ring-blue-500" : ""
        }`}
      >
        <div
          className={`question-header bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-t-lg border cursor-pointer hover:shadow-md transition-shadow ${
            isSelected ? "border-blue-500" : "border-gray-300"
          }`}
          onClick={() => {
            setSelectedQuestion(question);
            toggleExpand(question.id);
          }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {question.questionId}
                </span>
                <h3 className="font-semibold text-lg text-gray-800">
                  {question.questionName}
                </h3>
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                ID: {question.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                Question {index + 1}
              </span>
              <button
                className={`transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(question.id);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="question-content border-x border-b rounded-b-lg bg-white">
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-3 text-left flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Question Content & Answer:
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 overflow-x-auto text-left leading-relaxed">
                    {question.content}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="marking-viewer mx-auto p-6 max-w-7xl">
      {/* Marking Header */}
      <div className="marking-header bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-3">{marking.markingName}</h1>
            <div className="flex items-center gap-4 text-blue-100">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span>Marking ID: {marking.id}</span>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-blue-100">
            <p className="flex items-center gap-2 justify-end mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Created: {new Date(marking.createdAt).toLocaleDateString()}
            </p>
            <p className="flex items-center gap-2 justify-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Updated: {new Date(marking.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="questions-section space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Marking Questions
          </h2>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            onClick={() => {
              if (expandedQuestions.size === marking.markingQuestions.length) {
                setExpandedQuestions(new Set());
              } else {
                setExpandedQuestions(
                  new Set(marking.markingQuestions.map((q) => q.id))
                );
              }
            }}
          >
            {expandedQuestions.size === marking.markingQuestions.length
              ? "Collapse All"
              : "Expand All"}
          </button>
        </div>

        {marking.markingQuestions.length > 0 ? (
          marking.markingQuestions
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((question, index) => (
              <div key={question.id} className="question-wrapper">
                <QuestionRenderer question={question} index={index} />
              </div>
            ))
        ) : (
          <div className="no-questions text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 text-lg">No marking questions found.</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="marking-summary mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Marking Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {marking.markingQuestions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Expanded Questions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {expandedQuestions.size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Selected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedQuestion ? "1" : "0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkingViewer;
