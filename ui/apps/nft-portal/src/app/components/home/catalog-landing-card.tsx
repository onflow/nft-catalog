import { LandingLinkCard } from "./landing-link-card"

export function CatalogLandingCard({
}: {}) {
  const classes = "flex flex-col items-start px-4 py-6 rounded-lg bg-primary-gray-100/30 md:flex-row md:px-20 md:py-12 border-2"
  return (
    <div className="container">
      <div className={classes}>
        <div className="flex flex-1 flex-col items-start md:mr-20">
          <span className="mr-2 rounded bg-primary-gray-50 px-1 py-1 font-mono text-xs text-primary-blue">
            #onFlow
          </span>
          <header className="text-2xl font-display font-bold my-2 md:mb-3">Flow NFT Catalog</header>
          <p className="md:max-w-sm overflow-hidden text-ellipsis text-primary-gray-400">
            Browse Flow NFT Collections on the catalog.
            <div className="pt-2"/>
            As an NFT collection owner, have your NFT added to the catalog to unlock interoperability of your NFT across the Flow ecosystem.
            <div className="pt-2" />
            As an application, utilize the catalog to support NFT collections in your application. The catalog is available on-chain.
          </p>
        </div>
        <div className="flex w-full flex-1 flex-col items-stretch">
          <LandingLinkCard title="Catalog" description="Browse NFT collections which are on the NFT catalog and view their collection-level data" href="/catalog" />
          <LandingLinkCard title="Proposals" description="View proposal statuses for NFT collections being added to the catalog" href="/proposals" />
        </div>
      </div>
    </div>
  )
}