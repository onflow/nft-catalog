import { useNavigate } from 'react-router-dom';
import { CatalogItem } from '../catalog/catalog-explore';
import { Button } from '../shared/button';

const staticDisplayItems = [
  { name: 'NFLAllDay', subtext: 'A.e4cf4bdc1751c65d.AllDay.NFT' },
  { name: 'Flunks', subtext: 'A.807c3d470888cc48.Flunks.NFT' },
  { name: 'UFCStrike', subtext: 'A.329feb3ab062d289.UFC_NFT.NFT' },
];

export function NFTCatalogCard() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="float-right">
        <Button onClick={() => navigate('/catalog')} bgColor="bg-transparent">
          Explore catalog
        </Button>
      </div>
      <span className="text-3xl font-display font-bold my-2 md:mb-3">
        Flow NFT Catalog
      </span>
      <p className="overflow-hidden text-ellipsis text-gray-500">
        Browse NFT collections on the catalog and view their collection-level
        data
      </p>
      <div className="mt-8">
        <CatalogItem
          item={{
            name: 'NBATopShot',
            subtext: 'A.0b2a3299cc857e29.TopShot.NFT',
            image: 'https://nbatopshot.com/static/img/og/og.png',
          }}
          network="mainnet"
        />
      </div>
      <div className="flex flex-1 sm:flex-col sm:space-y-4 md:space-y-0 md:flex-row md:space-x-4 mt-4">
        {staticDisplayItems.map((item, i) => (
          <CatalogItem key={i} item={item} network="mainnet" />
        ))}
      </div>
    </div>
  );
}
