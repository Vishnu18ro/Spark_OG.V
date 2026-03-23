import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface FullViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function FullViewModal({ isOpen, onClose, title, children }: FullViewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] bg-card/95 backdrop-blur-xl border-2 border-primary/50 shadow-[0_0_30px_rgba(168,85,247,0.4)] p-0 flex flex-col [&>button]:hidden">
        <DialogHeader className="border-b border-primary/30 px-8 py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl font-bold bg-gradient-electric bg-clip-text text-transparent">
              {title}
            </DialogTitle>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-primary/20 transition-all duration-300 hover:rotate-90"
            >
              <X className="w-6 h-6 text-primary" />
            </button>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 px-8 py-6 overflow-y-auto">
          <div className="space-y-6">
            {children}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
