// This transaction purchases an NFT from a dapp directly (i.e. **not** on a peer-to-peer marketplace).
transaction(storefrontAddress: Address, listingResourceID: UInt64, expectedPrice: UFix64, commissionRecipient: Address?) {
    let paymentVault: @FungibleToken.Vault
    let nftCollection: &${cI.publicLinkedType}
    let storefront: &NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}
    let listing: &NFTStorefrontV2.Listing{NFTStorefrontV2.ListingPublic}
    let dappAddress: Address
    let salePrice: UFix64
    let balanceBeforeTransfer: UFix64
    let mainUtilityCoinVault: &${vI.contractName}.Vault
    var commissionRecipientCap: Capability<&{FungibleToken.Receiver}>?

    prepare(buyer: AuthAccount, dapp: AuthAccount, dapper: AuthAccount) {
        self.commissionRecipientCap = nil
        self.dappAddress = dapp.address
        
        // Initialize the buyer's collection if they do not already have one
        if buyer.borrow<&${cI.contractName}.Collection>(from: ${cI.storagePath}) == nil {
            let collection <- ${cI.contractName}.createEmptyCollection() as! @${cI.contractName}.Collection
            buyer.save(<-collection, to: ${cI.storagePath})
        }

        if (buyer.getCapability<&${cI.publicLinkedType}>(${cI.publicPath}).borrow() == nil) {
            buyer.unlink(${cI.publicPath})
            buyer.link<&${cI.publicLinkedType}>(${cI.publicPath}, target: ${cI.storagePath})
        }

        if (buyer.getCapability<&${cI.privateLinkedType}>(${cI.privatePath}).borrow() == nil) {
            buyer.unlink(${cI.privatePath})
            buyer.link<&${cI.privateLinkedType}>(${cI.privatePath}, target: ${cI.storagePath})
        }

        self.storefront = dapp
            .getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(
                NFTStorefrontV2.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        // Get the listing by ID from the storefront
        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)
            ?? panic("No Offer with that ID in Storefront")
        self.salePrice = self.listing.getDetails().salePrice

        // Get a vault from Dapper's account
        self.mainUtilityCoinVault = dapper.borrow<&${vI.contractName}.Vault>(from: ${vI.storagePath})
            ?? panic("Cannot borrow UtilityCoin vault from account storage")
        self.balanceBeforeTransfer = self.mainUtilityCoinVault.balance
        self.paymentVault <- self.mainUtilityCoinVault.withdraw(amount: self.salePrice)

        // Get the collection from the buyer so the NFT can be deposited into it
        self.nftCollection = buyer.borrow<&${cI.publicLinkedType}>(
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

    // Check that the price is right
    pre {
        self.salePrice == expectedPrice: "unexpected price"
        self.dappAddress == storefrontAddress: "Requires valid authorizing signature"
    }

    execute {
        let item <- self.listing.purchase(
            payment: <-self.paymentVault,
            commissionRecipient: self.commissionRecipientCap
        )

        self.nftCollection.deposit(token: <-item)
    }

    // Check that all utilityCoin was routed back to Dapper
    post {
        self.mainUtilityCoinVault.balance == self.balanceBeforeTransfer: "UtilityCoin leakage"
    }
}