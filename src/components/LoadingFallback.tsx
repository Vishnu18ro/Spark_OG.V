import { SpaceBackground } from "@/components/SpaceBackground";

export const LoadingFallback = () => (
    <div className="min-h-screen relative flex items-center justify-center">
        <SpaceBackground />
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-glow-primary"></div>
            <div className="text-2xl text-primary animate-pulse font-bold tracking-widest">LOADING SPARK...</div>
        </div>
    </div>
);
