import { createFileRoute } from "@tanstack/react-router";
import {
  HeroSection,
  SelectedWorkSection,
  WhatWeDoSection,
  BrandStatementSection,
  BuiltWithSection,
  FinalCTASection,
} from "@/components/site/KraqenSections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KRAQEN INNOVATIONS — Creative Technology & Digital Agency" },
      {
        name: "description",
        content:
          "We build digital products, websites, AI platforms and technology experiences for modern brands. Based in Chennai, India.",
      },
      {
        property: "og:title",
        content: "KRAQEN INNOVATIONS — Creative Technology & Digital Agency",
      },
      {
        property: "og:description",
        content:
          "We build digital products, websites, AI platforms and technology experiences for modern brands.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <HeroSection />
      <SelectedWorkSection />
      <WhatWeDoSection />
      <BrandStatementSection />
      <BuiltWithSection />
      <FinalCTASection />
    </>
  );
}
