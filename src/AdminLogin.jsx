import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./styles/Admin.css";  // correcto

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔥 Revisar si el admin ya está logueado
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard", { replace: true }); // CORREGIDO
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Verificando sesión…</p>
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, pass);

      navigate("/dashboard", { replace: true }); // CORREGIDO
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-credential") {
        setError("Correo o contraseña incorrectos");
      } else {
        setError("Error al iniciar sesión");
      }
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleLogin} className="admin-card">
        <h2>Panel Admin</h2>

        {error && <p className="admin-error">{error}</p>}

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
