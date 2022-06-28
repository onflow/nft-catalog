import { LandingCard } from './landing-card';
import { NFTCatalogCard } from './nft-catalog-card';
import { NFTVerifierCard } from './nft-verifier-card';

export function CardLayout() {
  return (<section className="my-20">
    <div className='flex flex-col md:flex-row md:items-start justify-evenly items-center'>
      <LandingCard />
      <div className='mt-4'>
        <NFTCatalogCard />
      </div>
      <div className='mt-4'>
        <NFTVerifierCard />
      </div>
    </div>
  </section>);
}
