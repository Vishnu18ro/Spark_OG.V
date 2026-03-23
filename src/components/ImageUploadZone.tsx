import { Camera, X } from "lucide-react";
import { useRef } from "react";
import { Label } from "./ui/label";

interface ImageUploadZoneProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export function ImageUploadZone({ label, value, onChange, onRemove }: ImageUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      {label && <Label className="bg-gradient-to-r from-[#22d3ee] to-[#c084fc] bg-clip-text text-transparent font-medium">{label}</Label>}
      <div className="flex flex-col items-start gap-4">
        {value ? (
          <div className="relative w-full aspect-[4/3] max-w-md rounded-xl overflow-hidden border-2 border-primary/20 bg-muted shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <img src={value} alt="Upload" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-[4/3] max-w-md border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all shadow-sm hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            <Camera className="w-8 h-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Click to upload image</span>
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
