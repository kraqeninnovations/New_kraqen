import { SiteContent } from '../schemas/site';
import { HomeContent } from '../schemas/home';
import { AboutContent } from '../schemas/about';
import { WorkContent } from '../schemas/work';
import { ContactContent } from '../schemas/contact';

export const defaultSite: SiteContent = {
  brand: {
    name: "Kraqen Innovations LLP",
    legalName: "Kraqen Innovations LLP",
    shortName: "Kraqen",
    url: "https://www.kraqeninc.com",
    email: "support@kraqeninc.com",
    phone: "+91 8939651621",
    tagline: "We Build Brands That Perform, Scale & Dominate",
    description: "Kraqen Innovations LLP is a creative, technology and digital innovation studio. We build brands that perform, scale and dominate.",
    giantWordmark: "kraqen",
    copyright: "© 2026 KRAQEN INNOVATIONS LLP. ALL RIGHTS RESERVED."
  },
  seo: {
    title: "Kraqen Innovations LLP — Creative, Technology & Production Studio",
    description: "We build brands that perform, scale and dominate. Creativity, technology and digital innovation under one roof.",
    ogImage: "/og-image.png",
    keywords: ["production studio", "creative technology", "digital innovation"]
  },
  logos: {
    navbarLogo: "/brand/kraqen-mark.png",
    whiteLogo: "/brand/kraqen-mark.png",
    darkLogo: "/brand/kraqen-mark.png",
    mark: "/brand/kraqen-mark.png",
    favicon: "/brand/kraqen-mark.png",
    alt: "Kraqen Innovations LLP"
  },
  navigation: {
    links: [
      { label: "WORK", href: "/work" },
      { label: "ABOUT", href: "/about" },
      { label: "CONTACT", href: "/contact" }
    ],
    cta: {
      label: "START A PROJECT",
      href: "/contact"
    },
    mobileMenuLabel: "MENU",
    mobileCloseLabel: "CLOSE"
  },
  socials: [
    { label: "INSTAGRAM", href: "https://instagram.com/kraqeninc" },
    { label: "LINKEDIN", href: "https://linkedin.com/company/kraqeninc" },
    { label: "TWITTER / X", href: "https://x.com/kraqeninc" }
  ],
  marquee: {
    pill: "KRAQEN INNOVATIONS",
    category: "CREATIVE + TECH + MARKETING",
    p1: "WE BUILD BRANDS THAT PERFORM, SCALE AND DOMINATE. CREATIVITY, TECHNOLOGY AND DIGITAL INNOVATION UNDER ONE ROOF.",
    p2: "FROM BRANDING AND VIDEO TO MARKETING, WEBSITES AND SOFTWARE. CREATIVITY THAT PERFORMS."
  },
  footer: {
    cta: {
      line1: "LET'S WORK",
      line2: "TOGETHER",
      href: "/contact"
    },
    navColumns: [
      [
        { label: "WORK", href: "/work" },
        { label: "ABOUT", href: "/about" },
        { label: "CONTACT", href: "/contact" }
      ],
      [
        { label: "INSTAGRAM", href: "https://instagram.com/kraqeninc" },
        { label: "LINKEDIN", href: "https://linkedin.com/company/kraqeninc" },
        { label: "TWITTER / X", href: "https://x.com/kraqeninc" }
      ]
    ]
  },
  reelWidget: {
    title: "KRAQEN INNOVATIONS — 2026 REEL",
    label: "VIEW REEL",
    videoSrc: "/about/showreel.mp4",
    previewSrc: "/about/showreel-preview.mp4",
    posterSrc: "/about/showreel-poster.jpg",
    enabled: true
  },
  notFound: {
    title: "PAGE NOT FOUND",
    message: "The frame you are looking for does not exist or has moved.",
    buttonLabel: "RETURN HOME",
    buttonHref: "/"
  },
  errors: {
    generic: "Something went wrong. Please try again later.",
    network: "Network connection error. Please verify your connection.",
    formRequired: "This field is required.",
    formInvalidEmail: "Please provide a valid email address.",
    formServerError: "Failed to send message. Please email us directly."
  }
};

