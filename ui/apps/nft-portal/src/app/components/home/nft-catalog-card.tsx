import { useNavigate } from 'react-router-dom';
import { Button } from '../shared/button';

export function NFTCatalogCard() {
  const navigate = useNavigate();
  const classes =
    'flex flex-col items-start items-center px-4 py-6 md:flex-row md:px-15 md:py-12';
  return (
    <div className="container">
      <div className="float-right">
        <Button onClick={() => navigate('/catalog')} bgColor="bg-transparent">
          Explore NFT Catalog
        </Button>
      </div>
      <span className="text-3xl font-display font-bold my-2 md:mb-3">
        Flow Catalog
      </span>
      <p className="overflow-hidden text-ellipsis text-gray-500">
        Browse NFT collections on the catalog and view their collection-level
        data
      </p>
      <div className={classes}>
        <div className="flex flex-1 flex-col items-start md:mr-10"></div>
      </div>
    </div>
  );
}
