import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  // Prevent the error from appearing in console
  event.preventDefault();
  
  // Silently handle authentication and network errors
  const error = event.reason;
  if (error?.message?.includes('Failed to fetch') || 
      error?.message?.includes('NetworkError') ||
      error?.message?.includes('401') ||
      error?.message?.includes('302')) {
    // These are expected during authentication flow
    return;
  }
});

createRoot(document.getElementById("root")!).render(<App />);
