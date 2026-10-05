import { motion } from 'motion/react';
import { useSiteData } from '@/lib/site-data';

export function Team() {
  const { site, about } = useSiteData();
  const team = about.team;

  return (
    <div className="space-y-16">
      <div className="mb-14">
        <p className="eyebrow text-[var(--color-accent,#ff3b00)] mb-2">LEADERSHIP & TALENT</p>
        <h2 className="font-display text-4xl sm:text-5xl text-cream uppercase">
          THE PEOPLE BEHIND {site.shortName || 'KRAQEN'}
        </h2>
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        {team.map((member, idx) => (
          <motion.div key={member.name || idx} className="space-y-4">
            <div className="aspect-[4/5] overflow-hidden bg-[#1a1a1a] border border-white/10">
              <img src={member.image} alt={member.name} className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
            <h3 className="font-display text-3xl text-cream uppercase">{member.name}</h3>
            <p className="eyebrow text-[var(--color-accent,#ff3b00)]">{member.role}</p>
            <p className="text-xs text-muted-text leading-relaxed">{member.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Team;
