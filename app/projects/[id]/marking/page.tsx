"use client";

import MarkingViewer from "@/components/marking/MarkingViewer";
import Loading from "@/components/ui/loading";
import { useProjectContext } from "@/contexts/projectContext";
import { useGetMarkingById } from "@/hooks/useMarking";

const MarkingView = () => {
  const { projectData, isLodingProject } = useProjectContext();
  const { data, isLoading } = useGetMarkingById(projectData?.markingId || "");
  if (isLoading || isLodingProject) {
    return <Loading />;
  }
  if (data === null) {
    return <div>No Marking Found</div>;
  }
  return (
    <div>
      <MarkingViewer marking={data!} />
    </div>
  );
};

export default MarkingView;
