import { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { usePreviewExpansion } from "@/hooks/use-preview-expansion";
import { FullViewModal } from "./FullViewModal";

export function CertificatesPreview() {
  const { certificates } = useProfile();
  const { displayedItems, showToggle, isExpanded, toggleExpansion, hiddenCount } = usePreviewExpansion(certificates, 6);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg p-8 shadow-glow-primary">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-electric bg-clip-text text-transparent">
          Certificates
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
          {displayedItems.map((cert) => (
            <div
              key={cert.id}
              className="bg-muted/20 border border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-all"
            >
              {cert.image && (
                <div className="relative mb-4 group">
                  <img
                    src={cert.image}
                    alt={cert.name || cert.description}
                    className="w-full h-40 object-contain bg-muted/20 rounded-md"
                  />
                  {cert.credentialUrl && (
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-black/60 backdrop-blur-sm text-white hover:text-[#22d3ee] hover:scale-110 transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_rgba(34,211,238,0.45)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              )}
              {cert.name && (
                <h3 className="text-lg font-semibold mt-3 text-[#c084fc]">
                  {cert.name}
                </h3>
              )}
              <div className="text-sm text-gray-400 mt-1">
                <span>{cert.issuer}</span>
                <span className="mx-2">•</span>
                <span>{cert.issueDate}</span>
              </div>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                {cert.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {cert.tags.slice(0, 3).map((tag, idx) => (
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
          No certificates added yet.
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
        title="All Certificates"
      >
        {certificates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-muted/20 border border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-all"
              >
                {cert.image && (
                  <div className="relative mb-4 group">
                    <img
                      src={cert.image}
                      alt={cert.name || cert.description}
                      className="w-full h-40 object-contain bg-muted/20 rounded-md"
                    />
                    {cert.credentialUrl && (
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-black/60 backdrop-blur-sm text-white hover:text-[#22d3ee] hover:scale-110 transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_rgba(34,211,238,0.45)]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
                {cert.name && (
                  <h3 className="text-lg font-semibold mt-3 text-[#c084fc]">
                    {cert.name}
                  </h3>
                )}
                <div className="text-sm text-gray-400 mt-1">
                  <span>{cert.issuer}</span>
                  <span className="mx-2">•</span>
                  <span>{cert.issueDate}</span>
                </div>
                <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                  {cert.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {cert.tags.map((tag, idx) => (
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
            No certificates added yet.
          </p>
        )}
      </FullViewModal>
    </div>
  );
}
