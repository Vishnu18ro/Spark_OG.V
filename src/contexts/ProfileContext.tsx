// @ts-nocheck
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isGuestMode } from "@/lib/auth";
import type { Session } from "@supabase/supabase-js";

export interface Project {
  id: string;
  name: string;
  image: string;
  githubLink: string;
  liveLink: string;
  description: string;
  tags: string[];
  featured?: boolean;
}

export interface SurpriseProject {
  id: string;
  name: string;
  image: string;
  githubLink: string;
  liveLink: string;
  basicBrief: string;
  whyFailed: string;
  externalHelp: string;
  whatYouCanDo: string;
  effortsMade: string;
  lessonsLearnt?: string;
  category: 'new' | 'modified' | 'replicating';
  tags: string[];
}

export interface Certificate {
  id: string;
  name: string;
  image: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
  description: string;
  tags: string[];
}

export interface Skill {
  id: string;
  name: string;
  proficiency: number;
}

export interface SkillGroup {
  id: string;
  name: string;
  color: string;
  skills: Skill[];
}

export interface CodingPlatform {
  id: string;
  name: string;
  image: string;
  link: string;
  description: string;
  tags: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  dateStarted: string;
  frequency: 'Daily' | 'Weekly' | 'Occasionally';
  achievements: string[];
  timeSpent?: number;
  category?: string;
  rating?: number;
  goal?: string;
}

export interface Experience {
  id: string;
  image: string;
  title: string;
  organization: string;
  role: string;
  type: 'Workshop' | 'Event' | 'Internship' | 'Job' | 'Custom';
  customType?: string;
  dateJoined: string;
  dateEnded: string;
  description: string;
  whatYouLearned: string;
  achievements: string[];
  skillsGained: string[];
  location: string;
  proofLink?: string;
  certificateImage?: string;
  rating: number;
  timeSpent: string | number;
  teamOrSolo?: string;
}

export interface Education {
  id: string;
  image: string;
  tag: string;
  instituteName: string;
  degreeOrCourse: string;
  year: string;
  location: string;
  description: string;
  grade?: string;
}

