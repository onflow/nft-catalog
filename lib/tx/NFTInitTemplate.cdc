/*
    Template parameters:
    Wrap template in ${} to be replaced
    
    collectionIdentifier + vaultIdentifier
    {cI.field} and {vI.field}

        available template fields within `cI and vI`:
            pub let contractName: String
            pub let storagePath: String
            pub let publicPath: String
            pub let privatePath: String
            pub let type: Type
            pub let publicCollection: Type
            pub let publicLinkedType: Type
            pub let privateLinkedType: Type

    createFtSetupTx == Replace with create ft setup tx code
    createNftSetupTx == Replace with create nft setup tx code
*/

transaction {

  prepare(signer: AuthAccount) {
    if signer.borrow<&${cI.publicLinkedType}>(from: ${cI.storagePath}) == nil {
      let collection <- ${cI.contractName}.createEmptyCollection()
      signer.save(<-collection, to: ${cI.storagePath})
    }
    if (signer.getCapability<&${cI.publicLinkedType}>(${cI.publicPath}).borrow() == nil) {
      signer.unlink(${cI.publicPath})
      signer.link<&${cI.publicLinkedType}>(${cI.publicPath}, target: ${cI.storagePath})
    }
  }

}