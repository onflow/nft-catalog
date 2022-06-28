import { Alert } from "../shared/alert"

export function NFTValidity({
  selectedContract,
  contractInfo
}: {
  selectedContract: string|undefined,
  contractInfo: any
}) {
  if (!contractInfo) { return null }
  if (!contractInfo.isNFTContract) {
    return (
      <>
        <Alert
          status="error"
          title={`The provided contract, ${selectedContract}, is not an NFT`}
          body="Your contract must implement the standard NonFungibleToken contract"
        />
      </>
    )
  }
  if (!contractInfo.nftConformsToMetadata || !contractInfo.collectionConformsToMetadata) {
    return (
      <>
        <Alert
          status="error"
          title={`The provided contract, ${selectedContract}, is not metadata standards ready`}
          body={
            <ul>
              { !contractInfo.nftConformsToMetadata && <li>* The contract's NFT resource should implement <b>MetadataViews.Resolver</b></li> }
              { !contractInfo.collectionConformsToMetadata && <li>* The contract's Collection resource should implement <b>MetadataViews.ResolverCollection</b></li> }
            </ul>
          }
        />
      </>
    )
  }
  return null
}