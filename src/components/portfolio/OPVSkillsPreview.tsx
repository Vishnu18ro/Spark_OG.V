import { useState } from "react";
import { useOPV } from "@/contexts/OPVContext";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { FullViewModal } from "./FullViewModal";

export function OPVSkillsPreview() {
  const { opvUserData } = useOPV();
  const skillGroups = (opvUserData?.skills as any[]) || [];
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg p-8 shadow-glow-primary">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-electric bg-clip-text text-transparent">
          Skills & Expertise
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

      {skillGroups.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <div
              key={group.id}
              className="bg-[#141414] rounded-xl p-6 border border-primary/20 hover:shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <h3 className="text-lg font-semibold text-gray-100">
                  {group.name}
                </h3>
              </div>

              {(group.skills || []).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No skills in this group.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {group.skills.map((skill) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.proficiency}%</span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary/30">
                        <div
                          className="h-full transition-all rounded-full"
                          style={{
                            width: `${skill.proficiency}%`,
                            backgroundColor: group.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          No skills added yet.
        </p>
      )}

      <FullViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="All Skills & Expertise"
      >
        {skillGroups.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {skillGroups.map((group) => (
              <div
                key={group.id}
                className="bg-[#141414] rounded-xl p-6 border border-primary/20 hover:shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <h3 className="text-lg font-semibold text-gray-100">
                    {group.name}
                  </h3>
                </div>

                {(group.skills || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No skills in this group.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {group.skills.map((skill) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">{skill.proficiency}%</span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary/30">
                          <div
                            className="h-full transition-all rounded-full"
                            style={{
                              width: `${skill.proficiency}%`,
                              backgroundColor: group.color
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No skills added yet.
          </p>
        )}
      </FullViewModal>
    </div>
  );
}
