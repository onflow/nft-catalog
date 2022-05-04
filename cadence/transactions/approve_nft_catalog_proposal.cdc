import NFTCatalogAdmin from "../contracts/NFTCatalogAdmin.cdc"

transaction(proposalID : UInt64) {
  let adminAgentResource : &NFTCatalogAdmin.AdminAgent

  prepare(acct: AuthAccount) {
    self.adminAgentResource = acct.borrow<&NFTCatalogAdmin.AdminAgent>(from : NFTCatalogAdmin.AdminAgentStoragePath)!
  }

  execute {
    self.adminAgentResource.getCapability()!.borrow()!.approveCatalogProposal(proposalID : proposalID)
  }
}