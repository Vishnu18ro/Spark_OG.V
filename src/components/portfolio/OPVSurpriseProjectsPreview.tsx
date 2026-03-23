import { useState } from "react";
import { useOPV } from "@/contexts/OPVContext";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { usePreviewExpansion } from "@/hooks/use-preview-expansion";
import { FullViewModal } from "./FullViewModal";

export function OPVSurpriseProjectsPreview() {
  const { opvUserData } = useOPV();
  const surpriseProjects = (opvUserData?.surprise_projects as any[]) || [];
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sort surprise projects by category priority: new > modified > replicating
  const getCategoryPriority = (category: string) => {
    if (category === 'new') return 0;
    if (category === 'modified') return 1;
    return 2; // replicating or any other
  };

  const sortedSurpriseProjects = [...surpriseProjects].sort((a, b) => {
    return getCategoryPriority(a.category) - getCategoryPriority(b.category);
  });

  const { displayedItems, showToggle, isExpanded, toggleExpansion, hiddenCount } = usePreviewExpansion(sortedSurpriseProjects, 6);

  const renderProjectCard = (project: any) => (
    <div
      key={project.id}
      className="bg-muted/20 border border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-all"
    >
      {project.image && (
        <div className="relative mb-4 group">
          <img
            src={project.image}
            alt={project.name || "Project"}
            className="w-full h-40 object-contain bg-muted/20 rounded-md"
          />
          <div className="absolute top-2 left-2">
            <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${project.category === 'new' ? 'bg-red-500' :
              project.category === 'modified' ? 'bg-orange-500' :
                'bg-blue-500'
              }`}>
              {project.category === 'new' ? '🔴 Completely New' :
                project.category === 'modified' ? '🟠 Modified & Inspired' :
                  '🔵 Replicating & Learning'}
            </span>
          </div>
          <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-black/60 backdrop-blur-sm text-white hover:text-[#c084fc] hover:scale-110 transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_rgba(168,85,247,0.45)]"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-black/60 backdrop-blur-sm text-white hover:text-[#22d3ee] hover:scale-110 transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_rgba(34,211,238,0.45)]"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      )}
      {project.name && (
        <h3 className="text-lg font-semibold mb-3 text-[#c084fc]">
          {project.name}
        </h3>
      )}
      {project.basicBrief && (
        <p className="text-sm text-gray-200 break-words mb-3 leading-relaxed">
          <span className="font-semibold text-[#22d3ee] mr-1">Basic Brief:</span>
          {project.basicBrief}
        </p>
      )}
      {project.whyFailed && (
        <p className="text-sm text-gray-200 break-words mb-3 leading-relaxed">
          <span className="font-semibold text-[#22d3ee] mr-1">Current Status:</span>
          {project.whyFailed}
        </p>
      )}
      {project.externalHelp && (
        <p className="text-sm text-gray-200 break-words mb-3 leading-relaxed">
          <span className="font-semibold text-[#22d3ee] mr-1">Improvision:</span>
          {project.externalHelp}
        </p>
      )}
      {project.effortsMade && (
        <p className="text-sm text-gray-200 break-words mb-3 leading-relaxed">
          <span className="font-semibold text-[#22d3ee] mr-1">Efforts Made:</span>
          {project.effortsMade}
        </p>
      )}
      {project.lessonsLearnt && (
        <p className="text-sm text-gray-200 break-words mb-3 leading-relaxed">
          <span className="font-semibold text-[#22d3ee] mr-1">Key Learnings:</span>
          {project.lessonsLearnt}
        </p>
      )}

      {(project.tags || []).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gradient-to-r from-[#22d3ee]/30 to-[#c084fc]/30 text-[#c084fc] border border-[#c084fc]/40 text-xs font-medium rounded-full hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] hover:scale-105 transition-all duration-300 ease-in-out"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg p-8 shadow-glow-primary">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-electric bg-clip-text text-transparent">
          Surprise Projects
        </h2>
        <Button
          size="sm"
          variant="outline"
          className="border-primary/50 hover:bg-primary/10"
          onClick={() => setIsModalOpen(true)}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Full
        </Button>
      </div>

      {displayedItems.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 transition-all duration-500 ease-in-out">
          {displayedItems.map(renderProjectCard)}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          No surprise projects added yet.
        </p>
      )}

      {showToggle && (
        <div className="flex justify-center mt-6">
          <button
            onClick={toggleExpansion}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-all duration-300 hover:gap-3 group"
          >
            <span className="text-sm font-medium">
              {isExpanded ? 'Show Less' : `Show More (${hiddenCount} more)`}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 group-hover:animate-pulse" />
            ) : (
              <ChevronDown className="w-4 h-4 group-hover:animate-pulse" />
            )}
          </button>
        </div>
      )}

      <FullViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="All Surprise Projects"
      >
        {sortedSurpriseProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {sortedSurpriseProjects.map(renderProjectCard)}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No surprise projects added yet.
          </p>
        )}
      </FullViewModal>
    </div>
  );
}
