import { useState, useRef, useEffect } from "react";
import { uploadImage } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
import { SpaceBackground } from "@/components/SpaceBackground";
import { ImageUploadZone } from "@/components/ImageUploadZone";
import { QuoteTicker } from "@/components/QuoteTicker";
import { Header } from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/contexts/ProfileContext";
import {
  Home, FolderOpen, Sparkles, Award, Code2,
  User, GraduationCap, Heart, ChevronRight, Camera, Plus, X, ExternalLink, Github, Briefcase,
  Mail, MapPin, Send, Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import emailjs from '@emailjs/browser';
import { PersonalConnectionEdit } from "@/components/portfolio/PersonalConnectionEdit";
import { logout, isGuestMode } from "@/lib/auth";
import { toast as sonnerToast } from "sonner";

const menuItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: FolderOpen, label: "Projects" },
  { icon: Sparkles, label: "Surprise Projects" },
  { icon: Award, label: "Skills and Expertise" },
  { icon: Award, label: "Certificates" },
  { icon: Briefcase, label: "Experience (XP)" },
  { icon: Code2, label: "Coding Platform" },
  { icon: User, label: "About Me" },
  { icon: GraduationCap, label: "Education" },
  { icon: Heart, label: "Personal Connection" },
];

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Profile Info");
  const {
    session,
    isLoading: profileLoading,
    username: profileUsername,
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
    location: profileLocation,
    setLocation,
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
  } = useProfile();

  useEffect(() => {
    if (!profileLoading && !session && !isGuestMode()) {
      navigate("/");
    }
  }, [session, profileLoading, navigate]);

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      sonnerToast.success("Logged out successfully");
      navigate("/");
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const aboutMeFileInputRef = useRef<HTMLInputElement>(null);
  const projectImageInputRef = useRef<HTMLInputElement>(null);

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
  const [draggedItemType, setDraggedItemType] = useState<string | null>(null);

  const handleDragStartCards = (e: React.DragEvent, index: number, type: string) => {
    setDraggedItemIndex(index);
    setDraggedItemType(type);
    setDraggedOverIndex(index);
  };

  const handleDragEnterCards = (e: React.DragEvent, index: number, type: string) => {
    e.preventDefault();
    if (draggedItemType !== type) return;
    setDraggedOverIndex(index);
  };

  const handleDragEndCards = (e: React.DragEvent, type: string, items: any[], setItems: (items: any[]) => void) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedOverIndex === null || draggedItemType !== type) {
      setDraggedItemIndex(null);
      setDraggedOverIndex(null);
      setDraggedItemType(null);
      return;
    }

    if (draggedItemIndex !== draggedOverIndex) {
      const newItems = [...items];
      const draggedItem = newItems.splice(draggedItemIndex, 1)[0];
      newItems.splice(draggedOverIndex, 0, draggedItem);
      setItems(newItems);
    }

    setDraggedItemIndex(null);
    setDraggedOverIndex(null);
    setDraggedItemType(null);
  };

  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    name: "",
    image: "",
    githubLink: "",
    liveLink: "",
    description: "",
    tags: [] as string[],
    featured: false,
  });
  const [tagInput, setTagInput] = useState("");

  const [isSurpriseDialogOpen, setIsSurpriseDialogOpen] = useState(false);
  const [editingSurpriseId, setEditingSurpriseId] = useState<string | null>(null);
  const [newSurpriseProject, setNewSurpriseProject] = useState({
    name: "",
    image: "",
    githubLink: "",
    liveLink: "",
    basicBrief: "",
    whyFailed: "",
    externalHelp: "",
    whatYouCanDo: "",
    effortsMade: "",
    lessonsLearnt: "",
    category: 'new' as 'new' | 'modified' | 'replicating',
    tags: [] as string[],
  });
  const [surpriseTagInput, setSurpriseTagInput] = useState("");

  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [editingCertificateId, setEditingCertificateId] = useState<string | null>(null);
  const [newCertificate, setNewCertificate] = useState({
    name: "",
    image: "",
    issuer: "",
    issueDate: "",
    credentialUrl: "",
    description: "",
    tags: [] as string[],
  });
  const [certificateTagInput, setCertificateTagInput] = useState("");

  const [isSkillGroupDialogOpen, setIsSkillGroupDialogOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [newSkillGroup, setNewSkillGroup] = useState({
    name: "",
    color: "#3b82f6",
    skills: [] as Array<{ id: string; name: string; proficiency: number }>,
  });
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  const [activeGroupForSkill, setActiveGroupForSkill] = useState<string | null>(null);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState({ name: "", proficiency: 50 });

  const [isCodingPlatformDialogOpen, setIsCodingPlatformDialogOpen] = useState(false);
  const [editingPlatformId, setEditingPlatformId] = useState<string | null>(null);
  const [newCodingPlatform, setNewCodingPlatform] = useState({
    name: "",
    image: "",
    link: "",
    description: "",
    tags: [] as string[],
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    dateStarted: "",
    frequency: 'Weekly' as 'Daily' | 'Weekly' | 'Occasionally',
    achievements: [] as string[],
    timeSpent: undefined as number | undefined,
    category: "",
    rating: undefined as number | undefined,
    goal: "",
  });
  const [platformTagInput, setPlatformTagInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");

  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [newExperience, setNewExperience] = useState({
    image: "",
    title: "",
    organization: "",
    role: "",
    type: 'Workshop' as 'Workshop' | 'Event' | 'Internship' | 'Job' | 'Custom',
    customType: "",
    dateJoined: "",
    dateEnded: "",
    description: "",
    whatYouLearned: "",
    achievements: [] as string[],
    skillsGained: [] as string[],
    location: "",
    proofLink: "",
    certificateImage: "",
    rating: 3,
    timeSpent: "" as string | number,
    teamOrSolo: "",
  });
  const [experienceSkillInput, setExperienceSkillInput] = useState("");
  const [experienceAchievementInput, setExperienceAchievementInput] = useState("");

  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);

  // Personal Connection state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [newEducation, setNewEducation] = useState({
    image: "",
    tag: "",
    instituteName: "",
    degreeOrCourse: "",
    year: "",
    location: "",
    description: "",
    grade: "",
  });

  // About Me state
  const [strengthInput, setStrengthInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [showFullBio, setShowFullBio] = useState(false);


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImage(file, "profile");
      setProfileImage(url);
    }
  };

  const handleAboutMeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImage(file, "about-me");
      setAboutMeProfileImage(url);
    }
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sectionPathMap: Record<string, string> = {
        "Projects": "projects",
        "Surprise Projects": "surprise-projects",
        "Certificates": "certificates",
        "Experience (XP)": "experience",
        "Coding Platform": "coding-platforms",
        "Education": "education",
      };
      const storagePath = sectionPathMap[activeSection] || "general";
      const url = await uploadImage(file, storagePath);

      if (activeSection === "Projects") {
        setNewProject(prev => ({ ...prev, image: url }));
      } else if (activeSection === "Surprise Projects") {
        setNewSurpriseProject(prev => ({ ...prev, image: url }));
      } else if (activeSection === "Certificates") {
        setNewCertificate(prev => ({ ...prev, image: url }));
      } else if (activeSection === "Experience (XP)") {
        setNewExperience(prev => ({ ...prev, image: url }));
      } else if (activeSection === "Coding Platform") {
        setNewCodingPlatform(prev => ({ ...prev, image: url }));
      } else if (activeSection === "Education") {
        setNewEducation(prev => ({ ...prev, image: url }));
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newProject.tags.includes(tagInput.trim())) {
      setNewProject(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const tags = value.split(',').map(t => t.trim()).filter(t => t && !newProject.tags.includes(t));
      if (tags.length > 0) {
        setNewProject(prev => ({
          ...prev,
          tags: [...prev.tags, ...tags]
        }));
      }
      setTagInput("");
    } else {
      setTagInput(value);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewProject(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSaveProject = () => {
    if (newProject.name && newProject.description && newProject.tags.length > 0) {
      if (editingProjectId) {
        updateProject(editingProjectId, newProject);
      } else {
        addProject(newProject);
      }
      setNewProject({
        name: "",
        image: "",
        githubLink: "",
        liveLink: "",
        description: "",
        tags: [],
        featured: false,
      });
      setEditingProjectId(null);
      setIsProjectDialogOpen(false);
    }
  };

  const handleEditProject = (project: typeof projects[0]) => {
    setNewProject({
      name: project.name,
      image: project.image,
      githubLink: project.githubLink,
      liveLink: project.liveLink,
      description: project.description,
      tags: project.tags,
      featured: project.featured || false,
    });
    setEditingProjectId(project.id);
    setIsProjectDialogOpen(true);
  };

  const handleAddSurpriseTag = () => {
    if (surpriseTagInput.trim() && !newSurpriseProject.tags.includes(surpriseTagInput.trim())) {
      setNewSurpriseProject(prev => ({
        ...prev,
        tags: [...prev.tags, surpriseTagInput.trim()]
      }));
      setSurpriseTagInput("");
    }
  };

  const handleSurpriseTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const tags = value.split(',').map(t => t.trim()).filter(t => t && !newSurpriseProject.tags.includes(t));
      if (tags.length > 0) {
        setNewSurpriseProject(prev => ({
          ...prev,
          tags: [...prev.tags, ...tags]
        }));
      }
      setSurpriseTagInput("");
    } else {
      setSurpriseTagInput(value);
    }
  };

  const handleRemoveSurpriseTag = (tagToRemove: string) => {
    setNewSurpriseProject(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSaveSurpriseProject = () => {
    if (newSurpriseProject.name && newSurpriseProject.basicBrief && newSurpriseProject.tags.length > 0) {
      if (editingSurpriseId) {
        updateSurpriseProject(editingSurpriseId, newSurpriseProject);
      } else {
        addSurpriseProject(newSurpriseProject);
      }
      setNewSurpriseProject({
        name: "",
        image: "",
        githubLink: "",
        liveLink: "",
        basicBrief: "",
        whyFailed: "",
        externalHelp: "",
        whatYouCanDo: "",
        effortsMade: "",
        category: 'new' as 'new' | 'modified' | 'replicating',
        tags: [],
      });
      setEditingSurpriseId(null);
      setIsSurpriseDialogOpen(false);
    }
  };

  const handleEditSurpriseProject = (project: typeof surpriseProjects[0]) => {
    setNewSurpriseProject({
      name: project.name,
      image: project.image,
      githubLink: project.githubLink,
      liveLink: project.liveLink,
      basicBrief: project.basicBrief,
      whyFailed: project.whyFailed,
      externalHelp: project.externalHelp,
      whatYouCanDo: project.whatYouCanDo,
      effortsMade: project.effortsMade,
      lessonsLearnt: project.lessonsLearnt || "",
      category: project.category,
      tags: project.tags,
    });
    setEditingSurpriseId(project.id);
    setIsSurpriseDialogOpen(true);
  };

  const handleAddCertificateTag = () => {
    if (certificateTagInput.trim() && !newCertificate.tags.includes(certificateTagInput.trim())) {
      setNewCertificate(prev => ({
        ...prev,
        tags: [...prev.tags, certificateTagInput.trim()]
      }));
      setCertificateTagInput("");
    }
  };

  const handleCertificateTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const tags = value.split(',').map(t => t.trim()).filter(t => t && !newCertificate.tags.includes(t));
      if (tags.length > 0) {
        setNewCertificate(prev => ({
          ...prev,
          tags: [...prev.tags, ...tags]
        }));
      }
      setCertificateTagInput("");
    } else {
      setCertificateTagInput(value);
    }
  };

  const handleRemoveCertificateTag = (tagToRemove: string) => {
    setNewCertificate(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSaveCertificate = () => {
    if (newCertificate.name && newCertificate.description && newCertificate.tags.length > 0) {
      if (editingCertificateId) {
        updateCertificate(editingCertificateId, newCertificate);
      } else {
        addCertificate(newCertificate);
      }
      setNewCertificate({
        name: "",
        image: "",
        issuer: "",
        issueDate: "",
        credentialUrl: "",
        description: "",
        tags: [],
      });
      setEditingCertificateId(null);
      setIsCertificateDialogOpen(false);
    }
  };

  const handleEditCertificate = (certificate: typeof certificates[0]) => {
    setNewCertificate({
      name: certificate.name,
      image: certificate.image,
      issuer: certificate.issuer,
      issueDate: certificate.issueDate,
      credentialUrl: certificate.credentialUrl,
      description: certificate.description,
      tags: certificate.tags,
    });
    setEditingCertificateId(certificate.id);
    setIsCertificateDialogOpen(true);
  };

  const handleSaveSkillGroup = () => {
    if (newSkillGroup.name) {
      if (editingGroupId) {
        updateSkillGroup(editingGroupId, newSkillGroup);
      } else {
        addSkillGroup(newSkillGroup);
      }
      setNewSkillGroup({ name: "", color: "#3b82f6", skills: [] });
      setEditingGroupId(null);
      setIsSkillGroupDialogOpen(false);
    }
  };

  const handleEditSkillGroup = (group: typeof skillGroups[0]) => {
    setNewSkillGroup({
      name: group.name,
      color: group.color,
      skills: group.skills,
    });
    setEditingGroupId(group.id);
    setIsSkillGroupDialogOpen(true);
  };

  const handleSaveSkill = () => {
    if (newSkill.name && activeGroupForSkill) {
      if (editingSkillId) {
        updateSkillInGroup(activeGroupForSkill, editingSkillId, newSkill);
      } else {
        addSkillToGroup(activeGroupForSkill, newSkill);
      }
      setNewSkill({ name: "", proficiency: 50 });
      setEditingSkillId(null);
      setActiveGroupForSkill(null);
      setIsAddSkillDialogOpen(false);
    }
  };

  const handleEditSkill = (groupId: string, skill: typeof skillGroups[0]['skills'][0]) => {
    setNewSkill({ name: skill.name, proficiency: skill.proficiency });
    setEditingSkillId(skill.id);
    setActiveGroupForSkill(groupId);
    setIsAddSkillDialogOpen(true);
  };

  const handleAddPlatformTag = () => {
    if (platformTagInput.trim() && !newCodingPlatform.tags.includes(platformTagInput.trim())) {
      setNewCodingPlatform(prev => ({
        ...prev,
        tags: [...prev.tags, platformTagInput.trim()]
      }));
      setPlatformTagInput("");
    }
  };

  const handlePlatformTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const tags = value.split(',').map(t => t.trim()).filter(t => t && !newCodingPlatform.tags.includes(t));
      if (tags.length > 0) {
        setNewCodingPlatform(prev => ({
          ...prev,
          tags: [...prev.tags, ...tags]
        }));
      }
      setPlatformTagInput("");
    } else {
      setPlatformTagInput(value);
    }
  };

  const handleRemovePlatformTag = (tagToRemove: string) => {
    setNewCodingPlatform(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddAchievement = () => {
    if (achievementInput.trim() && !newCodingPlatform.achievements.includes(achievementInput.trim())) {
      setNewCodingPlatform(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()]
      }));
      setAchievementInput("");
    }
  };

  const handleRemoveAchievement = (achievement: string) => {
    setNewCodingPlatform(prev => ({
      ...prev,
      achievements: prev.achievements.filter(a => a !== achievement)
    }));
  };

  const handleSaveCodingPlatform = () => {
    if (newCodingPlatform.name && newCodingPlatform.description && newCodingPlatform.tags.length > 0) {
      if (editingPlatformId) {
        updateCodingPlatform(editingPlatformId, newCodingPlatform);
      } else {
        addCodingPlatform(newCodingPlatform);
      }
      setNewCodingPlatform({
        name: "",
        image: "",
        link: "",
        description: "",
        tags: [],
        level: 'Beginner',
        dateStarted: "",
        frequency: 'Weekly',
        achievements: [],
        timeSpent: undefined,
        category: "",
        rating: undefined,
        goal: "",
      });
      setEditingPlatformId(null);
      setIsCodingPlatformDialogOpen(false);
    }
  };

  const handleEditCodingPlatform = (platform: typeof codingPlatforms[0]) => {
    setNewCodingPlatform({
      name: platform.name,
      image: platform.image,
      link: platform.link,
      description: platform.description,
      tags: platform.tags,
      level: platform.level,
      dateStarted: platform.dateStarted,
      frequency: platform.frequency,
      achievements: platform.achievements,
      timeSpent: platform.timeSpent,
      category: platform.category || "",
      rating: platform.rating,
      goal: platform.goal || "",
    });
    setEditingPlatformId(platform.id);
    setIsCodingPlatformDialogOpen(true);
  };

  const handleAddExperienceSkill = () => {
    if (experienceSkillInput.trim() && !newExperience.skillsGained.includes(experienceSkillInput.trim())) {
      setNewExperience(prev => ({
        ...prev,
        skillsGained: [...prev.skillsGained, experienceSkillInput.trim()]
      }));
      setExperienceSkillInput("");
    }
  };

  const handleRemoveExperienceSkill = (skillToRemove: string) => {
    setNewExperience(prev => ({
      ...prev,
      skillsGained: prev.skillsGained.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAddExperienceAchievement = () => {
    if (experienceAchievementInput.trim() && !newExperience.achievements.includes(experienceAchievementInput.trim())) {
      setNewExperience(prev => ({
        ...prev,
        achievements: [...prev.achievements, experienceAchievementInput.trim()]
      }));
      setExperienceAchievementInput("");
    }
  };

  const handleRemoveExperienceAchievement = (achievement: string) => {
    setNewExperience(prev => ({
      ...prev,
      achievements: prev.achievements.filter(a => a !== achievement)
    }));
  };

  const handleSaveExperience = () => {
    if (newExperience.title && newExperience.organization && newExperience.role) {
      if (editingExperienceId) {
        updateExperience(editingExperienceId, newExperience);
      } else {
        addExperience(newExperience);
      }
      setNewExperience({
        image: "",
        title: "",
        organization: "",
        role: "",
        type: 'Workshop',
        customType: "",
        dateJoined: "",
        dateEnded: "",
        description: "",
        whatYouLearned: "",
        achievements: [],
        skillsGained: [],
        location: "",
        proofLink: "",
        certificateImage: "",
        rating: 3,
        timeSpent: "",
        teamOrSolo: "",
      });
      setEditingExperienceId(null);
      setIsExperienceDialogOpen(false);
    }
  };

  const handleEditExperience = (experience: typeof experiences[0]) => {
    setNewExperience({
      image: experience.image,
      title: experience.title,
      organization: experience.organization,
      role: experience.role,
      type: experience.type,
      customType: experience.customType || "",
      dateJoined: experience.dateJoined,
      dateEnded: experience.dateEnded,
      description: experience.description,
      whatYouLearned: experience.whatYouLearned,
      achievements: experience.achievements,
      skillsGained: experience.skillsGained,
      location: experience.location,
      proofLink: experience.proofLink || "",
      certificateImage: experience.certificateImage || "",
      rating: experience.rating,
      timeSpent: experience.timeSpent,
      teamOrSolo: experience.teamOrSolo || "",
    });
    setEditingExperienceId(experience.id);
    setIsExperienceDialogOpen(true);
  };

  const handleSaveEducation = () => {
    if (newEducation.instituteName && newEducation.degreeOrCourse && newEducation.tag) {
      if (editingEducationId) {
        updateEducation(editingEducationId, newEducation);
      } else {
        addEducation(newEducation);
      }
      setNewEducation({
        image: "",
        tag: "",
        instituteName: "",
        degreeOrCourse: "",
        year: "",
        location: "",
        description: "",
        grade: "",
      });
      setEditingEducationId(null);
      setIsEducationDialogOpen(false);
    }
  };

  const handleEditEducation = (edu: typeof education[0]) => {
    setNewEducation({
      image: edu.image,
      tag: edu.tag,
      instituteName: edu.instituteName,
      degreeOrCourse: edu.degreeOrCourse,
      year: edu.year,
      location: edu.location,
      description: edu.description,
      grade: edu.grade || "",
    });
    setEditingEducationId(edu.id);
    setIsEducationDialogOpen(true);
  };


  return (
    <div className="min-h-screen relative flex">
      <SpaceBackground />
      <Header isAuthenticated username={profileUsername || "User"} profileImage={profileImage} onLogout={handleLogout} />

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 bottom-12 w-64 bg-card/30 backdrop-blur-md border-r border-primary/20 overflow-y-auto z-40">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-primary mb-4">Edit Profile</h2>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveSection("Profile Info")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === "Profile Info"
                ? "bg-primary/20 text-primary border border-primary/50"
                : "text-foreground hover:bg-muted/50"
                }`}
            >
              <User className="w-5 h-5" />
              <span className="flex-1 text-left text-sm">Profile Info</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    } else {
                      setActiveSection(item.label);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "text-foreground hover:bg-muted/50"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 pt-24 pb-20 px-8">
        <div className="w-full max-w-5xl xl:max-w-6xl mx-auto" style={{ zoom: "90%" }}>
          <h1 className="text-4xl font-bold bg-gradient-electric bg-clip-text text-transparent mb-6">
            {activeSection}
          </h1>

          <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-8">
            {activeSection === "Profile Info" ? (
              <div className="space-y-8">
                {/* Profile Photo Section */}
                <div className="flex flex-col items-center">
                  <h2 className="text-xl font-semibold text-primary mb-6">Profile Photo</h2>
                  <div className="relative group">
                    <Avatar className="w-32 h-32 border-4 border-primary/50">
                      <AvatarImage src={profileImage} />
                      <AvatarFallback className="bg-muted text-4xl">
                        {name ? name.charAt(0).toUpperCase() : <User className="w-16 h-16" />}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-3 shadow-glow-primary hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary"
                      tabIndex={0}
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Click the camera icon to upload a photo
                  </p>
                </div>

                {/* Personal Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-primary">Personal Information</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tagline">Tagline</Label>
                      <Textarea
                        id="tagline"
                        placeholder="Your professional tagline"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        className="bg-input border-border min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-primary">Social Links</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub URL</Label>
                      <Input
                        id="github"
                        type="url"
                        placeholder="https://github.com/yourusername"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="bg-input border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <Input
                        id="linkedin"
                        type="url"
                        placeholder="https://linkedin.com/in/yourusername"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-primary hover:shadow-glow-primary"
                >
                  Save & View Profile
                </Button>
              </div>
            ) : activeSection === "Projects" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-primary">My Projects</h2>
                  <Dialog open={isProjectDialogOpen} onOpenChange={(open) => {
                    setIsProjectDialogOpen(open);
                    if (!open) {
                      setEditingProjectId(null);
                      setNewProject({
                        name: "",
                        image: "",
                        githubLink: "",
                        liveLink: "",
                        description: "",
                        tags: [],
                        featured: false,
                      });
                      setTagInput("");
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:shadow-glow-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingProjectId ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                        <DialogDescription>
                          Fill in the details about your project
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="project-name">Project Name *</Label>
                          <Input
                            id="project-name"
                            placeholder="Enter project name..."
                            value={newProject.name}
                            onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-input border-border"
                            required
                          />
                        </div>

                        <ImageUploadZone label="Project Image" value={newProject.image} onChange={(val) => setNewProject(p => ({ ...p, image: val }))} onRemove={() => setNewProject(p => ({ ...p, image: "" }))} />

                        <div className="space-y-2">
                          <Label htmlFor="project-description">Description</Label>
                          <Textarea
                            id="project-description"
                            placeholder="Describe your project..."
                            value={newProject.description}
                            onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                            className="bg-input border-border min-h-[100px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="project-github">GitHub Repository Link (Optional)</Label>
                          <Input
                            id="project-github"
                            type="url"
                            placeholder="https://github.com/username/repo"
                            value={newProject.githubLink}
                            onChange={(e) => setNewProject(prev => ({ ...prev, githubLink: e.target.value }))}
                            className="bg-input border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="project-live">Live Demo Link (Optional)</Label>
                          <Input
                            id="project-live"
                            type="url"
                            placeholder="https://yourproject.com"
                            value={newProject.liveLink}
                            onChange={(e) => setNewProject(prev => ({ ...prev, liveLink: e.target.value }))}
                            className="bg-input border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="project-tags">Tags</Label>
                          <div className="flex gap-2">
                            <Input
                              id="project-tags"
                              type="text"
                              placeholder="Add a tag (separate with commas)..."
                              value={tagInput}
                              onChange={handleTagInputChange}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                              className="bg-input border-border"
                            />
                            <Button type="button" onClick={handleAddTag} size="sm">
                              Add
                            </Button>
                          </div>
                          {newProject.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {newProject.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="gap-1">
                                  {tag}
                                  <button
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="project-featured"
                            checked={newProject.featured}
                            onChange={(e) => setNewProject(prev => ({ ...prev, featured: e.target.checked }))}
                            className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                          />
                          <Label htmlFor="project-featured" className="cursor-pointer">
                            Mark as Featured
                          </Label>
                        </div>

                        <Button
                          onClick={handleSaveProject}
                          className="w-full bg-primary hover:shadow-glow-primary"
                          disabled={!newProject.name || !newProject.description || newProject.tags.length === 0}
                        >
                          {editingProjectId ? 'Update Project' : 'Save Project'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {projects.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground mb-2">No projects yet</p>
                    <p className="text-sm text-muted-foreground">Click the Add Project button to get started</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {projects.map((project, index) => (
                      <Card 
                        key={project.id} 
                        className={`overflow-hidden border-primary/20 cursor-move transition-transform ${draggedItemIndex === index && draggedItemType === 'projects' ? 'opacity-50 scale-95' : ''} ${draggedOverIndex === index && draggedItemType === 'projects' && draggedItemIndex !== index ? 'border-primary border-2 scale-105' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStartCards(e, index, 'projects')}
                        onDragEnter={(e) => handleDragEnterCards(e, index, 'projects')}
                        onDragEnd={(e) => handleDragEndCards(e, 'projects', projects, setProjects)}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <CardContent className="p-0">
                          {project.image && (
                            <div className="w-full h-48 overflow-hidden">
                              <img src={project.image} alt="Project" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="p-4 space-y-3">
                            <div className="flex items-center gap-2">
                              {project.name && (
                                <h3 className="text-lg font-semibold" style={{ color: '#ff914d' }}>
                                  {project.name}
                                </h3>
                              )}
                              {project.featured && (
                                <span className="px-2 py-0.5 rounded text-white font-bold text-[10px] tracking-widest uppercase bg-gradient-to-r from-[#22d3ee] via-[#8b5cf6] to-[#c084fc] shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                                  FEATURED
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-foreground">{project.description}</p>

                            {project.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-3 pt-2">
                              {project.githubLink && (
                                <a
                                  href={project.githubLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                                >
                                  <Github className="w-4 h-4" />
                                  GitHub
                                </a>
                              )}
                              {project.liveLink && (
                                <a
                                  href={project.liveLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Live Demo
                                </a>
                              )}
                              <button
                                onClick={() => handleEditProject(project)}
                                className="ml-auto text-sm text-primary hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeProject(project.id)}
                                className="text-sm text-destructive hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : activeSection === "Surprise Projects" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-primary">Surprise Projects</h2>
                  <Dialog open={isSurpriseDialogOpen} onOpenChange={(open) => {
                    setIsSurpriseDialogOpen(open);
                    if (!open) {
                      setEditingSurpriseId(null);
                      setNewSurpriseProject({
                        name: "",
                        image: "",
                        githubLink: "",
                        liveLink: "",
                        basicBrief: "",
                        whyFailed: "",
                        externalHelp: "",
                        whatYouCanDo: "",
                        effortsMade: "",
                        lessonsLearnt: "",
                        category: 'new' as 'new' | 'modified' | 'replicating',
                        tags: [],
                      });
                      setSurpriseTagInput("");
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:shadow-glow-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Surprise Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingSurpriseId ? 'Edit Surprise Project' : 'Add New Surprise Project'}</DialogTitle>
                        <DialogDescription>
                          Fill in the details about your surprise project
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="surprise-project-name">Project Name *</Label>
                          <Input
                            id="surprise-project-name"
                            placeholder="Enter project name..."
                            value={newSurpriseProject.name}
                            onChange={(e) => setNewSurpriseProject(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-input border-border"
                            required
                          />
                        </div>

                        <ImageUploadZone label="Project Image" value={newSurpriseProject.image} onChange={(val) => setNewSurpriseProject(p => ({ ...p, image: val }))} onRemove={() => setNewSurpriseProject(p => ({ ...p, image: "" }))} />

                        <div className="space-y-2 mt-4">
                          <Label>Project Category *</Label>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={newSurpriseProject.category === 'new' ? 'default' : 'outline'}
                              className={newSurpriseProject.category === 'new' ? 'bg-red-500 hover:bg-red-600 border-red-500' : 'border-red-500 text-red-500 hover:bg-red-50'}
                              onClick={() => setNewSurpriseProject({ ...newSurpriseProject, category: 'new' })}
                            >
                              🔴 Completely New
                            </Button>
                            <Button
                              type="button"
                              variant={newSurpriseProject.category === 'modified' ? 'default' : 'outline'}
                              className={newSurpriseProject.category === 'modified' ? 'bg-orange-500 hover:bg-orange-600 border-orange-500' : 'border-orange-500 text-orange-500 hover:bg-orange-50'}
                              onClick={() => setNewSurpriseProject({ ...newSurpriseProject, category: 'modified' })}
                            >
                              🟠 Modified & Inspired
                            </Button>
                            <Button
                              type="button"
                              variant={newSurpriseProject.category === 'replicating' ? 'default' : 'outline'}
                              className={newSurpriseProject.category === 'replicating' ? 'bg-blue-500 hover:bg-blue-600 border-blue-500' : 'border-blue-500 text-blue-500 hover:bg-blue-50'}
                              onClick={() => setNewSurpriseProject({ ...newSurpriseProject, category: 'replicating' })}
                            >
                              🔵 Replicating & Learning
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="surprise-basic-brief">1️⃣ Basic Brief</Label>
                          <Textarea
                            id="surprise-basic-brief"
                            placeholder="A short summary of the project idea..."
                            value={newSurpriseProject.basicBrief}
                            onChange={(e) => setNewSurpriseProject(prev => ({ ...prev, basicBrief: e.target.value }))}
                            className="bg-input border-border min-h-[80px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="surprise-why-failed">2️⃣ Current Status</Label>
                          <Textarea
                            id="surprise-why-failed"
                            placeholder="Current status of the project..."
                            value={newSurpriseProject.whyFailed}
                            onChange={(e) => setNewSurpriseProject(prev => ({ ...prev, whyFailed: e.target.value }))}
                            className="bg-input border-border min-h-[80px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="surprise-external-help">3️⃣ Improvision</Label>
                          <Textarea
                            id="surprise-external-help"
                            placeholder="Describe any improvisations..."
                            value={newSurpriseProject.externalHelp}
                            onChange={(e) => setNewSurpriseProject(prev => ({ ...prev, externalHelp: e.target.value }))}
                            className="bg-input border-border min-h-[80px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="surprise-efforts-made">4️⃣ Efforts Made</Label>
                          <Textarea
                            id="surprise-efforts-made"
                            placeholder="Describe your efforts..."
                            value={newSurpriseProject.effortsMade}
                            onChange={(e) => setNewSurpriseProject(prev => ({ ...prev, effortsMade: e.target.value }))}
                            className="bg-input border-border min-h-[80px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="surprise-lessons-learnt">5️⃣ Key Learnings</Label>
                          <Textarea
                            id="surprise-lessons-learnt"
                            placeholder="What were your main takeaways or lessons learnt?"
                            value={newSurpriseProject.lessonsLearnt || ""}
                            onChange={(e) => setNewSurpriseProject(prev => ({ ...prev, lessonsLearnt: e.target.value }))}
                            className="bg-input border-border min-h-[80px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="surprise-github">GitHub Repository Link (Optional)</Label>
                          <Input
                            id="surprise-github"
                            type="url"
                            placeholder="https://github.com/username/repo"
                            value={newSurpriseProject.githubLink}
                            onChange={(e) => setNewSurpriseProject(prev => ({ ...prev, githubLink: e.target.value }))}
                            className="bg-input border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="surprise-live">Live Demo Link (Optional)</Label>
                          <Input
                            id="surprise-live"
                            type="url"
                            placeholder="https://yourproject.com"
                            value={newSurpriseProject.liveLink}
                            onChange={(e) => setNewSurpriseProject(prev => ({ ...prev, liveLink: e.target.value }))}
                            className="bg-input border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="surprise-tags">Tags</Label>
                          <div className="flex gap-2">
                            <Input
                              id="surprise-tags"
                              type="text"
                              placeholder="Add a tag (separate with commas)..."
                              value={surpriseTagInput}
                              onChange={handleSurpriseTagInputChange}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSurpriseTag())}
                              className="bg-input border-border"
                            />
                            <Button type="button" onClick={handleAddSurpriseTag} size="sm">
                              Add
                            </Button>
                          </div>
                          {newSurpriseProject.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {newSurpriseProject.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="gap-1">
                                  {tag}
                                  <button
                                    onClick={() => handleRemoveSurpriseTag(tag)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={handleSaveSurpriseProject}
                          className="w-full bg-primary hover:shadow-glow-primary"
                          disabled={!newSurpriseProject.name || !newSurpriseProject.basicBrief || newSurpriseProject.tags.length === 0}
                        >
                          {editingSurpriseId ? 'Update Project' : 'Save Project'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {surpriseProjects.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground mb-2">No surprise projects yet</p>
                    <p className="text-sm text-muted-foreground">Click the Add Surprise Project button to get started</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {surpriseProjects.map((project, index) => (
                      <Card 
                        key={project.id} 
                        className={`overflow-hidden border-primary/20 cursor-move transition-transform ${draggedItemIndex === index && draggedItemType === 'surpriseProjects' ? 'opacity-50 scale-95' : ''} ${draggedOverIndex === index && draggedItemType === 'surpriseProjects' && draggedItemIndex !== index ? 'border-primary border-2 scale-105' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStartCards(e, index, 'surpriseProjects')}
                        onDragEnter={(e) => handleDragEnterCards(e, index, 'surpriseProjects')}
                        onDragEnd={(e) => handleDragEndCards(e, 'surpriseProjects', surpriseProjects, setSurpriseProjects)}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <CardContent className="p-0">
                          {project.image && (
                            <div className="w-full h-48 overflow-hidden relative">
                              <img src={project.image} alt="Project" className="w-full h-full object-contain bg-muted/20" />
                              <div className="absolute top-2 left-2">
                                <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${project.category === 'new' ? 'bg-red-500' :
                                  project.category === 'modified' ? 'bg-orange-500' :
                                    'bg-blue-500'
                                  }`}>
                                  {project.category === 'new' ? '🔴 Completely New' :
                                    project.category === 'modified' ? '🟠 Modified & Inspired' :
                                      '🔵 Replicating & Learning'}
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="p-4 space-y-3">
                            {project.name && (
                              <h3 className="text-lg font-semibold mb-2" style={{ color: '#ff914d' }}>
                                {project.name}
                              </h3>
                            )}
                            {project.basicBrief && (
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-primary">Basic Brief</p>
                                <p className="text-sm text-foreground">{project.basicBrief}</p>
                              </div>
                            )}
                            {project.whyFailed && (
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-primary">Current Status</p>
                                <p className="text-sm text-foreground">{project.whyFailed}</p>
                              </div>
                            )}
                            {project.externalHelp && (
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-primary">Improvision</p>
                                <p className="text-sm text-foreground">{project.externalHelp}</p>
                              </div>
                            )}
                            {project.effortsMade && (
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-primary">Efforts Made</p>
                                <p className="text-sm text-foreground">{project.effortsMade}</p>
                              </div>
                            )}
                            {project.lessonsLearnt && (
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-primary">Key Learnings</p>
                                <p className="text-sm text-foreground">{project.lessonsLearnt}</p>
                              </div>
                            )}

                            {project.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-3 pt-2">
                              {project.githubLink && (
                                <a
                                  href={project.githubLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                                >
                                  <Github className="w-4 h-4" />
                                  GitHub
                                </a>
                              )}
                              {project.liveLink && (
                                <a
                                  href={project.liveLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Live Demo
                                </a>
                              )}
                              <button
                                onClick={() => handleEditSurpriseProject(project)}
                                className="ml-auto text-sm text-primary hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeSurpriseProject(project.id)}
                                className="text-sm text-destructive hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : activeSection === "Certificates" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-primary">My Certificates</h2>
                  <Dialog open={isCertificateDialogOpen} onOpenChange={(open) => {
                    setIsCertificateDialogOpen(open);
                    if (!open) {
                      setEditingCertificateId(null);
                      setNewCertificate({
                        name: "",
                        image: "",
                        issuer: "",
                        issueDate: "",
                        credentialUrl: "",
                        description: "",
                        tags: [],
                      });
                      setCertificateTagInput("");
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:shadow-glow-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Certificate
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingCertificateId ? 'Edit Certificate' : 'Add New Certificate'}</DialogTitle>
                        <DialogDescription>
                          Fill in the details about your certificate
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="certificate-name">Certificate Name *</Label>
                          <Input
                            id="certificate-name"
                            placeholder="Enter certificate name..."
                            value={newCertificate.name}
                            onChange={(e) => setNewCertificate(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-input border-border"
                            required
                          />
                        </div>

                        <ImageUploadZone 
                          label="Certificate Image" 
                          value={newCertificate.image} 
                          onChange={(val) => setNewCertificate(prev => ({ ...prev, image: val }))} 
                          onRemove={() => setNewCertificate(prev => ({ ...prev, image: "" }))} 
                        />

                        <div className="space-y-2">
                          <Label htmlFor="certificate-issuer">Issuer</Label>
                          <Input
                            id="certificate-issuer"
                            type="text"
                            placeholder="Organization name"
                            value={newCertificate.issuer}
                            onChange={(e) => setNewCertificate(prev => ({ ...prev, issuer: e.target.value }))}
                            className="bg-input border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="certificate-date">Issue Date</Label>
                          <Input
                            id="certificate-date"
                            type="date"
                            value={newCertificate.issueDate}
                            onChange={(e) => setNewCertificate(prev => ({ ...prev, issueDate: e.target.value }))}
                            className="bg-input border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="certificate-url">Credential URL (Optional)</Label>
                          <Input
                            id="certificate-url"
                            type="url"
                            placeholder="https://credential-url.com"
                            value={newCertificate.credentialUrl}
                            onChange={(e) => setNewCertificate(prev => ({ ...prev, credentialUrl: e.target.value }))}
                            className="bg-input border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="certificate-description">Description</Label>
                          <Textarea
                            id="certificate-description"
                            placeholder="Describe your certificate..."
                            value={newCertificate.description}
                            onChange={(e) => setNewCertificate(prev => ({ ...prev, description: e.target.value }))}
                            className="bg-input border-border min-h-[100px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="certificate-tags">Tags</Label>
                          <div className="flex gap-2">
                            <Input
                              id="certificate-tags"
                              type="text"
                              placeholder="Add a tag (separate with commas)..."
                              value={certificateTagInput}
                              onChange={handleCertificateTagInputChange}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCertificateTag())}
                              className="bg-input border-border"
                            />
                            <Button type="button" onClick={handleAddCertificateTag} size="sm">
                              Add
                            </Button>
                          </div>
                          {newCertificate.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {newCertificate.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="gap-1">
                                  {tag}
                                  <button
                                    onClick={() => handleRemoveCertificateTag(tag)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={handleSaveCertificate}
                          className="w-full bg-primary hover:shadow-glow-primary"
                          disabled={!newCertificate.name || !newCertificate.description || newCertificate.tags.length === 0}
                        >
                          {editingCertificateId ? 'Update Certificate' : 'Save Certificate'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {certificates.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground mb-2">No certificates yet</p>
                    <p className="text-sm text-muted-foreground">Click the Add Certificate button to get started</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {certificates.map((certificate, index) => (
                      <Card 
                        key={certificate.id} 
                        className={`overflow-hidden border-primary/20 cursor-move transition-transform ${draggedItemIndex === index && draggedItemType === 'certificates' ? 'opacity-50 scale-95' : ''} ${draggedOverIndex === index && draggedItemType === 'certificates' && draggedItemIndex !== index ? 'border-primary border-2 scale-105' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStartCards(e, index, 'certificates')}
                        onDragEnter={(e) => handleDragEnterCards(e, index, 'certificates')}
                        onDragEnd={(e) => handleDragEndCards(e, 'certificates', certificates, setCertificates)}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <CardContent className="p-0">
                          {certificate.image && (
                            <div className="w-full h-48 overflow-hidden">
                              <img src={certificate.image} alt="Certificate" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="p-4 space-y-3">
                            {certificate.name && (
                              <h3 className="text-lg font-semibold mb-2" style={{ color: '#ff914d' }}>
                                {certificate.name}
                              </h3>
                            )}
                            {certificate.issuer && (
                              <p className="text-sm font-semibold text-primary">{certificate.issuer}</p>
                            )}
                            {certificate.issueDate && (
                              <p className="text-xs text-muted-foreground">{certificate.issueDate}</p>
                            )}
                            <p className="text-sm text-foreground">{certificate.description}</p>

                            {certificate.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {certificate.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-3 pt-2">
                              {certificate.credentialUrl && (
                                <a
                                  href={certificate.credentialUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Credential
                                </a>
                              )}
                              <button
                                onClick={() => handleEditCertificate(certificate)}
                                className="ml-auto text-sm text-primary hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeCertificate(certificate.id)}
                                className="text-sm text-destructive hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : activeSection === "Skills and Expertise" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-primary">Skills and Expertise</h2>
                  <Dialog open={isSkillGroupDialogOpen} onOpenChange={(open) => {
                    setIsSkillGroupDialogOpen(open);
                    if (!open) {
                      setEditingGroupId(null);
                      setNewSkillGroup({ name: "", color: "#3b82f6", skills: [] });
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:shadow-glow-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Skill Group
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{editingGroupId ? 'Edit Skill Group' : 'Add New Skill Group'}</DialogTitle>
                        <DialogDescription>
                          Create a color-coded group for related skills
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="group-name">Group Name</Label>
                          <Input
                            id="group-name"
                            type="text"
                            placeholder="e.g., Frontend, Backend, Design..."
                            value={newSkillGroup.name}
                            onChange={(e) => setNewSkillGroup(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-input border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="group-color">Group Color</Label>
                          <div className="flex gap-3 items-center">
                            <input
                              id="group-color"
                              type="color"
                              value={newSkillGroup.color}
                              onChange={(e) => setNewSkillGroup(prev => ({ ...prev, color: e.target.value }))}
                              className="h-10 w-20 rounded border border-border cursor-pointer"
                            />
                            <span className="text-sm text-muted-foreground">{newSkillGroup.color}</span>
                          </div>
                        </div>
                        <Button
                          onClick={handleSaveSkillGroup}
                          className="w-full bg-primary hover:shadow-glow-primary"
                          disabled={!newSkillGroup.name}
                        >
                          {editingGroupId ? 'Update Group' : 'Create Group'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {skillGroups.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground mb-2">No skill groups yet</p>
                    <p className="text-sm text-muted-foreground">Click the Add Skill Group button to get started</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {skillGroups.map((group, index) => (
                      <Card 
                        key={group.id} 
                        className={`border-primary/20 cursor-move transition-transform ${draggedItemIndex === index && draggedItemType === 'skillGroups' ? 'opacity-50 scale-95' : ''} ${draggedOverIndex === index && draggedItemType === 'skillGroups' && draggedItemIndex !== index ? 'border-primary border-2 scale-105' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStartCards(e, index, 'skillGroups')}
                        onDragEnter={(e) => handleDragEnterCards(e, index, 'skillGroups')}
                        onDragEnd={(e) => handleDragEndCards(e, 'skillGroups', skillGroups, setSkillGroups)}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: group.color }}
                              />
                              <h3 className="text-lg font-semibold">{group.name}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setActiveGroupForSkill(group.id);
                                  setIsAddSkillDialogOpen(true);
                                }}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Skill
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditSkillGroup(group)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeSkillGroup(group.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>

                          {group.skills.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No skills in this group. Click Add Skill to get started.
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {group.skills.map((skill) => (
                                <div key={skill.id} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{skill.name}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-muted-foreground">{skill.proficiency}%</span>
                                      <button
                                        onClick={() => handleEditSkill(group.id, skill)}
                                        className="text-xs text-primary hover:underline"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => removeSkillFromGroup(group.id, skill.id)}
                                        className="text-xs text-destructive hover:underline"
                                      >
                                        Remove
                                      </button>
                                    </div>
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <Dialog open={isAddSkillDialogOpen} onOpenChange={(open) => {
                  setIsAddSkillDialogOpen(open);
                  if (!open) {
                    setNewSkill({ name: "", proficiency: 50 });
                    setEditingSkillId(null);
                    setActiveGroupForSkill(null);
                  }
                }}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingSkillId ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
                      <DialogDescription>
                        Add a skill and set your proficiency level
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="skill-name">Skill Name</Label>
                        <Input
                          id="skill-name"
                          type="text"
                          placeholder="e.g., React, TypeScript..."
                          value={newSkill.name}
                          onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="skill-proficiency">Proficiency Level: {newSkill.proficiency}%</Label>
                        <Slider
                          id="skill-proficiency"
                          min={0}
                          max={100}
                          step={5}
                          value={[newSkill.proficiency]}
                          onValueChange={(value) => setNewSkill(prev => ({ ...prev, proficiency: value[0] }))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Beginner</span>
                          <span>Expert</span>
                        </div>
                      </div>
                      <Button
                        onClick={handleSaveSkill}
                        className="w-full bg-primary hover:shadow-glow-primary"
                        disabled={!newSkill.name}
                      >
                        {editingSkillId ? 'Update Skill' : 'Add Skill'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : activeSection === "Experience (XP)" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-primary">Experience (XP)</h2>
                  <Dialog open={isExperienceDialogOpen} onOpenChange={(open) => {
                    setIsExperienceDialogOpen(open);
                    if (!open) {
                      setEditingExperienceId(null);
                      setNewExperience({
                        image: "",
                        title: "",
                        organization: "",
                        role: "",
                        type: 'Workshop',
                        customType: "",
                        dateJoined: "",
                        dateEnded: "",
                        description: "",
                        whatYouLearned: "",
                        achievements: [],
                        skillsGained: [],
                        location: "",
                        proofLink: "",
                        certificateImage: "",
                        rating: 3,
                        timeSpent: "",
                        teamOrSolo: "",
                      });
                      setExperienceSkillInput("");
                      setExperienceAchievementInput("");
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:shadow-glow-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Experience
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingExperienceId ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
                        <DialogDescription>
                          Fill in the details about your professional or learning experience
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 col-span-2">
                            <ImageUploadZone 
                              label="Image/Logo" 
                              value={newExperience.image} 
                              onChange={(val) => setNewExperience(prev => ({ ...prev, image: val }))} 
                              onRemove={() => setNewExperience(prev => ({ ...prev, image: "" }))} 
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="exp-title">Title *</Label>
                            <Input
                              id="exp-title"
                              placeholder="Workshop/Event/Job Role Name"
                              value={newExperience.title}
                              onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                              className="bg-input border-border"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="exp-organization">Organization *</Label>
                            <Input
                              id="exp-organization"
                              placeholder="Company/Institution Name"
                              value={newExperience.organization}
                              onChange={(e) => setNewExperience(prev => ({ ...prev, organization: e.target.value }))}
                              className="bg-input border-border"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="exp-role">Role *</Label>
                            <Input
                              id="exp-role"
                              placeholder="Your role or position"
                              value={newExperience.role}
                              onChange={(e) => setNewExperience(prev => ({ ...prev, role: e.target.value }))}
                              className="bg-input border-border"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="exp-type">Type</Label>
                            <select
                              id="exp-type"
                              value={newExperience.type}
                              onChange={(e) => setNewExperience(prev => ({ ...prev, type: e.target.value as any, customType: e.target.value === 'Custom' ? prev.customType : '' }))}
                              className="w-full h-10 rounded-md border border-border bg-input px-3"
                            >
                              <option value="Workshop">Workshop</option>
                              <option value="Event">Event</option>
                              <option value="Internship">Internship</option>
                              <option value="Job">Job</option>
                              <option value="Custom">Custom</option>
                            </select>
                            {newExperience.type === 'Custom' && (
                              <Input
                                id="exp-customType"
                                placeholder="Enter custom type..."
                                value={newExperience.customType}
                                onChange={(e) => setNewExperience(prev => ({ ...prev, customType: e.target.value }))}
                                className="bg-input border-border mt-2"
                              />
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="exp-dateJoined">Date Joined</Label>
                            <Input
                              id="exp-dateJoined"
                              type="date"
                              value={newExperience.dateJoined}
                              onChange={(e) => setNewExperience(prev => ({ ...prev, dateJoined: e.target.value }))}
                              className="bg-input border-border"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="exp-dateEnded">Date Ended</Label>
                            <Input
                              id="exp-dateEnded"
                              type="date"
                              value={newExperience.dateEnded}
                              onChange={(e) => setNewExperience(prev => ({ ...prev, dateEnded: e.target.value }))}
                              className="bg-input border-border"
                            />
                          </div>

                          <div className="space-y-2 col-span-2">
                            <Label htmlFor="exp-location">Location</Label>
                            <Input
                              id="exp-location"
                              placeholder="City, Country or Remote"
                              value={newExperience.location}
                              onChange={(e) => setNewExperience(prev => ({ ...prev, location: e.target.value }))}
                              className="bg-input border-border"
                            />
                          </div>

                          <div className="space-y-2 col-span-2">
                            <Label htmlFor="exp-description">Description</Label>
                            <Textarea
                              id="exp-description"
                              placeholder="Describe your experience..."
                              value={newExperience.description}
                              onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                              className="min-h-[80px] bg-input border-border"
                            />
                          </div>

                          <div className="space-y-2 col-span-2">
                            <Label htmlFor="exp-learned">What You Learned</Label>
                            <Textarea
                              id="exp-learned"
                              placeholder="Key learnings and takeaways..."
                              value={newExperience.whatYouLearned}
                              onChange={(e) => setNewExperience(prev => ({ ...prev, whatYouLearned: e.target.value }))}
                              className="min-h-[80px] bg-input border-border"
                            />
                          </div>

                          <div className="space-y-2 col-span-2">
                            <Label>Skills Gained</Label>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a skill"
                                value={experienceSkillInput}
                                onChange={(e) => setExperienceSkillInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExperienceSkill())}
                                className="bg-input border-border"
                              />
                              <Button
                                type="button"
                                onClick={handleAddExperienceSkill}
                                size="sm"
                                className="bg-primary hover:shadow-glow-primary"
                              >
                                Add
                              </Button>
                            </div>
                            {newExperience.skillsGained.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {newExperience.skillsGained.map((skill) => (
                                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                                    {skill}
                                    <button
                                      onClick={() => handleRemoveExperienceSkill(skill)}
                                      className="ml-1 hover:text-destructive"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2 col-span-2">
                            <Label>Achievements (Optional)</Label>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add an achievement"
                                value={experienceAchievementInput}
                                onChange={(e) => setExperienceAchievementInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExperienceAchievement())}
                                className="bg-input border-border"
                              />
                              <Button
                                type="button"
                                onClick={handleAddExperienceAchievement}
                                size="sm"
                                className="bg-primary hover:shadow-glow-primary"
                              >
                                Add
                              </Button>
                            </div>
                            {newExperience.achievements.length > 0 && (
                              <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                                {newExperience.achievements.map((achievement, index) => (
                                  <li key={index} className="flex items-center justify-between">
                                    <span>{achievement}</span>
                                    <button
                                      onClick={() => handleRemoveExperienceAchievement(achievement)}
                                      className="text-destructive hover:underline text-xs"
                                    >
                                      Remove
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="exp-rating">Rating (1-5)</Label>
                            <Input
                              id="exp-rating"
                              type="number"
                              min="1"
                              max="5"
                              value={newExperience.rating}
                              onChange={(e) => setNewExperience(prev => ({ ...prev, rating: parseInt(e.target.value) || 3 }))}
                              className="bg-input border-border"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="exp-timeSpent">Time Spent</Label>
                            <Input
                              id="exp-timeSpent"
                              type="text"
                              placeholder="e.g., 2 weeks, 40 hours, 3 months"
                              value={newExperience.timeSpent}
                              onChange={(e) => setNewExperience(prev => ({ ...prev, timeSpent: e.target.value }))}
                              className="bg-input border-border"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="exp-teamOrSolo">Team or Solo (Optional)</Label>
                            <Input
                              id="exp-teamOrSolo"
                              placeholder="e.g., Team of 5, Solo"
                              value={newExperience.teamOrSolo}
                              onChange={(e) => setNewExperience(prev => ({ ...prev, teamOrSolo: e.target.value }))}
                              className="bg-input border-border"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="exp-proofLink">Proof Link (Optional)</Label>
                            <Input
                              id="exp-proofLink"
                              type="url"
                              placeholder="https://..."
                              value={newExperience.proofLink}
                              onChange={(e) => setNewExperience(prev => ({ ...prev, proofLink: e.target.value }))}
                              className="bg-input border-border"
                            />
                          </div>

                          <div className="space-y-2 col-span-2">
                            <Label htmlFor="exp-certificateImage">Certificate Image URL (Optional)</Label>
                            <Input
                              id="exp-certificateImage"
                              type="url"
                              placeholder="https://..."
                              value={newExperience.certificateImage}
                              onChange={(e) => setNewExperience(prev => ({ ...prev, certificateImage: e.target.value }))}
                              className="bg-input border-border"
                            />
                          </div>
                        </div>

                        <Button
                          onClick={handleSaveExperience}
                          className="w-full bg-primary hover:shadow-glow-primary"
                          disabled={!newExperience.title || !newExperience.organization || !newExperience.role}
                        >
                          {editingExperienceId ? 'Update Experience' : 'Add Experience'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {experiences.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No experiences yet. Add your first experience!</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {experiences.map((experience, index) => (
                      <Card 
                        key={experience.id} 
                        className={`overflow-hidden hover:shadow-lg transition-all cursor-move ${draggedItemIndex === index && draggedItemType === 'experiences' ? 'opacity-50 scale-[0.98]' : ''} ${draggedOverIndex === index && draggedItemType === 'experiences' && draggedItemIndex !== index ? 'border-primary border-2 scale-[1.02]' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStartCards(e, index, 'experiences')}
                        onDragEnter={(e) => handleDragEnterCards(e, index, 'experiences')}
                        onDragEnd={(e) => handleDragEndCards(e, 'experiences', experiences, setExperiences)}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {experience.image && (
                              <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-border">
                                <img
                                  src={experience.image}
                                  alt={experience.title}
                                  className="w-full h-full object-contain bg-muted"
                                />
                              </div>
                            )}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-xl font-semibold text-primary">{experience.title}</h3>
                                  <p className="text-sm text-muted-foreground">{experience.organization} · {experience.role}</p>
                                </div>
                                <Badge variant="outline">{experience.type === 'Custom' ? (experience.customType || 'Custom') : experience.type}</Badge>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {experience.dateJoined && experience.dateEnded && (
                                  <span>📅 {experience.dateJoined} → {experience.dateEnded}</span>
                                )}
                                {experience.location && <span>📍 {experience.location}</span>}
                                {experience.timeSpent && <span>⏱️ {experience.timeSpent}</span>}
                                {experience.rating && (
                                  <span>⭐ {experience.rating}/5</span>
                                )}
                              </div>

                              {experience.description && (
                                <p className="text-sm text-foreground">{experience.description}</p>
                              )}

                              {experience.whatYouLearned && (
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-primary">What You Learned</p>
                                  <p className="text-sm text-foreground">{experience.whatYouLearned}</p>
                                </div>
                              )}

                              {experience.achievements.length > 0 && (
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-primary">Achievements</p>
                                  <ul className="text-sm text-foreground list-disc list-inside space-y-1">
                                    {experience.achievements.map((achievement, index) => (
                                      <li key={index}>{achievement}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {experience.skillsGained.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {experience.skillsGained.map((skill) => (
                                    <Badge key={skill} variant="secondary">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {experience.teamOrSolo && (
                                <p className="text-sm text-muted-foreground">👥 {experience.teamOrSolo}</p>
                              )}

                              <div className="flex items-center gap-3 pt-2">
                                {experience.proofLink && (
                                  <a
                                    href={experience.proofLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    View Proof
                                  </a>
                                )}
                                {experience.certificateImage && (
                                  <a
                                    href={experience.certificateImage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                                  >
                                    <Award className="w-4 h-4" />
                                    Certificate
                                  </a>
                                )}
                                <button
                                  onClick={() => handleEditExperience(experience)}
                                  className="ml-auto text-sm text-primary hover:underline"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => removeExperience(experience.id)}
                                  className="text-sm text-destructive hover:underline"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : activeSection === "Coding Platform" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-primary">Coding Platforms</h2>
                  <Dialog open={isCodingPlatformDialogOpen} onOpenChange={(open) => {
                    setIsCodingPlatformDialogOpen(open);
                    if (!open) {
                      setEditingPlatformId(null);
                      setNewCodingPlatform({
                        name: "",
                        image: "",
                        link: "",
                        description: "",
                        tags: [],
                        level: 'Beginner',
                        dateStarted: "",
                        frequency: 'Weekly',
                        achievements: [],
                        timeSpent: undefined,
                        category: "",
                        rating: undefined,
                        goal: "",
                      });
                      setPlatformTagInput("");
                      setAchievementInput("");
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:shadow-glow-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Platform
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingPlatformId ? 'Edit Coding Platform' : 'Add New Coding Platform'}</DialogTitle>
                        <DialogDescription>
                          Fill in the details about your coding platform experience
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="platform-name">Platform Name *</Label>
                          <Input
                            id="platform-name"
                            placeholder="Enter platform name (e.g., LeetCode, HackerRank)..."
                            value={newCodingPlatform.name}
                            onChange={(e) => setNewCodingPlatform(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-input border-border"
                            required
                          />
                        </div>

                        <ImageUploadZone 
                          label="Platform Logo/Image" 
                          value={newCodingPlatform.image} 
                          onChange={(val) => setNewCodingPlatform(prev => ({ ...prev, image: val }))} 
                          onRemove={() => setNewCodingPlatform(prev => ({ ...prev, image: "" }))} 
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="platform-link">Platform Link *</Label>
                            <Input
                              id="platform-link"
                              type="url"
                              placeholder="https://leetcode.com/yourprofile"
                              value={newCodingPlatform.link}
                              onChange={(e) => setNewCodingPlatform(prev => ({ ...prev, link: e.target.value }))}
                              className="bg-input border-border"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="platform-level">Level *</Label>
                            <select
                              id="platform-level"
                              value={newCodingPlatform.level}
                              onChange={(e) => setNewCodingPlatform(prev => ({ ...prev, level: e.target.value as any }))}
                              className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="platform-description">Description *</Label>
                          <Textarea
                            id="platform-description"
                            placeholder="Brief about what the platform is or your experience..."
                            value={newCodingPlatform.description}
                            onChange={(e) => setNewCodingPlatform(prev => ({ ...prev, description: e.target.value }))}
                            className="bg-input border-border min-h-[80px]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="platform-date">Date Started *</Label>
                            <Input
                              id="platform-date"
                              type="date"
                              value={newCodingPlatform.dateStarted}
                              onChange={(e) => setNewCodingPlatform(prev => ({ ...prev, dateStarted: e.target.value }))}
                              className="bg-input border-border"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="platform-frequency">Frequency *</Label>
                            <select
                              id="platform-frequency"
                              value={newCodingPlatform.frequency}
                              onChange={(e) => setNewCodingPlatform(prev => ({ ...prev, frequency: e.target.value as any }))}
                              className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground"
                            >
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Occasionally">Occasionally</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="platform-category">Category (Optional)</Label>
                            <Input
                              id="platform-category"
                              type="text"
                              placeholder="e.g., Competitive, Learning..."
                              value={newCodingPlatform.category}
                              onChange={(e) => setNewCodingPlatform(prev => ({ ...prev, category: e.target.value }))}
                              className="bg-input border-border"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="platform-time">Time Spent (hours, optional)</Label>
                            <Input
                              id="platform-time"
                              type="number"
                              placeholder="100"
                              value={newCodingPlatform.timeSpent || ""}
                              onChange={(e) => setNewCodingPlatform(prev => ({ ...prev, timeSpent: e.target.value ? parseInt(e.target.value) : undefined }))}
                              className="bg-input border-border"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="platform-rating">Rating (0-5, optional)</Label>
                            <Input
                              id="platform-rating"
                              type="number"
                              min="0"
                              max="5"
                              step="0.5"
                              placeholder="4.5"
                              value={newCodingPlatform.rating || ""}
                              onChange={(e) => setNewCodingPlatform(prev => ({ ...prev, rating: e.target.value ? parseFloat(e.target.value) : undefined }))}
                              className="bg-input border-border"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="platform-goal">Goal (Optional)</Label>
                            <Input
                              id="platform-goal"
                              type="text"
                              placeholder="e.g., Reach 1000 points"
                              value={newCodingPlatform.goal}
                              onChange={(e) => setNewCodingPlatform(prev => ({ ...prev, goal: e.target.value }))}
                              className="bg-input border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="platform-achievements">Achievements</Label>
                          <div className="flex gap-2">
                            <Input
                              id="platform-achievements"
                              type="text"
                              placeholder="Add an achievement..."
                              value={achievementInput}
                              onChange={(e) => setAchievementInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAchievement())}
                              className="bg-input border-border"
                            />
                            <Button type="button" onClick={handleAddAchievement} size="sm">
                              Add
                            </Button>
                          </div>
                          {newCodingPlatform.achievements.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {newCodingPlatform.achievements.map((achievement, index) => (
                                <Badge key={index} variant="secondary" className="gap-1">
                                  {achievement}
                                  <button
                                    onClick={() => handleRemoveAchievement(achievement)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="platform-tags">Tags *</Label>
                          <div className="flex gap-2">
                            <Input
                              id="platform-tags"
                              type="text"
                              placeholder="Add a tag (separate with commas)..."
                              value={platformTagInput}
                              onChange={handlePlatformTagInputChange}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPlatformTag())}
                              className="bg-input border-border"
                            />
                            <Button type="button" onClick={handleAddPlatformTag} size="sm">
                              Add
                            </Button>
                          </div>
                          {newCodingPlatform.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {newCodingPlatform.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="gap-1">
                                  {tag}
                                  <button
                                    onClick={() => handleRemovePlatformTag(tag)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={handleSaveCodingPlatform}
                          className="w-full bg-primary hover:shadow-glow-primary"
                          disabled={!newCodingPlatform.name || !newCodingPlatform.description || newCodingPlatform.tags.length === 0 || !newCodingPlatform.link || !newCodingPlatform.dateStarted}
                        >
                          {editingPlatformId ? 'Update Platform' : 'Save Platform'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {codingPlatforms.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground mb-2">No coding platforms yet</p>
                    <p className="text-sm text-muted-foreground">Click the Add Platform button to get started</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {codingPlatforms.map((platform, index) => (
                      <Card 
                        key={platform.id} 
                        className={`overflow-hidden border-primary/20 cursor-move transition-transform ${draggedItemIndex === index && draggedItemType === 'codingPlatforms' ? 'opacity-50 scale-95' : ''} ${draggedOverIndex === index && draggedItemType === 'codingPlatforms' && draggedItemIndex !== index ? 'border-primary border-2 scale-105' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStartCards(e, index, 'codingPlatforms')}
                        onDragEnter={(e) => handleDragEnterCards(e, index, 'codingPlatforms')}
                        onDragEnd={(e) => handleDragEndCards(e, 'codingPlatforms', codingPlatforms, setCodingPlatforms)}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <CardContent className="p-0">
                          {platform.image && (
                            <div className="w-full h-32 overflow-hidden relative bg-muted flex items-center justify-center p-4">
                              <img src={platform.image} alt="Platform" className="max-h-full max-w-full object-contain" />
                            </div>
                          )}
                          <div className="p-4 space-y-3">
                            {platform.name && (
                              <h3 className="text-lg font-semibold mb-2" style={{ color: '#ff914d' }}>
                                {platform.name}
                              </h3>
                            )}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                  <Badge variant={
                                    platform.level === 'Advanced' ? 'default' :
                                      platform.level === 'Intermediate' ? 'secondary' :
                                        'outline'
                                  }>
                                    {platform.level}
                                  </Badge>
                                  <Badge variant="outline">{platform.frequency}</Badge>
                                  {platform.category && (
                                    <Badge variant="outline">{platform.category}</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-foreground">{platform.description}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                              <div>
                                <span className="font-semibold">Started:</span> {new Date(platform.dateStarted).toLocaleDateString()}
                              </div>
                              {platform.timeSpent && (
                                <div>
                                  <span className="font-semibold">Time:</span> {platform.timeSpent}h
                                </div>
                              )}
                              {platform.rating && (
                                <div>
                                  <span className="font-semibold">Rating:</span> {platform.rating}/5 ⭐
                                </div>
                              )}
                            </div>

                            {platform.goal && (
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-primary">Goal</p>
                                <p className="text-sm text-foreground">{platform.goal}</p>
                              </div>
                            )}

                            {platform.achievements.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-primary">Achievements</p>
                                <ul className="text-sm text-foreground list-disc list-inside space-y-1">
                                  {platform.achievements.map((achievement, index) => (
                                    <li key={index}>{achievement}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {platform.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {platform.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-3 pt-2">
                              {platform.link && (
                                <a
                                  href={platform.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Visit Profile
                                </a>
                              )}
                              <button
                                onClick={() => handleEditCodingPlatform(platform)}
                                className="ml-auto text-sm text-primary hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeCodingPlatform(platform.id)}
                                className="text-sm text-destructive hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : activeSection === "About Me" ? (
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent mb-6">About Me</h2>

                {/* TOP SECTION - Two Column Split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* LEFT SIDE - Photo, Name, Title */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent transition-all duration-300">Profile Photo</Label>
                      <ImageUploadZone value={aboutMeProfileImage} onChange={(val) => setAboutMeProfileImage(val)} onRemove={() => setAboutMeProfileImage("")} label="" variant="about-me" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent transition-all duration-300">Full Name</Label>
                      <Input
                        id="fullName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-base text-gray-200 font-medium tracking-wide"
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent transition-all duration-300">Title / Role</Label>
                      <Input
                        id="title"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-base text-gray-200 font-medium tracking-wide"
                        placeholder="e.g., Full Stack Developer"
                      />
                    </div>
                  </div>

                  {/* RIGHT SIDE - Bio Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent transition-all duration-300">Bio (2-3 line intro)</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 min-h-[80px] text-base text-gray-200 font-medium tracking-wide"
                        placeholder="A brief 2-3 line introduction about yourself..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="approach" className="bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent transition-all duration-300">Approach (Development/Work Philosophy)</Label>
                      <Textarea
                        id="approach"
                        value={approach}
                        onChange={(e) => setApproach(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 min-h-[100px] text-base text-gray-200 font-medium tracking-wide"
                        placeholder="Your development or work philosophy..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentFocus" className="bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent transition-all duration-300">Current Focus</Label>
                      <Textarea
                        id="currentFocus"
                        value={currentFocus}
                        onChange={(e) => setCurrentFocus(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 min-h-[80px] text-base text-gray-200 font-medium tracking-wide"
                        placeholder="What you're currently working on..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="goals" className="bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent transition-all duration-300">Long-term Goals</Label>
                      <Textarea
                        id="goals"
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 min-h-[80px] text-base text-gray-200 font-medium tracking-wide"
                        placeholder="Your long-term vision..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatYouDoToAchieveGoals" className="bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent transition-all duration-300">What You're Doing to Achieve Goals</Label>
                      <Textarea
                        id="whatYouDoToAchieveGoals"
                        value={whatYouDoToAchieveGoals}
                        onChange={(e) => setWhatYouDoToAchieveGoals(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 min-h-[80px] text-base text-gray-200 font-medium tracking-wide"
                        placeholder="Active steps you're taking to reach your goals..."
                      />
                    </div>
                  </div>
                </div>

                {/* MOTTO - Full Width Center */}
                <div className="space-y-2 border-t border-[#c084fc]/20 pt-8">
                  <Label htmlFor="motto" className="text-center block bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent transition-all duration-300">Your Motto</Label>
                  <Input
                    id="motto"
                    value={motto}
                    onChange={(e) => setMotto(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-center text-lg text-gray-200 font-medium tracking-wide"
                    placeholder="e.g., Machines don't sleep — and neither does curiosity."
                  />
                  {motto && (
                    <div className="text-center py-6">
                      <p className="text-2xl font-bold bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent animate-pulse">
                        "{motto}"
                      </p>
                      <div className="h-1 w-32 mx-auto mt-2 bg-gradient-to-r from-[#22d3ee] to-[#c084fc] rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* SECOND ROW - Two Column Split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-[#c084fc]/20 pt-8">
                  {/* LEFT SIDE - Links */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resumeLink" className="bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent transition-all duration-300">Resume Link</Label>
                      <Input
                        id="resumeLink"
                        type="url"
                        value={resumeLink}
                        onChange={(e) => setResumeLink(e.target.value)}
                        className="bg-input border-border"
                        placeholder="https://your-resume-link.com"
                      />
                      {resumeLink && (
                        <Button
                          onClick={() => window.open(resumeLink, '_blank')}
                          className="w-full bg-gradient-to-b from-[#22d3ee] to-[#c084fc] text-white font-semibold py-2 px-4 rounded-lg shadow-[0_0_15px_rgba(192,132,252,0.4)] hover:scale-[1.03] transition-all mt-2"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Resume
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent transition-all duration-300">Personal Connect Section</Label>
                      <Button
                        onClick={() => setActiveSection("Personal Connection")}
                        className="w-full bg-[#c084fc] hover:bg-gradient-to-r from-[#22d3ee] to-[#c084fc] text-white font-semibold transition-all"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Go to Personal Connect
                      </Button>
                    </div>
                  </div>

                  {/* RIGHT SIDE - Strengths, Mindset, Interests */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="strengthsSellPoints" className="bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent transition-all duration-300">Strengths / Sell Points</Label>
                      <div className="flex gap-2">
                        <Input
                          id="strengthsSellPoints"
                          value={strengthInput}
                          onChange={(e) => setStrengthInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (strengthInput.trim() && !strengthsSellPoints.includes(strengthInput.trim())) {
                                setStrengthsSellPoints([...strengthsSellPoints, strengthInput.trim()]);
                                setStrengthInput("");
                              }
                            }
                          }}
                          className="bg-input border-border"
                          placeholder="Add a strength..."
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (strengthInput.trim() && !strengthsSellPoints.includes(strengthInput.trim())) {
                              setStrengthsSellPoints([...strengthsSellPoints, strengthInput.trim()]);
                              setStrengthInput("");
                            }
                          }}
                          size="sm"
                        >
                          Add
                        </Button>
                      </div>
                      {strengthsSellPoints.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {strengthsSellPoints.map((strength, index) => (
                            <Badge key={index} className="gap-1 bg-gradient-to-r from-[#22d3ee]/30 to-[#c084fc]/30 text-[#c084fc] border border-[#c084fc]/40 rounded-full px-3 py-1 text-xs font-medium hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] transition-all">
                              {strength}
                              <button
                                onClick={() => setStrengthsSellPoints(strengthsSellPoints.filter((_, i) => i !== index))}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mindset" className="bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent transition-all duration-300">Mindset</Label>
                      <Input
                        id="mindset"
                        value={mindset}
                        onChange={(e) => setMindset(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-base text-gray-200 font-medium tracking-wide"
                        placeholder="Your one-line philosophy or mindset..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otherInterests" className="bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent transition-all duration-300">Other Interests</Label>
                      <div className="flex gap-2">
                        <Input
                          id="otherInterests"
                          value={interestInput}
                          onChange={(e) => setInterestInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (interestInput.trim() && !otherInterests.includes(interestInput.trim())) {
                                setOtherInterests([...otherInterests, interestInput.trim()]);
                                setInterestInput("");
                              }
                            }
                          }}
                          className="bg-input border-border"
                          placeholder="Add an interest..."
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (interestInput.trim() && !otherInterests.includes(interestInput.trim())) {
                              setOtherInterests([...otherInterests, interestInput.trim()]);
                              setInterestInput("");
                            }
                          }}
                          size="sm"
                        >
                          Add
                        </Button>
                      </div>
                      {otherInterests.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {otherInterests.map((interest, index) => (
                            <Badge key={index} className="gap-1 bg-gradient-to-r from-[#22d3ee]/30 to-[#c084fc]/30 text-[#c084fc] border border-[#c084fc]/40 rounded-full px-3 py-1 text-xs font-medium hover:shadow-[0_0_15px_rgba(192,132,252,0.4)] transition-all">
                              {interest}
                              <button
                                onClick={() => setOtherInterests(otherInterests.filter((_, i) => i !== index))}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* PERSONAL BIO - Bottom Left Full Width */}
                <div className="space-y-2 border-t border-[#c084fc]/20 pt-8">
                  <Label htmlFor="personalBio" className="text-[#c084fc] font-semibold">Personal Bio (Life Journey & Experiences)</Label>
                  <Textarea
                    id="personalBio"
                    value={personalBio}
                    onChange={(e) => setPersonalBio(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 min-h-[150px] text-base text-gray-300 leading-relaxed tracking-wide"
                    placeholder="Share your life journey, milestones, or personal experiences..."
                  />
                  {personalBio && personalBio.length > 200 && (
                    <div className="mt-4 p-4 bg-card border border-border rounded-lg">
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {showFullBio ? personalBio : `${personalBio.slice(0, 200)}...`}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFullBio(!showFullBio)}
                        className="mt-2 text-primary hover:text-primary/80"
                      >
                        {showFullBio ? 'Read Less' : 'Read More'} <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showFullBio ? 'rotate-90' : ''}`} />
                      </Button>
                    </div>
                  )}
                </div>

                {/* FUN FACT - Center Bottom */}
                <div className="space-y-2 border-t border-[#c084fc]/20 pt-8">
                  <Label htmlFor="funFact" className="bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent transition-all duration-300">Fun Fact 🤖</Label>
                  <Input
                    id="funFact"
                    value={funFact}
                    onChange={(e) => setFunFact(e.target.value)}
                    className="bg-input border-border"
                    placeholder="e.g., I name every robot I build — because every machine deserves a soul."
                  />
                  {funFact && (
                    <div className="text-center py-4 px-6 bg-gradient-to-r from-[#22d3ee]/40 to-[#c084fc]/40 rounded-lg animate-pulse mt-4">
                      <p className="text-lg text-white font-semibold tracking-wide">
                        {funFact}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-gradient-to-b from-[#22d3ee] to-[#c084fc] text-white font-semibold hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(192,132,252,0.4)] mt-6"
                >
                  Save & View Profile
                </Button>
              </div>
            ) : activeSection === "Education" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-primary">Education</h2>
                  <Dialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setNewEducation({
                          image: "",
                          tag: "",
                          instituteName: "",
                          degreeOrCourse: "",
                          year: "",
                          location: "",
                          description: "",
                          grade: "",
                        });
                        setEditingEducationId(null);
                      }} className="bg-primary hover:shadow-glow-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Education
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingEducationId ? 'Edit Education' : 'Add Education'}</DialogTitle>
                        <DialogDescription>
                          Add your educational background with institution details and achievements
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <ImageUploadZone 
                          label="Institution Photo/Logo" 
                          value={newEducation.image} 
                          onChange={(val) => setNewEducation(prev => ({ ...prev, image: val }))} 
                          onRemove={() => setNewEducation(prev => ({ ...prev, image: "" }))} 
                        />

                        <div className="space-y-2">
                          <Label htmlFor="edu-tag">Tag (e.g., CBSE, B.Tech, Diploma, AI Workshop) *</Label>
                          <Input
                            id="edu-tag"
                            type="text"
                            placeholder="Enter education tag..."
                            value={newEducation.tag}
                            onChange={(e) => setNewEducation(prev => ({ ...prev, tag: e.target.value }))}
                            className="bg-input border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edu-institute">Institution Name *</Label>
                          <Input
                            id="edu-institute"
                            type="text"
                            placeholder="e.g., MIT, Stanford University"
                            value={newEducation.instituteName}
                            onChange={(e) => setNewEducation(prev => ({ ...prev, instituteName: e.target.value }))}
                            className="bg-input border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edu-degree">Degree/Course *</Label>
                          <Input
                            id="edu-degree"
                            type="text"
                            placeholder="e.g., Bachelor of Science in Computer Science"
                            value={newEducation.degreeOrCourse}
                            onChange={(e) => setNewEducation(prev => ({ ...prev, degreeOrCourse: e.target.value }))}
                            className="bg-input border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edu-year">Year (Start-End or Graduation) *</Label>
                          <Input
                            id="edu-year"
                            type="text"
                            placeholder="e.g., 2020-2024 or 2024"
                            value={newEducation.year}
                            onChange={(e) => setNewEducation(prev => ({ ...prev, year: e.target.value }))}
                            className="bg-input border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edu-location">Location *</Label>
                          <Input
                            id="edu-location"
                            type="text"
                            placeholder="e.g., Cambridge, MA, USA"
                            value={newEducation.location}
                            onChange={(e) => setNewEducation(prev => ({ ...prev, location: e.target.value }))}
                            className="bg-input border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edu-description">Description *</Label>
                          <Textarea
                            id="edu-description"
                            placeholder="Describe your studies, major achievements, research areas..."
                            value={newEducation.description}
                            onChange={(e) => setNewEducation(prev => ({ ...prev, description: e.target.value }))}
                            className="bg-input border-border min-h-[100px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edu-grade">Grade/GPA (Optional)</Label>
                          <Input
                            id="edu-grade"
                            type="text"
                            placeholder="e.g., 3.8/4.0, First Class Honours"
                            value={newEducation.grade}
                            onChange={(e) => setNewEducation(prev => ({ ...prev, grade: e.target.value }))}
                            className="bg-input border-border"
                          />
                        </div>

                        <Button
                          onClick={handleSaveEducation}
                          className="w-full bg-primary hover:shadow-glow-primary"
                          disabled={!newEducation.instituteName || !newEducation.degreeOrCourse || !newEducation.tag}
                        >
                          {editingEducationId ? 'Update Education' : 'Save Education'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {education.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground mb-2">No education records yet</p>
                    <p className="text-sm text-muted-foreground">Click the Add Education button to get started</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {education.map((edu, index) => (
                      <Card 
                        key={edu.id} 
                        className={`overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm cursor-move transition-transform ${draggedItemIndex === index && draggedItemType === 'education' ? 'opacity-50 scale-95' : ''} ${draggedOverIndex === index && draggedItemType === 'education' && draggedItemIndex !== index ? 'border-primary border-2 scale-105' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStartCards(e, index, 'education')}
                        onDragEnter={(e) => handleDragEnterCards(e, index, 'education')}
                        onDragEnd={(e) => handleDragEndCards(e, 'education', education, setEducation)}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <CardContent className="p-0">
                          {edu.image && (
                            <div className="w-full h-32 overflow-hidden relative bg-muted flex items-center justify-center p-4">
                              <img src={edu.image} alt="Institution" className="max-h-full max-w-full object-contain" />
                            </div>
                          )}
                          <div className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <Badge
                                  variant="outline"
                                  className="mb-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                                >
                                  {edu.tag}
                                </Badge>
                                <h3 className="text-lg font-semibold text-foreground">{edu.instituteName}</h3>
                                <p className="text-sm text-primary font-medium">{edu.degreeOrCourse}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                              <div>
                                <span className="font-semibold">Year:</span> {edu.year}
                              </div>
                              <div>
                                <span className="font-semibold">Location:</span> {edu.location}
                              </div>
                            </div>

                            {edu.grade && (
                              <div className="text-xs text-muted-foreground">
                                <span className="font-semibold">Grade:</span> {edu.grade}
                              </div>
                            )}

                            <p className="text-sm text-foreground">{edu.description}</p>

                            <div className="flex items-center gap-3 pt-2 border-t border-border">
                              <button
                                onClick={() => handleEditEducation(edu)}
                                className="text-sm text-primary hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeEducation(edu.id)}
                                className="ml-auto text-sm text-destructive hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : activeSection === "Personal Connection" ? (
              <PersonalConnectionEdit />
            ) : (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-primary mx-auto mb-4 animate-glow" />
                <p className="text-xl text-muted-foreground mb-4">
                  Section Under Construction
                </p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  This section will allow you to edit your profile information,
                  upload images, add descriptions, and manage tags.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <QuoteTicker />
    </div>
  );
}
