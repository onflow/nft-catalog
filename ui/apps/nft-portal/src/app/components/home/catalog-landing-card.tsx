import OnFlowIcon from '../../../assets/flow-icon-bw-light.svg';

export function CatalogLandingCard({}: {}) {
  const classes =
    'flex flex-col items-start items-center px-4 py-6 md:flex-row md:px-15 md:py-12';
  return (
    <div className="container">
      <div className={classes}>
        <div className="flex flex-1 flex-col items-start md:mr-10">
          <header className="text-5xl font-display font-bold my-2 md:mb-3">
            Explore the Flow Catalog
          </header>
          <p className="md:max-w-sm overflow-hidden text-ellipsis text-gray-500">
            Build your next idea using Flow NFT collections.
          </p>
        </div>
        <div className="flex w-full flex-1 flex-col items-stretch">
          <img src={OnFlowIcon} />
        </div>
      </div>
    </div>
  );
}
