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

      {/* SECOND ROW - Two Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-[#c084fc]/20 pt-8 mb-8">
        {/* LEFT SIDE - Links */}
        <div className="space-y-4">
          {resumeLink && (
            <div className="space-y-2">
              <p className="text-xs font-semibold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent">Resume Link</p>
              <Button
                onClick={() => window.open(resumeLink, '_blank')}
                className="w-full bg-gradient-to-b from-[#22d3ee] to-[#c084fc] text-white font-semibold py-2 px-4 rounded-lg shadow-[0_0_15px_rgba(192,132,252,0.4)] hover:scale-[1.03] transition-all"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-semibold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent">Personal Connect Section</p>
            <Button
              className="w-full bg-[#c084fc] hover:bg-gradient-to-r from-[#22d3ee] to-[#c084fc] text-white font-semibold transition-all"
              onClick={() => {
                const element = document.getElementById('personal-connection');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              <Heart className="w-4 h-4 mr-2" />
              Go to Personal Connect
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE - Strengths, Mindset, Interests */}
        <div className="space-y-4">
          {strengthsSellPoints.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent">Strengths / Sell Points</p>
              <div className="flex flex-wrap gap-2">
                {strengthsSellPoints.map((strength, index) => (
                  <Badge
                    key={index}
                    className="bg-gradient-to-r from-[#22d3ee]/30 to-[#c084fc]/30 text-[#c084fc] border border-[#c084fc]/40 rounded-full px-3 py-1 text-xs font-medium hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] transition-all"
                  >
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {mindset && (
            <div className="space-y-1">
              <p className="text-xs font-semibold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent">Mindset</p>
              <p className="text-base text-gray-200 font-medium tracking-wide">{mindset}</p>
            </div>
          )}

          {otherInterests.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent">Other Interests</p>
              <div className="flex flex-wrap gap-2">
                {otherInterests.map((interest, index) => (
                  <Badge
                    key={index}
                    className="bg-gradient-to-r from-[#22d3ee]/30 to-[#c084fc]/30 text-[#c084fc] border border-[#c084fc]/40 rounded-full px-3 py-1 text-xs font-medium hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] transition-all"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PERSONAL BIO - Bottom Left Full Width */}
      {personalBio && (
        <div className="border-t border-[#c084fc]/20 pt-8 mb-8">
          <p className="text-sm font-semibold text-[#c084fc] mb-3">Personal Bio (Life Journey & Experiences)</p>
          <p className="text-gray-300 leading-relaxed tracking-wide text-base whitespace-pre-wrap">{personalBio}</p>
        </div>
      )}

      {/* FUN FACT - Center Bottom */}
      {funFact && (
        <div className="border-t border-[#c084fc]/20 pt-8">
          <div className="text-center py-4 px-6 bg-gradient-to-r from-[#22d3ee]/40 to-[#c084fc]/40 rounded-lg animate-pulse">
            <p className="text-lg text-white font-semibold tracking-wide">
              🤖 {funFact}
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
