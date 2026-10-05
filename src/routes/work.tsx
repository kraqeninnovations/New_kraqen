import { createFileRoute } from "@tanstack/react-router";
import { WorkPageContent } from "@/components/site/KraqenWorkGallery";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "WORK — KRAQEN INNOVATIONS" },
      {
        name: "description",
        content:
          "Selected digital products, websites, AI platforms and technology experiences built by Kraqen Innovations.",
      },
      { property: "og:title", content: "WORK — KRAQEN INNOVATIONS" },
      {
        property: "og:description",
        content:
          "Selected digital products, websites, AI platforms and technology experiences built by Kraqen Innovations.",
      },
    ],
  }),
  component: WorkPageContent,
});
