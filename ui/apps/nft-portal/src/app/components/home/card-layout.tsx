import { ToolsCard } from '../shared/tools-card';
import { CatalogLandingCard } from './catalog-landing-card';

export function CardLayout() {
  return (
    <section>
      <CatalogLandingCard />
      <br />
      <ToolsCard />
    </section>
  );
}
