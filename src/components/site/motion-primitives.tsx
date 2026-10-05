import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

export const EASE = [0.76, 0, 0.24, 1] as const;
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function TextReveal({
  lines,
  className,
  delay = 0,
  inView = false,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  inView?: boolean;
}) {
  return (
    <span className={className}>
      {lines.map((l, i) => {
        const anim = { y: "0%", opacity: 1, filter: "blur(0px)" };
        return (
          <span key={i} className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block"
              initial={{ y: "110%", opacity: 0, filter: "blur(8px)" }}
              {...(inView
                ? { whileInView: anim, viewport: { once: true, margin: "-10%" } }
                : { animate: anim })}
              transition={{ duration: 1.4, ease: EASE_OUT, delay: delay + i * 0.12 }}
            >
              {l}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

export function ImageReveal({ src, alt, className, imgClassName }: { src: string; alt: string; className?: string; imgClassName?: string }) {
  return (
    <motion.div
      className={`overflow-hidden ${className ?? ""}`}
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover ${imgClassName ?? ""}`}
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.8, ease: EASE_OUT }}
      />
    </motion.div>
  );
}

export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  return (
    <motion.span
      ref={ref}
      className="inline-block"
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.span>
  );
}

export function FadeUp({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.1, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}
