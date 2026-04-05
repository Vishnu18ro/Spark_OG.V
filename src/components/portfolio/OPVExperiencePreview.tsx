import { useState } from "react";
import { useOPV } from "@/contexts/OPVContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ChevronDown, ChevronUp, Calendar, MapPin, Clock, Star, Award, X } from "lucide-react";
import { usePreviewExpansion } from "@/hooks/use-preview-expansion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FullViewModal } from "./FullViewModal";

export function OPVExperiencePreview() {
  const { opvUserData } = useOPV();
  const experiences = (opvUserData?.experience as any[]) || [];
  const { displayedItems, showToggle, isExpanded, toggleExpansion, hiddenCount } = usePreviewExpansion(experiences, 3);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const renderExperienceCard = (exp: any) => (
    <div
      key={exp.id}
      className="group relative bg-gradient-to-br from-muted/30 via-card/60 to-muted/20 border border-primary/20 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all duration-500"
    >
      {/* Gradient accent top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#22d3ee] via-[#8b5cf6] to-[#c084fc]" />

      <div className="p-6 space-y-4">
        {/* Header: Image + Title + Badge */}
        <div className="flex gap-4 items-start">
          {exp.image && (
            <div
              className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 border-primary/30 cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"
              onClick={() => setSelectedImage(exp.image)}
            >
              <img
                src={exp.image}
                alt={exp.title}
                className="w-full h-full object-contain bg-muted/50"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-lg font-bold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent truncate">{exp.title}</h3>
                <p className="text-sm text-muted-foreground">{exp.organization} · {exp.role}</p>
              </div>
              <span className="flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-[#22d3ee]/20 to-[#c084fc]/20 text-[#c084fc] border border-[#c084fc]/30">
                {exp.type === 'Custom' ? (exp.customType || 'Custom') : exp.type}
              </span>
            </div>
          </div>
        </div>

        {/* Meta info row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          {exp.dateJoined && exp.dateEnded && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/30">
              <Calendar className="w-3.5 h-3.5 text-[#22d3ee]" />
              {formatDate(exp.dateJoined)} → {formatDate(exp.dateEnded)}
            </span>
          )}
          {exp.location && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/30">
              <MapPin className="w-3.5 h-3.5 text-[#22d3ee]" />
              {exp.location}
            </span>
          )}
          {exp.timeSpent && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/30">
              <Clock className="w-3.5 h-3.5 text-[#22d3ee]" />
              {exp.timeSpent}
            </span>
          )}
          {exp.rating && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/30">
              <Star className="w-3.5 h-3.5 text-yellow-400" />
              {exp.rating}/5
            </span>
          )}
        </div>

        {/* Description */}
        {exp.description && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <p className="text-sm text-foreground/90 leading-relaxed">{exp.description}</p>
          </>
        )}

        {/* What You Learned */}
        {exp.whatYouLearned && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent">💡 What You Learned</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{exp.whatYouLearned}</p>
            </div>
          </>
        )}

        {/* Achievements */}
        {(exp.achievements || []).length > 0 && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent">🏆 Achievements</p>
              <ul className="text-sm text-foreground/80 space-y-1">
                {exp.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#22d3ee] mt-1 text-xs">▸</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Skills */}
        {(exp.skillsGained || []).length > 0 && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="flex flex-wrap gap-1.5">
              {exp.skillsGained.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-gradient-to-r from-[#22d3ee]/15 to-[#c084fc]/15 text-[#c084fc] border border-[#c084fc]/30 text-xs font-medium rounded-full hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  {skill}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Team/Solo */}
        {exp.teamOrSolo && (
          <p className="text-xs text-muted-foreground">👥 {exp.teamOrSolo}</p>
        )}

        {/* Links */}
        {(exp.proofLink || exp.certificateImage) && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="flex items-center gap-4">
              {exp.proofLink && (
                <a
                  href={exp.proofLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/20 hover:bg-[#22d3ee]/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Proof
                </a>
              )}
              {exp.certificateImage && (
                <a
                  href={exp.certificateImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#c084fc]/10 text-[#c084fc] border border-[#c084fc]/20 hover:bg-[#c084fc]/20 hover:shadow-[0_0_15px_rgba(192,132,252,0.3)] transition-all duration-300"
                >
                  <Award className="w-3.5 h-3.5" />
                  Certificate
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg p-8 shadow-glow-primary">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-electric bg-clip-text text-transparent">
          Experience
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
        <div className="grid gap-4 md:grid-cols-2 transition-all duration-500 ease-in-out">
          {displayedItems.map(renderExperienceCard)}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          No experiences added yet.
        </p>
      )}

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/80 backdrop-blur-md border-none">
          <div className="relative w-full h-full flex items-center justify-center p-8">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-300"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Experience preview"
                className="max-w-full max-h-[80vh] object-contain rounded-lg animate-fade-in"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {showToggle && (
        <div className="flex justify-center mt-6">
          <button
            onClick={toggleExpansion}
            className="text-[#22d3ee] hover:text-[#c084fc] font-semibold cursor-pointer transition-all duration-300 hover:underline hover:decoration-[#c084fc] hover:shadow-[0_0_10px_rgba(192,132,252,0.4)] px-4 py-2 rounded"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}

      <FullViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="All Experience"
      >
        {experiences.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {experiences.map(renderExperienceCard)}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No experiences added yet.
          </p>
        )}
      </FullViewModal>
    </div>
  );
}
