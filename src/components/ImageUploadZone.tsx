import { Camera, X, Loader2 } from "lucide-react";
import { useRef, useState, DragEvent, ClipboardEvent } from "react";
import { Label } from "./ui/label";
import { uploadImage } from "@/lib/storage";

interface ImageUploadZoneProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  variant?: 'default' | 'about-me';
  storagePath?: string;
}

export function ImageUploadZone({ label, value, onChange, onRemove, variant = 'default', storagePath = 'general' }: ImageUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const processFile = async (file?: File) => {
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      try {
        const url = await uploadImage(file, storagePath);
        onChange(url);
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0]);
  };

  const handleDragOver = (e: DragEvent<HTMLButtonElement>) => {
    if (variant === 'about-me') return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLButtonElement>) => {
    if (variant === 'about-me') return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLButtonElement>) => {
    if (variant === 'about-me') return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    let file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
      return;
    }

    // Try fetching from dropped URL or HTML image
    let url = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
    if (!url && e.dataTransfer.getData("text/html")) {
      const htmlMatch = e.dataTransfer.getData("text/html").match(/src="?([^" ]+)"?/);
      if (htmlMatch) url = htmlMatch[1];
    }

    if (url && url.match(/^https?:\/\//)) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        processFile(new File([blob], "dropped-image.jpg", { type: blob.type }));
      } catch (err) {
        console.error("Failed to fetch image URL", err);
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLButtonElement>) => {
    if (variant === 'about-me') return;
    const file = e.clipboardData.files?.[0] || Array.from(e.clipboardData.items || []).find(i => i.type.startsWith('image/'))?.getAsFile();
    if (file) {
      e.preventDefault();
      processFile(file);
    }
  };

  const isAbout = variant === 'about-me';

  const containerClasses = isAbout 
    ? "relative w-full aspect-[4/3] max-w-md rounded-xl overflow-hidden border-2 border-primary/20 bg-muted shadow-[0_0_15px_rgba(139,92,246,0.3)]"
    : "relative w-full h-48 rounded-lg overflow-hidden border border-border bg-muted";

  const emptyClasses = isAbout
    ? "w-full aspect-[4/3] max-w-md border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all shadow-sm hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
    : `w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-colors ${
        isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary hover:bg-muted/50'
      }`;

  const removeButtonClasses = isAbout
    ? "absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
    : "absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 shadow-sm hover:scale-110 transition-transform";

  return (
    <div className={isAbout ? "space-y-3" : "space-y-2"}>
      {label && (
        <Label className="bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent font-medium">
          {label}
        </Label>
      )}
      <div className={`flex flex-col gap-4 ${isAbout ? 'items-start' : 'items-center'}`}>
        {value ? (
          <div className={containerClasses}>
            <img src={value} alt="Upload" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={onRemove}
              className={removeButtonClasses}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : isUploading ? (
          <div className={emptyClasses.replace('hover:', '')}>
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground">Uploading...</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onPaste={handlePaste}
            className={emptyClasses}
          >
            <Camera className="w-8 h-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isAbout ? "Click to upload image" : "Click, paste, or drag & drop"}
            </span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
