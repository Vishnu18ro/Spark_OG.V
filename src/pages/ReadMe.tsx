import { SpaceBackground } from "@/components/SpaceBackground";
import { Header } from "@/components/Header";
import {
    Rocket,
    Search,
    Eye,
    Sparkles,
    User,
    Lock,
    MessageCircle,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { isGuestMode } from "@/lib/auth";
import { useEffect } from "react";

export default function ReadMe() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isGuestMode()) {
            // If not a guest (and likely authenticated or just visiting), 
            // maybe we still want to show it? 
            // But the requirement says "Guest Mode Only".
            // Let's keep it accessible but primarily for guests.
        }
    }, []);

    const features = [
        {
            icon: Sparkles,
            title: "Explore",
            description: "Discover public profiles of SPARK users. Browse through the community and see what others are building.",
            action: "Go to Explore",
            path: "/explore",
            color: "text-blue-400"
        },
        {
            icon: Search,
            title: "Search & OPV",
            description: "Know a username? Search for them directly to access their Other Person's View (OPV) and see their portfolio.",
            action: "Try Search in Header",
            path: null, // Focus on header
            color: "text-purple-400"
        },
        {
            icon: User,
            title: "Portfolio Hub",
            description: "View detailed portfolios including Projects, Experience, and Skills. As a guest, you have read-only access to these details.",
            action: "View Example (Search 'vishnu')",
            path: null,
            color: "text-green-400"
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            <SpaceBackground />
            <Header isAuthenticated={false} isGuest={true} />

            <main className="container mx-auto px-4 pt-24 pb-20 relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-16 space-y-6 animate-float">
                    <div className="inline-block p-4 rounded-full bg-primary/10 border border-primary/30 mb-4">
                        <Rocket className="w-12 h-12 text-primary animate-glow" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold bg-gradient-electric bg-clip-text text-transparent">
                        Welcome to SPARK
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        The ultimate portfolio platform for developers and creators.
                        <br />
                        You are currently browsing in <span
                            className="text-primary font-semibold cursor-pointer hover:underline hover:text-primary/80 transition-colors"
                            onClick={() => navigate("/guest")}
                        >
                            Guest Mode
                        </span>.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow-primary group"
                        >
                            <feature.icon className={`w-10 h-10 mb-4 ${feature.color}`} />
                            <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground mb-6 h-20">
                                {feature.description}
                            </p>
                            {feature.path && (
                                <Button
                                    variant="ghost"
                                    className="group-hover:translate-x-1 transition-transform p-0 hover:bg-transparent"
                                    onClick={() => navigate(feature.path!)}
                                >
                                    {feature.action} <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Guest Limitations */}
                <div className="bg-card/20 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 mb-20">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
                                <Lock className="w-8 h-8 text-yellow-500" />
                                Guest Mode Limitations
                            </h2>
                            <ul className="space-y-4 text-muted-foreground">
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2.5" />
                                    <span>
                                        <strong>View Only:</strong> You can view profiles and portfolios, but you cannot edit them or create your own.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2.5" />
                                    <span>
                                        <strong>No Messaging:</strong> Direct messaging is disabled. You must sign in to connect with others.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2.5" />
                                    <span>
                                        <strong>No Progress Saving:</strong> Listings and preferences are not saved in Guest Mode.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex-1 bg-gradient-to-br from-primary/20 to-purple-500/20 p-8 rounded-2xl border border-white/10 text-center space-y-6">
                            <h3 className="text-2xl font-bold text-foreground">Ready to join?</h3>
                            <p className="text-muted-foreground">
                                Create your own professional portfolio, connect with others, and showcase your work to the world.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-primary text-primary-foreground hover:shadow-glow-primary"
                                    onClick={() => navigate("/", { state: { tab: "signup" } })}
                                >
                                    Sign Up Now
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => navigate("/", { state: { tab: "signin" } })}
                                >
                                    Sign In
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
