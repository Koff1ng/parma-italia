import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollAnimationObserver() {
  const location = useLocation();

  useEffect(() => {
    // No ejecutar en páginas de admin/dashboard
    if (location.pathname === '/admin' || location.pathname === '/dashboard') {
      return;
    }

    // Esperar a que el DOM esté completamente cargado
    const initObserver = () => {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
      }

      // Configuración del observer
      const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      }, observerOptions);

      // Función para observar elementos
      const observeElements = () => {
        try {
          const elements = document.querySelectorAll(
            ".scroll-animate, .scroll-animate-fade, .scroll-animate-slide-left, .scroll-animate-slide-right, .scroll-animate-scale"
          );
          
          elements.forEach((element) => {
            if (!element.classList.contains("animate-in")) {
              observer.observe(element);
            }
          });
        } catch (error) {
          console.warn("Error en ScrollAnimationObserver:", error);
        }
      };

      // Observar elementos iniciales después de un pequeño delay
      setTimeout(() => {
        observeElements();
      }, 100);

      // Observar elementos nuevos que se agreguen dinámicamente
      const interval = setInterval(observeElements, 500);

      // Limpiar al desmontar
      return () => {
        clearInterval(interval);
        observer.disconnect();
      };
    };

    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initObserver);
    } else {
      const cleanup = initObserver();
      return cleanup;
    }
  }, [location.pathname]);

  return null;
}

