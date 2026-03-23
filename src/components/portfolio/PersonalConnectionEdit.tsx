import { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Save } from "lucide-react";

export function PersonalConnectionEdit() {
  const { email, location, updateProfile } = useProfile();
  const { toast } = useToast();
  const [emailValue, setEmailValue] = useState(email || '');
  const [locationValue, setLocationValue] = useState(location || '');

  const handleSave = () => {
    updateProfile({ email: emailValue, location: locationValue });
    toast({
      title: "Changes saved",
      description: "Your contact information has been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-purple-500 mb-6">Personal Connection</h2>
      
      <div className="space-y-6 max-w-2xl">
        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="edit-email" className="text-gray-200 flex items-center gap-2">
            <Mail className="w-4 h-4 text-purple-400" />
            Email Address
          </Label>
          <Input
            id="edit-email"
            type="email"
            placeholder="your.email@example.com"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            className="bg-[#0d0d0d] border-purple-500/30 text-gray-200 rounded-xl focus:border-purple-500 transition-all"
          />
        </div>

        {/* Location Input */}
        <div className="space-y-2">
          <Label htmlFor="edit-location" className="text-gray-200 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-400" />
            Location
          </Label>
          <Input
            id="edit-location"
            type="text"
            placeholder="Your City, Country"
            value={locationValue}
            onChange={(e) => setLocationValue(e.target.value)}
            className="bg-[#0d0d0d] border-purple-500/30 text-gray-200 rounded-xl focus:border-purple-500 transition-all"
          />
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition-all rounded-xl"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
