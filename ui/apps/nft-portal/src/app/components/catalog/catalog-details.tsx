import { useEffect, useState } from "react"
import { getNFTMetadataForCollectionIdentifier } from "../../../flow/utils"
import { useParams } from "react-router-dom";
import { Spinner } from "../shared/spinner"
import { EmptyContent } from "./empty-content"
import { Network } from "./network-dropdown";
import { CollectionDataView } from "../shared/views/collection-data-view"
import { CollectionDisplayView } from "../shared/views/collection-display-view"
import { changeFCLEnvironment } from '../../../flow/setup';
import { ContractDetails } from "../shared/views/contract-details";
import { Address } from "@onflow/types";

type CatalogParams = {
  network: Network;
  collectionIdentifier: string;
};

export function CatalogDetails() {
  const { network = 'testnet', collectionIdentifier } = useParams<CatalogParams>()
  const [collectionData, setCollectionData] = useState<any>()
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    changeFCLEnvironment(network);
    setCollectionData(null)
    setError(null)
    if (!collectionIdentifier) { return }
    const setup = async () => {
      const res = await getNFTMetadataForCollectionIdentifier(collectionIdentifier)
      const collection = res
      if (res) {
        setCollectionData(collection)
      } else {
        setError(`Unable to find a catalog entry with identifier ${collectionIdentifier}`)
      }
    }
    setup()
  }, [network, collectionIdentifier])

  let content = null
  if (!collectionIdentifier) {
    content = <EmptyContent />
  } else if (!collectionData) {
    content = <Spinner />
  } else {
    const link = `https://${network === "testnet" ? 'testnet.' : ''}flowscan.org/contract/${collectionData.nftType.typeID.replace(/.NFT/, '')}}`
    content = (
      <>
        <CollectionDisplayView view={collectionData.collectionDisplay} withRawView={false} />
        <hr />
        <ContractDetails contractLink={link} view={{ type: collectionData.nftType.typeID, address: collectionData.contractAddress, ...collectionData.collectionData }} />
      </>
    )
  }

  return (
    <div className="mx-auto px-0 md:px-4 lg:px-32">
      { content }
    </div>
  )
}