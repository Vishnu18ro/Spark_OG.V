import { useState } from "react";
import { useOPV } from "@/contexts/OPVContext";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FullViewModal } from "./FullViewModal";

export function OPVAboutMePreview() {
  const { opvUserData } = useOPV();
  const aboutMe = (opvUserData?.about_me as any) || {};
  const profile = (opvUserData?.profile as any) || {};
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get profile image and name/tagline from profile object (where PV saves them)
  const aboutMeProfileImage = profile.aboutMeImage || profile.image;
  const name = profile.name;
  const tagline = profile.tagline;
  const bio = aboutMe.bio;
  const approach = aboutMe.approach;
  const currentFocus = aboutMe.currentFocus;
  const goals = aboutMe.goals;
  const whatYouDoToAchieveGoals = aboutMe.whatYouDoToAchieveGoals;
  const motto = aboutMe.motto;
  const resumeLink = aboutMe.resumeLink;
  const strengthsSellPoints = aboutMe.strengthsSellPoints || [];
  const mindset = aboutMe.mindset;
  const otherInterests = aboutMe.otherInterests || [];
  const personalBio = aboutMe.personalBio;
  const funFact = aboutMe.funFact;

  const renderAboutMeContent = () => (
    <>
      {/* TOP SECTION - Two Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* LEFT SIDE - Photo, Name, Title */}
        <div className="space-y-4">
          {aboutMeProfileImage && (
            <div className="w-64 h-64 rounded-lg overflow-hidden border-2 border-[#c084fc]/30 shadow-[0_0_15px_rgba(192,132,252,0.3)]">
              <img src={aboutMeProfileImage} alt={name || "Profile"} className="w-full h-full object-cover" />
            </div>
          )}

          {name && (
            <div className="space-y-1">
              <p className="text-xs font-semibold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent">Full Name</p>
              <p className="text-base text-gray-200 font-medium tracking-wide">{name}</p>
            </div>
          )}

          {tagline && (
            <div className="space-y-1">
              <p className="text-xs font-semibold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent">Title / Role</p>
              <p className="text-base text-gray-200 font-medium tracking-wide">{tagline}</p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - Bio Fields */}
        <div className="space-y-4">
          {bio && (
            <div className="space-y-1">
              <p className="text-xs font-semibold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent">Bio (2-3 line intro)</p>
              <p className="text-base text-gray-200 font-medium tracking-wide leading-relaxed">{bio}</p>
            </div>
          )}

          {approach && (
            <div className="space-y-1">
              <p className="text-xs font-semibold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent">Approach (Development/Work Philosophy)</p>
              <p className="text-base text-gray-200 font-medium tracking-wide leading-relaxed">{approach}</p>
            </div>
          )}

          {currentFocus && (
            <div className="space-y-1">
              <p className="text-xs font-semibold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent">Current Focus</p>
              <p className="text-base text-gray-200 font-medium tracking-wide leading-relaxed">{currentFocus}</p>
            </div>
          )}

          {goals && (
            <div className="space-y-1">
              <p className="text-xs font-semibold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent">Long-term Goals</p>
              <p className="text-base text-gray-200 font-medium tracking-wide leading-relaxed">{goals}</p>
            </div>
          )}

          {whatYouDoToAchieveGoals && (
            <div className="space-y-1">
              <p className="text-xs font-semibold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent">What You're Doing to Achieve Goals</p>
              <p className="text-base text-gray-200 font-medium tracking-wide leading-relaxed">{whatYouDoToAchieveGoals}</p>
            </div>
          )}
        </div>
      </div>

      {/* MOTTO - Full Width Center */}
      {motto && (
        <div className="border-t border-[#c084fc]/20 pt-8 mb-8">
          <p className="text-xs font-semibold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent text-center mb-2">Your Motto</p>
          <div className="text-center py-6">
            <p className="text-2xl font-bold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent animate-pulse">
              "{motto}"
            </p>
            <div className="h-1 w-32 mx-auto mt-2 bg-gradient-to-r from-[#22d3ee] to-[#c084fc] rounded-full"></div>
          </div>
        </div>
      )}

      {/* SECOND ROW - Bento Box Style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 border-t border-[#c084fc]/20 pt-8 mb-8">
        {/* Action Hub */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="bg-black/40 border border-white/10 rounded-xl p-5 shadow-lg backdrop-blur-md h-full space-y-5">
            <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#c084fc]" /> Quick Actions
            </h3>
            <div className="space-y-4">
              {resumeLink && (
                <Button
                  onClick={() => window.open(resumeLink, '_blank')}
                  className="w-full relative group overflow-hidden rounded-lg bg-transparent border border-[#22d3ee]/50 text-[#22d3ee] hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.15)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#22d3ee] to-[#c084fc] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Resume
                </Button>
              )}
              <Button
                className="w-full relative group overflow-hidden rounded-lg bg-transparent border border-[#c084fc]/50 text-[#c084fc] hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(192,132,252,0.15)]"
                onClick={() => {
                  const element = document.getElementById('personal-connection');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#c084fc] to-[#22d3ee] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                <Heart className="w-4 h-4 mr-2" />
                Personal Connect
              </Button>
            </div>
          </div>
        </div>

        {/* Strengths & Mindset Hub */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* Strengths */}
            {strengthsSellPoints.length > 0 && (
              <div className="bg-[#c084fc]/5 border border-[#c084fc]/20 rounded-xl p-5 shadow-inner">
                <h3 className="text-sm font-bold text-[#c084fc] mb-4">Core Strengths</h3>
                <div className="flex flex-wrap gap-2">
                  {strengthsSellPoints.map((strength: any, index: any) => (
                    <Badge
                      variant="outline"
                      key={index}
                      className="bg-black/50 text-gray-200 border-[#c084fc]/40 py-1.5 px-3 rounded-md font-medium text-xs tracking-wide hover:border-[#c084fc] hover:shadow-[0_0_10px_rgba(192,132,252,0.3)] hover:-translate-y-0.5 transition-all"
                    >
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {otherInterests.length > 0 && (
              <div className="bg-[#22d3ee]/5 border border-[#22d3ee]/20 rounded-xl p-5 shadow-inner">
                <h3 className="text-sm font-bold text-[#22d3ee] mb-4">Interests & Hobbies</h3>
                <div className="flex flex-wrap gap-2">
                  {otherInterests.map((interest: any, index: any) => (
                    <Badge
                      variant="outline"
                      key={index}
                      className="bg-black/50 text-gray-200 border-[#22d3ee]/40 py-1.5 px-3 rounded-md font-medium text-xs tracking-wide hover:border-[#22d3ee] hover:shadow-[0_0_10px_rgba(34,211,238,0.3)] hover:-translate-y-0.5 transition-all"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mindset Quote Box */}
          {mindset && (
            <div className="bg-gradient-to-r from-black via-[#c084fc]/5 to-[#22d3ee]/5 border-l-4 border-[#c084fc] rounded-r-xl p-5 shadow-md">
              <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Mindset</p>
              <p className="text-sm text-gray-200 font-medium italic leading-relaxed">"{mindset}"</p>
            </div>
          )}
        </div>
      </div>

      {/* PERSONAL BIO - Bottom Width */}
      {personalBio && (
        <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-6 mb-8 relative overflow-hidden group hover:border-[#c084fc]/30 transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22d3ee]/50 to-[#c084fc]/50 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-widest">Life Journey</h3>
          <p className="text-gray-400 leading-relaxed text-sm whitespace-pre-wrap">{personalBio}</p>
        </div>
      )}

      {/* FUN FACT - Center Bottom */}
      {funFact && (
        <div className="flex justify-center pb-4">
          <div className="inline-flex items-center gap-3 py-3 px-6 bg-gradient-to-r from-[#22d3ee]/10 to-[#c084fc]/10 border border-white/10 rounded-full hover:scale-105 hover:shadow-[0_0_20px_rgba(192,132,252,0.15)] transition-all cursor-default">
            <span className="text-xl">🤖</span>
            <p className="text-sm text-gray-200 font-medium tracking-wide">
              <span className="text-[#22d3ee] font-bold mr-2">FUN FACT:</span> {funFact}
            </p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="border border-[#ff914d]/30 rounded-xl shadow-[0_0_20px_rgba(255,145,77,0.25)] bg-[#0d0d0d] p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent">
          About Me
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

      {renderAboutMeContent()}

      <FullViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="About Me - Full View"
      >
        {renderAboutMeContent()}
      </FullViewModal>
    </div>
  );
}
