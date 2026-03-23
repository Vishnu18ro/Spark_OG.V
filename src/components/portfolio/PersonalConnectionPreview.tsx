import { useProfile } from "@/contexts/ProfileContext";
import { Mail, MapPin, MessageCircle, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const scrollToProfileInfo = () => {
  const profileInfoSection = document.getElementById('profile-info-section');
  if (profileInfoSection) {
    profileInfoSection.scrollIntoView({ behavior: 'smooth' });
  }
};

export function PersonalConnectionPreview() {
  const { email, location } = useProfile();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#c084fc] mb-6">Personal Connection</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT SIDE - Contact Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">Let's Connect</h3>
            <p className="text-gray-400">
              Feel free to reach out for collaborations, questions, or just a friendly chat.
            </p>
          </div>

          <div className="space-y-4">
            {/* Email Card - Clickable */}
            <a 
              href={`mailto:${email || 'your.email@example.com'}`}
              className="block p-4 rounded-xl border border-purple-500/30 bg-[#0d0d0d]/50 backdrop-blur-sm hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-200">{email || 'your.email@example.com'}</p>
                </div>
              </div>
            </a>

            {/* Location Card */}
            <div className="p-4 rounded-xl border border-purple-500/30 bg-[#0d0d0d]/50 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="text-sm font-medium text-gray-200">{location || 'Your City, Country'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Note about contact */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">Get In Touch</h3>
            <p className="text-sm text-gray-400">
              Contact information is displayed for viewing purposes. To send a message, please use the email provided.
            </p>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
            <p className="text-xs text-gray-400">
              <strong className="text-purple-400">Note:</strong> This is a view-only profile. Contact the profile owner directly via the email address provided above.
            </p>
          </div>

          {/* Direct Message Button */}
          <button
            onClick={() => navigate("/messages")}
            className="w-full mt-4 p-4 rounded-xl border border-purple-500/30 bg-[#0d0d0d]/50 backdrop-blur-sm hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-all">
                <MessageCircle className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-200 group-hover:text-purple-300 transition-colors">
                  Direct Message
                </p>
                <p className="text-xs text-gray-500">
                  View your messages
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Return to Top Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={scrollToProfileInfo}
          className="p-4 rounded-xl border border-purple-500/30 bg-[#0d0d0d]/50 backdrop-blur-sm hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-all">
              <ArrowUp className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-200 group-hover:text-purple-300 transition-colors">
                Return to Top
              </p>
              <p className="text-xs text-gray-500">
                Back to profile info
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}