export const defaultHome: HomeContent = {
  seo: {
    title: "Kraqen Innovations LLP — Creative & Production Studio",
    description: "We translate brand stories into cinematic work people feel, remember, and recognize as yours."
  },
  hero: {
    headlineLines: ["WE GIVE", "YOU A POINT", "OF VIEW"],
    location: "CHENNAI — INDIA",
    paragraph: "You're building a brand with something to say. We translate that story into cinematic work people feel, remember, and recognize as yours.",
    cta: { label: "VIEW OUR WORK", href: "#work" },
    images: [
      { src: "/images/hero-snacks.jpg", alt: "Smiling woman holding colorful snack packs", position: "top-center" },
      { src: "/images/hero-runner.jpg", alt: "Person running on grass field, motion blur", position: "left" },
      { src: "/images/hero-ice.jpg", alt: "Blue ice cube on deep blue background", position: "left-center" },
      { src: "/images/hero-city.jpg", alt: "City skyline at golden hour sunset", position: "right" }
    ]
  },
  selectedWork: {
    label: "SELECTED WORK",
    labelLeft: "PORTFOLIO",
    labelRight: "SELECTED WORK",
    headingLines: ["SELECTED", "WORK"],
    paragraph: "A selection of brand identities, campaigns, websites and digital products.",
    sideText: "A selection of brand identities, campaigns, websites and digital products.",
    hoverLabel: "VIEW",
    source: "manual" as const,
    limit: 12,
    viewer: {
      closeLabel: "CLOSE",
      prevLabel: "PREVIOUS",
      nextLabel: "NEXT",
      hint: "SWIPE UP OR DOWN FOR MORE",
      reelBadge: "REEL",
      postBadge: "POST"
    },
    projects: [
      { id: "01", number: "01", title: "RUGBY BRICKS", name: "RUGBY BRICKS", category: "REEL", services: "REEL PRODUCTION", year: "2026", mediaType: "reel" as const, instagramUrl: "https://www.instagram.com/reel/DC_Kraqen01/", image: "/images/work/reel-01.webp", video: "", fit: "cover" as const, imageStyle: "full-bleed" as const, alt: "Rugby Bricks Reel" },
      { id: "02", number: "02", title: "SNACKISH CAMPAIGN", name: "SNACKISH CAMPAIGN", category: "POST", services: "CAMPAIGN POSTER", year: "2026", mediaType: "post" as const, instagramUrl: "https://www.instagram.com/p/DC_Kraqen02/", image: "/images/work/post-02.webp", video: "", fit: "inset" as const, imageStyle: "inset" as const, alt: "Snackish Campaign Poster" },
      { id: "03", number: "03", title: "KODAMA ICE CO.", name: "KODAMA ICE CO.", category: "REEL", services: "PRODUCT REEL", year: "2026", mediaType: "reel" as const, instagramUrl: "https://www.instagram.com/reel/DC_Kraqen03/", image: "/images/work/reel-03.webp", video: "", fit: "cover" as const, imageStyle: "full-bleed" as const, alt: "Kodama Ice Co. Reel" },
      { id: "04", number: "04", title: "CAFÉ KITSUNÉ", name: "CAFÉ KITSUNÉ", category: "POST", services: "EDITORIAL POST", year: "2026", mediaType: "post" as const, instagramUrl: "https://www.instagram.com/p/DC_Kraqen04/", image: "/images/work/post-04.webp", video: "", fit: "cover" as const, imageStyle: "full-bleed" as const, alt: "Café Kitsuné Editorial" }
    ]
  },
  services: {
    labelLeft: "WHAT WE DO",
    labelRight: "FULL SERVICE PRODUCTION",
    items: [
      { number: "01", name: "VIDEOGRAPHY", description: "END-TO-END VIDEO PRODUCTION SHAPED AROUND THE STORY." },
      { number: "02", name: "PHOTOGRAPHY", description: "CAMPAIGN, PRODUCT, AND EDITORIAL IMAGERY WITH CINEMATIC INTENT." },
      { number: "03", name: "SOCIAL CONTENT", description: "PLATFORM-NATIVE STORIES TOLD BESPOKE FOR YOUR BRAND." },
      { number: "04", name: "CREATIVE DIRECTION", description: "CONCEPT AND VISUAL DIRECTION THAT CONNECTS EVERY FRAME." }
    ]
  },
  partners: {
    labelLeft: "FRIENDS WE'VE WORKED WITH",
    labelRight: "SELECTED PARTNERS",
    headingLines: ["GOOD COMPANY.", "GREAT STORIES."],
    fillEmptyCells: true,
    clients: [
      { id: "snackish", name: "snackish", logo: "/logos/snackish.svg", hoverImage: "/images/hover-snackish.jpg", scale: 1 },
      { id: "smart-sweets", name: "Smart Sweets", logo: "/logos/smart-sweets.svg", hoverImage: "/images/hover-smart-sweets.jpg", scale: 1 },
      { id: "kitsune", name: "Café Kitsuné Paris", logo: "/logos/kitsune.svg", hoverImage: "/images/hover-kitsune.jpg", scale: 1 },
      { id: "rugbybricks", name: "Rugbybricks", logo: "/logos/rugbybricks.svg", hoverImage: "/images/hover-rugbybricks.jpg", scale: 1 },
      { id: "staffbase", name: "Staffbase", logo: "/logos/staffbase.svg", hoverImage: "/images/hover-staffbase.jpg", scale: 1 },
      { id: "tevah", name: "Tevah", logo: "/logos/tevah.svg", hoverImage: "/images/hover-tevah.jpg", scale: 1 },
      { id: "mugco", name: "Mug Co.", logo: "/logos/mug.svg", hoverImage: "/images/hover-mug.jpg", scale: 1 },
      { id: "slo", name: "slo.", logo: "/logos/slo.svg", hoverImage: "/images/hover-slo.jpg", scale: 1 },
      { id: "kodama", name: "Kodama Ice Co.", logo: "/logos/kodama.svg", hoverImage: "/images/hero-ice.jpg", scale: 1 },
      { id: "contenthub", name: "contenthub.diy", logo: "/logos/contenthub.svg", hoverImage: "/images/hero-city.jpg", scale: 1 },
      { id: "shineon", name: "Shine On Stories", logo: "/logos/shineon.svg", hoverImage: "/images/hero-snacks.jpg", scale: 1 }
    ]
  }
};

