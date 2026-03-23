import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground" style={{ zoom: "90%" }}>
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold bg-gradient-electric bg-clip-text text-transparent">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-secondary transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
