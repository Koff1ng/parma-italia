import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollAnimationObserver() {
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe existing elements
    const observeAll = () => {
      const elements = document.querySelectorAll(
        ".scroll-animate:not(.animate-in), .scroll-animate-fade:not(.animate-in)"
      );
      elements.forEach((el) => observer.observe(el));
    };

    observeAll();

    // MutationObserver to catch dynamically added elements (e.g. async-loaded products)
    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  return null;
}
