// This transaction was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)
//
// This transaction facilitates the listing of an NFT with the StorefrontV2 contract
// 
// Collection Identifier: ${cI.identifier}
// Vault Identifier: ${vI.identifier}
//
// Version: ${version}

transaction(saleItemID: UInt64, saleItemPrice: UFix64, commissionAmount: UFix64, marketplaceAddresses: [Address], expiry: UInt64, customID: String?) {
    // 'saleItemID' - ID of the NFT that is put on sale by the seller.
    // 'saleItemPrice' - Amount of tokens (FT) buyer needs to pay for the purchase of listed NFT.
    // 'commissionAmount' - Commission amount that will be taken away by the purchase facilitator i.e marketplaceAddresses.
    // 'marketplaceAddresses' - List of addresses that are allowed to get the commission.
    // 'expiry' - Unix timestamp at which created listing become expired.
    // 'customID' - Optional string to represent identifier of the dapp.
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
        let nftPrivateCollectionPath = ${cI.privatePath}

        // ************************* Handling of DUC Recevier *************************** //

        // Fetch the capability of the universal DUC receiver
        // Note - Below address only works for the Testnet transaction, For mainnet it needs to change.
        let recipient = getAccount(${vI.contractAddress}).getCapability<&{FungibleToken.Receiver}>(/public/dapperUtilityCoinReceiver)
        assert(recipient.borrow() != nil, message: "Missing or mis-typed Fungible Token receiver for the DUC recipient")

        // Check whether the receiver has the capability to receive the DUC
        self.sellerPaymentReceiver = seller.getCapability<&{FungibleToken.Receiver}>(/public/dapperUtilityCoinReceiver)
        if self.sellerPaymentReceiver.borrow() == nil || !self.sellerPaymentReceiver.borrow()!.isInstance(Type<@TokenForwarding.Forwarder>()) {
            seller.unlink(/public/dapperUtilityCoinReceiver)
            // Create the forwarder and save it to the account that is doing the forwarding
            let vault <- TokenForwarding.createNewForwarder(recipient: recipient)
            seller.save(<-vault, to: /storage/ducTokenForwarder)
            // Link the new forwarding receiver capability
            seller.link<&{FungibleToken.Receiver}>(
                /public/dapperUtilityCoinReceiver,
                target: /storage/ducTokenForwarder
            )
            self.sellerPaymentReceiver = seller.getCapability<&{FungibleToken.Receiver}>(/public/dapperUtilityCoinReceiver)
        }

        // Validate the marketplaces capability before submiting to 'createListing'.
        for mp in marketplaceAddresses {
            let marketplaceReceiver = getAccount(mp).getCapability<&{FungibleToken.Receiver}>(/public/dapperUtilityCoinReceiver)
            assert(marketplaceReceiver.borrow() != nil && marketplaceReceiver.borrow()!.isInstance(Type<@TokenForwarding.Forwarder>()), message: "Marketplaces does not posses the valid receiver type for DUC")
            self.marketplacesCapability.append(marketplaceReceiver)
        }

        // *************************** Seller account interactions  *************************** //

        // This checks for the public capability
        if !seller.getCapability<&${cI.publicLinkedType}>(${cI.contractName}.CollectionPublicPath)!.check() {
            seller.unlink(${cI.contractName}.CollectionPublicPath)
            seller.link<&{${cI.publicLinkedType}>(${cI.contractName}.CollectionPublicPath, target: ${cI.contractName}.CollectionStoragePath)
        }

        // Check if the Provider capability exists or not if 'no' then create a new link for the same.
        if !seller.getCapability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftPrivateCollectionPath)!.check() {
            seller.unlink(nftPrivateCollectionPath)
            seller.link<&{${cI.privateLinkedType}>(nftPrivateCollectionPath, target: ${cI.contractName}.CollectionStoragePath)
        }

        self.nftProvider = seller.getCapability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftPrivateCollectionPath)!
        let collectionRef = seller
            .getCapability(${cI.publicPath})
            .borrow<&${cI.publicLinkedType}>()
        var totalRoyaltyCut = 0.0
        let effectiveSaleItemPrice = saleItemPrice - commissionAmount

        let nft = collectionRef.borrowViewResolver(id: saleItemID)!       
        // Check whether the NFT implements the MetadataResolver or not.
        if nft.getViews().contains(Type<MetadataViews.Royalties>()) {
            let royaltiesRef = nft.resolveView(Type<MetadataViews.Royalties>()) ?? panic("Unable to retrieve the royalties")
            let royalties = (royaltiesRef as! MetadataViews.Royalties).getRoyalties()
            for royalty in royalties {
                let royaltyReceiver = royalty.receiver
                assert(royaltyReceiver.borrow() != nil && royaltyReceiver.borrow()!.isInstance(Type<@TokenForwarding.Forwarder>()), message: "Royalty receiver does not has valid receiver type")
                self.saleCuts.append(NFTStorefrontV2.SaleCut(receiver: royalty.receiver, amount: royalty.cut * effectiveSaleItemPrice))
                totalRoyaltyCut = totalRoyaltyCut + royalty.cut * effectiveSaleItemPrice
            }
        }
        // Append the cut for the seller.
        self.saleCuts.append(NFTStorefrontV2.SaleCut(
            receiver: self.sellerPaymentReceiver,
            amount: effectiveSaleItemPrice - totalRoyaltyCut
        ))
        assert(self.nftProvider.borrow() != nil, message: "Missing or mis-typed ${cI.contractName}.Collection provider")

        if seller.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath) == nil {
            // Create a new empty Storefront
            let storefront <- NFTStorefrontV2.createStorefront() as! @NFTStorefrontV2.Storefront
            // save it to the account
            seller.save(<-storefront, to: NFTStorefrontV2.StorefrontStoragePath)
            // create a public capability for the Storefront
            seller.link<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(NFTStorefrontV2.StorefrontPublicPath, target: NFTStorefrontV2.StorefrontStoragePath)
        }
        self.storefront = seller.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath)!
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
