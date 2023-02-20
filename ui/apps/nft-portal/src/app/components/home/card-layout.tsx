import { Divider } from '../shared/divider';
import { ToolsCard } from '../shared/tools-card';
import { CatalogLandingCard } from './catalog-landing-card';
import { NFTCatalogCard } from './nft-catalog-card';
import { ContentLinks } from '../shared/content-links';

export function CardLayout() {
  return (
    <section>
      <CatalogLandingCard />
      <br />
      <NFTCatalogCard />
      <Divider space='80px'></Divider>
      <ContentLinks />
      <Divider space='80px'></Divider>      
      <ToolsCard />
    </section>
  );
}
