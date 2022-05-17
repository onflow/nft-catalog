import NFTRetrieval from "../contracts/NFTRetrieval.cdc"

pub fun main(ownerAddress: Address, collections: [String]) : { String : [NFTRetrieval.BaseNFTViewsV1] }  {
  let nfts = NFTRetrieval.getNFTs(ownerAddress : ownerAddress)
  
  let items : {String : [NFTRetrieval.BaseNFTViewsV1] } = {}

  for collection in collections {
    if nfts.containsKey(collection) {
      items[collection] = nfts[collection]!
    }
  }

  return items
}