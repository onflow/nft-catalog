// This transaction was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)
//
// This transaction facilitates the purchase of a listed NFT with the StorefrontV2 contract 
// 
// Collection Identifier: ${cI.identifier}
// Vault Identifier: ${vI.identifier}
//
// Version: ${version}

transaction(listingResourceID: UInt64, storefrontAddress: Address, commissionRecipient: Address?) {
    /// `listingResourceID` - ID of the Storefront listing resource
    /// `storefrontAddress` - The address that owns the storefront listing
    /// `commissionRecipient` - Optional recipient for transaction commission if comission exists.
    let paymentVault: @FungibleToken.Vault
    let nftCollection: &${cI.publicLinkedType}
    let storefront: &NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}
    let listing: &NFTStorefrontV2.Listing{NFTStorefrontV2.ListingPublic}
    var commissionRecipientCap: Capability<&{FungibleToken.Receiver}>?

    prepare(acct: AuthAccount) {
        self.commissionRecipientCap = nil

        // Set up NFT to make sure this account has NFT setup correctly
        if acct.borrow<&${cI.contractName}.Collection>(from: ${cI.storagePath}) == nil {
            let collection <- ${cI.contractName}.createEmptyCollection()
            acct.save(<-collection, to: ${cI.storagePath})
            }
        if (acct.getCapability<&${cI.publicLinkedType}>(${cI.publicPath}).borrow() == nil) {
            acct.unlink(${cI.publicPath})
            acct.link<&${cI.publicLinkedType}>(${cI.publicPath}, target: ${cI.storagePath})
        }

        if (acct.getCapability<&${cI.privateLinkedType}>(${cI.privatePath}).borrow() == nil) {
            acct.unlink(${cI.privatePath})
            acct.link<&${cI.privateLinkedType}>(${cI.privatePath}, target: ${cI.storagePath})
        }
        
        // Access the storefront public resource of the seller to purchase the listing.
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(
                NFTStorefrontV2.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        // Borrow the listing
        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)
                    ?? panic("No Offer with that ID in Storefront")
        let price = self.listing.getDetails().salePrice

        // Access the vault of the buyer to pay the sale price of the listing.
        let mainFTVault = acct.borrow<&${vI.contractName}.Vault>(from: ${vI.storagePath})
            ?? panic("Cannot borrow Fungible Token vault from acct storage")
        self.paymentVault <- mainFTVault.withdraw(amount: price)

        // Access the buyer's NFT collection to store the purchased NFT.
        self.nftCollection = acct.borrow<&${cI.publicLinkedType}>(
            from: ${cI.storagePath}
        ) ?? panic("Cannot borrow NFT collection receiver from account")

        // Fetch the commission amt.
        let commissionAmount = self.listing.getDetails().commissionAmount

        if commissionRecipient != nil && commissionAmount != 0.0 {
            // Access the capability to receive the commission.
            let _commissionRecipientCap = getAccount(commissionRecipient!).getCapability<&{FungibleToken.Receiver}>(${vI.publicPath})
            assert(_commissionRecipientCap.check(), message: "Commission Recipient doesn't have flowtoken receiving capability")
            self.commissionRecipientCap = _commissionRecipientCap
        } else if commissionAmount == 0.0 {
            self.commissionRecipientCap = nil
        } else {
            panic("Commission recipient can not be empty when commission amount is non zero")
        }
    }

    execute {
        // Purchase the NFT
        let item <- self.listing.purchase(
            payment: <-self.paymentVault,
            commissionRecipient: self.commissionRecipientCap
        )
        // Deposit the NFT in the buyer's collection.
        self.nftCollection.deposit(token: <-item)
    }
}