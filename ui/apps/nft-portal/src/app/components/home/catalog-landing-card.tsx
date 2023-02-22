import { useNavigate } from 'react-router-dom';
import HomeBannerImage from '../../../assets/home-banner.png';
import { Button } from '../shared/button';

export function CatalogLandingCard({}: {}) {
  const navigate = useNavigate();
  const classes =
    'flex flex-col items-start items-center px-4 py-6 md:flex-row md:px-15 md:py-12';
  return (
    <div className="bg-gradient-home-br">
      <div className="container">
        <div className={classes}>
          <div className="flex flex-1 flex-col items-start md:mr-10">
            <span className="mr-2 rounded px-1 py-1 font-display font-bold text-m text-gray-500">
              #onFlow
            </span>
            <header className="text-5xl font-display font-bold my-2 md:mb-3">
              Explore the Flow NFT Catalog
            </header>
            <p className="md:max-w-sm overflow-hidden text-ellipsis font-semibold text-gray-600 mb-2">
              Build your next idea using Flow NFT collections.
            </p>
            <Button
              onClick={() => navigate('/catalog')}
              bgColor="bg-black"
              textColor="text-white"
              hoverColor="hover:bg-black/50"
            >
              Explore catalog
            </Button>
          </div>
          <div className="flex w-full flex-1 flex-col items-stretch sm:mt-10 md:mt-0">
            <img src={"https://raw.githubusercontent.com/dapperlabs/nft-catalog/v2/ui/apps/nft-portal/src/assets/home-banner.png"} referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </div>
  );
}
