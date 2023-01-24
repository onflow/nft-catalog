import { LandingLinkCard } from './landing-link-card';

export function ToolsCard({}: {}) {
  const classes =
    'flex flex-col items-start items-center px-4 py-5 md:flex-row md:px-15 md:py-10';
  return (
    <div className="container">
      <span className="text-xl font-display font-bold my-2 md:mb-3">Tools</span>
      <div className={classes}>
        <div className="flex w-full flex-1 flex-row space-x-4 items-start">
          <LandingLinkCard
            title="Generate Transaction"
            description={undefined}
            href="/transactions"
          />
          <LandingLinkCard
            title="View NFT's"
            description={undefined}
            href="/nfts"
          />
        </div>
      </div>
    </div>
  );
}
