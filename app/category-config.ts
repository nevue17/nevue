import type { CategoryPageConfig } from "./components/CategoryPage";

// Keep this mapping explicit so confirmed database labels can be added without
// changing the route components. Only this value has been verified in the DB.
export const categoryConfigs: Record<string, CategoryPageConfig> = {
  markets: {
    title: "Markets",
    description: "Track the forces moving prices, capital, and confidence.",
    categories: [],
  },
  business: {
    title: "Business",
    description: "Understand the companies and decisions shaping the economy.",
    categories: [],
  },
  economy: {
    title: "Economy",
    description: "Follow the data, policy, and trends behind economic change.",
    categories: [],
  },
  global: {
    title: "Global",
    description: "See the developments connecting markets, countries, and people.",
    categories: ["Global & Energy"],
  },
};
