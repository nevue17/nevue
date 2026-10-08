export type EventCardProps = {
  slug?: string;
  category: string;
  date?: string;
  eyebrow?: string;
  headline: string;
  summary: string;
  tags: string[];
  featured?: boolean;
};

export const events: EventCardProps[] = [
  {
    category: "Business & Technology",
    eyebrow: "Signal 01",
    headline: "The next phase of the AI investment cycle is becoming clearer",
    summary: "Enterprise spending is shifting from experimentation toward infrastructure, productivity, and measurable returns.",
    tags: ["Technology", "Capital flows"],
    featured: true,
  },
  {
    category: "Markets & Macro",
    headline: "Investors are repricing the path of global interest rates",
    summary: "Fresh inflation signals are changing expectations for when major central banks can begin easing policy.",
    tags: ["Rates", "Inflation"],
  },
  {
    category: "Global & Energy",
    headline: "A new supply risk is reshaping the energy outlook",
    summary: "Policy decisions and shipping disruptions are creating a wider range of outcomes for crude and gas markets.",
    tags: ["Energy", "Geopolitics"],
  },
  {
    category: "Business & Trade",
    headline: "Manufacturers are redrawing their global supply chains",
    summary: "Companies are balancing resilience, cost, and access to strategic markets as trade rules evolve.",
    tags: ["Trade", "Industry"],
  },
  {
    category: "Economy & Policy",
    headline: "Fiscal choices are moving back to the center of the outlook",
    summary: "Government spending plans could influence growth, bond yields, and the timing of future policy moves.",
    tags: ["Fiscal policy", "Bonds"],
  },
  {
    category: "Global & Technology",
    headline: "Data sovereignty is becoming a board-level question",
    summary: "New rules around critical data are changing how global companies plan infrastructure and expansion.",
    tags: ["Regulation", "Digital"],
  },
];
