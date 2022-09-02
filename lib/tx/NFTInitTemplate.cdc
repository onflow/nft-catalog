
// Collection Identifier: ${cI.identifier}

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