// This transaction was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)
//
// This transaction purchases an NFT from a dapp directly (i.e. **not** on a peer-to-peer marketplace).
// 
// Collection Identifier: ${cI.identifier}
// Vault Identifier: ${vI.identifier}
//
// Version: ${version}

transaction(saleItemID: UInt64, saleItemPrice: UFix64, commissionAmount: UFix64, marketplacesAddress: [Address], expiry: UInt64, customID: String?) {
    /// `saleItemID` - ID of the NFT that is put on sale by the seller.
    /// `saleItemPrice` - Amount of tokens (FT) buyer needs to pay for the purchase of listed NFT.
    /// `commissionAmount` - Commission amount that will be taken away by the purchase facilitator.
    /// `marketplacesAddress` - List of addresses that are allowed to get the commission.
    /// `expiry` - Unix timestamp at which created listing become expired.
    /// `customID` - Optional string to represent identifier of the dapp.
    let sellerPaymentReceiver: Capability<&{FungibleToken.Receiver}>
    let nftProvider: Capability<&${cI.contractName}.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefrontV2.Storefront
    var saleCuts: [NFTStorefrontV2.SaleCut]
    var marketplacesCapability: [Capability<&AnyResource{FungibleToken.Receiver}>]

    // It's important that the dapp account authorize this transaction so the dapp has the ability
    // to validate and approve the royalty included in the sale.
    prepare(seller: AuthAccount) {
        self.saleCuts = []
        self.marketplacesCapability = []

        // If the account doesn't already have a storefront, create one and add it to the account
        if seller.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath) == nil {
            // Create a new empty Storefront
            let storefront <- NFTStorefrontV2.createStorefront() as! @NFTStorefrontV2.Storefront
            // save it to the account
            seller.save(<-storefront, to: NFTStorefrontV2.StorefrontStoragePath)
            // create a public capability for the Storefront
            seller.link<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(NFTStorefrontV2.StorefrontPublicPath, target: NFTStorefrontV2.StorefrontStoragePath)
        }

         // FT Setup if the user's account is not initialized with FT receiver
        if seller.borrow<&{FungibleToken.Receiver}>(from: ${vI.receiverStoragePath}) == nil {

            let dapper = getAccount(${vI.contractAddress})
            let dapperFTReceiver = dapper.getCapability<&{FungibleToken.Receiver}>(${vI.publicPath})!

            // Create a new Forwarder resource for FUT and store it in the new account's storage
            let ftForwarder <- TokenForwarding.createNewForwarder(recipient: dapperFTReceiver)
            seller.save(<-ftForwarder, to: ${vI.receiverStoragePath})

            // Publish a Receiver capability for the new account, which is linked to the FUT Forwarder
            seller.link<&${vI.contractName}.Vault{FungibleToken.Receiver}>(
                ${vI.publicPath},
                target: ${vI.receiverStoragePath}
            )
        }

        // Get a reference to the receiver that will receive the fungible tokens if the sale executes.
        // Note that the sales receiver aka MerchantAddress should be an account owned by Dapper or an end-user Dapper Wallet account address.
        self.sellerPaymentReceiver = getAccount(seller.address).getCapability<&{FungibleToken.Receiver}>(${vI.publicPath})
        assert(self.sellerPaymentReceiver.borrow() != nil, message: "Missing or mis-typed DapperUtilityCoin receiver")

        // If the user does not have their collection linked to their account, link it.
        if seller.borrow<&${cI.contractName}.Collection>(from: ${cI.storagePath}) == nil {
            let collection <- ${cI.contractName}.createEmptyCollection()
            seller.save(<-collection, to: ${cI.storagePath})
        }
        if (seller.getCapability<&${cI.publicLinkedType}>(${cI.publicPath}).borrow() == nil) {
            seller.unlink(${cI.publicPath})
            seller.link<&${cI.publicLinkedType}>(${cI.publicPath}, target: ${cI.storagePath})
        }

        if (seller.getCapability<&${cI.privateLinkedType}>(${cI.privatePath}).borrow() == nil) {
            seller.unlink(${cI.privatePath})
            seller.link<&${cI.privateLinkedType}>(${cI.privatePath}, target: ${cI.storagePath})
        }

        self.nftProvider = seller.getCapability<&${cI.contractName}.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(${cI.privatePath})!
        assert(self.nftProvider.borrow() != nil, message: "Missing or mis-typed collection provider")

        if seller.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath) == nil {
            // Create a new empty Storefront
            let storefront <- NFTStorefrontV2.createStorefront() as! @NFTStorefrontV2.Storefront
            // save it to the account
            seller.save(<-storefront, to: NFTStorefrontV2.StorefrontStoragePath)
            // create a public capability for the Storefront
            seller.link<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(NFTStorefrontV2.StorefrontPublicPath, target: NFTStorefrontV2.StorefrontStoragePath)
        }
        self.storefront = seller.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")

        
        let collectionRef = seller
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
            receiver: self.sellerPaymentReceiver,
            amount: effectiveSaleItemPrice - totalRoyaltyCut
        ))

        for marketplace in marketplacesAddress {
            self.marketplacesCapability.append(getAccount(marketplace).getCapability<&{FungibleToken.Receiver}>(${vI.publicPath}))
        }
    }

    execute {

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