import { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { usePreviewExpansion } from "@/hooks/use-preview-expansion";
import { FullViewModal } from "./FullViewModal";

export function ProjectsPreview() {
  const { projects } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sort projects: featured first, then non-featured
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const { displayedItems, showToggle, isExpanded, toggleExpansion, hiddenCount } = usePreviewExpansion(sortedProjects, 6);

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg p-8 shadow-glow-primary">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-electric bg-clip-text text-transparent">
          Projects
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
          {displayedItems.map((project) => (
            <div
              key={project.id}
              className="bg-muted/20 border border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-all"
            >
              {project.image && (
                <div className="relative mb-4 group">
                  <img
                    src={project.image}
                    alt={project.name || project.description}
                    className="w-full h-40 object-contain bg-muted/20 rounded-md"
                  />
                  {project.featured && (
                    <div className="absolute top-2 left-2 px-3 py-1 rounded-br-lg text-white font-bold text-[10px] tracking-widest uppercase bg-gradient-to-r from-[#22d3ee] via-[#8b5cf6] to-[#c084fc] shadow-[0_0_15px_rgba(139,92,246,0.6)] animate-glow">
                      FEATURED
                    </div>
                  )}
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
              <p className="text-sm text-foreground mb-3 break-words">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gradient-to-r from-[#22d3ee]/30 to-[#c084fc]/30 text-[#c084fc] border border-[#c084fc]/40 text-xs font-medium rounded-full hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          No projects added yet. Add projects from the Profile Edit page.
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
        title="All Projects"
      >
        {sortedProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {sortedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-muted/20 border border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-all"
              >
                {project.image && (
                  <div className="relative mb-4 group">
                    <img
                      src={project.image}
                      alt={project.name || project.description}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    {project.featured && (
                      <div className="absolute top-2 left-2 px-3 py-1 rounded-br-lg text-white font-bold text-[10px] tracking-widest uppercase bg-gradient-to-r from-[#22d3ee] via-[#8b5cf6] to-[#c084fc] shadow-[0_0_15px_rgba(139,92,246,0.6)] animate-glow">
                        FEATURED
                      </div>
                    )}
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
                <p className="text-sm text-foreground mb-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gradient-to-r from-[#22d3ee]/30 to-[#c084fc]/30 text-[#c084fc] border border-[#c084fc]/40 text-xs font-medium rounded-full hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No projects added yet.
          </p>
        )}
      </FullViewModal>
    </div>
  );
}
