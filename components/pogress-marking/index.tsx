import { MarkingProcess } from "@/types/MarkingProcess";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Target,
} from "lucide-react";
import React from "react";

const MarkingPogress = ({
  markingProcess,
}: {
  markingProcess: MarkingProcess;
}) => {
  const currentStatus = markingProcess.status;

  const steps = [
    { key: "idle", label: "Idle", icon: Clock },
    { key: "extracted", label: "Text Extracted", icon: FileText },
    { key: "graded", label: "Graded", icon: Target },
    { key: "completed", label: "Completed", icon: CheckCircle },
  ];

  const getCurrentStepIndex = () => {
    if (currentStatus === "error") return -1;
    return steps.findIndex((step) => step.key === currentStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  const getStepColor = (stepIndex: number) => {
    if (currentStatus === "error") {
      return "bg-red-500";
    }
    if (stepIndex <= currentStepIndex) {
      return "bg-green-500";
    }
    if (stepIndex === currentStepIndex + 1) {
      return "bg-blue-500";
    }
    return "bg-gray-300";
  };

  const getStatusMessage = () => {
    if (currentStatus === "error") {
      return "An error occurred during the marking process";
    }
    const currentStep = steps[currentStepIndex];
    return currentStep ? `Currently: ${currentStep.label}` : "Unknown status";
  };

  return (
    <div className="w-full max-w-md">
      {/* Status Bar */}
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isError = currentStatus === "error";

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isError
                      ? "bg-red-500"
                      : isCompleted
                      ? "bg-green-500"
                      : isActive
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                >
                  {isError && index === currentStepIndex ? (
                    <AlertCircle size={20} className="text-white" />
                  ) : (
                    <Icon size={20} className="text-white" />
                  )}
                </div>
                <span className="text-xs mt-1 text-center">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${getStepColor(index)}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current Status Message */}
      <div className="text-center">
        <p
          className={`text-sm font-medium ${
            currentStatus === "error" ? "text-red-600" : "text-gray-700"
          }`}
        >
          {getStatusMessage()}
        </p>
      </div>
    </div>
  );
};

export default MarkingPogress;