interface ProfileContextType {
  session: Session | null;
  isLoading: boolean;
  username: string;
  setUsername: (username: string) => void;
  profileImage: string;
  setProfileImage: (image: string) => void;
  aboutMeProfileImage: string;
  setAboutMeProfileImage: (image: string) => void;
  name: string;
  setName: (name: string) => void;
  tagline: string;
  setTagline: (tagline: string) => void;
  githubUrl: string;
  setGithubUrl: (url: string) => void;
  linkedinUrl: string;
  setLinkedinUrl: (url: string) => void;
  email: string;
  setEmail: (email: string) => void;
  location: string;
  setLocation: (location: string) => void;
  updateProfile: (updates: { email?: string; location?: string }) => void;
  // About Me fields
  bio: string;
  setBio: (bio: string) => void;
  approach: string;
  setApproach: (approach: string) => void;
  currentFocus: string;
  setCurrentFocus: (currentFocus: string) => void;
  goals: string;
  setGoals: (goals: string) => void;
  whatYouDoToAchieveGoals: string;
  setWhatYouDoToAchieveGoals: (whatYouDoToAchieveGoals: string) => void;
  motto: string;
  setMotto: (motto: string) => void;
  resumeLink: string;
  setResumeLink: (resumeLink: string) => void;
  personalConnectLink: string;
  setPersonalConnectLink: (personalConnectLink: string) => void;
  strengthsSellPoints: string[];
  setStrengthsSellPoints: (strengthsSellPoints: string[]) => void;
  mindset: string;
  setMindset: (mindset: string) => void;
  otherInterests: string[];
  setOtherInterests: (otherInterests: string[]) => void;
  personalBio: string;
  setPersonalBio: (personalBio: string) => void;
  funFact: string;
  setFunFact: (funFact: string) => void;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, updatedData: Omit<Project, 'id'>) => void;
  surpriseProjects: SurpriseProject[];
  setSurpriseProjects: (projects: SurpriseProject[]) => void;
  addSurpriseProject: (project: Omit<SurpriseProject, 'id'>) => void;
  removeSurpriseProject: (id: string) => void;
  updateSurpriseProject: (id: string, updatedData: Omit<SurpriseProject, 'id'>) => void;
  certificates: Certificate[];
  setCertificates: (certificates: Certificate[]) => void;
  addCertificate: (certificate: Omit<Certificate, 'id'>) => void;
  removeCertificate: (id: string) => void;
  updateCertificate: (id: string, updatedData: Omit<Certificate, 'id'>) => void;
  skillGroups: SkillGroup[];
  setSkillGroups: (groups: SkillGroup[]) => void;
  addSkillGroup: (group: Omit<SkillGroup, 'id'>) => void;
  removeSkillGroup: (id: string) => void;
  updateSkillGroup: (id: string, updatedData: Omit<SkillGroup, 'id'>) => void;
  addSkillToGroup: (groupId: string, skill: Omit<Skill, 'id'>) => void;
  removeSkillFromGroup: (groupId: string, skillId: string) => void;
  updateSkillInGroup: (groupId: string, skillId: string, updatedData: Omit<Skill, 'id'>) => void;
  codingPlatforms: CodingPlatform[];
  setCodingPlatforms: (platforms: CodingPlatform[]) => void;
  addCodingPlatform: (platform: Omit<CodingPlatform, 'id'>) => void;
  removeCodingPlatform: (id: string) => void;
  updateCodingPlatform: (id: string, updatedData: Omit<CodingPlatform, 'id'>) => void;
  experiences: Experience[];
  setExperiences: (experiences: Experience[]) => void;
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  removeExperience: (id: string) => void;
  updateExperience: (id: string, updatedData: Omit<Experience, 'id'>) => void;
  education: Education[];
  setEducation: (education: Education[]) => void;
  addEducation: (education: Omit<Education, 'id'>) => void;
  removeEducation: (id: string) => void;
  updateEducation: (id: string, updatedData: Omit<Education, 'id'>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsernameState] = useState<string>(() => {
    return localStorage.getItem("username") || "";
  });

  const [profileImage, setProfileImageState] = useState<string>(() => {
    return localStorage.getItem("profileImage") || "";
  });

  const [aboutMeProfileImage, setAboutMeProfileImageState] = useState<string>(() => {
    return localStorage.getItem("aboutMeProfileImage") || "";
  });

  const [name, setNameState] = useState<string>(() => {
    return localStorage.getItem("profileName") || "";
  });

  const [tagline, setTaglineState] = useState<string>(() => {
    return localStorage.getItem("profileTagline") || "";
  });

  const [githubUrl, setGithubUrlState] = useState<string>(() => {
    return localStorage.getItem("profileGithub") || "";
  });

  const [linkedinUrl, setLinkedinUrlState] = useState<string>(() => {
    return localStorage.getItem("profileLinkedin") || "";
  });

  const [email, setEmailState] = useState<string>(() => {
    return localStorage.getItem("profileEmail") || "";
  });

  const [location, setLocationState] = useState<string>(() => {
    return localStorage.getItem("profileLocation") || "";
  });

  const [projects, setProjectsState] = useState<Project[]>(() => {
    const stored = localStorage.getItem("profileProjects");
    return stored ? JSON.parse(stored) : [];
  });

  const [surpriseProjects, setSurpriseProjectsState] = useState<SurpriseProject[]>(() => {
    const stored = localStorage.getItem("profileSurpriseProjects");
    return stored ? JSON.parse(stored) : [];
  });

  const [certificates, setCertificatesState] = useState<Certificate[]>(() => {
    const stored = localStorage.getItem("profileCertificates");
    return stored ? JSON.parse(stored) : [];
  });

  const [skillGroups, setSkillGroupsState] = useState<SkillGroup[]>(() => {
    const stored = localStorage.getItem("profileSkillGroups");
    return stored ? JSON.parse(stored) : [];
  });

  const [codingPlatforms, setCodingPlatformsState] = useState<CodingPlatform[]>(() => {
    const stored = localStorage.getItem("profileCodingPlatforms");
    return stored ? JSON.parse(stored) : [];
  });

  const [experiences, setExperiencesState] = useState<Experience[]>(() => {
    const stored = localStorage.getItem("profileExperiences");
    return stored ? JSON.parse(stored) : [];
  });

  const [education, setEducationState] = useState<Education[]>(() => {
    const stored = localStorage.getItem("profileEducation");
    return stored ? JSON.parse(stored) : [];
  });

  // About Me state
  const [bio, setBioState] = useState<string>(() => {
    return localStorage.getItem("profileBio") || "";
  });

  const [approach, setApproachState] = useState<string>(() => {
    return localStorage.getItem("profileApproach") || "";
  });

  const [currentFocus, setCurrentFocusState] = useState<string>(() => {
    return localStorage.getItem("profileCurrentFocus") || "";
  });

  const [goals, setGoalsState] = useState<string>(() => {
    return localStorage.getItem("profileGoals") || "";
  });

  const [whatYouDoToAchieveGoals, setWhatYouDoToAchieveGoalsState] = useState<string>(() => {
    return localStorage.getItem("profileWhatYouDoToAchieveGoals") || "";
  });

  const [motto, setMottoState] = useState<string>(() => {
    return localStorage.getItem("profileMotto") || "";
  });

  const [resumeLink, setResumeLinkState] = useState<string>(() => {
    return localStorage.getItem("profileResumeLink") || "";
  });

  const [personalConnectLink, setPersonalConnectLinkState] = useState<string>(() => {
    return localStorage.getItem("profilePersonalConnectLink") || "";
  });

  const [strengthsSellPoints, setStrengthsSellPointsState] = useState<string[]>(() => {
    const stored = localStorage.getItem("profileStrengthsSellPoints");
    return stored ? JSON.parse(stored) : [];
  });

  const [mindset, setMindsetState] = useState<string>(() => {
    return localStorage.getItem("profileMindset") || "";
  });

  const [otherInterests, setOtherInterestsState] = useState<string[]>(() => {
    const stored = localStorage.getItem("profileOtherInterests");
    return stored ? JSON.parse(stored) : [];
  });

  const [personalBio, setPersonalBioState] = useState<string>(() => {
    return localStorage.getItem("profilePersonalBio") || "";
  });

  const [funFact, setFunFactState] = useState<string>(() => {
    return localStorage.getItem("profileFunFact") || "";
  });

  const setProfileImage = (image: string) => {
    setProfileImageState(image);
    localStorage.setItem("profileImage", image);
  };

  const setAboutMeProfileImage = (image: string) => {
    setAboutMeProfileImageState(image);
    localStorage.setItem("aboutMeProfileImage", image);
  };

  const setName = (name: string) => {
    setNameState(name);
    localStorage.setItem("profileName", name);
  };

  const setTagline = (tagline: string) => {
    setTaglineState(tagline);
    localStorage.setItem("profileTagline", tagline);
  };

  const setGithubUrl = (url: string) => {
    setGithubUrlState(url);
    localStorage.setItem("profileGithub", url);
  };

  const setLinkedinUrl = (url: string) => {
    setLinkedinUrlState(url);
    localStorage.setItem("profileLinkedin", url);
  };

  const setEmail = (email: string) => {
    setEmailState(email);
    localStorage.setItem("profileEmail", email);
  };

  const setLocation = (location: string) => {
    setLocationState(location);
    localStorage.setItem("profileLocation", location);
  };

  const updateProfile = (updates: { email?: string; location?: string }) => {
    if (updates.email !== undefined) {
      setEmail(updates.email);
    }
    if (updates.location !== undefined) {
      setLocation(updates.location);
    }
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: Date.now().toString() };
    const updatedProjects = [...projects, newProject];
    setProjectsState(updatedProjects);
    localStorage.setItem("profileProjects", JSON.stringify(updatedProjects));
  };

  const removeProject = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjectsState(updatedProjects);
    localStorage.setItem("profileProjects", JSON.stringify(updatedProjects));
  };

  const updateProject = (id: string, updatedData: Omit<Project, 'id'>) => {
    const updatedProjects = projects.map(p => p.id === id ? { ...updatedData, id } : p);
    setProjectsState(updatedProjects);
    localStorage.setItem("profileProjects", JSON.stringify(updatedProjects));
  };

  const addSurpriseProject = (project: Omit<SurpriseProject, 'id'>) => {
    const newProject = { ...project, id: Date.now().toString() };
    const updatedProjects = [...surpriseProjects, newProject];
    setSurpriseProjectsState(updatedProjects);
    localStorage.setItem("profileSurpriseProjects", JSON.stringify(updatedProjects));
  };

  const removeSurpriseProject = (id: string) => {
    const updatedProjects = surpriseProjects.filter(p => p.id !== id);
    setSurpriseProjectsState(updatedProjects);
    localStorage.setItem("profileSurpriseProjects", JSON.stringify(updatedProjects));
  };

  const updateSurpriseProject = (id: string, updatedData: Omit<SurpriseProject, 'id'>) => {
    const updatedProjects = surpriseProjects.map(p => p.id === id ? { ...updatedData, id } : p);
    setSurpriseProjectsState(updatedProjects);
    localStorage.setItem("profileSurpriseProjects", JSON.stringify(updatedProjects));
  };

  const addCertificate = (certificate: Omit<Certificate, 'id'>) => {
    const newCertificate = { ...certificate, id: Date.now().toString() };
    const updatedCertificates = [...certificates, newCertificate];
    setCertificatesState(updatedCertificates);
    localStorage.setItem("profileCertificates", JSON.stringify(updatedCertificates));
  };

  const removeCertificate = (id: string) => {
    const updatedCertificates = certificates.filter(c => c.id !== id);
    setCertificatesState(updatedCertificates);
    localStorage.setItem("profileCertificates", JSON.stringify(updatedCertificates));
  };

  const updateCertificate = (id: string, updatedData: Omit<Certificate, 'id'>) => {
    const updatedCertificates = certificates.map(c => c.id === id ? { ...updatedData, id } : c);
    setCertificatesState(updatedCertificates);
    localStorage.setItem("profileCertificates", JSON.stringify(updatedCertificates));
  };

  const addSkillGroup = (group: Omit<SkillGroup, 'id'>) => {
    const newGroup = { ...group, id: Date.now().toString() };
    const updatedGroups = [...skillGroups, newGroup];
    setSkillGroupsState(updatedGroups);
    localStorage.setItem("profileSkillGroups", JSON.stringify(updatedGroups));
  };

  const removeSkillGroup = (id: string) => {
    const updatedGroups = skillGroups.filter(g => g.id !== id);
    setSkillGroupsState(updatedGroups);
    localStorage.setItem("profileSkillGroups", JSON.stringify(updatedGroups));
  };

  const updateSkillGroup = (id: string, updatedData: Omit<SkillGroup, 'id'>) => {
    const updatedGroups = skillGroups.map(g => g.id === id ? { ...updatedData, id } : g);
    setSkillGroupsState(updatedGroups);
    localStorage.setItem("profileSkillGroups", JSON.stringify(updatedGroups));
  };

  const addSkillToGroup = (groupId: string, skill: Omit<Skill, 'id'>) => {
    const newSkill = { ...skill, id: Date.now().toString() };
    const updatedGroups = skillGroups.map(g =>
      g.id === groupId ? { ...g, skills: [...g.skills, newSkill] } : g
    );
    setSkillGroupsState(updatedGroups);
    localStorage.setItem("profileSkillGroups", JSON.stringify(updatedGroups));
  };

  const removeSkillFromGroup = (groupId: string, skillId: string) => {
    const updatedGroups = skillGroups.map(g =>
      g.id === groupId ? { ...g, skills: g.skills.filter(s => s.id !== skillId) } : g
    );
    setSkillGroupsState(updatedGroups);
    localStorage.setItem("profileSkillGroups", JSON.stringify(updatedGroups));
  };

  const updateSkillInGroup = (groupId: string, skillId: string, updatedData: Omit<Skill, 'id'>) => {
    const updatedGroups = skillGroups.map(g =>
      g.id === groupId
        ? { ...g, skills: g.skills.map(s => s.id === skillId ? { ...updatedData, id: skillId } : s) }
        : g
    );
    setSkillGroupsState(updatedGroups);
    localStorage.setItem("profileSkillGroups", JSON.stringify(updatedGroups));
  };

  const addCodingPlatform = (platform: Omit<CodingPlatform, 'id'>) => {
    const newPlatform = { ...platform, id: Date.now().toString() };
    const updatedPlatforms = [...codingPlatforms, newPlatform];
    setCodingPlatformsState(updatedPlatforms);
    localStorage.setItem("profileCodingPlatforms", JSON.stringify(updatedPlatforms));
  };

  const removeCodingPlatform = (id: string) => {
    const updatedPlatforms = codingPlatforms.filter(p => p.id !== id);
    setCodingPlatformsState(updatedPlatforms);
    localStorage.setItem("profileCodingPlatforms", JSON.stringify(updatedPlatforms));
  };

  const updateCodingPlatform = (id: string, updatedData: Omit<CodingPlatform, 'id'>) => {
    const updatedPlatforms = codingPlatforms.map(p => p.id === id ? { ...updatedData, id } : p);
    setCodingPlatformsState(updatedPlatforms);
    localStorage.setItem("profileCodingPlatforms", JSON.stringify(updatedPlatforms));
  };

  const addExperience = (experience: Omit<Experience, 'id'>) => {
    const newExperience = { ...experience, id: Date.now().toString() };
    const updatedExperiences = [...experiences, newExperience];
    setExperiencesState(updatedExperiences);
    localStorage.setItem("profileExperiences", JSON.stringify(updatedExperiences));
  };

  const removeExperience = (id: string) => {
    const updatedExperiences = experiences.filter(e => e.id !== id);
    setExperiencesState(updatedExperiences);
    localStorage.setItem("profileExperiences", JSON.stringify(updatedExperiences));
  };

  const updateExperience = (id: string, updatedData: Omit<Experience, 'id'>) => {
    const updatedExperiences = experiences.map(e => e.id === id ? { ...updatedData, id } : e);
    setExperiencesState(updatedExperiences);
    localStorage.setItem("profileExperiences", JSON.stringify(updatedExperiences));
  };

  const addEducation = (educationData: Omit<Education, 'id'>) => {
    const newEducation = { ...educationData, id: Date.now().toString() };
    const updatedEducation = [...education, newEducation];
    setEducationState(updatedEducation);
    localStorage.setItem("profileEducation", JSON.stringify(updatedEducation));
  };

  const removeEducation = (id: string) => {
    const updatedEducation = education.filter(e => e.id !== id);
    setEducationState(updatedEducation);
    localStorage.setItem("profileEducation", JSON.stringify(updatedEducation));
  };

  const updateEducation = (id: string, updatedData: Omit<Education, 'id'>) => {
    const updatedEducation = education.map(e => e.id === id ? { ...updatedData, id } : e);
    setEducationState(updatedEducation);
    localStorage.setItem("profileEducation", JSON.stringify(updatedEducation));
  };

  const setProjects = (newProjects: Project[]) => {
    setProjectsState(newProjects);
    localStorage.setItem("profileProjects", JSON.stringify(newProjects));
  };

  const setSurpriseProjects = (newProjects: SurpriseProject[]) => {
    setSurpriseProjectsState(newProjects);
    localStorage.setItem("profileSurpriseProjects", JSON.stringify(newProjects));
  };

  const setCertificates = (newCertificates: Certificate[]) => {
    setCertificatesState(newCertificates);
    localStorage.setItem("profileCertificates", JSON.stringify(newCertificates));
  };

  const setSkillGroups = (newGroups: SkillGroup[]) => {
    setSkillGroupsState(newGroups);
    localStorage.setItem("profileSkillGroups", JSON.stringify(newGroups));
  };

  const setCodingPlatforms = (newPlatforms: CodingPlatform[]) => {
    setCodingPlatformsState(newPlatforms);
    localStorage.setItem("profileCodingPlatforms", JSON.stringify(newPlatforms));
  };

  const setExperiences = (newExperiences: Experience[]) => {
    setExperiencesState(newExperiences);
    localStorage.setItem("profileExperiences", JSON.stringify(newExperiences));
  };

  const setEducation = (newEducation: Education[]) => {
    setEducationState(newEducation);
    localStorage.setItem("profileEducation", JSON.stringify(newEducation));
  };

  // About Me setters
  const setBio = (bio: string) => {
    setBioState(bio);
    localStorage.setItem("profileBio", bio);
  };

  const setApproach = (approach: string) => {
    setApproachState(approach);
    localStorage.setItem("profileApproach", approach);
  };

  const setCurrentFocus = (currentFocus: string) => {
    setCurrentFocusState(currentFocus);
    localStorage.setItem("profileCurrentFocus", currentFocus);
  };

  const setGoals = (goals: string) => {
    setGoalsState(goals);
    localStorage.setItem("profileGoals", goals);
  };

  const setWhatYouDoToAchieveGoals = (whatYouDoToAchieveGoals: string) => {
    setWhatYouDoToAchieveGoalsState(whatYouDoToAchieveGoals);
    localStorage.setItem("profileWhatYouDoToAchieveGoals", whatYouDoToAchieveGoals);
  };

  const setMotto = (motto: string) => {
    setMottoState(motto);
    localStorage.setItem("profileMotto", motto);
  };

  const setResumeLink = (resumeLink: string) => {
    setResumeLinkState(resumeLink);
    localStorage.setItem("profileResumeLink", resumeLink);
  };

  const setPersonalConnectLink = (personalConnectLink: string) => {
    setPersonalConnectLinkState(personalConnectLink);
    localStorage.setItem("profilePersonalConnectLink", personalConnectLink);
  };

  const setStrengthsSellPoints = (strengthsSellPoints: string[]) => {
    setStrengthsSellPointsState(strengthsSellPoints);
    localStorage.setItem("profileStrengthsSellPoints", JSON.stringify(strengthsSellPoints));
  };

  const setMindset = (mindset: string) => {
    setMindsetState(mindset);
    localStorage.setItem("profileMindset", mindset);
  };

  const setOtherInterests = (otherInterests: string[]) => {
    setOtherInterestsState(otherInterests);
    localStorage.setItem("profileOtherInterests", JSON.stringify(otherInterests));
  };

  const setPersonalBio = (personalBio: string) => {
    setPersonalBioState(personalBio);
    localStorage.setItem("profilePersonalBio", personalBio);
  };

  const setFunFact = (funFact: string) => {
    setFunFactState(funFact);
    localStorage.setItem("profileFunFact", funFact);
  };

  // Helper function to save all data to Supabase
  const saveToSupabase = async () => {
    if (isGuestMode() || !session) return;

    try {
      const userData = {
        profile: {
          image: profileImage,
          aboutMeImage: aboutMeProfileImage,
          name,
          tagline,
          github: githubUrl,
          linkedin: linkedinUrl,
          email,
          location
        } as any,
        projects: projects as any,
        surprise_projects: surpriseProjects as any,
        skills: skillGroups as any,
        certificates: certificates as any,
        experience: experiences as any,
        coding_platforms: codingPlatforms as any,
        about_me: {
          bio,
          approach,
          currentFocus,
          goals,
          whatYouDoToAchieveGoals,
          motto,
          resumeLink,
          personalConnectLink,
          strengthsSellPoints,
          mindset,
          otherInterests,
          personalBio,
          funFact
        } as any,
        education: education as any,
        personal_connect: { email, location } as any
      };

      // @ts-ignore - Supabase types issue
      const updateResult = await supabase
        .from("users")
        // @ts-ignore
        .update(userData)
        .eq("auth_user_id", session.user.id);
    } catch (error) {
      console.error("Error saving to Supabase:", error);
    }
  };

  // Helper function to load data from Supabase
  const loadFromSupabase = async (userId: string) => {
    try {
      // @ts-ignore - Supabase types issue
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", userId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return;

      // @ts-ignore - Supabase types issue
      // Load profile data
      if (data.profile) {
        // @ts-ignore
        const profile = data.profile as any;
        if (profile.image) setProfileImageState(profile.image);
        if (profile.aboutMeImage) setAboutMeProfileImageState(profile.aboutMeImage);
        if (profile.name) setNameState(profile.name);
        if (profile.tagline) setTaglineState(profile.tagline);
        if (profile.github) setGithubUrlState(profile.github);
        if (profile.linkedin) setLinkedinUrlState(profile.linkedin);
        if (profile.email) setEmailState(profile.email);
        if (profile.location) setLocationState(profile.location);
      }

      // @ts-ignore - Supabase types issue
      // Load other data
      if (data.projects) setProjectsState(data.projects as any);
      // @ts-ignore
      if (data.surprise_projects) setSurpriseProjectsState(data.surprise_projects as any);
      // @ts-ignore
      if (data.skills) setSkillGroupsState(data.skills as any);
      // @ts-ignore
      if (data.certificates) setCertificatesState(data.certificates as any);
      // @ts-ignore
      if (data.experience) setExperiencesState(data.experience as any);
      // @ts-ignore
      if (data.coding_platforms) setCodingPlatformsState(data.coding_platforms as any);
      // @ts-ignore
      if (data.education) setEducationState(data.education as any);

      // @ts-ignore - Supabase types issue
      // Load about me data
      if (data.about_me) {
        // @ts-ignore
        const aboutMe = data.about_me as any;
        if (aboutMe.bio) setBioState(aboutMe.bio);
        if (aboutMe.approach) setApproachState(aboutMe.approach);
        if (aboutMe.currentFocus) setCurrentFocusState(aboutMe.currentFocus);
        if (aboutMe.goals) setGoalsState(aboutMe.goals);
        if (aboutMe.whatYouDoToAchieveGoals) setWhatYouDoToAchieveGoalsState(aboutMe.whatYouDoToAchieveGoals);
        if (aboutMe.motto) setMottoState(aboutMe.motto);
        if (aboutMe.resumeLink) setResumeLinkState(aboutMe.resumeLink);
        if (aboutMe.personalConnectLink) setPersonalConnectLinkState(aboutMe.personalConnectLink);
        if (aboutMe.strengthsSellPoints) setStrengthsSellPointsState(aboutMe.strengthsSellPoints);
        if (aboutMe.mindset) setMindsetState(aboutMe.mindset);
        if (aboutMe.otherInterests) setOtherInterestsState(aboutMe.otherInterests);
        if (aboutMe.personalBio) setPersonalBioState(aboutMe.personalBio);
        if (aboutMe.funFact) setFunFactState(aboutMe.funFact);
      }

      // @ts-ignore - Supabase types issue
      if (data.username) {
        // @ts-ignore
        setUsernameState(data.username);
        // @ts-ignore
        localStorage.setItem("username", data.username);
      }
    } catch (error) {
      console.error("Error loading from Supabase:", error);
    }
  };

  // Auth state management
  useEffect(() => {
    // Set up auth listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);

      if (newSession?.user) {
        setIsLoading(true);
        // Load data and then set loading to false
        loadFromSupabase(newSession.user.id).finally(() => {
          setIsLoading(false);
        });
      } else {
        // No user, stop loading immediately
        setIsLoading(false);
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      setSession(existingSession);
      if (existingSession?.user) {
        // Await the data load before setting loading to false
        await loadFromSupabase(existingSession.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-save to Supabase when data changes
  useEffect(() => {
    if (!isLoading && session && !isGuestMode()) {
      const timeoutId = setTimeout(() => {
        saveToSupabase();
      }, 2000); // Debounce saves by 2 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [
    session, isLoading, profileImage, aboutMeProfileImage, name, tagline, githubUrl, linkedinUrl,
    email, location, projects, surpriseProjects, skillGroups, certificates, experiences,
    codingPlatforms, education, bio, approach, currentFocus, goals, whatYouDoToAchieveGoals,
    motto, resumeLink, personalConnectLink, strengthsSellPoints, mindset, otherInterests,
    personalBio, funFact
  ]);

  const setUsername = (newUsername: string) => {
    setUsernameState(newUsername);
    localStorage.setItem("username", newUsername);
  };

  return (
    <ProfileContext.Provider value={{
      session,
      isLoading,
      username,
      setUsername,
      profileImage,
      setProfileImage,
      aboutMeProfileImage,
      setAboutMeProfileImage,
      name,
      setName,
      tagline,
      setTagline,
      githubUrl,
      setGithubUrl,
      linkedinUrl,
      setLinkedinUrl,
      email,
      setEmail,
      location,
      setLocation,
      updateProfile,
      projects,
      setProjects,
      addProject,
      removeProject,
      updateProject,
      surpriseProjects,
      setSurpriseProjects,
      addSurpriseProject,
      removeSurpriseProject,
      updateSurpriseProject,
      certificates,
      setCertificates,
      addCertificate,
      removeCertificate,
      updateCertificate,
      skillGroups,
      setSkillGroups,
      addSkillGroup,
      removeSkillGroup,
      updateSkillGroup,
      addSkillToGroup,
      removeSkillFromGroup,
      updateSkillInGroup,
      codingPlatforms,
      setCodingPlatforms,
      addCodingPlatform,
      removeCodingPlatform,
      updateCodingPlatform,
      experiences,
      setExperiences,
      addExperience,
      removeExperience,
      updateExperience,
      education,
      setEducation,
      addEducation,
      removeEducation,
      updateEducation,
      bio,
      setBio,
      approach,
      setApproach,
      currentFocus,
      setCurrentFocus,
      goals,
      setGoals,
      whatYouDoToAchieveGoals,
      setWhatYouDoToAchieveGoals,
      motto,
      setMotto,
      resumeLink,
      setResumeLink,
      personalConnectLink,
      setPersonalConnectLink,
      strengthsSellPoints,
      setStrengthsSellPoints,
      mindset,
      setMindset,
      otherInterests,
      setOtherInterests,
      personalBio,
      setPersonalBio,
      funFact,
      setFunFact
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
