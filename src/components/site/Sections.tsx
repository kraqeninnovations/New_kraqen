import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { partners, projects, services, type Project } from "@/data/site";
import { EASE_OUT, FadeUp, ImageReveal, TextReveal } from "./motion-primitives";

function useFollower() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 150, damping: 20, mass: 0.6 });
  const vx = useMotionValue(0);
  const rotate = useSpring(useTransform(vx, [-40, 40], [-8, 8]), { stiffness: 120, damping: 18 });
  const onMove = (e: React.MouseEvent) => {
    vx.set(Math.max(-40, Math.min(40, e.clientX - x.get())));
    x.set(e.clientX); y.set(e.clientY);
  };
  return { sx, sy, rotate, onMove };
}

function FloatingPreview({ image, show, f, w = "w-[26rem]" }: { image?: string | undefined; show: boolean; f: ReturnType<typeof useFollower>; w?: string }) {
  return (
    <motion.div
      className={`pointer-events-none fixed top-0 left-0 z-30 hidden aspect-[4/3] md:block ${w}`}
      style={{ x: f.sx, y: f.sy, rotate: f.rotate, translateX: "-50%", translateY: "-50%" }}
      animate={{ scale: show ? 1 : 0, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      <div className="relative h-full w-full overflow-hidden">
        <AnimatePresence initial={false}>
          {image && (
            <motion.img
              key={image}
              src={image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.15 }}
              animate={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function SelectedWork({ items = projects, heading = true }: { items?: Project[]; heading?: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  const f = useFollower();
  return (
    <section className="px-5 py-28 md:px-10 md:py-40" onMouseMove={f.onMove}>
      {heading && (
        <div className="mb-16 grid gap-6 md:grid-cols-12 md:items-end">
          <h2 className="text-section md:col-span-8"><TextReveal inView lines={["Selected", "Work"]} /></h2>
          <FadeUp className="max-w-sm text-lg text-muted-foreground md:col-span-4">
            A selection of films, photographs, campaigns, and brand worlds.
          </FadeUp>
        </div>
      )}
      <ul onMouseLeave={() => setActive(null)} className="border-t">
        {items.map((p, i) => {
          const on = active === i;
          const dim = active !== null && !on;
          return (
            <li key={p.slug} onMouseEnter={() => setActive(i)} data-cursor="view" className="border-b">
              <Link to="/work" className="group block py-6 md:py-9">
                <div className={`grid grid-cols-12 items-baseline gap-4 transition-opacity duration-500 ${dim ? "opacity-30" : ""}`}>
                  <span className="col-span-2 h-5 overflow-hidden text-sm leading-5 text-muted-foreground md:col-span-1">
                    <motion.span className="block" animate={{ y: on ? "-100%" : "0%" }} transition={{ duration: 0.5, ease: EASE_OUT }}>
                      {String(i + 1).padStart(2, "0")}
                    </motion.span>
                    <motion.span className="block text-foreground" animate={{ y: on ? "-100%" : "0%" }} transition={{ duration: 0.5, ease: EASE_OUT }}>
                      →
                    </motion.span>
                  </span>
                  <motion.h3 className="text-project col-span-10 md:col-span-6" animate={{ x: on ? 24 : 0 }} transition={{ duration: 0.6, ease: EASE_OUT }}>
                    {p.title}
                  </motion.h3>
                  <motion.span className="col-span-8 col-start-3 text-sm text-muted-foreground md:col-span-3 md:col-start-auto" animate={{ x: on ? -12 : 0 }} transition={{ duration: 0.6, ease: EASE_OUT }}>
                    {p.disciplines}
                  </motion.span>
                  <span className="col-span-2 text-right text-sm text-muted-foreground">{p.year}</span>
                </div>
                <div className="mt-5 aspect-[16/10] overflow-hidden md:hidden">
                  <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <FloatingPreview image={active !== null ? items[active]?.image : undefined} show={active !== null} f={f} />
    </section>
  );
}

export function FeaturedProject() {
  const p = projects[0]!;
  return (
    <section className="px-5 pb-28 md:px-10 md:pb-40">
      <Link to="/work" data-cursor="view" className="group relative block aspect-[4/5] overflow-hidden text-paper md:aspect-[21/9]">
        <ImageReveal src={p.image} alt={p.title} className="absolute inset-0" imgClassName="transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-scrim to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between md:p-10">
          <div className="transition-transform duration-700 group-hover:-translate-y-2">
            <p className="eyebrow opacity-80">Featured — selected</p>
            <h3 className="text-section mt-3">{p.title}</h3>
          </div>
          <span className="flex items-center gap-3 text-sm">
            View project
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
          </span>
        </div>
      </Link>
    </section>
  );
}

export function Services() {
  const [active, setActive] = useState<number | null>(null);
  const f = useFollower();
  return (
    <section className="bg-ink px-5 py-28 text-paper md:px-10 md:py-40" onMouseMove={f.onMove}>
      <div className="mb-16 grid gap-6 md:grid-cols-12 md:items-end">
        <h2 className="text-section md:col-span-8"><TextReveal inView lines={["What we do"]} /></h2>
        <p className="eyebrow opacity-60 md:col-span-4">Full service production</p>
      </div>
      <ul onMouseLeave={() => setActive(null)} className="border-t border-paper/15">
        {services.map((s, i) => {
          const on = active === i;
          return (
            <motion.li
              key={s.title}
              onMouseEnter={() => setActive(i)}
              data-cursor="link"
              className="border-b border-paper/15"
              animate={{ paddingTop: on ? 44 : 28, paddingBottom: on ? 44 : 28 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              <div className="grid grid-cols-12 items-center gap-4">
                <motion.span className="col-span-2 text-sm opacity-60 md:col-span-1" animate={{ x: on ? 10 : 0 }}>
                  {String(i + 1).padStart(2, "0")}
                </motion.span>
                <h3 className="text-project col-span-10 md:col-span-5">{s.title}</h3>
                <p className={`col-span-10 col-start-3 max-w-sm opacity-70 transition-all duration-500 md:col-span-5 md:col-start-auto ${on ? "md:translate-y-0 md:opacity-80" : "md:translate-y-2 md:opacity-0"}`}>
                  {s.body}
                </p>
                <motion.span className="col-span-1 hidden justify-self-end md:block" animate={{ x: on ? 0 : -10, rotate: on ? 0 : -45 }}>
                  <ArrowUpRight className="h-5 w-5" />
                </motion.span>
              </div>
            </motion.li>
          );
        })}
      </ul>
      <FloatingPreview image={active !== null ? services[active]?.image : undefined} show={active !== null} f={f} w="w-[20rem]" />
    </section>
  );
}

export function Partners() {
  return (
    <section className="px-5 py-28 md:px-10 md:py-40">
      <h2 className="text-section mb-16"><TextReveal inView lines={["Good company.", <span className="font-serif italic font-normal text-muted-foreground">Great stories.</span>]} /></h2>
      <div className="grid grid-cols-2 border-t border-l md:grid-cols-4">
        {partners.map((n, i) => (
          <motion.div
            key={n}
            className="group flex aspect-[3/2] items-center justify-center border-r border-b"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: i * 0.06 }}
          >
            <span className="flex items-center gap-2 text-xl tracking-tight opacity-40 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100 md:text-2xl">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className="fill-current">
                {i % 3 === 0 ? <circle cx="9" cy="9" r="8" /> : i % 3 === 1 ? <rect x="1" y="1" width="16" height="16" /> : <polygon points="9,1 17,17 1,17" />}
              </svg>
              <span className={i % 2 ? "font-serif italic" : "font-medium"}>{n}</span>
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function AboutTeaser({ image }: { image: string }) {
  return (
    <section className="grid gap-12 px-5 pb-28 md:grid-cols-12 md:px-10 md:pb-40">
      <ImageReveal src={image} alt="Studio at work" className="aspect-[4/5] md:col-span-5" />
      <div className="flex flex-col justify-between gap-10 md:col-span-6 md:col-start-7">
        <p className="eyebrow text-muted-foreground">About the studio</p>
        <h2 className="text-section"><TextReveal inView lines={["A point of view,", "carried through", "every frame."]} /></h2>
        <FadeUp className="max-w-md text-lg text-muted-foreground">
          Lumen translates brand moments into visceral perspectives, flexing between the quietude of the ethereal and the grit of the expressive.
        </FadeUp>
        <Link to="/about" data-cursor="link" className="link-line w-fit text-sm">About us →</Link>
      </div>
    </section>
  );
}
