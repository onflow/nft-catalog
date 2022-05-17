import NFTRetrieval from "../contracts/NFTRetrieval.cdc"

pub fun main(ownerAddress: Address) : { String : [NFTRetrieval.BaseNFTViewsV1] } {
  return NFTRetrieval.getNFTs(ownerAddress : ownerAddress)
}