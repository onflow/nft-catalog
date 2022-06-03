import NFTCatalog from "./NFTCatalog.cdc"

// NFTCatalogAdmin
//
// An admin contract that defines an  admin resource and
// a proxy resource to receive a capability that lets you make changes to the NFT Catalog
// and manage proposals

pub contract NFTCatalogAdmin {

  pub let AdminPrivatePath: PrivatePath
  pub let AdminStoragePath: StoragePath

  pub let AdminProxyPublicPath: PublicPath
  pub let AdminProxyStoragePath: StoragePath

  pub resource Admin {

    pub fun addCatalogEntry(collectionName: String, metadata : NFTCatalog.NFTCatalogMetadata) {
      NFTCatalog.addCatalogEntry(collectionName: collectionName, metadata : metadata)
    }

    pub fun updateCatalogEntry(collectionName : String , metadata : NFTCatalog.NFTCatalogMetadata) {
      NFTCatalog.updateCatalogEntry(collectionName: collectionName, metadata : metadata)
    }

    pub fun removeCatalogEntry(collectionName : String) {
      NFTCatalog.removeCatalogEntry(collectionName : collectionName)
    }

    pub fun approveCatalogProposal(proposalID : UInt64) {
      pre {
        NFTCatalog.getCatalogProposalEntry(proposalID : proposalID) != nil : "Invalid Proposal ID"
        NFTCatalog.getCatalogProposalEntry(proposalID : proposalID)!.status == "IN_REVIEW" : "Invalid Proposal"
      }
      let catalogProposalEntry = NFTCatalog.getCatalogProposalEntry(proposalID : proposalID)!
      let newCatalogProposalEntry = NFTCatalog.NFTCatalogProposal(collectionName : catalogProposalEntry.collectionName, metadata : catalogProposalEntry.metadata, message : catalogProposalEntry.message, status: "APPROVED", proposer: catalogProposalEntry.proposer)
      NFTCatalog.updateCatalogProposal(proposalID : proposalID, proposalMetadata : newCatalogProposalEntry)

      if NFTCatalog.getCatalogEntry(collectionName : NFTCatalog.getCatalogProposalEntry(proposalID : proposalID)!.collectionName) == nil {
        NFTCatalog.addCatalogEntry(collectionName: newCatalogProposalEntry.collectionName, metadata : newCatalogProposalEntry.metadata)
      } else {
        NFTCatalog.updateCatalogEntry(collectionName: newCatalogProposalEntry.collectionName, metadata: newCatalogProposalEntry.metadata)
      }
    }

    pub fun rejectCatalogProposal(proposalID : UInt64) {
      pre {
        NFTCatalog.getCatalogProposalEntry(proposalID : proposalID) != nil : "Invalid Proposal ID"
        NFTCatalog.getCatalogProposalEntry(proposalID : proposalID)!.status == "IN_REVIEW" : "Invalid Proposal"
      }
      let catalogProposalEntry = NFTCatalog.getCatalogProposalEntry(proposalID : proposalID)!
      let newCatalogProposalEntry = NFTCatalog.NFTCatalogProposal(collectionName : catalogProposalEntry.collectionName, metadata : catalogProposalEntry.metadata, message : catalogProposalEntry.message, status: "REJECTED", proposer: catalogProposalEntry.proposer)
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

  pub resource interface IAdminProxy {
		
    pub fun addCapability(capability : Capability<&Admin>)

	}

  pub resource AdminProxy : IAdminProxy {
    
    access(self) var capability : Capability<&Admin>?

    pub fun addCapability(capability : Capability<&Admin>) {
      pre {
        capability.check() : "Invalid Admin Capability"
        self.capability == nil : "Admin Proxy already set"
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

  pub fun createAdminProxy() : @AdminProxy {
		return <- create AdminProxy()
	}

  init () {
    self.AdminProxyPublicPath = /public/nftCatalogAdminProxy
    self.AdminProxyStoragePath = /storage/nftCatalogAdminProxy
    
    self.AdminPrivatePath = /private/nftCatalogAdmin
    self.AdminStoragePath = /storage/nftCatalogAdmin

    let admin  <- create Admin()

    self.account.save(<-admin, to: self.AdminStoragePath)
    self.account.link<&Admin>(self.AdminPrivatePath, target: self.AdminStoragePath)
  }
}