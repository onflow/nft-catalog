import { ToolsCard } from '../shared/tools-card';
import { CatalogLandingCard } from './catalog-landing-card';
import { NFTCatalogCard } from './nft-catalog-card';

export function CardLayout() {
  return (
    <section>
      <CatalogLandingCard />
      <br />
      <NFTCatalogCard />
      <br />
      <ToolsCard />
    </section>
  );
}
