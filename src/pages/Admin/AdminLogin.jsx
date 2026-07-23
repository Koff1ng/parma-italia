import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./Admin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Try Supabase Auth
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!authErr && data.user) {
        localStorage.setItem("tvp_admin_auth", "true");
        navigate("/dashboard", { replace: true });
        return;
      }

      // 2. Fallback admin password check for easy initial access
      if (
        (email === "admin@thevaultprestige.com" || email === "admin") &&
        (password === "vault2026" || password === "admin123")
      ) {
        localStorage.setItem("tvp_admin_auth", "true");
        navigate("/dashboard", { replace: true });
        return;
      }

      setError(authErr ? authErr.message : "Credenciales incorrectas.");
    } catch (err) {
      // Direct master fallback
      if (password === "vault2026" || password === "admin123") {
        localStorage.setItem("tvp_admin_auth", "true");
        navigate("/dashboard", { replace: true });
        return;
      }
      setError("Error de autenticación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="login-logo">
          <span>THE VAULT</span>
          <span className="gold-sub">PRESTIGE ADMIN</span>
        </div>

        <h2>PANEL DE CONTROL</h2>

        {error && <div className="admin-error-box">{error}</div>}

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-input-group">
            <label>Correo Electrónico Admin</label>
            <input
              type="text"
              placeholder="admin@thevaultprestige.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-gold" disabled={loading}>
            {loading ? "VERIFICANDO..." : "INGRESAR AL PANEL VIP"}
          </button>
        </form>

        <p className="admin-hint">Clave por defecto de inicio: admin / vault2026</p>
      </div>
    </div>
  );
}
