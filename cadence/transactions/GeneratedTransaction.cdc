
import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20
import CharlieNFT from 0x0c7f58ca4b64219d
transaction {

  prepare(signer: AuthAccount) {
    if signer.borrow<&CharlieNFT.Collection{CharlieNFT.CharlieNFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(from: /storage/CharlieNFTCollection) == nil {
      let collection <- CharlieNFT.createEmptyCollection()
      signer.save(<-collection, to: /storage/CharlieNFTCollection)
    }
    if (signer.getCapability<&CharlieNFT.Collection{CharlieNFT.CharlieNFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(/public/CharlieNFTCollection).borrow() == nil) {
      signer.unlink(/public/CharlieNFTCollection)
      signer.link<&CharlieNFT.Collection{CharlieNFT.CharlieNFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(/public/CharlieNFTCollection, target: /storage/CharlieNFTCollection)
    }
  }

}



