import { LandingLinkCard } from "./landing-link-card"

export function MetadataLandingCard({
}: {}) {
  const classes = "flex flex-col items-start px-4 py-6 rounded-lg bg-primary-gray-100/30 md:flex-row md:px-20 md:py-12 border-2 bg-gradient-home-br"
  return (
    <div className="container">
      <div className={classes}>
        <div className="flex w-full flex-1 flex-col items-start">
          <LandingLinkCard title="Verify Metadata + Add to Catalog" description="Check how close your NFT is to being compliant with standards, and create a proposal to add your NFT to the NFT Catalog." href="/v" />
          <LandingLinkCard title="View Example NFT" description="The Example NFT Contract provides you an easy to reference implementation with all needed metadata standard views implemented. You may use this as an example to help get your NFTs implemented." href="https://github.com/onflow/flow-nft/blob/master/contracts/ExampleNFT.cdc" />
        </div>
        <div className="flex flex-1 flex-col items-stretch md:pl-32">
          <div className="pt-2"/>
          <header className="text-2xl font-display font-bold my-2 md:mb-3">NFT Metadata Standard</header>
          <p className="md:max-w-sm overflow-hidden text-ellipsis text-primary-gray-400">
            Conform to the Flow NFT Metadata standard to unlock interoperability for your NFT across the Flow ecosystem.
            <div className="pt-2"/>
            Implement the <a className="text-blue-600 hover:underline cursor-pointer" href="https://github.com/onflow/flow-nft/pull/103/files#diff-a7af41cf43e29d0e6028827c3d5f305326677661bf65d79539d59ed1056c0a84R38" target="_blank">Core NFT Views</a> in your NFT as a pre-requisite to being added to the NFT Catalog.
            <div className="pt-2"/>
            Use the example contract to help guide your implementation.
          </p>
        </div>
      </div>
    </div>
  )
}