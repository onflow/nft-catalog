import NFTRetrieval from "../contracts/NFTRetrieval.cdc"

pub fun main(ownerAddress: Address, collection : String, tokenID: UInt64) : NFTRetrieval.BaseNFTViewsV1? {
    let allNFTs = NFTRetrieval.getNFTs(ownerAddress : ownerAddress)

    assert(allNFTs.containsKey(collection), message: "Invalid Collection")
    let nfts = allNFTs[collection]!
    
    for nft in nfts {
      if nft.id == tokenID {
        return nft
      }
    }
    panic("Invalid Token ID")
}