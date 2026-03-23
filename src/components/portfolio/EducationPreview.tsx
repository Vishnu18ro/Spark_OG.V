import { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { MapPin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FullViewModal } from "./FullViewModal";

export function EducationPreview() {
  const { education } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg p-8 shadow-glow-primary">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-electric bg-clip-text text-transparent">
          Education
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

      {education.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="bg-[#141414] border border-[#c084fc]/20 rounded-lg overflow-hidden hover:border-[#c084fc]/40 transition-all"
            >
              {edu.image && (
                <div className="w-full h-32 overflow-hidden relative bg-muted flex items-center justify-center p-4">
                  <img src={edu.image} alt={edu.instituteName} className="max-h-full max-w-full object-contain" />
                </div>
              )}

              <div className="p-4 space-y-2">
                <Badge variant="outline" className="bg-gradient-to-r from-[#22d3ee]/25 to-[#c084fc]/25 text-[#c084fc] border border-[#c084fc]/40 rounded-full px-2 py-1 text-xs font-medium hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] transition-all">
                  {edu.tag}
                </Badge>

                <h3 className="text-[#c084fc] text-lg font-semibold mt-2">
                  {edu.instituteName}
                </h3>

                <p className="text-sm text-gray-300 font-medium">
                  {edu.degreeOrCourse}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                  <span className="font-medium">{edu.year}</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{edu.location}</span>
                  </div>
                </div>

                {edu.grade && (
                  <div className="text-xs">
                    <span className="text-[#22d3ee] font-medium">Grade: </span>
                    <span className="text-gray-300">{edu.grade}</span>
                  </div>
                )}

                <p className="text-gray-300 text-sm leading-relaxed mt-2">
                  {edu.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-2">No education records yet</p>
          <p className="text-sm text-muted-foreground">Start adding your educational background</p>
        </div>
      )}

      <FullViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="All Education"
      >
        {education.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="bg-[#141414] border border-[#c084fc]/20 rounded-lg overflow-hidden hover:border-[#c084fc]/40 transition-all"
              >
                {edu.image && (
                  <div className="w-full h-32 overflow-hidden relative bg-muted flex items-center justify-center p-4">
                    <img src={edu.image} alt={edu.instituteName} className="max-h-full max-w-full object-contain" />
                  </div>
                )}

                <div className="p-4 space-y-2">
                  <Badge variant="outline" className="bg-gradient-to-r from-[#22d3ee]/25 to-[#c084fc]/25 text-[#c084fc] border border-[#c084fc]/40 rounded-full px-2 py-1 text-xs font-medium hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] transition-all">
                    {edu.tag}
                  </Badge>

                  <h3 className="text-[#c084fc] text-lg font-semibold mt-2">
                    {edu.instituteName}
                  </h3>

                  <p className="text-sm text-gray-300 font-medium">
                    {edu.degreeOrCourse}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                    <span className="font-medium">{edu.year}</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{edu.location}</span>
                    </div>
                  </div>

                  {edu.grade && (
                    <div className="text-xs">
                      <span className="text-[#22d3ee] font-medium">Grade: </span>
                      <span className="text-gray-300">{edu.grade}</span>
                    </div>
                  )}

                  <p className="text-gray-300 text-sm leading-relaxed mt-2">
                    {edu.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-2">No education records yet</p>
            <p className="text-sm text-muted-foreground">Start adding your educational background</p>
          </div>
        )}
      </FullViewModal>
    </div>
  );
}
