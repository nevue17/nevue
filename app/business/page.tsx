import CategoryPage from "../components/CategoryPage";
import { categoryConfigs } from "../category-config";

export default function BusinessPage() {
  return <CategoryPage config={categoryConfigs.business} />;
}
