import "./Hero.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
export default function Hero() {
  return (
    <section className="hero">
      
      {/* 🔥 VIDEO BACKGROUND */}
      <video
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/video.webm" type="video/webm" />
      </video>

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1>ESSENZIALI</h1>
        <h2>Benvenuto</h2>
        <p>NUEVOS DISEÑOS</p>

         <Link to="/about" className="hero-btn">
          DESCUBRE MÁS
        </Link>
      </div>
    </section>
  );
}