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

transaction(saleItemID: UInt64, saleItemPrice: UFix64, customID: String?, commissionAmount: UFix64, expiry: UInt64, marketplacesAddress: [Address]) {
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

        if acct.getCapability<&${vI.publicLinkedType}>(${vI.publicPath}) == nil {
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