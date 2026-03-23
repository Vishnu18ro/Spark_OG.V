import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ProfileProvider } from "./contexts/ProfileContext";
import { OPVProvider } from "./contexts/OPVContext";

createRoot(document.getElementById("root")!).render(
  <ProfileProvider>
    <OPVProvider>
      <App />
    </OPVProvider>
  </ProfileProvider>
);
