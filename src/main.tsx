
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./app/App.tsx";
import { AuthProvider } from "./app/auth/AuthContext";
import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  );
  
