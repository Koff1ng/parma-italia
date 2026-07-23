import { useState, useEffect } from "react";
import "./AppPreloader.css";

export default function AppPreloader() {
  const [loading, setLoading] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Minimum display time for luxury entrance feel
    const timer = setTimeout(() => {
      setFadingOut(true);
      const removeTimer = setTimeout(() => {
        setLoading(false);
      }, 600); // 600ms fade transition
      return () => clearTimeout(removeTimer);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className={`app-preloader-backdrop ${fadingOut ? "fade-out" : ""}`}>
      <div className="preloader-content">
        <img src="/logo.png" alt="THE VOULT PRESTIGE" className="preloader-logo-img" />
        
        <div className="preloader-red-bar">
          <div className="preloader-progress-line"></div>
        </div>

        <p className="preloader-tagline">
          THE VOULT PRESTIGE • EDICIONES EXCLUSIVAS
        </p>
      </div>
    </div>
  );
}
