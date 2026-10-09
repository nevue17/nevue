import CategoryPage from "../components/CategoryPage";
import { categoryConfigs } from "../category-config";

export default function MarketsPage() {
  return <CategoryPage config={categoryConfigs.markets} />;
}
