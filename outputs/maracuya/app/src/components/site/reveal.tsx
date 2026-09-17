import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Retraso del escalonado, en milisegundos. Acótalo: ver `stagger`. */
  delay?: number;
  className?: string;
};

/**
 * Revelado al entrar en pantalla, para rejillas que se leen como listas.
 *
 * Dos decisiones deliberadas:
 *
 * 1. El estado por defecto del marcado es visible. El ocultamiento lo pone
 *    este efecto, así que si el script falla o no llega a correr, no hay
 *    nada escondido.
 * 2. Lo que ya está en pantalla al montar no se anima. Con render en el
 *    servidor el contenido se pinta antes de hidratar, y animarlo después
 *    produciría un parpadeo: aparece, se esconde y vuelve.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    el.style.setProperty("--reveal-delay", `${delay}ms`);
    el.dataset["reveal"] = "pending";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.dataset["reveal"] = "in";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Retraso de un elemento dentro de una lista escalonada.
 * El total está acotado: a partir del sexto, todos entran a la vez, para que
 * una rejilla larga no obligue a esperar.
 */
export function stagger(index: number, step = 70, max = 6) {
  return Math.min(index, max) * step;
}