export const defaultAbout: AboutContent = {
  seo: {
    title: "About — Kraqen Innovations LLP",
    description: "Kraqen Innovations translates brand moments into visceral perspectives."
  },
  intro: {
    title: "ABOUT",
    paragraph: "Kraqen Innovations translates brand moments into visceral perspectives, flexing between the quietude of the ethereal and the grit of the expressive. We are a close-knit production team drawn to ideas with texture, movement and feeling, shaping each frame with cinematic intent from first conversation through final delivery."
  },
  team: {
    heading: "THE TEAM",
    members: [
      {
        id: "victor-yuen",
        name: "VICTOR YUEN",
        role: "FOUNDER / CREATIVE DIRECTOR",
        bio: "Victor has worked in the creative industry for more than a decade, collaborating with clients at every scale. With a background in design, he puts storytelling and strong visual direction at the forefront of every project.",
        image: "/about/victor-yuen.jpg",
        alt: "Victor Yuen, Founder and Creative Director at Kraqen Innovations",
        isGreyscaleDefault: true
      },
      {
        id: "max-tagesen",
        name: "MAX TAGESEN",
        role: "EDITOR / CAMERA OPERATOR / ASSISTANT",
        bio: "Max is a multidisciplinary creator with an undying passion for sport. He tells real, meaningful stories through photography and video, looking for the emotion and movement that make each frame unique.",
        image: "/about/max-tagesen.jpg",
        alt: "Max Tagesen, Editor and Camera Operator at Kraqen Innovations",
        isGreyscaleDefault: false
      }
    ]
  },
  services: {
    labelLeft: "WHAT WE DO",
    labelRight: "FULL SERVICE PRODUCTION",
    useHomeServices: true,
    items: []
  },
  studioSplit: {
    left: {
      src: "/about/studio-left.jpg",
      alt: "Kraqen Innovations team working at studio desk",
      widthRatio: "66%"
    },
    right: {
      src: "/about/studio-right.jpg",
      alt: "Studio shelf interior",
      widthRatio: "34%"
    }
  },
  approach: {
    labelLeft: "APPROACH",
    labelRight: "SELECTED PARTNERS",
    headlineLines: ["A POINT OF VIEW, CARRIED", "THROUGH EVERY FRAME."],
    useHomePartners: true,
    fillEmptyCells: true,
    clients: []
  }
};

