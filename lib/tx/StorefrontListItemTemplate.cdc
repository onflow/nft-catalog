// This transaction was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)
//
// This transaction facilitates the listing of an NFT with the StorefrontV2 contract
// 
// Collection Identifier: ${cI.identifier}
// Vault Identifier: ${vI.identifier}
//
// Version: ${version}

transaction(saleItemID: UInt64, saleItemPrice: UFix64, customID: String?, commissionAmount: UFix64, expiry: UInt64, marketplacesAddress: [Address]) {
    /// `saleItemID` - ID of the NFT that is put on sale by the seller.
    /// `saleItemPrice` - Amount of tokens (FT) buyer needs to pay for the purchase of listed NFT.
    /// `customID` - Optional string to represent identifier of the dapp.
    /// `commissionAmount` - Commission amount that will be taken away by the purchase facilitator.
    /// `expiry` - Unix timestamp at which created listing become expired.
    /// `marketplacesAddress` - List of addresses that are allowed to get the commission.
    let ftReceiver: Capability<&AnyResource{FungibleToken.Receiver}>
    let nftProvider: Capability<&AnyResource{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefrontV2.Storefront
    var saleCuts: [NFTStorefrontV2.SaleCut]
    var marketplacesCapability: [Capability<&AnyResource{FungibleToken.Receiver}>]

    prepare(acct: AuthAccount) {
        self.saleCuts = []
        self.marketplacesCapability = []

        // Set up FT to make sure this account can receive the proper currency
        if acct.borrow<&${vI.contractName}.Vault>(from: ${vI.storagePath}) == nil {
            let vault <- ${vI.contractName}.createEmptyVault()
            acct.save(<-vault, to: ${vI.storagePath})
        }

        if acct.getCapability<&${vI.publicLinkedType}>(${vI.publicPath}).borrow() == nil {
            acct.unlink(${vI.publicPath})
            acct.link<&${vI.publicLinkedType}>(${vI.publicPath},target: ${vI.storagePath})
        }
        
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

        // Receiver for the sale cut.
        self.ftReceiver = acct.getCapability<&{FungibleToken.Receiver}>(${vI.publicPath})!
        assert(self.ftReceiver.borrow() != nil, message: "Missing or mis-typed Fungible Token receiver")

        self.nftProvider = acct.getCapability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(${cI.privatePath})!
        let collectionRef = acct
            .getCapability(${cI.publicPath})
            .borrow<&${cI.publicLinkedType}>()
            ?? panic("Could not borrow a reference to the collection")
        var totalRoyaltyCut = 0.0
        let effectiveSaleItemPrice = saleItemPrice - commissionAmount

        let nft = collectionRef.borrowViewResolver(id: saleItemID)!       
        if (nft.getViews().contains(Type<MetadataViews.Royalties>())) {
            let royaltiesRef = nft.resolveView(Type<MetadataViews.Royalties>()) ?? panic("Unable to retrieve the royalties")
            let royalties = (royaltiesRef as! MetadataViews.Royalties).getRoyalties()
            for royalty in royalties {
                // TODO - Verify the type of the vault and it should exists
                self.saleCuts.append(NFTStorefrontV2.SaleCut(receiver: royalty.receiver, amount: royalty.cut * effectiveSaleItemPrice))
                totalRoyaltyCut = totalRoyaltyCut + royalty.cut * effectiveSaleItemPrice
            }
        }

        // Append the cut for the seller.
        self.saleCuts.append(NFTStorefrontV2.SaleCut(
            receiver: self.ftReceiver,
            amount: effectiveSaleItemPrice - totalRoyaltyCut
        ))
        assert(self.nftProvider.borrow() != nil, message: "Missing or mis-typed nftProvider")


        if acct.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath) == nil {
            // Create a new empty Storefront
            let storefront <- NFTStorefrontV2.createStorefront() as! @NFTStorefrontV2.Storefront
            // save it to the account
            acct.save(<-storefront, to: NFTStorefrontV2.StorefrontStoragePath)
            // create a public capability for the Storefront
            acct.link<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(NFTStorefrontV2.StorefrontPublicPath, target: NFTStorefrontV2.StorefrontStoragePath)
        }
        self.storefront = acct.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")

        for marketplace in marketplacesAddress {
            self.marketplacesCapability.append(getAccount(marketplace).getCapability<&{FungibleToken.Receiver}>(${vI.publicPath}))
        }
    }

    execute {
        // Create listing
        self.storefront.createListing(
            nftProviderCapability: self.nftProvider,
            nftType: Type<${cI.type}>(),
            nftID: saleItemID,
            salePaymentVaultType: Type<${vI.type}>(),
            saleCuts: self.saleCuts,
            marketplacesCapability: self.marketplacesCapability.length == 0 ? nil : self.marketplacesCapability,
            customID: customID,
            commissionAmount: commissionAmount,
            expiry: expiry
        )
    }
}