import { createFileRoute } from "@tanstack/react-router";
import { ContactPageContent } from "@/components/site/KraqenContactContent";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "CONTACT — KRAQEN INNOVATIONS" },
      {
        name: "description",
        content:
          "Start a project inquiry with Kraqen Innovations. Based in Chennai, India.",
      },
      { property: "og:title", content: "CONTACT — KRAQEN INNOVATIONS" },
      {
        property: "og:description",
        content:
          "Start a project inquiry with Kraqen Innovations. Based in Chennai, India.",
      },
    ],
  }),
  component: ContactPageContent,
});