export const defaultWork: WorkContent = {
  seo: {
    title: "Work — Kraqen Innovations LLP",
    description: "A selection of films, photographs, campaigns, and brand worlds created by Kraqen Innovations LLP."
  },
  header: {
    title: "WORK",
    countFormat: "{count} / {total}",
    filters: [
      { id: "all", label: "ALL WORK" },
      { id: "photography", label: "PHOTOGRAPHY" },
      { id: "videography", label: "VIDEOGRAPHY" },
      { id: "creative-direction", label: "CREATIVE DIRECTION" },
      { id: "post-production", label: "POST-PRODUCTION" },
      { id: "social-content", label: "SOCIAL CONTENT" },
      { id: "film-production", label: "FILM PRODUCTION" },
      { id: "campaign", label: "CAMPAIGN" }
    ]
  },
  projects: [
    {
      id: "rugby-bricks",
      title: "RUGBY BRICKS",
      category: "PHOTOGRAPHY + VIDEOGRAPHY",
      tags: ["photography", "videography", "campaign"],
      year: "2026",
      image: "/images/hero-runner.jpg",
      aspect: "aspect-[16/9]",
      column: "left"
    },
    {
      id: "kodama-ice",
      title: "KODAMA ICE CO.",
      category: "PRODUCT PHOTOGRAPHY",
      tags: ["photography", "creative-direction"],
      year: "2026",
      image: "/images/hero-ice.jpg",
      aspect: "aspect-[3/5]",
      column: "right"
    }
  ]
};

export const defaultContact: ContactContent = {
  seo: {
    title: "Contact — Kraqen Innovations LLP",
    description: "Start a project with Kraqen Innovations LLP. Let's give your story a point of view."
  },
  hero: {
    label: "START A PROJECT",
    headlineLines: ["BRING", "US INTO", "THE", "PICTURE"],
    paragraph: "Have a story to tell, a feeling to capture, or a moment worth holding onto? Let's give it a point of view."
  },
  fields: {
    name: { enabled: true, required: true, label: "NAME", placeholder: "Jane Doe" },
    email: { enabled: true, required: true, label: "EMAIL", placeholder: "jane@example.com" },
    phone: { enabled: false, required: false, label: "PHONE", placeholder: "" },
    company: { enabled: true, required: false, label: "COMPANY", placeholder: "Acme Studio" },
    projectTypes: {
      enabled: true,
      required: true,
      label: "PROJECT TYPE (CHOOSE ALL THAT APPLY)",
      options: [
        { id: "video", label: "Video Production" },
        { id: "photo", label: "Photography" },
        { id: "social", label: "Social Media" },
        { id: "creative", label: "Creative Direction" }
      ]
    },
    budget: {
      enabled: true,
      required: true,
      label: "APPROXIMATE BUDGET",
      placeholder: "Choose a range",
      options: [
        { value: "under-5k", label: "Under $5,000" },
        { value: "5k-10k", label: "$5,000 - $10,000" },
        { value: "10k-25k", label: "$10,000 - $25,000" },
        { value: "25k-50k", label: "$25,000 - $50,000" },
        { value: "50k-plus", label: "$50,000+" },
        { value: "undecided", label: "Not sure yet" }
      ]
    },
    timing: {
      enabled: true,
      required: true,
      label: "TIMING",
      placeholder: "Choose timing",
      options: [
        { value: "asap", label: "ASAP" },
        { value: "1-month", label: "Within 1 month" },
        { value: "1-3-months", label: "1 - 3 months" },
        { value: "3-plus-months", label: "3+ months" },
        { value: "flexible", label: "Flexible" }
      ]
    },
    message: {
      enabled: true,
      required: true,
      label: "TELL US ABOUT THE PROJECT",
      helper: "What are you making, who is it for, and what should the work accomplish?",
      placeholder: "Tell us about your brand, campaign goals, key deliverables, and desired vision..."
    }
  },
  validation: {
    nameRequired: "Please enter your name.",
    emailRequired: "Please enter your email.",
    emailInvalid: "Please enter a valid email address.",
    projectTypeRequired: "Please select at least one project type.",
    budgetRequired: "Please select a budget range.",
    timingRequired: "Please select a timeframe.",
    messageRequired: "Please describe your project.",
    messageMinLength: "Please provide a few more details about your project."
  },
  submit: {
    label: "SEND ENQUIRY",
    sending: "SENDING..."
  },
  privacyNote: "By sending, you agree to our Privacy Policy.",
  success: {
    heading: "THANK YOU.",
    message: "We got your enquiry and will reply within 1 to 2 business days.",
    resetButton: "SEND ANOTHER"
  },
  error: {
    text: "Something went wrong. Please try again or email us directly at",
    showEmail: true
  }
};

export const defaultContentMap = {
  site: defaultSite,
  home: defaultHome,
  about: defaultAbout,
  work: defaultWork,
  contact: defaultContact,
} as const;

