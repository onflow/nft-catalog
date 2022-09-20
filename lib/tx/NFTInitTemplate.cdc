// This transaction was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)
//
// This transaction initializes a user's collection to support a specific NFT
// 
// Collection Identifier: ${cI.identifier}
//
// Version: ${version}

transaction {

  prepare(signer: AuthAccount) {
    if signer.borrow<&${cI.contractName}.Collection>(from: ${cI.storagePath}) == nil {
      let collection <- ${cI.contractName}.createEmptyCollection()
      signer.save(<-collection, to: ${cI.storagePath})
    }
    if (signer.getCapability<&${cI.publicLinkedType}>(${cI.publicPath}).borrow() == nil) {
      signer.unlink(${cI.publicPath})
      signer.link<&${cI.publicLinkedType}>(${cI.publicPath}, target: ${cI.storagePath})
    }
  }

}