import { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ChevronDown, ChevronUp, Calendar, Clock, Star, X } from "lucide-react";
import { usePreviewExpansion } from "@/hooks/use-preview-expansion";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { FullViewModal } from "./FullViewModal";

export function CodingPlatformPreview() {
  const { codingPlatforms } = useProfile();
  const { displayedItems, showToggle, isExpanded, toggleExpansion, hiddenCount } = usePreviewExpansion(codingPlatforms, 6);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg p-8 shadow-glow-primary">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-electric bg-clip-text text-transparent">
          Coding Platform
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
          {displayedItems.map((platform) => (
            <div
              key={platform.id}
              className="bg-[#141414] border border-primary/20 rounded-lg overflow-hidden hover:border-primary/40 transition-all"
            >
              {platform.image && (
                <div
                  className="w-full h-32 overflow-hidden relative bg-muted flex items-center justify-center p-4 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage(platform.image)}
                >
                  <img
                    src={platform.image}
                    alt={platform.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              <div className="p-4 space-y-3">
                {platform.name && (
                  <h3 className="text-lg font-semibold text-[#c084fc]">
                    {platform.name}
                  </h3>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    className={
                      platform.level === 'Advanced'
                        ? 'bg-green-500/20 text-green-300 border-green-500/40'
                        : platform.level === 'Intermediate'
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }
                  >
                    {platform.level}
                  </Badge>
                  <Badge className="bg-[#22d3ee]/25 text-[#c084fc] border-[#c084fc]/40">
                    {platform.frequency}
                  </Badge>
                  {platform.category && (
                    <Badge className="bg-[#c084fc]/25 text-[#c084fc] border-[#c084fc]/40">
                      {platform.category}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {platform.description}
                </p>

                <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-[#22d3ee]" />
                    <span className="font-medium">Started:</span>
                    <span>{formatDate(platform.dateStarted)}</span>
                  </div>
                  {platform.timeSpent && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-[#22d3ee]" />
                      <span className="font-medium">Time:</span>
                      <span>{platform.timeSpent}h</span>
                    </div>
                  )}
                  {platform.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">Rating:</span>
                      <span>{platform.rating}/5</span>
                    </div>
                  )}
                </div>

                {platform.goal && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[#22d3ee]">Goal</p>
                    <p className="text-sm text-gray-300">{platform.goal}</p>
                  </div>
                )}

                {platform.achievements.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[#22d3ee]">Achievements</p>
                    <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                      {platform.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {platform.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {platform.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gradient-to-r from-[#22d3ee]/25 to-[#c084fc]/25 text-[#c084fc] border border-[#c084fc]/40 text-xs font-medium rounded-full hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] hover:scale-105 transition-all duration-300 ease-in-out"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  {platform.link && (
                    <a
                      href={platform.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#22d3ee] hover:text-[#c084fc] transition-all duration-300 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[#c084fc] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left hover:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Profile
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          No coding platforms added yet.
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

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl bg-black/80 backdrop-blur-md border border-[#c084fc]/40">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-50"
          >
            <X className="h-6 w-6 text-white" />
            <span className="sr-only">Close</span>
          </button>
          <div className="flex items-center justify-center p-4">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Platform preview"
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-[0_0_30px_rgba(192,132,252,0.3)] animate-fade-in"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <FullViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="All Coding Platforms"
      >
        {codingPlatforms.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {codingPlatforms.map((platform) => (
              <div
                key={platform.id}
                className="bg-[#141414] border border-primary/20 rounded-lg overflow-hidden hover:border-primary/40 transition-all"
              >
                {platform.image && (
                  <div
                    className="w-full h-32 overflow-hidden relative bg-muted flex items-center justify-center p-4 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedImage(platform.image)}
                  >
                    <img
                      src={platform.image}
                      alt={platform.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
                <div className="p-4 space-y-3">
                  {platform.name && (
                    <h3 className="text-lg font-semibold text-[#c084fc]">
                      {platform.name}
                    </h3>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      className={
                        platform.level === 'Advanced'
                          ? 'bg-green-500/20 text-green-300 border-green-500/40'
                          : platform.level === 'Intermediate'
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }
                    >
                      {platform.level}
                    </Badge>
                    <Badge className="bg-[#22d3ee]/25 text-[#c084fc] border-[#c084fc]/40">
                      {platform.frequency}
                    </Badge>
                    {platform.category && (
                      <Badge className="bg-[#c084fc]/25 text-[#c084fc] border-[#c084fc]/40">
                        {platform.category}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed">
                    {platform.description}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-[#22d3ee]" />
                      <span className="font-medium">Started:</span>
                      <span>{formatDate(platform.dateStarted)}</span>
                    </div>
                    {platform.timeSpent && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-[#22d3ee]" />
                        <span className="font-medium">Time:</span>
                        <span>{platform.timeSpent}h</span>
                      </div>
                    )}
                    {platform.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">Rating:</span>
                        <span>{platform.rating}/5</span>
                      </div>
                    )}
                  </div>

                  {platform.goal && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-[#22d3ee]">Goal</p>
                      <p className="text-sm text-gray-300">{platform.goal}</p>
                    </div>
                  )}

                  {platform.achievements.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-[#22d3ee]">Achievements</p>
                      <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                        {platform.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {platform.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {platform.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gradient-to-r from-[#22d3ee]/25 to-[#c084fc]/25 text-[#c084fc] border border-[#c084fc]/40 text-xs font-medium rounded-full hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2">
                    {platform.link && (
                      <a
                        href={platform.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-[#22d3ee] hover:text-[#c084fc] transition-all duration-300 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-[#c084fc] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left hover:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Profile
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No coding platforms added yet.
          </p>
        )}
      </FullViewModal>
    </div>
  );
}
