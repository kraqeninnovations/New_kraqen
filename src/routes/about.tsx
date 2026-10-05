import { createFileRoute } from "@tanstack/react-router";
import { AboutPageContent } from "@/components/site/KraqenAboutContent";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "ABOUT — KRAQEN INNOVATIONS" },
      {
        name: "description",
        content:
          "Kraqen Innovations creates digital experiences where technology, creativity and strategy come together.",
      },
      { property: "og:title", content: "ABOUT — KRAQEN INNOVATIONS" },
      {
        property: "og:description",
        content:
          "Kraqen Innovations creates digital experiences where technology, creativity and strategy come together.",
      },
    ],
  }),
  component: AboutPageContent,
});
