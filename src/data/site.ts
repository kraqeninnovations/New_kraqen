import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";

export type Project = { slug: string; title: string; disciplines: string; year: string; image: string };

export const projects: Project[] = [
  { slug: "rugby-bricks", title: "Rugby Bricks", disciplines: "Photography + Videography", year: "2026", image: p1 },
  { slug: "snackish", title: "Snackish", disciplines: "Photography + Videography", year: "2026", image: p2 },
  { slug: "kodama-ice", title: "Kodama Ice Co.", disciplines: "Photography + Creative Direction", year: "2026", image: p3 },
  { slug: "smartsweets", title: "SmartSweets", disciplines: "Photography + Creative Direction", year: "2026", image: p4 },
  { slug: "slo-coffee", title: "Slo Coffee", disciplines: "Photography + Videography", year: "2026", image: p5 },
  { slug: "joey", title: "JOEY Restaurants", disciplines: "Photography + Videography", year: "2026", image: p6 },
  { slug: "tevah", title: "Tevah Wellness", disciplines: "Videography + Post-production", year: "2026", image: p7 },
];

export const services = [
  { title: "Videography", body: "End-to-end video production shaped around the story.", image: p1 },
  { title: "Photography", body: "Campaign, product, and editorial imagery with cinematic intent.", image: p3 },
  { title: "Social Content", body: "Platform-native stories told bespoke for your brand.", image: p5 },
  { title: "Creative Direction", body: "Concept and visual direction that connects every frame.", image: p7 },
];

export const partners = ["Northfold", "Atlas & Oak", "Kinship", "Halden", "Merid", "Sable Co.", "Ostra", "Field Notes"];
