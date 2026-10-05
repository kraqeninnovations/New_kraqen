import React from "react";
import { useSiteData } from "@/lib/site-data";

export function LogoMark({ className = "w-8 h-8", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 rounded-[22%] transition-transform duration-300 group-hover:scale-105 ${className}`}
      {...props}
    >
      <rect width="512" height="512" rx="110" fill="#5E38EC" />
      <path
        d="M 42 512
           C 42 420, 42 300, 95 190
           C 145 90, 235 25, 360 20
           C 440 15, 485 45, 512 85
           L 512 512
           Z"
        fill="#171439"
      />
      <path
        d="M 190 60
           C 310 30, 445 60, 480 180
           C 515 300, 465 440, 345 478
           C 220 515, 135 440, 160 330
           C 180 230, 280 140, 390 170
           C 470 190, 490 280, 445 350
           C 400 410, 310 415, 275 355
           C 250 305, 290 250, 345 255
           C 385 260, 400 295, 385 320"
        stroke="#5E38EC"
        strokeWidth="48"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 235 460
           C 285 460, 380 475, 480 500
           L 512 512
           L 210 512
           C 220 490, 225 470, 235 460 Z"
        fill="#171439"
      />
      <path
        d="M 105 325
           C 100 300, 115 265, 142 258
           C 147 257, 149 262, 145 275
           C 137 305, 118 335, 108 335
           C 105 335, 104 330, 105 325 Z"
        fill="#74FF00"
      />
    </svg>
  );
}

export function Logo({
  showText = true,
  className = "",
  size = 32,
  textClassName = "font-display text-xl sm:text-2xl tracking-wider text-cream uppercase",
}: {
  showText?: boolean;
  className?: string;
  size?: number;
  textClassName?: string;
}) {
  const { site, navigation } = useSiteData();
  const logoText = navigation.logo || site.shortName || "KRAQEN";
  const subtitleText = site.name ? site.name.replace(logoText, "").trim() : "INNOVATIONS";

  return (
    <div className={`group inline-flex items-center gap-3 ${className}`}>
      <LogoMark style={{ width: size, height: size }} />
      {showText && (
        <span className={`inline-flex items-baseline ${textClassName}`}>
          {logoText}
          {subtitleText && (
            <span className="font-sans font-medium text-[10px] sm:text-xs text-muted-text ml-2 tracking-[0.2em] opacity-70 uppercase hidden xs:inline-block sm:inline-block">
              {subtitleText}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

