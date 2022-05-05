import NFTCatalog from "./NFTCatalog.cdc"

pub contract NFTCatalogAdmin {

  pub let AdminPrivatePath: PrivatePath
  pub let AdminStoragePath: StoragePath

  pub let AdminAgentPublicPath: PublicPath
  pub let AdminAgentStoragePath: StoragePath

  pub resource Admin {

    pub fun addCatalogEntry(name: String, metadata : NFTCatalog.NFTCatalogMetadata) {
      NFTCatalog.addToCatalog(name: name, metadata : metadata)
    }

    pub fun approveCatalogProposal(proposalID : UInt64) {
      pre {
        NFTCatalog.getCatalogProposalEntry(proposalID : proposalID) != nil : "Invalid Proposal ID"
        NFTCatalog.getCatalogProposalEntry(proposalID : proposalID)!.status == "IN_REVIEW" : "Invalid Proposal"
      }
      let catalogProposalEntry = NFTCatalog.getCatalogProposalEntry(proposalID : proposalID)!
      let newCatalogProposalEntry = NFTCatalog.NFTCatalogProposal(metadata : catalogProposalEntry.metadata, message : catalogProposalEntry.message, status: "APPROVED")
      NFTCatalog.updateCatalogProposal(proposalID : proposalID, proposalMetadata : newCatalogProposalEntry)

      // Add to catalog
      NFTCatalog.addToCatalog(name: newCatalogProposalEntry.metadata.name, metadata : newCatalogProposalEntry.metadata)
    }

    pub fun rejectCatalogProposal(proposalID : UInt64) {
      pre {
        NFTCatalog.getCatalogProposalEntry(proposalID : proposalID) != nil : "Invalid Proposal ID"
        NFTCatalog.getCatalogProposalEntry(proposalID : proposalID)!.status == "IN_REVIEW" : "Invalid Proposal"
      }
      let catalogProposalEntry = NFTCatalog.getCatalogProposalEntry(proposalID : proposalID)!
      let newCatalogProposalEntry = NFTCatalog.NFTCatalogProposal(metadata : catalogProposalEntry.metadata, message : catalogProposalEntry.message, status: "REJECTED")
      NFTCatalog.updateCatalogProposal(proposalID : proposalID, proposalMetadata : newCatalogProposalEntry)
    }

    pub fun removeCatalogProposal(proposalID : UInt64) {
      pre {
        NFTCatalog.getCatalogProposalEntry(proposalID : proposalID) != nil : "Invalid Proposal ID"
      }
      NFTCatalog.removeCatalogProposal(proposalID : proposalID)
    }

    init () {}

  }

  pub resource interface IAdminAgent {
		
    pub fun addCapability(capability : Capability<&Admin>)

	}

  pub resource AdminAgent : IAdminAgent {
    
    access(self) var capability : Capability<&Admin>?

    pub fun addCapability(capability : Capability<&Admin>) {
      pre {
        capability.check() : "Invalid Admin Capability"
        self.capability == nil : "Admin Agent already set"
      }
      self.capability = capability
    }

    pub fun getCapability() : Capability<&Admin>? {
      return self.capability
    }

    init() {
      self.capability = nil
    }
    
  }

  pub fun createAdminAgent() : @AdminAgent {
		return <- create AdminAgent()
	}

  init () {
    self.AdminAgentPublicPath = /public/nftCatalogAdminAgent
    self.AdminAgentStoragePath = /storage/nftCatalogAdminAgent
    
    self.AdminPrivatePath = /private/nftCatalogAdmin
    self.AdminStoragePath = /storage/nftCatalogAdmin

    let admin  <- create Admin()

    self.account.save(<-admin, to: self.AdminStoragePath)
    self.account.link<&Admin>(self.AdminPrivatePath, target: self.AdminStoragePath)
  }
}