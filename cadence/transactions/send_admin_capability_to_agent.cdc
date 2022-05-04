import NFTCatalogAdmin from "../contracts/NFTCatalogAdmin.cdc"

transaction(agentAddress: Address) {
  let adminCap : Capability<&NFTCatalogAdmin.Admin>
  
  prepare(acct: AuthAccount) {
    self.adminCap = acct.getCapability<&NFTCatalogAdmin.Admin>(NFTCatalogAdmin.AdminPrivatePath)
  }

  execute {
    let owner = getAccount(agentAddress)
    let agent = owner.getCapability<&{NFTCatalogAdmin.IAdminAgent}>(NFTCatalogAdmin.AdminAgentPublicPath)
      .borrow() ?? panic("Could not borrow Admin Agent")
    
    agent.addCapability(capability : self.adminCap)
  }
}