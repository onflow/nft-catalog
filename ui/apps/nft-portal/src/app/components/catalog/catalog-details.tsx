import { useEffect, useState } from "react"
import { getNFTMetadataForCollectionIdentifier, getProposal } from "../../../flow/utils"
import { useParams } from "react-router-dom";
import { Spinner } from "../shared/spinner"
import { EmptyContent } from "./empty-content"
import { Network } from "./network-dropdown";
import { CollectionDisplayView } from "../shared/views/collection-display-view"
import { changeFCLEnvironment } from '../../../flow/setup';
import { ContractDetails } from "../shared/views/contract-details";
import { ProposalActions } from './proposal-actions';

type CatalogParams = {
  network: Network;
  collectionIdentifier: string;
};

export function CatalogDetails({
  type
}: {
  type: "Catalog" | "Proposals",
}) {
  const { network = 'testnet', collectionIdentifier } = useParams<CatalogParams>()
  const [collectionData, setCollectionData] = useState<any>()
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    changeFCLEnvironment(network);
    setCollectionData(null)
    setError(null)
    if (!collectionIdentifier) { return }
    const setup = async () => {
      let res;
      if (type === 'Proposals') {
        res = await getProposal(collectionIdentifier)
        console.log()
        res = { ...res, ...res.metadata }
      } else {
        res = await getNFTMetadataForCollectionIdentifier(collectionIdentifier)
      }
      console.log('res is', res)
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
    const link = `https://${network === "testnet" ? 'testnet.' : ''}flowscan.org/contract/${collectionData.nftType.typeID.replace(/\.NFT/, '')}}`
    content = (
      <>
        <CollectionDisplayView proposalData={ type === "Proposals" ? collectionData : null } view={collectionData.collectionDisplay} withRawView={false} />
        <div className="-mt-16 pb-16">
          { type === 'Proposals' ? <ProposalActions proposal={collectionData} proposalID={collectionIdentifier} /> : null }
        </div>
        <hr />
        <ContractDetails contractLink={link} view={{ type: collectionData.nftType.typeID, address: collectionData.contractAddress, ...collectionData.collectionData }} />
      </>
    )
  }

  return (
    <div className="mx-auto px-4 md:px-4 lg:px-32">
      { content }
    </div>
  )
}