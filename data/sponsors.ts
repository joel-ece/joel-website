export type SponsorType = "technical" | "financial";

export interface Sponsor {
  id: string;
  name: string;
  type: SponsorType;
  image: string; // path under /public, e.g. "/sponsors/technical.png"
  url?: string; // optional external link
  alt?: string; // alt text for accessibility
}

export const sponsors: Sponsor[] = [
  {
    id: "tech-1",
    name: "MathWorks",
    type: "technical",
    image: "/sponsors/technical.png",
    url: "https://technicalsponsor.example",
    alt: "Technical sponsor logo - Technical Sponsor Name",
  },
  {
    id: "fin-1",
    name: "Financial Sponsor 1",
    type: "financial",
    image: "/sponsors/financial1.png",
    url: "https://financial1.example",
    alt: "Financial sponsor 1 logo",
  },
  {
    id: "fin-2",
    name: "Financial Sponsor 2",
    type: "financial",
    image: "/sponsors/financial2.jpg",
    url: "https://financial2.example",
    alt: "Financial sponsor 2 logo",
  },
  {
    id: "fin-3",
    name: "Financial Sponsor 3",
    type: "financial",
    image: "/sponsors/financial3.png",
    url: "https://financial3.example",
    alt: "Financial sponsor 3 logo",
  },
  {
    id: "fin-4",
    name: "Financial Sponsor 4",
    type: "financial",
    image: "/sponsors/financial4.png",
    url: "https://financial4.example",
    alt: "Financial sponsor 4 logo",
  },
];