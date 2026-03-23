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
      className="bg-muted/20 border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all"
    >
      <div className="flex gap-4">
        {exp.image && (
          <div
            className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-border cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setSelectedImage(exp.image)}
          >
            <img
              src={exp.image}
              alt={exp.title}
              className="w-full h-full object-contain bg-muted"
            />
          </div>
        )}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-primary">{exp.title}</h3>
              <p className="text-sm text-muted-foreground">{exp.organization} · {exp.role}</p>
            </div>
            <Badge variant="outline">{exp.type}</Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            {exp.dateJoined && exp.dateEnded && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(exp.dateJoined)} → {formatDate(exp.dateEnded)}
              </span>
            )}
            {exp.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {exp.location}
              </span>
            )}
            {exp.timeSpent > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {exp.timeSpent}h
              </span>
            )}
            {exp.rating && (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {exp.rating}/5
              </span>
            )}
          </div>

          {exp.description && (
            <p className="text-sm text-foreground">{exp.description}</p>
          )}

          {exp.whatYouLearned && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-primary">What You Learned</p>
              <p className="text-sm text-foreground">{exp.whatYouLearned}</p>
            </div>
          )}

          {(exp.achievements || []).length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-primary">Achievements</p>
              <ul className="text-sm text-foreground list-disc list-inside space-y-1">
                {exp.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}

          {(exp.skillsGained || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {exp.skillsGained.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gradient-to-r from-[#22d3ee]/25 to-[#c084fc]/25 text-[#c084fc] border border-[#c084fc]/40 text-xs font-medium rounded-full hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {exp.teamOrSolo && (
            <p className="text-sm text-muted-foreground">👥 {exp.teamOrSolo}</p>
          )}

          <div className="flex items-center gap-3 pt-2">
            {exp.proofLink && (
              <a
                href={exp.proofLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:text-[#22d3ee] hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300 group"
              >
                <ExternalLink className="w-4 h-4 group-hover:animate-pulse" />
                <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[#22d3ee] after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                  View Proof
                </span>
              </a>
            )}
            {exp.certificateImage && (
              <a
                href={exp.certificateImage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:text-[#22d3ee] hover:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300 group"
              >
                <Award className="w-4 h-4 group-hover:animate-pulse" />
                <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[#22d3ee] after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                  Certificate
                </span>
              </a>
            )}
          </div>
        </div>
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
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 transition-all duration-500 ease-in-out">
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
