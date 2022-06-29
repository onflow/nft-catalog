import { CatalogLandingCard } from './catalog-landing-card';
import { MetadataLandingCard } from './metadata-landing-card';

export function CardLayout() {
  return (<section className="my-12">
    <CatalogLandingCard />
    <br />
    <MetadataLandingCard />
  </section>);
}
