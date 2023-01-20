import { CatalogForm } from "./catalog-form"

type AddToCatalogProps = {
  sampleAddress: string | null
  storagePath: string | null,
  nftID: string | null
}
export function AddToCatalog({ sampleAddress, storagePath, nftID
}: AddToCatalogProps) {

  return (
    <>
      <div className="text-h1 mb-6 w-1/2 overflow-hidden text-ellipsis !text-xl md:!text-2xl font-display font-bold">Submit your collection</div>
      <div className="text-l w-7/12 text-stone-500">
        After submitting your collection, it will be reviewed by our submissions team.
        <br />
        When approved, it will be added to the catalog.
      </div>
      <CatalogForm sampleAddress={sampleAddress} storagePath={storagePath} nftID={nftID} />
    </>
  )
}





