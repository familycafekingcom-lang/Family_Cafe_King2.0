import { useEffect, useRef, type ReactNode } from "react";

type Variant = "up" | "left" | "right" | "scale";

interface RevealProps {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }

    // Safety fallback timer to ensure content is always revealed even if IO is delayed or trapped
    const fallbackTimer = window.setTimeout(() => {
      if (el && !el.classList.contains("in")) {
        el.classList.add("in");
      }
    }, 1200 + delay);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const t = window.setTimeout(() => {
              entry.target.classList.add("in");
            }, delay);
            io.unobserve(entry.target);
            return () => clearTimeout(t);
          }
        });
      },
      { threshold: 0.01, rootMargin: "100px 0px 100px 0px" },
    );

    io.observe(el);

    return () => {
      window.clearTimeout(fallbackTimer);
      io.disconnect();
    };
  }, [delay]);

  const base =
    variant === "up"
      ? "reveal"
      : variant === "left"
      ? "reveal-left"
      : variant === "right"
      ? "reveal-right"
      : "reveal-scale";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component: any = Tag;

  return (
    <Component ref={ref as never} className={`${base} ${className}`}>
      {children}
    </Component>
  );
}
