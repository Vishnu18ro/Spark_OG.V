import { createContext, useContext, useState, ReactNode } from "react";

// Define the user data type directly to avoid Supabase type issues
interface UserData {
  id: string;
  username: string;
  auth_user_id: string | null;
  profile: any;
  projects: any;
  surprise_projects: any;
  skills: any;
  certificates: any;
  experience: any;
  coding_platforms: any;
  about_me: any;
  education: any;
  personal_connect: any;
  created_at?: string;
  updated_at?: string;
}

interface OPVContextType {
  opvUserData: UserData | null;
  setOpvUserData: (data: UserData | null) => void;
  isOPVMode: boolean;
  setIsOPVMode: (mode: boolean) => void;
}

const OPVContext = createContext<OPVContextType | undefined>(undefined);

export const OPVProvider = ({ children }: { children: ReactNode }) => {
  const [opvUserData, setOpvUserData] = useState<UserData | null>(null);
  const [isOPVMode, setIsOPVMode] = useState(false);

  return (
    <OPVContext.Provider value={{ opvUserData, setOpvUserData, isOPVMode, setIsOPVMode }}>
      {children}
    </OPVContext.Provider>
  );
};

export const useOPV = () => {
  const context = useContext(OPVContext);
  if (context === undefined) {
    throw new Error("useOPV must be used within an OPVProvider");
  }
  return context;
};
