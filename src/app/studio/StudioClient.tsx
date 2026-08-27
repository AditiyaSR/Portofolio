"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  verifyPasscode, updateProfile, 
  createProject, updateProject, deleteProject, 
  createExperience, updateExperience, deleteExperience,
  createEducation, updateEducation, deleteEducation,
  createSkill, updateSkill, deleteSkill,
  createAchievement, updateAchievement, deleteAchievement,
  createCertificate, updateCertificate, deleteCertificate
} from "./actions";
import { 
  Lock, User, Briefcase, Wrench, Image as ImageIcon, Save, Plus, 
  Trash2, Globe, Link, UploadCloud, Camera, GraduationCap, Award, Zap, ShieldCheck 
} from "lucide-react";
import { upload } from "@vercel/blob/client";

export default function StudioClient({ 
  initialProfile, 
  initialExperiences, 
  initialEducation, 
  initialProjects, 
  initialSkills, 
  initialAchievements,
  initialCertificates 
}: any) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  
  // State
  const [profile, setProfile] = useState(initialProfile || {});
  const [projects, setProjects] = useState(initialProjects || []);
  const [experiences, setExperiences] = useState(initialExperiences || []);
  const [education, setEducation] = useState(initialEducation || []);
  const [skills, setSkills] = useState(initialSkills || []);
  const [achievements, setAchievements] = useState(initialAchievements || []);
  const [certificates, setCertificates] = useState(initialCertificates || []);

  const [isSaving, setIsSaving] = useState(false);
  const [uploadingState, setUploadingState] = useState<{ id: string | null; uploading: boolean }>({ id: null, uploading: false });
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetUploadId, setTargetUploadId] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = await verifyPasscode(passcode);
    if (valid) setIsAuthenticated(true);
    else alert("Invalid Passcode");
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await updateProfile(profile);
    setIsSaving(false);
    alert("Profile saved successfully!");
    router.refresh();
  };

  const compressAndConvertImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          
          let width = img.width;
          let height = img.height;
          const max_size = 1920; 
          
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Failed to get canvas context");
          
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (!blob) return reject("Canvas to blob failed");
            const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], newName, {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }, "image/webp", 0.8);
        };
        img.onerror = (e) => reject(e);
      };
      reader.onerror = (e) => reject(e);
    });
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processAndUploadFile = async (file: File, targetId: string | null) => {
    const isDocumentTarget = targetId === "mechanicalCv" || targetId === "softwareCv" || targetId === "resume";
    
    if (!isDocumentTarget && !file.type.startsWith("image/")) {
      alert("Please upload an image file (JPEG, PNG, WebP) for photos/media.");
      return;
    }

    try {
      setUploadingState({ id: targetId, uploading: true });
      let uploadFile: File = file;
      
      // Compress image if it's an image file and not a document
      if (file.type.startsWith("image/")) {
        uploadFile = await compressAndConvertImage(file);
      }

      let finalUrl = "";

      // 1. Try Vercel Blob client upload (if token is provided in environment)
      try {
        const newBlob = await upload(uploadFile.name, uploadFile, {
          access: 'public',
          handleUploadUrl: '/api/upload', 
        });
        finalUrl = newBlob.url;
      } catch (blobErr) {
        // 2. Try Local Upload Fallback (/public/uploads via FormData)
        try {
          const formData = new FormData();
          formData.append("file", uploadFile);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            finalUrl = data.url;
          } else {
            throw new Error("Local filesystem unavailable");
          }
        } catch (localErr) {
          // 3. Zero-Config Ultra-Resilient Data URI Fallback (Guaranteed to work 100% on Vercel read-only serverless filesystem)
          finalUrl = await fileToDataUrl(uploadFile);
        }
      }
      
      if (targetId === "profile") {
        setProfile((prev: any) => ({ ...prev, avatarUrl: finalUrl }));
        alert("Avatar photo uploaded successfully! Click Save Changes to commit.");
      } else if (targetId === "mechanicalCv") {
        setProfile((prev: any) => ({ ...prev, mechanicalCvUrl: finalUrl }));
        alert("Mechanical CV PDF uploaded successfully! Click Save Changes to commit.");
      } else if (targetId === "softwareCv") {
        setProfile((prev: any) => ({ ...prev, softwareCvUrl: finalUrl }));
        alert("Software CV PDF uploaded successfully! Click Save Changes to commit.");
      } else if (targetId === "resume") {
        setProfile((prev: any) => ({ ...prev, resumeUrl: finalUrl }));
        alert("General Resume PDF uploaded successfully! Click Save Changes to commit.");
      } else if (targetId && targetId.startsWith("exp-")) {
        const expId = targetId.replace("exp-", "");
        setExperiences((prev: any) => 
          prev.map((e: any) => e.id === expId ? { ...e, logoUrl: finalUrl } : e)
        );
        alert("Company logo uploaded successfully! Click Save Experience to commit.");
      } else if (targetId && targetId.startsWith("edu-")) {
        const eduId = targetId.replace("edu-", "");
        setEducation((prev: any) => 
          prev.map((e: any) => e.id === eduId ? { ...e, logoUrl: finalUrl } : e)
        );
        alert("Institution logo uploaded successfully! Click Save Education to commit.");
      } else if (targetId && targetId.startsWith("ach-")) {
        const achId = targetId.replace("ach-", "");
        setAchievements((prev: any) => 
          prev.map((a: any) => a.id === achId ? { ...a, imageUrl: finalUrl } : a)
        );
        alert("Achievement badge/image uploaded successfully! Click Save Achievement to commit.");
      } else if (targetId && targetId.startsWith("cert-")) {
        const certId = targetId.replace("cert-", "");
        setCertificates((prev: any) => 
          prev.map((c: any) => c.id === certId ? { ...c, imageUrl: finalUrl } : c)
        );
        alert("Certificate badge/image uploaded successfully! Click Save Certificate to commit.");
      } else if (targetId && targetId !== "media") {
        setProjects((prevProjects: any) => 
          prevProjects.map((p: any) => p.id === targetId ? { ...p, imageUrl: finalUrl } : p)
        );
        alert("Project image uploaded successfully! Click Save Project to commit.");
      } else {
        alert(`Media Upload Success!\nURL: ${finalUrl}`);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`Failed to upload file: ${error.message || error}`);
    } finally {
      setUploadingState({ id: null, uploading: false });
      setTargetUploadId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerImageUpload = (targetId: string) => {
    setTargetUploadId(targetId);
    fileInputRef.current?.click();
  };

  const handleGlobalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    await processAndUploadFile(e.target.files[0], targetUploadId);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      await processAndUploadFile(e.dataTransfer.files[0], "media");
    }
  };

  // High-contrast, dark-mode input classes
  const inputBaseClass = "w-full bg-[#09090b] border border-zinc-700/80 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all font-medium text-sm";
  const labelClass = "text-xs text-amber-400 uppercase tracking-wider font-mono font-bold mb-1.5 block";

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#09090b] text-zinc-100">
        <form onSubmit={handleLogin} className="bg-zinc-900 p-10 rounded-[2rem] border border-zinc-800 shadow-2xl w-[400px] space-y-8">
          <div className="flex justify-center mb-6">
            <div className="bg-amber-400/10 p-4 rounded-full border border-amber-400/20">
              <Lock size={32} className="text-amber-400" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-white">Studio Login</h2>
            <p className="text-zinc-400 font-medium text-sm">Enter master passcode to unlock CMS</p>
          </div>
          <div className="space-y-4">
            <input 
              type="password" 
              placeholder="••••••••" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-[#09090b] border border-zinc-700 rounded-xl px-5 py-4 text-white text-center text-lg tracking-widest focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all font-bold"
            />
            <button type="submit" className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold py-4 rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2">
              Unlock CMS
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-8 font-sans">
      <input type="file" accept="image/*,application/pdf,.pdf,.doc,.docx" ref={fileInputRef} onChange={handleGlobalImageUpload} className="hidden" />

      <div className="max-w-7xl mx-auto flex gap-8">
        
        {/* Sidebar */}
        <div className="w-64 shrink-0 space-y-4">
          <div className="mb-10 px-4 flex items-center gap-3">
            <div className="bg-amber-400 p-2.5 rounded-xl shadow-md shadow-amber-400/20">
              <Lock size={20} className="text-zinc-950 font-bold"/> 
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">ECC Studio</h2>
              <span className="text-[10px] text-amber-400 font-mono tracking-widest uppercase font-semibold">CMS v2.0</span>
            </div>
          </div>

          <div className="space-y-2 px-2">
            <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all border ${activeTab === "profile" ? "bg-amber-400/10 text-amber-400 border-amber-400/30 shadow-md" : "bg-zinc-900/40 text-zinc-400 border-zinc-800/80 hover:bg-zinc-800/60 hover:text-white"}`}>
              <User size={18} /> Profile Info
            </button>
            <button onClick={() => setActiveTab("experience")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all border ${activeTab === "experience" ? "bg-amber-400/10 text-amber-400 border-amber-400/30 shadow-md" : "bg-zinc-900/40 text-zinc-400 border-zinc-800/80 hover:bg-zinc-800/60 hover:text-white"}`}>
              <Briefcase size={18} /> Experience
            </button>
            <button onClick={() => setActiveTab("education")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all border ${activeTab === "education" ? "bg-amber-400/10 text-amber-400 border-amber-400/30 shadow-md" : "bg-zinc-900/40 text-zinc-400 border-zinc-800/80 hover:bg-zinc-800/60 hover:text-white"}`}>
              <GraduationCap size={18} /> Education
            </button>
            <button onClick={() => setActiveTab("projects")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all border ${activeTab === "projects" ? "bg-amber-400/10 text-amber-400 border-amber-400/30 shadow-md" : "bg-zinc-900/40 text-zinc-400 border-zinc-800/80 hover:bg-zinc-800/60 hover:text-white"}`}>
              <Wrench size={18} /> Projects
            </button>
            <button onClick={() => setActiveTab("skills")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all border ${activeTab === "skills" ? "bg-amber-400/10 text-amber-400 border-amber-400/30 shadow-md" : "bg-zinc-900/40 text-zinc-400 border-zinc-800/80 hover:bg-zinc-800/60 hover:text-white"}`}>
              <Zap size={18} /> Core Competencies
            </button>
            <button onClick={() => setActiveTab("achievements")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all border ${activeTab === "achievements" ? "bg-amber-400/10 text-amber-400 border-amber-400/30 shadow-md" : "bg-zinc-900/40 text-zinc-400 border-zinc-800/80 hover:bg-zinc-800/60 hover:text-white"}`}>
              <Award size={18} /> Achievements
            </button>
            <button onClick={() => setActiveTab("certificates")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all border ${activeTab === "certificates" ? "bg-amber-400/10 text-amber-400 border-amber-400/30 shadow-md" : "bg-zinc-900/40 text-zinc-400 border-zinc-800/80 hover:bg-zinc-800/60 hover:text-white"}`}>
              <ShieldCheck size={18} /> Certifications
            </button>
            <button onClick={() => setActiveTab("media")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all border ${activeTab === "media" ? "bg-amber-400/10 text-amber-400 border-amber-400/30 shadow-md" : "bg-zinc-900/40 text-zinc-400 border-zinc-800/80 hover:bg-zinc-800/60 hover:text-white"}`}>
              <ImageIcon size={18} /> Media Library
            </button>
          </div>
        </div>

        {/* Main Content Panel */}
        <div className="flex-1 bg-zinc-900/90 border border-zinc-800/90 rounded-[2rem] p-10 min-h-[80vh] shadow-2xl relative overflow-hidden">
          
          {/* Subtle Glow Accent */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-center pb-6 border-b border-zinc-800">
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tight">Profile Details</h3>
                  <p className="text-zinc-400 font-medium text-sm mt-1">Manage public biography and contact channels.</p>
                </div>
                <button onClick={handleSaveProfile} disabled={isSaving} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-400/20 transition-all active:scale-95 text-sm">
                  <Save size={18} /> {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4 shrink-0">
                  <div className="w-32 h-32 rounded-full border-2 border-zinc-700 shadow-md overflow-hidden bg-zinc-950 flex items-center justify-center relative group">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={48} className="text-zinc-600" />
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={24} className="text-white" />
                    </div>
                  </div>
                  <button 
                    onClick={() => triggerImageUpload("profile")}
                    disabled={uploadingState.uploading && uploadingState.id === "profile"}
                    className="text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-zinc-700"
                  >
                    {uploadingState.uploading && uploadingState.id === "profile" ? "Uploading..." : "Upload Photo"}
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-6 w-full">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input value={profile.name || ""} onChange={e => setProfile({...profile, name: e.target.value})} className={inputBaseClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Professional Title</label>
                    <input value={profile.title || ""} onChange={e => setProfile({...profile, title: e.target.value})} className={inputBaseClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input value={profile.email || ""} onChange={e => setProfile({...profile, email: e.target.value})} className={inputBaseClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input value={profile.phone || ""} onChange={e => setProfile({...profile, phone: e.target.value})} className={inputBaseClass} />
                  </div>
                  <div>
                    <label className={labelClass}>LinkedIn URL</label>
                    <input value={profile.linkedinUrl || ""} onChange={e => setProfile({...profile, linkedinUrl: e.target.value})} className={inputBaseClass} />
                  </div>
                  <div>
                    <label className={labelClass}>GitHub URL</label>
                    <input value={profile.githubUrl || ""} onChange={e => setProfile({...profile, githubUrl: e.target.value})} className={inputBaseClass} />
                  </div>
                </div>
              </div>

              {/* CV Management */}
              <div className="pt-6 border-t border-zinc-800 space-y-6">
                <div>
                  <h4 className="text-lg font-black text-amber-400">CV / Resume Upload & Links</h4>
                  <p className="text-xs text-zinc-400">Upload or paste direct URLs for Mechanical & Software CV documents (PDF).</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-zinc-950/60 border border-zinc-800 rounded-2xl space-y-3">
                    <label className={labelClass}>Mechanical Mode CV (PDF)</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => triggerImageUpload("mechanicalCv")}
                        disabled={uploadingState.uploading && uploadingState.id === "mechanicalCv"}
                        className="shrink-0 flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2.5 rounded-xl font-bold text-xs border border-zinc-700"
                      >
                        <UploadCloud size={16} className={uploadingState.uploading && uploadingState.id === "mechanicalCv" ? "animate-bounce text-amber-400" : ""} />
                        {uploadingState.uploading && uploadingState.id === "mechanicalCv" ? "Uploading..." : "Upload PDF"}
                      </button>
                      <input 
                        value={profile.mechanicalCvUrl || ""} 
                        onChange={e => setProfile({...profile, mechanicalCvUrl: e.target.value})} 
                        placeholder="https://... or /uploads/..." 
                        className={inputBaseClass} 
                      />
                    </div>
                  </div>

                  <div className="p-5 bg-zinc-950/60 border border-zinc-800 rounded-2xl space-y-3">
                    <label className={labelClass}>Software Mode CV (PDF)</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => triggerImageUpload("softwareCv")}
                        disabled={uploadingState.uploading && uploadingState.id === "softwareCv"}
                        className="shrink-0 flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2.5 rounded-xl font-bold text-xs border border-zinc-700"
                      >
                        <UploadCloud size={16} className={uploadingState.uploading && uploadingState.id === "softwareCv" ? "animate-bounce text-amber-400" : ""} />
                        {uploadingState.uploading && uploadingState.id === "softwareCv" ? "Uploading..." : "Upload PDF"}
                      </button>
                      <input 
                        value={profile.softwareCvUrl || ""} 
                        onChange={e => setProfile({...profile, softwareCvUrl: e.target.value})} 
                        placeholder="https://... or /uploads/..." 
                        className={inputBaseClass} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Biography</label>
                <textarea value={profile.bio || ""} onChange={e => setProfile({...profile, bio: e.target.value})} rows={5} className={inputBaseClass} />
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-center pb-6 border-b border-zinc-800">
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tight">Project Portfolio</h3>
                  <p className="text-zinc-400 font-medium text-sm mt-1">Add, edit, or remove technical projects.</p>
                </div>
                <button onClick={async () => {
                  const newProj = { title: "New Project", category: "Engineering", description: "", year: "2026", mode: "BOTH", order: projects.length + 1 };
                  const res = await createProject(newProj);
                  if (res?.success) {
                    router.refresh();
                    setProjects([...projects, { ...newProj, id: Date.now().toString() }]);
                  }
                }} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-400/20 transition-all active:scale-95 text-sm">
                  <Plus size={18} /> Add Project
                </button>
              </div>
              
              <div className="space-y-8">
                {projects.map((proj: any) => (
                  <div key={proj.id} className="p-8 bg-[#09090b]/80 border border-zinc-800 rounded-3xl space-y-6 transition-all hover:border-amber-400/50 shadow-xl relative group">
                    <div className="flex justify-between items-start gap-6">
                      <div className="w-full">
                        <label className={labelClass}>Project Title</label>
                        <input value={proj.title} onChange={e => setProjects(projects.map((p: any) => p.id === proj.id ? {...p, title: e.target.value} : p))} className={`${inputBaseClass} text-xl font-black`} />
                      </div>
                      <button onClick={async () => { 
                        if(confirm('Delete Project permanently?')) { 
                          await deleteProject(proj.id); 
                          setProjects(projects.filter((p: any) => p.id !== proj.id));
                          router.refresh();
                        } 
                      }} className="text-red-400 hover:text-red-300 p-3 mt-5 bg-red-950/40 hover:bg-red-950/80 border border-red-800/40 rounded-xl transition-colors shrink-0">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <label className={labelClass}>Category</label>
                        <input value={proj.category} onChange={e => setProjects(projects.map((p: any) => p.id === proj.id ? {...p, category: e.target.value} : p))} className={inputBaseClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Year</label>
                        <input value={proj.year || ""} onChange={e => setProjects(projects.map((p: any) => p.id === proj.id ? {...p, year: e.target.value} : p))} className={inputBaseClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Display Pipeline</label>
                        <select value={proj.mode} onChange={e => setProjects(projects.map((p: any) => p.id === proj.id ? {...p, mode: e.target.value} : p))} className={inputBaseClass}>
                          <option value="BOTH" className="bg-zinc-900 text-white">Universal (BOTH)</option>
                          <option value="MECHANICAL" className="bg-zinc-900 text-white">Mechanical Mode</option>
                          <option value="SOFTWARE" className="bg-zinc-900 text-white">Software Mode</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div>
                        <label className={`${labelClass} flex items-center gap-1.5`}><Globe size={14}/> Live Demo URL</label>
                        <input value={proj.demoUrl || ""} onChange={e => setProjects(projects.map((p: any) => p.id === proj.id ? {...p, demoUrl: e.target.value} : p))} placeholder="https://..." className={inputBaseClass} />
                      </div>
                      <div>
                        <label className={`${labelClass} flex items-center gap-1.5`}><Link size={14}/> Repository URL</label>
                        <input value={proj.repositoryUrl || ""} onChange={e => setProjects(projects.map((p: any) => p.id === proj.id ? {...p, repositoryUrl: e.target.value} : p))} placeholder="https://..." className={inputBaseClass} />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Cover Image</label>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => triggerImageUpload(proj.id)}
                          disabled={uploadingState.uploading && uploadingState.id === proj.id}
                          className="shrink-0 flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-5 py-3 rounded-xl font-bold transition-colors text-xs border border-zinc-700"
                        >
                          {uploadingState.uploading && uploadingState.id === proj.id ? <UploadCloud size={16} className="animate-bounce text-amber-400"/> : <Camera size={16} />}
                          {uploadingState.uploading && uploadingState.id === proj.id ? "Uploading..." : "Upload Image"}
                        </button>
                        <input value={proj.imageUrl || ""} onChange={e => setProjects(projects.map((p: any) => p.id === proj.id ? {...p, imageUrl: e.target.value} : p))} placeholder="Or paste image URL..." className={inputBaseClass} />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Project Description</label>
                      <textarea value={proj.description || ""} onChange={e => setProjects(projects.map((p: any) => p.id === proj.id ? {...p, description: e.target.value} : p))} rows={4} className={inputBaseClass} />
                    </div>

                    <div className="pt-4 flex justify-end border-t border-zinc-800/80">
                      <button onClick={async () => {
                        await updateProject(proj.id, {
                          title: proj.title, category: proj.category, year: proj.year,
                          description: proj.description, imageUrl: proj.imageUrl, 
                          repositoryUrl: proj.repositoryUrl, demoUrl: proj.demoUrl, mode: proj.mode
                        });
                        alert("Project updated successfully!");
                        router.refresh();
                      }} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-6 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95 text-xs">
                        <Save size={16} strokeWidth={2.5}/> Save Project
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experiences Tab */}
          {activeTab === "experience" && (
            <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-center pb-6 border-b border-zinc-800">
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tight">Professional Experience</h3>
                  <p className="text-zinc-400 font-medium text-sm mt-1">Manage career history and roles.</p>
                </div>
                <button onClick={async () => {
                  const newExp = { role: "New Role", company: "Company", startDate: "Jan 2026", endDate: "Present", isCurrent: true, description: "", mode: "BOTH", order: experiences.length + 1 };
                  const res = await createExperience(newExp);
                  if (res?.success) {
                    router.refresh();
                    setExperiences([...experiences, { ...newExp, id: Date.now().toString() }]);
                  }
                }} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-400/20 transition-all active:scale-95 text-sm">
                  <Plus size={18} /> Add Experience
                </button>
              </div>
              
              <div className="space-y-8">
                {experiences.map((exp: any) => (
                  <div key={exp.id} className="p-8 bg-[#09090b]/80 border border-zinc-800 rounded-3xl space-y-6 transition-all hover:border-amber-400/50 shadow-xl relative group">
                    <div className="flex justify-between items-start gap-6">
                      <div className="grid grid-cols-2 gap-6 w-full">
                        <div>
                          <label className={labelClass}>Role / Title</label>
                          <input value={exp.role} onChange={e => setExperiences(experiences.map((p: any) => p.id === exp.id ? {...p, role: e.target.value} : p))} className={`${inputBaseClass} text-lg font-black`} />
                        </div>
                        <div>
                          <label className={labelClass}>Company Name</label>
                          <input value={exp.company} onChange={e => setExperiences(experiences.map((p: any) => p.id === exp.id ? {...p, company: e.target.value} : p))} className={`${inputBaseClass} text-lg font-black`} />
                        </div>
                      </div>
                      <button onClick={async () => { 
                        if(confirm('Delete Experience permanently?')) { 
                          await deleteExperience(exp.id); 
                          setExperiences(experiences.filter((p: any) => p.id !== exp.id));
                          router.refresh();
                        } 
                      }} className="text-red-400 hover:text-red-300 p-3 mt-5 bg-red-950/40 hover:bg-red-950/80 border border-red-800/40 rounded-xl transition-colors shrink-0">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                      <div>
                        <label className={labelClass}>Start Date</label>
                        <input value={exp.startDate || ""} onChange={e => setExperiences(experiences.map((p: any) => p.id === exp.id ? {...p, startDate: e.target.value} : p))} className={inputBaseClass} />
                      </div>
                      <div>
                        <label className={labelClass}>End Date</label>
                        <input value={exp.endDate || ""} onChange={e => setExperiences(experiences.map((p: any) => p.id === exp.id ? {...p, endDate: e.target.value} : p))} disabled={exp.isCurrent} className={`${inputBaseClass} disabled:opacity-40 disabled:bg-zinc-900`} />
                      </div>
                      <div>
                        <label className={labelClass}>Location</label>
                        <input value={exp.location || ""} onChange={e => setExperiences(experiences.map((p: any) => p.id === exp.id ? {...p, location: e.target.value} : p))} className={inputBaseClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Display Pipeline</label>
                        <select value={exp.mode} onChange={e => setExperiences(experiences.map((p: any) => p.id === exp.id ? {...p, mode: e.target.value} : p))} className={inputBaseClass}>
                          <option value="BOTH" className="bg-zinc-900 text-white">Universal (BOTH)</option>
                          <option value="MECHANICAL" className="bg-zinc-900 text-white">Mechanical Mode</option>
                          <option value="SOFTWARE" className="bg-zinc-900 text-white">Software Mode</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className={`${labelClass} flex items-center gap-1.5`}><Globe size={14}/> Company URL / Website</label>
                        <input value={exp.companyUrl || ""} onChange={e => setExperiences(experiences.map((p: any) => p.id === exp.id ? {...p, companyUrl: e.target.value} : p))} placeholder="https://company.com" className={inputBaseClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Company Logo / Badge Image</label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => triggerImageUpload(`exp-${exp.id}`)}
                            disabled={uploadingState.uploading && uploadingState.id === `exp-${exp.id}`}
                            className="shrink-0 flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2.5 rounded-xl font-bold text-xs border border-zinc-700"
                          >
                            <UploadCloud size={16} className={uploadingState.uploading && uploadingState.id === `exp-${exp.id}` ? "animate-bounce text-amber-400" : ""} />
                            {uploadingState.uploading && uploadingState.id === `exp-${exp.id}` ? "Uploading..." : "Upload Logo"}
                          </button>
                          <input 
                            value={exp.logoUrl || ""} 
                            onChange={e => setExperiences(experiences.map((p: any) => p.id === exp.id ? {...p, logoUrl: e.target.value} : p))} 
                            placeholder="https://... or /uploads/..." 
                            className={inputBaseClass} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1 pb-1">
                      <input type="checkbox" id={`current-${exp.id}`} checked={exp.isCurrent} onChange={e => setExperiences(experiences.map((p: any) => p.id === exp.id ? {...p, isCurrent: e.target.checked} : p))} className="w-5 h-5 rounded accent-amber-400 border-zinc-700 bg-zinc-900 cursor-pointer" />
                      <label htmlFor={`current-${exp.id}`} className="text-sm font-bold text-zinc-300 cursor-pointer select-none">I currently work here</label>
                    </div>

                    <div>
                      <label className={labelClass}>Job Description</label>
                      <textarea value={exp.description || ""} onChange={e => setExperiences(experiences.map((p: any) => p.id === exp.id ? {...p, description: e.target.value} : p))} rows={4} className={inputBaseClass} />
                    </div>

                    <div className="pt-4 flex justify-end border-t border-zinc-800/80">
                      <button onClick={async () => {
                        await updateExperience(exp.id, {
                          role: exp.role, company: exp.company, companyUrl: exp.companyUrl, logoUrl: exp.logoUrl,
                          location: exp.location, startDate: exp.startDate, endDate: exp.endDate,
                          isCurrent: exp.isCurrent, description: exp.description, mode: exp.mode
                        });
                        alert("Experience updated successfully!");
                        router.refresh();
                      }} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-6 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95 text-xs">
                        <Save size={16} strokeWidth={2.5}/> Save Experience
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === "education" && (
            <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-center pb-6 border-b border-zinc-800">
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tight">Education & Credentials</h3>
                  <p className="text-zinc-400 font-medium text-sm mt-1">Manage academic background and degrees.</p>
                </div>
                <button onClick={async () => {
                  const newEdu = { degree: "Bachelor's Degree", major: "Engineering", institution: "University", location: "City, Country", startDate: "2022", endDate: "2026", gpa: "3.80", description: "", mode: "BOTH", order: education.length + 1 };
                  const res = await createEducation(newEdu);
                  if (res?.success) {
                    router.refresh();
                    setEducation([...education, res.education || { ...newEdu, id: Date.now().toString() }]);
                  }
                }} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-400/20 transition-all active:scale-95 text-sm">
                  <Plus size={18} /> Add Education
                </button>
              </div>
              
              <div className="space-y-8">
                {education.map((edu: any) => (
                  <div key={edu.id} className="p-8 bg-[#09090b]/80 border border-zinc-800 rounded-3xl space-y-6 transition-all hover:border-amber-400/50 shadow-xl relative group">
                    <div className="flex justify-between items-start gap-6">
                      <div className="grid grid-cols-3 gap-6 w-full">
                        <div>
                          <label className={labelClass}>Degree</label>
                          <input value={edu.degree} onChange={e => setEducation(education.map((item: any) => item.id === edu.id ? {...item, degree: e.target.value} : item))} className={`${inputBaseClass} font-bold`} />
                        </div>
                        <div>
                          <label className={labelClass}>Major / Concentration</label>
                          <input value={edu.major} onChange={e => setEducation(education.map((item: any) => item.id === edu.id ? {...item, major: e.target.value} : item))} className={`${inputBaseClass} font-bold`} />
                        </div>
                        <div>
                          <label className={labelClass}>Institution</label>
                          <input value={edu.institution} onChange={e => setEducation(education.map((item: any) => item.id === edu.id ? {...item, institution: e.target.value} : item))} className={`${inputBaseClass} font-bold`} />
                        </div>
                      </div>
                      <button onClick={async () => { 
                        if(confirm('Delete Education entry permanently?')) { 
                          await deleteEducation(edu.id); 
                          setEducation(education.filter((item: any) => item.id !== edu.id));
                          router.refresh();
                        } 
                      }} className="text-red-400 hover:text-red-300 p-3 mt-5 bg-red-950/40 hover:bg-red-950/80 border border-red-800/40 rounded-xl transition-colors shrink-0">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                      <div>
                        <label className={labelClass}>Start Date</label>
                        <input value={edu.startDate || ""} onChange={e => setEducation(education.map((item: any) => item.id === edu.id ? {...item, startDate: e.target.value} : item))} className={inputBaseClass} />
                      </div>
                      <div>
                        <label className={labelClass}>End Date</label>
                        <input value={edu.endDate || ""} onChange={e => setEducation(education.map((item: any) => item.id === edu.id ? {...item, endDate: e.target.value} : item))} className={inputBaseClass} />
                      </div>
                      <div>
                        <label className={labelClass}>GPA / Grade</label>
                        <input value={edu.gpa || ""} onChange={e => setEducation(education.map((item: any) => item.id === edu.id ? {...item, gpa: e.target.value} : item))} placeholder="e.g. 3.77" className={inputBaseClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Display Pipeline</label>
                        <select value={edu.mode} onChange={e => setEducation(education.map((item: any) => item.id === edu.id ? {...item, mode: e.target.value} : item))} className={inputBaseClass}>
                          <option value="BOTH" className="bg-zinc-900 text-white">Universal (BOTH)</option>
                          <option value="MECHANICAL" className="bg-zinc-900 text-white">Mechanical Mode</option>
                          <option value="SOFTWARE" className="bg-zinc-900 text-white">Software Mode</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className={`${labelClass} flex items-center gap-1.5`}><Globe size={14}/> Institution Website URL</label>
                        <input value={edu.institutionUrl || ""} onChange={e => setEducation(education.map((item: any) => item.id === edu.id ? {...item, institutionUrl: e.target.value} : item))} placeholder="https://university.edu" className={inputBaseClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Institution Logo / Emblem</label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => triggerImageUpload(`edu-${edu.id}`)}
                            disabled={uploadingState.uploading && uploadingState.id === `edu-${edu.id}`}
                            className="shrink-0 flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2.5 rounded-xl font-bold text-xs border border-zinc-700"
                          >
                            <UploadCloud size={16} className={uploadingState.uploading && uploadingState.id === `edu-${edu.id}` ? "animate-bounce text-amber-400" : ""} />
                            {uploadingState.uploading && uploadingState.id === `edu-${edu.id}` ? "Uploading..." : "Upload Logo"}
                          </button>
                          <input 
                            value={edu.logoUrl || ""} 
                            onChange={e => setEducation(education.map((item: any) => item.id === edu.id ? {...item, logoUrl: e.target.value} : item))} 
                            placeholder="https://... or /uploads/..." 
                            className={inputBaseClass} 
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Location</label>
                      <input value={edu.location || ""} onChange={e => setEducation(education.map((item: any) => item.id === edu.id ? {...item, location: e.target.value} : item))} className={inputBaseClass} />
                    </div>

                    <div>
                      <label className={labelClass}>Description & Highlights</label>
                      <textarea value={edu.description || ""} onChange={e => setEducation(education.map((item: any) => item.id === edu.id ? {...item, description: e.target.value} : item))} rows={3} className={inputBaseClass} />
                    </div>

                    <div className="pt-4 flex justify-end border-t border-zinc-800/80">
                      <button onClick={async () => {
                        await updateEducation(edu.id, {
                          degree: edu.degree, major: edu.major, institution: edu.institution,
                          institutionUrl: edu.institutionUrl, logoUrl: edu.logoUrl,
                          location: edu.location, startDate: edu.startDate, endDate: edu.endDate,
                          gpa: edu.gpa, description: edu.description, mode: edu.mode
                        });
                        alert("Education updated successfully!");
                        router.refresh();
                      }} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-6 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95 text-xs">
                        <Save size={16} strokeWidth={2.5}/> Save Education
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-center pb-6 border-b border-zinc-800">
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tight">Core Competencies & Skills</h3>
                  <p className="text-zinc-400 font-medium text-sm mt-1">Manage hard skills, soft skills, and engineering tools.</p>
                </div>
                <button onClick={async () => {
                  const newSkill = { name: "New Skill", category: "HARD_SKILL", mode: "MECHANICAL", order: skills.length + 1 };
                  const res = await createSkill(newSkill);
                  if (res?.success) {
                    router.refresh();
                    setSkills([...skills, res.skill || { ...newSkill, id: Date.now().toString() }]);
                  }
                }} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-400/20 transition-all active:scale-95 text-sm">
                  <Plus size={18} /> Add Skill
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map((skill: any) => (
                  <div key={skill.id} className="p-6 bg-[#09090b]/80 border border-zinc-800 rounded-2xl space-y-4 transition-all hover:border-amber-400/50 shadow-xl relative">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex-1">
                        <label className={labelClass}>Skill Name</label>
                        <input value={skill.name} onChange={e => setSkills(skills.map((s: any) => s.id === skill.id ? {...s, name: e.target.value} : s))} className={`${inputBaseClass} font-bold`} />
                      </div>
                      <button onClick={async () => { 
                        if(confirm('Delete Skill?')) { 
                          await deleteSkill(skill.id); 
                          setSkills(skills.filter((s: any) => s.id !== skill.id));
                          router.refresh();
                        } 
                      }} className="text-red-400 hover:text-red-300 p-2.5 mt-5 bg-red-950/40 hover:bg-red-950/80 border border-red-800/40 rounded-xl transition-colors shrink-0">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Category</label>
                        <select value={skill.category} onChange={e => setSkills(skills.map((s: any) => s.id === skill.id ? {...s, category: e.target.value} : s))} className={inputBaseClass}>
                          <option value="HARD_SKILL" className="bg-zinc-900 text-white">Hard Skill</option>
                          <option value="SOFT_SKILL" className="bg-zinc-900 text-white">Soft Skill</option>
                          <option value="TOOL" className="bg-zinc-900 text-white">Tool / Software</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Display Pipeline</label>
                        <select value={skill.mode} onChange={e => setSkills(skills.map((s: any) => s.id === skill.id ? {...s, mode: e.target.value} : s))} className={inputBaseClass}>
                          <option value="MECHANICAL" className="bg-zinc-900 text-white">Mechanical Mode</option>
                          <option value="SOFTWARE" className="bg-zinc-900 text-white">Software Mode</option>
                          <option value="BOTH" className="bg-zinc-900 text-white">Universal (BOTH)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button onClick={async () => {
                        await updateSkill(skill.id, { name: skill.name, category: skill.category, mode: skill.mode });
                        alert("Skill updated successfully!");
                        router.refresh();
                      }} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95">
                        <Save size={14} strokeWidth={2.5}/> Save Skill
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-center pb-6 border-b border-zinc-800">
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tight">Achievements & Awards</h3>
                  <p className="text-zinc-400 font-medium text-sm mt-1">Manage competitions, honors, and certificates.</p>
                </div>
                <button onClick={async () => {
                  const newAch = { title: "New Achievement", year: "2026", description: "", credentialUrl: "", mode: "MECHANICAL", order: achievements.length + 1 };
                  const res = await createAchievement(newAch);
                  if (res?.success) {
                    router.refresh();
                    setAchievements([...achievements, res.achievement || { ...newAch, id: Date.now().toString() }]);
                  }
                }} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-400/20 transition-all active:scale-95 text-sm">
                  <Plus size={18} /> Add Achievement
                </button>
              </div>
              
              <div className="space-y-8">
                {achievements.map((ach: any) => (
                  <div key={ach.id} className="p-8 bg-[#09090b]/80 border border-zinc-800 rounded-3xl space-y-6 transition-all hover:border-amber-400/50 shadow-xl relative group">
                    <div className="flex justify-between items-start gap-6">
                      <div className="w-full">
                        <label className={labelClass}>Achievement Title</label>
                        <input value={ach.title} onChange={e => setAchievements(achievements.map((item: any) => item.id === ach.id ? {...item, title: e.target.value} : item))} className={`${inputBaseClass} text-lg font-black`} />
                      </div>
                      <button onClick={async () => { 
                        if(confirm('Delete Achievement permanently?')) { 
                          await deleteAchievement(ach.id); 
                          setAchievements(achievements.filter((item: any) => item.id !== ach.id));
                          router.refresh();
                        } 
                      }} className="text-red-400 hover:text-red-300 p-3 mt-5 bg-red-950/40 hover:bg-red-950/80 border border-red-800/40 rounded-xl transition-colors shrink-0">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className={labelClass}>Year</label>
                        <input value={ach.year || ""} onChange={e => setAchievements(achievements.map((item: any) => item.id === ach.id ? {...item, year: e.target.value} : item))} className={inputBaseClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Display Pipeline</label>
                        <select value={ach.mode} onChange={e => setAchievements(achievements.map((item: any) => item.id === ach.id ? {...item, mode: e.target.value} : item))} className={inputBaseClass}>
                          <option value="MECHANICAL" className="bg-zinc-900 text-white">Mechanical Mode</option>
                          <option value="SOFTWARE" className="bg-zinc-900 text-white">Software Mode</option>
                          <option value="BOTH" className="bg-zinc-900 text-white">Universal (BOTH)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className={`${labelClass} flex items-center gap-1.5`}><Globe size={14}/> Credential / Certificate URL</label>
                        <input value={ach.credentialUrl || ""} onChange={e => setAchievements(achievements.map((item: any) => item.id === ach.id ? {...item, credentialUrl: e.target.value} : item))} placeholder="https://..." className={inputBaseClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Achievement Badge / Award Image</label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => triggerImageUpload(`ach-${ach.id}`)}
                            disabled={uploadingState.uploading && uploadingState.id === `ach-${ach.id}`}
                            className="shrink-0 flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2.5 rounded-xl font-bold text-xs border border-zinc-700"
                          >
                            <UploadCloud size={16} className={uploadingState.uploading && uploadingState.id === `ach-${ach.id}` ? "animate-bounce text-amber-400" : ""} />
                            {uploadingState.uploading && uploadingState.id === `ach-${ach.id}` ? "Uploading..." : "Upload Image"}
                          </button>
                          <input 
                            value={ach.imageUrl || ""} 
                            onChange={e => setAchievements(achievements.map((item: any) => item.id === ach.id ? {...item, imageUrl: e.target.value} : item))} 
                            placeholder="https://... or /uploads/..." 
                            className={inputBaseClass} 
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea value={ach.description || ""} onChange={e => setAchievements(achievements.map((item: any) => item.id === ach.id ? {...item, description: e.target.value} : item))} rows={3} className={inputBaseClass} />
                    </div>

                    <div className="pt-4 flex justify-end border-t border-zinc-800/80">
                      <button onClick={async () => {
                        await updateAchievement(ach.id, {
                          title: ach.title, year: ach.year, description: ach.description,
                          credentialUrl: ach.credentialUrl, imageUrl: ach.imageUrl, mode: ach.mode
                        });
                        alert("Achievement updated successfully!");
                        router.refresh();
                      }} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-6 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95 text-xs">
                        <Save size={16} strokeWidth={2.5}/> Save Achievement
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === "certificates" && (
            <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-center pb-6 border-b border-zinc-800">
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tight">Licenses &amp; Certifications</h3>
                  <p className="text-zinc-400 font-medium text-sm mt-1">Manage professional credentials, badges, and verification links.</p>
                </div>
                <button onClick={async () => {
                  const newCert = { 
                    title: "New Certification", 
                    issuer: "Issuing Organization", 
                    issueDate: "2026", 
                    expiryDate: "No Expiration", 
                    credentialId: "", 
                    credentialUrl: "", 
                    imageUrl: "", 
                    mode: "BOTH", 
                    order: certificates.length + 1 
                  };
                  const res = await createCertificate(newCert);
                  if (res?.success) {
                    router.refresh();
                    setCertificates([...certificates, res.certificate || { ...newCert, id: Date.now().toString() }]);
                  }
                }} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-400/20 transition-all active:scale-95 text-sm">
                  <Plus size={18} /> Add Certificate
                </button>
              </div>
              
              <div className="space-y-8">
                {certificates.map((cert: any) => (
                  <div key={cert.id} className="p-8 bg-[#09090b]/80 border border-zinc-800 rounded-3xl space-y-6 transition-all hover:border-amber-400/50 shadow-xl relative group">
                    <div className="flex justify-between items-start gap-6">
                      <div className="grid grid-cols-2 gap-6 w-full">
                        <div>
                          <label className={labelClass}>Certificate / Credential Title</label>
                          <input value={cert.title} onChange={e => setCertificates(certificates.map((item: any) => item.id === cert.id ? {...item, title: e.target.value} : item))} className={`${inputBaseClass} text-lg font-black`} />
                        </div>
                        <div>
                          <label className={labelClass}>Issuing Organization / Authority</label>
                          <input value={cert.issuer} onChange={e => setCertificates(certificates.map((item: any) => item.id === cert.id ? {...item, issuer: e.target.value} : item))} className={`${inputBaseClass} text-lg font-black`} />
                        </div>
                      </div>
                      <button onClick={async () => { 
                        if(confirm('Delete Certificate permanently?')) { 
                          await deleteCertificate(cert.id); 
                          setCertificates(certificates.filter((item: any) => item.id !== cert.id));
                          router.refresh();
                        } 
                      }} className="text-red-400 hover:text-red-300 p-3 mt-5 bg-red-950/40 hover:bg-red-950/80 border border-red-800/40 rounded-xl transition-colors shrink-0">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                      <div>
                        <label className={labelClass}>Issue Date</label>
                        <input value={cert.issueDate || ""} onChange={e => setCertificates(certificates.map((item: any) => item.id === cert.id ? {...item, issueDate: e.target.value} : item))} placeholder="e.g. Nov 2025" className={inputBaseClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Expiry Date</label>
                        <input value={cert.expiryDate || ""} onChange={e => setCertificates(certificates.map((item: any) => item.id === cert.id ? {...item, expiryDate: e.target.value} : item))} placeholder="e.g. Nov 2028 or No Expiration" className={inputBaseClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Credential ID</label>
                        <input value={cert.credentialId || ""} onChange={e => setCertificates(certificates.map((item: any) => item.id === cert.id ? {...item, credentialId: e.target.value} : item))} placeholder="e.g. C-XXXXXXXXX" className={inputBaseClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Display Pipeline</label>
                        <select value={cert.mode} onChange={e => setCertificates(certificates.map((item: any) => item.id === cert.id ? {...item, mode: e.target.value} : item))} className={inputBaseClass}>
                          <option value="BOTH" className="bg-zinc-900 text-white">Universal (BOTH)</option>
                          <option value="MECHANICAL" className="bg-zinc-900 text-white">Mechanical Mode</option>
                          <option value="SOFTWARE" className="bg-zinc-900 text-white">Software Mode</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className={`${labelClass} flex items-center gap-1.5`}><Globe size={14}/> Credential Verification URL</label>
                        <input value={cert.credentialUrl || ""} onChange={e => setCertificates(certificates.map((item: any) => item.id === cert.id ? {...item, credentialUrl: e.target.value} : item))} placeholder="https://verify.example.com/..." className={inputBaseClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Certificate Badge / Logo Image</label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => triggerImageUpload(`cert-${cert.id}`)}
                            disabled={uploadingState.uploading && uploadingState.id === `cert-${cert.id}`}
                            className="shrink-0 flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2.5 rounded-xl font-bold text-xs border border-zinc-700"
                          >
                            <UploadCloud size={16} className={uploadingState.uploading && uploadingState.id === `cert-${cert.id}` ? "animate-bounce text-amber-400" : ""} />
                            {uploadingState.uploading && uploadingState.id === `cert-${cert.id}` ? "Uploading..." : "Upload Logo"}
                          </button>
                          <input 
                            value={cert.imageUrl || ""} 
                            onChange={e => setCertificates(certificates.map((item: any) => item.id === cert.id ? {...item, imageUrl: e.target.value} : item))} 
                            placeholder="https://... or /uploads/..." 
                            className={inputBaseClass} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end border-t border-zinc-800/80">
                      <button onClick={async () => {
                        await updateCertificate(cert.id, {
                          title: cert.title, issuer: cert.issuer, issueDate: cert.issueDate,
                          expiryDate: cert.expiryDate, credentialId: cert.credentialId,
                          credentialUrl: cert.credentialUrl, imageUrl: cert.imageUrl, mode: cert.mode
                        });
                        alert("Certificate updated successfully!");
                        router.refresh();
                      }} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-6 py-2.5 rounded-xl font-bold shadow-md transition-all active:scale-95 text-xs">
                        <Save size={16} strokeWidth={2.5}/> Save Certificate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media Library Tab */}
          {activeTab === "media" && (
            <div className="space-y-8 relative z-10">
              <div className="pb-6 border-b border-zinc-800">
                <h3 className="text-3xl font-black text-white tracking-tight">Media Processing Engine</h3>
                <p className="text-zinc-400 font-medium text-sm mt-1">Client-side Auto-Compression (WebP) before Vercel Blob Upload.</p>
              </div>

              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`p-16 border-2 border-dashed rounded-3xl text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[400px] ${isDragging ? "border-amber-400 bg-amber-400/10 scale-[1.02]" : "border-zinc-800 bg-[#09090b]/60 hover:border-zinc-700"}`}
              >
                {uploadingState.uploading && uploadingState.id === "media" ? (
                  <div className="flex flex-col items-center animate-pulse space-y-4">
                    <div className="bg-amber-400/10 p-6 rounded-full border border-amber-400/20">
                      <UploadCloud size={64} className="text-amber-400" />
                    </div>
                    <p className="text-amber-400 font-black text-xl tracking-tight">Compressing & Uploading...</p>
                  </div>
                ) : (
                  <>
                    <div className={`p-6 rounded-full mb-6 transition-colors ${isDragging ? "bg-amber-400/20 text-amber-400" : "bg-zinc-800 text-zinc-400"}`}>
                      <ImageIcon size={64} />
                    </div>
                    <h4 className={`text-2xl font-black tracking-tight mb-2 ${isDragging ? "text-amber-400" : "text-white"}`}>
                      {isDragging ? "Drop to Upload!" : "Drag & Drop Images"}
                    </h4>
                    <p className="text-zinc-400 font-medium text-sm mb-8 max-w-sm">
                      Files are automatically resized (max 1920px), compressed, and converted to .WEBP to save cloud storage space.
                    </p>
                    <button onClick={() => triggerImageUpload("media")} className="cursor-pointer inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 px-8 py-4 rounded-xl font-bold shadow-xl shadow-amber-400/10 transition-all active:scale-95 text-base">
                      Browse Files
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
