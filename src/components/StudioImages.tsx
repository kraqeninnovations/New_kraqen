import { useSiteData } from '@/lib/site-data';

export function StudioImages() {
  const { site, about } = useSiteData();
  const images = about.studioImages;

  return (
    <div className="grid gap-4 md:grid-cols-12 items-stretch">
      {images.map((img, idx) => (
        <div key={idx} className={`${idx === 0 ? 'md:col-span-8 aspect-[16/9]' : 'md:col-span-4 aspect-[4/3] md:aspect-auto'} overflow-hidden bg-[#1a1a1a] border border-white/10`}>
          <img src={img} alt={`Studio image ${idx + 1}`} className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

export default StudioImages;
