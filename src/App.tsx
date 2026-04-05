import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { LoadingFallback } from "./components/LoadingFallback";

const Landing = lazy(() => import("./pages/Landing"));
const Guest = lazy(() => import("./pages/Guest"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const OPV = lazy(() => import("./pages/OPV"));
const OPVPortfolioDetail = lazy(() => import("./pages/OPVPortfolioDetail"));
const PortfolioPreview = lazy(() => import("./pages/PortfolioPreview"));
const ProfileEdit = lazy(() => import("./pages/ProfileEdit"));
const Welcome = lazy(() => import("./pages/Welcome"));
const Messages = lazy(() => import("./pages/Messages"));
const Settings = lazy(() => import("./pages/Settings"));
const Explore = lazy(() => import("./pages/Explore"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ReadMe = lazy(() => import("./pages/ReadMe"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,      // 2 min — data considered fresh, no refetch
      gcTime: 10 * 60 * 1000,         // 10 min — keep in memory for instant navigation
      refetchOnWindowFocus: false,     // don't refetch on alt-tab
      retry: 1,                        // retry once on failure
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/guest" element={<Guest />} />
            <Route path="/readme" element={<ReadMe />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/opv" element={<OPV />} />
            <Route path="/opv-portfolio" element={<OPVPortfolioDetail />} />
            <Route path="/opv-portfolio/:username" element={<OPVPortfolioDetail />} />
            <Route path="/portfolio" element={<PortfolioPreview />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:recipientId" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/explore" element={<Explore />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
