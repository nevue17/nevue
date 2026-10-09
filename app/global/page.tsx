import CategoryPage from "../components/CategoryPage";
import { categoryConfigs } from "../category-config";

export default function GlobalPage() {
  return <CategoryPage config={categoryConfigs.global} />;
}
