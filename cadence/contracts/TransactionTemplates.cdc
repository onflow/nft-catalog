// TransactionTemplates is an auto-generated contract created from https://github.com/dapperlabs/nft-catalog
//
// Why is this string stuff on-chain?!?
// This is on-chain and consummable from a Cadence script in order to allow consumers
// to be able to pull relevant transactions from wherever cadence is able to be executed.
// JS-specific support including an NPM module is available at the above github.
//

import FungibleToken from "./FungibleToken.cdc"
import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"
import NFTCatalog from "./NFTCatalog.cdc"
import StringUtils from "./StringUtils.cdc"
import ArrayUtils from "./ArrayUtils.cdc"
import NFTStorefrontV2 from "./NFTStorefrontV2.cdc"
import TransactionGenerationUtils from "./TransactionGenerationUtils.cdc"

pub contract TransactionTemplates {

/*
  The following functions are available:
  NFTInitTemplate, StorefrontListItemTemplate, StorefrontBuyItemTemplate, DapperBuyNFTMarketplaceTemplate, StorefrontRemoveItemTemplate, DapperCreateListingTemplate, DapperBuyNFTDirectTemplate, DapperGetPrimaryListingMetadataTemplate, DapperGetSecondaryListingMetadataTemplate
*/
pub fun NFTInitTemplate(nftSchema: TransactionGenerationUtils.NFTSchema?, ftSchema: TransactionGenerationUtils.FTSchemaV2?, params: {String: String}?): String {

    var nftPublicLink = ""
    var nftPrivateLink = ""
    var ftPublicLink = ""
    var ftPrivateLink = ""
    if nftSchema != nil {
      nftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.publicLinkedType)
      nftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.privateLinkedType)
    }
    if ftSchema != nil {
      ftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.publicLinkedType)
      ftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.privateLinkedType)
    }
  
let lines: [[String]] = [
["// This transaction was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)"],
["//"],
["// This transaction initializes a user's collection to support a specific NFT"],
["// "],
["// Collection Identifier: ", nftSchema!.identifier, ""],
["//"],
["// Version: 0.1.1"],
[""],
["transaction {"],
[""],
["  prepare(signer: AuthAccount) {"],
["    if signer.borrow<&", nftSchema!.contractName, ".Collection>(from: ", nftSchema!.storagePath, ") == nil {"],
["      let collection <- ", nftSchema!.contractName, ".createEmptyCollection()"],
["      signer.save(<-collection, to: ", nftSchema!.storagePath, ")"],
["    }"],
["    if (signer.getCapability<&", nftPublicLink, ">(", nftSchema!.publicPath, ").borrow() == nil) {"],
["      signer.unlink(", nftSchema!.publicPath, ")"],
["      signer.link<&", nftPublicLink, ">(", nftSchema!.publicPath, ", target: ", nftSchema!.storagePath, ")"],
["    }"],
["  }"],
[""],
["}"],
[""]]
var combinedLines: [String] = []
for line in lines {
combinedLines.append(StringUtils.join(line, ""))
}
return StringUtils.join(combinedLines, "\n")
}
pub fun StorefrontListItemTemplate(nftSchema: TransactionGenerationUtils.NFTSchema?, ftSchema: TransactionGenerationUtils.FTSchemaV2?, params: {String: String}?): String {

    var nftPublicLink = ""
    var nftPrivateLink = ""
    var ftPublicLink = ""
    var ftPrivateLink = ""
    if nftSchema != nil {
      nftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.publicLinkedType)
      nftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.privateLinkedType)
    }
    if ftSchema != nil {
      ftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.publicLinkedType)
      ftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.privateLinkedType)
    }
  
let lines: [[String]] = [
["// This transaction was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)"],
["//"],
["// This transaction facilitates the listing of an NFT with the StorefrontV2 contract"],
["// "],
["// Collection Identifier: ", nftSchema!.identifier, ""],
["// Vault Identifier: ", ftSchema!.identifier, ""],
["//"],
["// Version: 0.1.1"],
[""],
["transaction(saleItemID: UInt64, saleItemPrice: UFix64, customID: String?, commissionAmount: UFix64, expiry: UInt64, marketplacesAddress: [Address]) {"],
["    /// `saleItemID` - ID of the NFT that is put on sale by the seller."],
["    /// `saleItemPrice` - Amount of tokens (FT) buyer needs to pay for the purchase of listed NFT."],
["    /// `customID` - Optional string to represent identifier of the dapp."],
["    /// `commissionAmount` - Commission amount that will be taken away by the purchase facilitator."],
["    /// `expiry` - Unix timestamp at which created listing become expired."],
["    /// `marketplacesAddress` - List of addresses that are allowed to get the commission."],
["    let ftReceiver: Capability<&AnyResource{FungibleToken.Receiver}>"],
["    let nftProvider: Capability<&AnyResource{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>"],
["    let storefront: &NFTStorefrontV2.Storefront"],
["    var saleCuts: [NFTStorefrontV2.SaleCut]"],
["    var marketplacesCapability: [Capability<&AnyResource{FungibleToken.Receiver}>]"],
[""],
["    prepare(acct: AuthAccount) {"],
["        self.saleCuts = []"],
["        self.marketplacesCapability = []"],
[""],
["        // Set up FT to make sure this account can receive the proper currency"],
["        if acct.borrow<&", ftSchema!.contractName, ".Vault>(from: ", ftSchema!.storagePath, ") == nil {"],
["            let vault <- ", ftSchema!.contractName, ".createEmptyVault()"],
["            acct.save(<-vault, to: ", ftSchema!.storagePath, ")"],
["        }"],
[""],
["        if acct.getCapability<&", ftPublicLink, ">(", ftSchema!.publicPath, ").borrow() == nil {"],
["            acct.unlink(", ftSchema!.publicPath, ")"],
["            acct.link<&", ftPublicLink, ">(", ftSchema!.publicPath, ",target: ", ftSchema!.storagePath, ")"],
["        }"],
["        "],
["        // Set up NFT to make sure this account has NFT setup correctly"],
["        if acct.borrow<&", nftSchema!.contractName, ".Collection>(from: ", nftSchema!.storagePath, ") == nil {"],
["            let collection <- ", nftSchema!.contractName, ".createEmptyCollection()"],
["            acct.save(<-collection, to: ", nftSchema!.storagePath, ")"],
["        }"],
["        if (acct.getCapability<&", nftPublicLink, ">(", nftSchema!.publicPath, ").borrow() == nil) {"],
["            acct.unlink(", nftSchema!.publicPath, ")"],
["            acct.link<&", nftPublicLink, ">(", nftSchema!.publicPath, ", target: ", nftSchema!.storagePath, ")"],
["        }"],
[""],
["        if (acct.getCapability<&", nftPrivateLink, ">(", nftSchema!.privatePath, ").borrow() == nil) {"],
["            acct.unlink(", nftSchema!.privatePath, ")"],
["            acct.link<&", nftPrivateLink, ">(", nftSchema!.privatePath, ", target: ", nftSchema!.storagePath, ")"],
["        }"],
[""],
["        // Receiver for the sale cut."],
["        self.ftReceiver = acct.getCapability<&{FungibleToken.Receiver}>(", ftSchema!.publicPath, ")!"],
["        assert(self.ftReceiver.borrow() != nil, message: \"Missing or mis-typed Fungible Token receiver\")"],
[""],
["        self.nftProvider = acct.getCapability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(", nftSchema!.privatePath, ")!"],
["        let collectionRef = acct"],
["            .getCapability(", nftSchema!.publicPath, ")"],
["            .borrow<&", nftPublicLink, ">()"],
["            ?? panic(\"Could not borrow a reference to the collection\")"],
["        var totalRoyaltyCut = 0.0"],
["        let effectiveSaleItemPrice = saleItemPrice - commissionAmount"],
[""],
["        let nft = collectionRef.borrowViewResolver(id: saleItemID)!       "],
["        if (nft.getViews().contains(Type<MetadataViews.Royalties>())) {"],
["            let royaltiesRef = nft.resolveView(Type<MetadataViews.Royalties>()) ?? panic(\"Unable to retrieve the royalties\")"],
["            let royalties = (royaltiesRef as! MetadataViews.Royalties).getRoyalties()"],
["            for royalty in royalties {"],
["                // TODO - Verify the type of the vault and it should exists"],
["                self.saleCuts.append(NFTStorefrontV2.SaleCut(receiver: royalty.receiver, amount: royalty.cut * effectiveSaleItemPrice))"],
["                totalRoyaltyCut = totalRoyaltyCut + royalty.cut * effectiveSaleItemPrice"],
["            }"],
["        }"],
[""],
["        // Append the cut for the seller."],
["        self.saleCuts.append(NFTStorefrontV2.SaleCut("],
["            receiver: self.ftReceiver,"],
["            amount: effectiveSaleItemPrice - totalRoyaltyCut"],
["        ))"],
["        assert(self.nftProvider.borrow() != nil, message: \"Missing or mis-typed nftProvider\")"],
[""],
[""],
["        if acct.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath) == nil {"],
["            // Create a new empty Storefront"],
["            let storefront <- NFTStorefrontV2.createStorefront() as! @NFTStorefrontV2.Storefront"],
["            // save it to the account"],
["            acct.save(<-storefront, to: NFTStorefrontV2.StorefrontStoragePath)"],
["            // create a public capability for the Storefront"],
["            acct.link<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(NFTStorefrontV2.StorefrontPublicPath, target: NFTStorefrontV2.StorefrontStoragePath)"],
["        }"],
["        self.storefront = acct.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath)"],
["            ?? panic(\"Missing or mis-typed NFTStorefront Storefront\")"],
[""],
["        for marketplace in marketplacesAddress {"],
["            self.marketplacesCapability.append(getAccount(marketplace).getCapability<&{FungibleToken.Receiver}>(", ftSchema!.publicPath, "))"],
["        }"],
["    }"],
[""],
["    execute {"],
["        // Create listing"],
["        self.storefront.createListing("],
["            nftProviderCapability: self.nftProvider,"],
["            nftType: Type<@", TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.type), ">(),"],
["            nftID: saleItemID,"],
["            salePaymentVaultType: Type<@", TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.type), ">(),"],
["            saleCuts: self.saleCuts,"],
["            marketplacesCapability: self.marketplacesCapability.length == 0 ? nil : self.marketplacesCapability,"],
["            customID: customID,"],
["            commissionAmount: commissionAmount,"],
["            expiry: expiry"],
["        )"],
["    }"],
["}"],
[""]]
var combinedLines: [String] = []
for line in lines {
combinedLines.append(StringUtils.join(line, ""))
}
return StringUtils.join(combinedLines, "\n")
}
pub fun StorefrontBuyItemTemplate(nftSchema: TransactionGenerationUtils.NFTSchema?, ftSchema: TransactionGenerationUtils.FTSchemaV2?, params: {String: String}?): String {

    var nftPublicLink = ""
    var nftPrivateLink = ""
    var ftPublicLink = ""
    var ftPrivateLink = ""
    if nftSchema != nil {
      nftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.publicLinkedType)
      nftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.privateLinkedType)
    }
    if ftSchema != nil {
      ftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.publicLinkedType)
      ftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.privateLinkedType)
    }
  
let lines: [[String]] = [
["// This transaction was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)"],
["//"],
["// This transaction facilitates the purchase of a listed NFT with the StorefrontV2 contract "],
["// "],
["// Collection Identifier: ", nftSchema!.identifier, ""],
["// Vault Identifier: ", ftSchema!.identifier, ""],
["//"],
["// Version: 0.1.1"],
[""],
["transaction(listingResourceID: UInt64, storefrontAddress: Address, commissionRecipient: Address?) {"],
["    /// `listingResourceID` - ID of the Storefront listing resource"],
["    /// `storefrontAddress` - The address that owns the storefront listing"],
["    /// `commissionRecipient` - Optional recipient for transaction commission if comission exists."],
["    let paymentVault: @FungibleToken.Vault"],
["    let nftCollection: &", nftPublicLink, ""],
["    let storefront: &NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}"],
["    let listing: &NFTStorefrontV2.Listing{NFTStorefrontV2.ListingPublic}"],
["    var commissionRecipientCap: Capability<&{FungibleToken.Receiver}>?"],
[""],
["    prepare(acct: AuthAccount) {"],
["        self.commissionRecipientCap = nil"],
[""],
["        // Set up NFT to make sure this account has NFT setup correctly"],
["        if acct.borrow<&", nftSchema!.contractName, ".Collection>(from: ", nftSchema!.storagePath, ") == nil {"],
["            let collection <- ", nftSchema!.contractName, ".createEmptyCollection()"],
["            acct.save(<-collection, to: ", nftSchema!.storagePath, ")"],
["            }"],
["        if (acct.getCapability<&", nftPublicLink, ">(", nftSchema!.publicPath, ").borrow() == nil) {"],
["            acct.unlink(", nftSchema!.publicPath, ")"],
["            acct.link<&", nftPublicLink, ">(", nftSchema!.publicPath, ", target: ", nftSchema!.storagePath, ")"],
["        }"],
[""],
["        if (acct.getCapability<&", nftPrivateLink, ">(", nftSchema!.privatePath, ").borrow() == nil) {"],
["            acct.unlink(", nftSchema!.privatePath, ")"],
["            acct.link<&", nftPrivateLink, ">(", nftSchema!.privatePath, ", target: ", nftSchema!.storagePath, ")"],
["        }"],
["        "],
["        // Access the storefront public resource of the seller to purchase the listing."],
["        self.storefront = getAccount(storefrontAddress)"],
["            .getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>("],
["                NFTStorefrontV2.StorefrontPublicPath"],
["            )!"],
["            .borrow()"],
["            ?? panic(\"Could not borrow Storefront from provided address\")"],
[""],
["        // Borrow the listing"],
["        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)"],
["                    ?? panic(\"No Offer with that ID in Storefront\")"],
["        let price = self.listing.getDetails().salePrice"],
[""],
["        // Access the vault of the buyer to pay the sale price of the listing."],
["        let mainFTVault = acct.borrow<&", ftSchema!.contractName, ".Vault>(from: ", ftSchema!.storagePath, ")"],
["            ?? panic(\"Cannot borrow Fungible Token vault from acct storage\")"],
["        self.paymentVault <- mainFTVault.withdraw(amount: price)"],
[""],
["        // Access the buyer's NFT collection to store the purchased NFT."],
["        self.nftCollection = acct.borrow<&", nftPublicLink, ">("],
["            from: ", nftSchema!.storagePath, ""],
["        ) ?? panic(\"Cannot borrow NFT collection receiver from account\")"],
[""],
["        // Fetch the commission amt."],
["        let commissionAmount = self.listing.getDetails().commissionAmount"],
[""],
["        if commissionRecipient != nil && commissionAmount != 0.0 {"],
["            // Access the capability to receive the commission."],
["            let _commissionRecipientCap = getAccount(commissionRecipient!).getCapability<&{FungibleToken.Receiver}>(", ftSchema!.publicPath, ")"],
["            assert(_commissionRecipientCap.check(), message: \"Commission Recipient doesn't have flowtoken receiving capability\")"],
["            self.commissionRecipientCap = _commissionRecipientCap"],
["        } else if commissionAmount == 0.0 {"],
["            self.commissionRecipientCap = nil"],
["        } else {"],
["            panic(\"Commission recipient can not be empty when commission amount is non zero\")"],
["        }"],
["    }"],
[""],
["    execute {"],
["        // Purchase the NFT"],
["        let item <- self.listing.purchase("],
["            payment: <-self.paymentVault,"],
["            commissionRecipient: self.commissionRecipientCap"],
["        )"],
["        // Deposit the NFT in the buyer's collection."],
["        self.nftCollection.deposit(token: <-item)"],
["    }"],
["}"],
[""]]
var combinedLines: [String] = []
for line in lines {
combinedLines.append(StringUtils.join(line, ""))
}
return StringUtils.join(combinedLines, "\n")
}
pub fun DapperBuyNFTMarketplaceTemplate(nftSchema: TransactionGenerationUtils.NFTSchema?, ftSchema: TransactionGenerationUtils.FTSchemaV2?, params: {String: String}?): String {

    var nftPublicLink = ""
    var nftPrivateLink = ""
    var ftPublicLink = ""
    var ftPrivateLink = ""
    if nftSchema != nil {
      nftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.publicLinkedType)
      nftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.privateLinkedType)
    }
    if ftSchema != nil {
      ftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.publicLinkedType)
      ftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.privateLinkedType)
    }
  
let lines: [[String]] = [
["// This transaction was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)"],
["//"],
["// This transaction purchases an NFT from a p2p marketplace."],
["// "],
["// Collection Identifier: ", nftSchema!.identifier, ""],
["// Vault Identifier: ", ftSchema!.identifier, ""],
["//"],
["// Version: 0.1.1"],
[""],
["transaction(storefrontAddress: Address, listingResourceID: UInt64,  expectedPrice: UFix64, commissionRecipient: Address?) {"],
["    /// `storefrontAddress` - The address that owns the storefront listing"],
["    /// `listingResourceID` - ID of the Storefront listing resource"],
["    /// `expectedPrice: UFix64` - How much you expect to pay for the NFT"],
["    /// `commissionRecipient` - Optional recipient for transaction commission if comission exists."],
["    let paymentVault: @FungibleToken.Vault"],
["    let nftCollection: &", nftPublicLink, ""],
["    let storefront: &NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}"],
["    let listing: &NFTStorefrontV2.Listing{NFTStorefrontV2.ListingPublic}"],
["    let salePrice: UFix64"],
["    let balanceBeforeTransfer: UFix64"],
["    let mainUtilityCoinVault: &", ftSchema!.contractName, ".Vault"],
["    var commissionRecipientCap: Capability<&{FungibleToken.Receiver}>?"],
[""],
["    prepare(dapper: AuthAccount, buyer: AuthAccount) {"],
["        self.commissionRecipientCap = nil"],
["        "],
["        // Initialize the buyer's collection if they do not already have one"],
["        if buyer.borrow<&", nftSchema!.contractName, ".Collection>(from: ", nftSchema!.storagePath, ") == nil {"],
["            let collection <- ", nftSchema!.contractName, ".createEmptyCollection() as! @", nftSchema!.contractName, ".Collection"],
["            buyer.save(<-collection, to: ", nftSchema!.storagePath, ")"],
["        }"],
[""],
["        if (buyer.getCapability<&", nftPublicLink, ">(", nftSchema!.publicPath, ").borrow() == nil) {"],
["            buyer.unlink(", nftSchema!.publicPath, ")"],
["            buyer.link<&", nftPublicLink, ">(", nftSchema!.publicPath, ", target: ", nftSchema!.storagePath, ")"],
["        }"],
[""],
["        if (buyer.getCapability<&", nftPrivateLink, ">(", nftSchema!.privatePath, ").borrow() == nil) {"],
["            buyer.unlink(", nftSchema!.privatePath, ")"],
["            buyer.link<&", nftPrivateLink, ">(", nftSchema!.privatePath, ", target: ", nftSchema!.storagePath, ")"],
["        }"],
[""],
["        // Get the storefront reference from the seller"],
["        self.storefront = getAccount(storefrontAddress)"],
["            .getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>("],
["                NFTStorefrontV2.StorefrontPublicPath"],
["            )!"],
["            .borrow()"],
["            ?? panic(\"Could not borrow Storefront from provided address\")"],
[""],
["        // Get the listing by ID from the storefront"],
["        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)"],
["            ?? panic(\"No Offer with that ID in Storefront\")"],
["        self.salePrice = self.listing.getDetails().salePrice"],
[""],
["        // Get a vault from Dapper's account"],
["        self.mainUtilityCoinVault = dapper.borrow<&", ftSchema!.contractName, ".Vault>(from: ", ftSchema!.storagePath, ")"],
["            ?? panic(\"Cannot borrow UtilityCoin vault from account storage\")"],
["        self.balanceBeforeTransfer = self.mainUtilityCoinVault.balance"],
["        self.paymentVault <- self.mainUtilityCoinVault.withdraw(amount: self.salePrice)"],
[""],
["        // Get the collection from the buyer so the NFT can be deposited into it"],
["        self.nftCollection = buyer.borrow<&", nftPublicLink, ">("],
["            from: ", nftSchema!.storagePath, ""],
["        ) ?? panic(\"Cannot borrow NFT collection receiver from account\")"],
[""],
["         // Fetch the commission amt."],
["        let commissionAmount = self.listing.getDetails().commissionAmount"],
[""],
["        if commissionRecipient != nil && commissionAmount != 0.0 {"],
["            // Access the capability to receive the commission."],
["            let _commissionRecipientCap = getAccount(commissionRecipient!).getCapability<&{FungibleToken.Receiver}>(", ftSchema!.publicPath, ")"],
["            assert(_commissionRecipientCap.check(), message: \"Commission Recipient doesn't have flowtoken receiving capability\")"],
["            self.commissionRecipientCap = _commissionRecipientCap"],
["        } else if commissionAmount == 0.0 {"],
["            self.commissionRecipientCap = nil"],
["        } else {"],
["            panic(\"Commission recipient can not be empty when commission amount is non zero\")"],
["        }"],
["    }"],
[""],
["    // Check that the price is right"],
["    pre {"],
["        self.salePrice == expectedPrice: \"unexpected price\""],
["    }"],
[""],
["    execute {"],
["        let item <- self.listing.purchase("],
["            payment: <-self.paymentVault,"],
["            commissionRecipient: self.commissionRecipientCap"],
["        )"],
[""],
["        self.nftCollection.deposit(token: <-item)"],
["    }"],
[""],
["    // Check that all utilityCoin was routed back to Dapper"],
["    post {"],
["        self.mainUtilityCoinVault.balance == self.balanceBeforeTransfer: \"UtilityCoin leakage\""],
["    }"],
["}"],
[""]]
var combinedLines: [String] = []
for line in lines {
combinedLines.append(StringUtils.join(line, ""))
}
return StringUtils.join(combinedLines, "\n")
}
pub fun StorefrontRemoveItemTemplate(nftSchema: TransactionGenerationUtils.NFTSchema?, ftSchema: TransactionGenerationUtils.FTSchemaV2?, params: {String: String}?): String {

    var nftPublicLink = ""
    var nftPrivateLink = ""
    var ftPublicLink = ""
    var ftPrivateLink = ""
    if nftSchema != nil {
      nftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.publicLinkedType)
      nftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.privateLinkedType)
    }
    if ftSchema != nil {
      ftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.publicLinkedType)
      ftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.privateLinkedType)
    }
  
let lines: [[String]] = [
["// This transaction was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)"],
["//"],
["// This transaction facilitates the removal of a listing with the StorefrontV2 contract"],
["// "],
["// Collection Identifier: ", nftSchema!.identifier, ""],
["//"],
["// Version: 0.1.1"],
[""],
["transaction(listingResourceID: UInt64) {"],
["    /// `listingResourceID` - ID of the Storefront listing resource"],
["    "],
["    let storefront: &NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontManager}"],
[""],
["    prepare(acct: AuthAccount) {"],
["        self.storefront = acct.borrow<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontManager}>(from: NFTStorefrontV2.StorefrontStoragePath)"],
["            ?? panic(\"Missing or mis-typed NFTStorefrontV2.Storefront\")"],
["    }"],
[""],
["    execute {"],
["        self.storefront.removeListing(listingResourceID: listingResourceID)"],
["    }"],
["}"],
[""],
[""]]
var combinedLines: [String] = []
for line in lines {
combinedLines.append(StringUtils.join(line, ""))
}
return StringUtils.join(combinedLines, "\n")
}
pub fun DapperCreateListingTemplate(nftSchema: TransactionGenerationUtils.NFTSchema?, ftSchema: TransactionGenerationUtils.FTSchemaV2?, params: {String: String}?): String {

    var nftPublicLink = ""
    var nftPrivateLink = ""
    var ftPublicLink = ""
    var ftPrivateLink = ""
    if nftSchema != nil {
      nftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.publicLinkedType)
      nftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.privateLinkedType)
    }
    if ftSchema != nil {
      ftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.publicLinkedType)
      ftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.privateLinkedType)
    }
  
let lines: [[String]] = [
["// This transaction was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)"],
["//"],
["// This transaction purchases an NFT from a dapp directly (i.e. **not** on a peer-to-peer marketplace)."],
["// "],
["// Collection Identifier: ", nftSchema!.identifier, ""],
["// Vault Identifier: ", ftSchema!.identifier, ""],
["//"],
["// Version: 0.1.1"],
[""],
["transaction(saleItemID: UInt64, saleItemPrice: UFix64, commissionAmount: UFix64, marketplacesAddress: [Address], expiry: UInt64, customID: String?) {"],
["    /// `saleItemID` - ID of the NFT that is put on sale by the seller."],
["    /// `saleItemPrice` - Amount of tokens (FT) buyer needs to pay for the purchase of listed NFT."],
["    /// `commissionAmount` - Commission amount that will be taken away by the purchase facilitator."],
["    /// `marketplacesAddress` - List of addresses that are allowed to get the commission."],
["    /// `expiry` - Unix timestamp at which created listing become expired."],
["    /// `customID` - Optional string to represent identifier of the dapp."],
["    let sellerPaymentReceiver: Capability<&{FungibleToken.Receiver}>"],
["    let nftProvider: Capability<&", nftSchema!.contractName, ".Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>"],
["    let storefront: &NFTStorefrontV2.Storefront"],
["    var saleCuts: [NFTStorefrontV2.SaleCut]"],
["    var marketplacesCapability: [Capability<&AnyResource{FungibleToken.Receiver}>]"],
[""],
["    // It's important that the dapp account authorize this transaction so the dapp has the ability"],
["    // to validate and approve the royalty included in the sale."],
["    prepare(seller: AuthAccount) {"],
["        self.saleCuts = []"],
["        self.marketplacesCapability = []"],
[""],
["        // If the account doesn't already have a storefront, create one and add it to the account"],
["        if seller.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath) == nil {"],
["            // Create a new empty Storefront"],
["            let storefront <- NFTStorefrontV2.createStorefront() as! @NFTStorefrontV2.Storefront"],
["            // save it to the account"],
["            seller.save(<-storefront, to: NFTStorefrontV2.StorefrontStoragePath)"],
["            // create a public capability for the Storefront"],
["            seller.link<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(NFTStorefrontV2.StorefrontPublicPath, target: NFTStorefrontV2.StorefrontStoragePath)"],
["        }"],
[""],
["         // FT Setup if the user's account is not initialized with FT receiver"],
["        if seller.borrow<&{FungibleToken.Receiver}>(from: ", ftSchema!.receiverStoragePath ?? "", ") == nil {"],
[""],
["            let dapper = getAccount(", TransactionGenerationUtils.getAddressFromType(ftSchema!.type), ")"],
["            let dapperFTReceiver = dapper.getCapability<&{FungibleToken.Receiver}>(", ftSchema!.publicPath, ")!"],
[""],
["            // Create a new Forwarder resource for FUT and store it in the new account's storage"],
["            let ftForwarder <- TokenForwarding.createNewForwarder(recipient: dapperFTReceiver)"],
["            seller.save(<-ftForwarder, to: ", ftSchema!.receiverStoragePath ?? "", ")"],
[""],
["            // Publish a Receiver capability for the new account, which is linked to the FUT Forwarder"],
["            seller.link<&", ftSchema!.contractName, ".Vault{FungibleToken.Receiver}>("],
["                ", ftSchema!.publicPath, ","],
["                target: ", ftSchema!.receiverStoragePath ?? "", ""],
["            )"],
["        }"],
[""],
["        // Get a reference to the receiver that will receive the fungible tokens if the sale executes."],
["        // Note that the sales receiver aka MerchantAddress should be an account owned by Dapper or an end-user Dapper Wallet account address."],
["        self.sellerPaymentReceiver = getAccount(seller.address).getCapability<&{FungibleToken.Receiver}>(", ftSchema!.publicPath, ")"],
["        assert(self.sellerPaymentReceiver.borrow() != nil, message: \"Missing or mis-typed DapperUtilityCoin receiver\")"],
[""],
["        // If the user does not have their collection linked to their account, link it."],
["        if seller.borrow<&", nftSchema!.contractName, ".Collection>(from: ", nftSchema!.storagePath, ") == nil {"],
["            let collection <- ", nftSchema!.contractName, ".createEmptyCollection()"],
["            seller.save(<-collection, to: ", nftSchema!.storagePath, ")"],
["        }"],
["        if (seller.getCapability<&", nftPublicLink, ">(", nftSchema!.publicPath, ").borrow() == nil) {"],
["            seller.unlink(", nftSchema!.publicPath, ")"],
["            seller.link<&", nftPublicLink, ">(", nftSchema!.publicPath, ", target: ", nftSchema!.storagePath, ")"],
["        }"],
[""],
["        if (seller.getCapability<&", nftPrivateLink, ">(", nftSchema!.privatePath, ").borrow() == nil) {"],
["            seller.unlink(", nftSchema!.privatePath, ")"],
["            seller.link<&", nftPrivateLink, ">(", nftSchema!.privatePath, ", target: ", nftSchema!.storagePath, ")"],
["        }"],
[""],
["        self.nftProvider = seller.getCapability<&", nftSchema!.contractName, ".Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(", nftSchema!.privatePath, ")!"],
["        assert(self.nftProvider.borrow() != nil, message: \"Missing or mis-typed collection provider\")"],
[""],
["        if seller.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath) == nil {"],
["            // Create a new empty Storefront"],
["            let storefront <- NFTStorefrontV2.createStorefront() as! @NFTStorefrontV2.Storefront"],
["            // save it to the account"],
["            seller.save(<-storefront, to: NFTStorefrontV2.StorefrontStoragePath)"],
["            // create a public capability for the Storefront"],
["            seller.link<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(NFTStorefrontV2.StorefrontPublicPath, target: NFTStorefrontV2.StorefrontStoragePath)"],
["        }"],
["        self.storefront = seller.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath)"],
["            ?? panic(\"Missing or mis-typed NFTStorefront Storefront\")"],
[""],
["        "],
["        let collectionRef = seller"],
["            .getCapability(", nftSchema!.publicPath, ")"],
["            .borrow<&", nftPublicLink, ">()"],
["            ?? panic(\"Could not borrow a reference to the collection\")"],
["        var totalRoyaltyCut = 0.0"],
["        let effectiveSaleItemPrice = saleItemPrice - commissionAmount"],
[""],
["        let nft = collectionRef.borrowViewResolver(id: saleItemID)!       "],
["        if (nft.getViews().contains(Type<MetadataViews.Royalties>())) {"],
["            let royaltiesRef = nft.resolveView(Type<MetadataViews.Royalties>()) ?? panic(\"Unable to retrieve the royalties\")"],
["            let royalties = (royaltiesRef as! MetadataViews.Royalties).getRoyalties()"],
["            for royalty in royalties {"],
["                // TODO - Verify the type of the vault and it should exists"],
["                self.saleCuts.append(NFTStorefrontV2.SaleCut(receiver: royalty.receiver, amount: royalty.cut * effectiveSaleItemPrice))"],
["                totalRoyaltyCut = totalRoyaltyCut + royalty.cut * effectiveSaleItemPrice"],
["            }"],
["        }"],
[""],
["        // Append the cut for the seller."],
["        self.saleCuts.append(NFTStorefrontV2.SaleCut("],
["            receiver: self.sellerPaymentReceiver,"],
["            amount: effectiveSaleItemPrice - totalRoyaltyCut"],
["        ))"],
[""],
["        for marketplace in marketplacesAddress {"],
["            self.marketplacesCapability.append(getAccount(marketplace).getCapability<&{FungibleToken.Receiver}>(", ftSchema!.publicPath, "))"],
["        }"],
["    }"],
[""],
["    execute {"],
[""],
["         self.storefront.createListing("],
["            nftProviderCapability: self.nftProvider,"],
["            nftType: Type<@", TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.type), ">(),"],
["            nftID: saleItemID,"],
["            salePaymentVaultType: Type<@", TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.type), ">(),"],
["            saleCuts: self.saleCuts,"],
["            marketplacesCapability: self.marketplacesCapability.length == 0 ? nil : self.marketplacesCapability,"],
["            customID: customID,"],
["            commissionAmount: commissionAmount,"],
["            expiry: expiry"],
["        )"],
["    }"],
["}"],
[""]]
var combinedLines: [String] = []
for line in lines {
combinedLines.append(StringUtils.join(line, ""))
}
return StringUtils.join(combinedLines, "\n")
}
pub fun DapperBuyNFTDirectTemplate(nftSchema: TransactionGenerationUtils.NFTSchema?, ftSchema: TransactionGenerationUtils.FTSchemaV2?, params: {String: String}?): String {

    var nftPublicLink = ""
    var nftPrivateLink = ""
    var ftPublicLink = ""
    var ftPrivateLink = ""
    if nftSchema != nil {
      nftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.publicLinkedType)
      nftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.privateLinkedType)
    }
    if ftSchema != nil {
      ftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.publicLinkedType)
      ftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.privateLinkedType)
    }
  
let lines: [[String]] = [
["// This transaction was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)"],
["//"],
["// This transaction purchases an NFT from a dapp directly (i.e. **not** on a peer-to-peer marketplace)."],
["// "],
["// Collection Identifier: ", nftSchema!.identifier, ""],
["// Vault Identifier: ", ftSchema!.identifier, ""],
["//"],
["// Version: 0.1.1"],
[""],
["transaction(merchantAccountAddress: Address, storefrontAddress: Address, listingResourceID: UInt64, expectedPrice: UFix64, commissionRecipient: Address?) {"],
["    /* This transaction purchases an NFT from a dapp directly (i.e. **not** on a peer-to-peer marketplace). */"],
["    "],
["    /// `merchantAccountAddress` - The merchant account address provided by Dapper Labs"],
["    /// `storefrontAddress` - The address that owns the storefront listing"],
["    /// `listingResourceID` - ID of the Storefront listing resource"],
["    /// `expectedPrice: UFix64` - How much you expect to pay for the NFT"],
["    /// `commissionRecipient` - Optional recipient for transaction commission if comission exists."],
[""],
[""],
["    let paymentVault: @FungibleToken.Vault"],
["    let nftCollection: &", nftPublicLink, ""],
["    let storefront: &NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}"],
["    let listing: &NFTStorefrontV2.Listing{NFTStorefrontV2.ListingPublic}"],
["    let salePrice: UFix64"],
["    let balanceBeforeTransfer: UFix64"],
["    let mainUtilityCoinVault: &", ftSchema!.contractName, ".Vault"],
["    var commissionRecipientCap: Capability<&{FungibleToken.Receiver}>?"],
[""],
["    prepare(dapper: AuthAccount, buyer: AuthAccount) {"],
["        self.commissionRecipientCap = nil"],
["        "],
["        // Initialize the buyer's collection if they do not already have one"],
["        if buyer.borrow<&", nftSchema!.contractName, ".Collection>(from: ", nftSchema!.storagePath, ") == nil {"],
["            let collection <- ", nftSchema!.contractName, ".createEmptyCollection() as! @", nftSchema!.contractName, ".Collection"],
["            buyer.save(<-collection, to: ", nftSchema!.storagePath, ")"],
["        }"],
[""],
["        if (buyer.getCapability<&", nftPublicLink, ">(", nftSchema!.publicPath, ").borrow() == nil) {"],
["            buyer.unlink(", nftSchema!.publicPath, ")"],
["            buyer.link<&", nftPublicLink, ">(", nftSchema!.publicPath, ", target: ", nftSchema!.storagePath, ")"],
["        }"],
[""],
["        if (buyer.getCapability<&", nftPrivateLink, ">(", nftSchema!.privatePath, ").borrow() == nil) {"],
["            buyer.unlink(", nftSchema!.privatePath, ")"],
["            buyer.link<&", nftPrivateLink, ">(", nftSchema!.privatePath, ", target: ", nftSchema!.storagePath, ")"],
["        }"],
[""],
["        self.storefront = getAccount(storefrontAddress)"],
["            .getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>("],
["                NFTStorefrontV2.StorefrontPublicPath"],
["            )!"],
["            .borrow()"],
["            ?? panic(\"Could not borrow Storefront from provided address\")"],
[""],
["        // Get the listing by ID from the storefront"],
["        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)"],
["            ?? panic(\"No Offer with that ID in Storefront\")"],
["        self.salePrice = self.listing.getDetails().salePrice"],
[""],
["        // Get a vault from Dapper's account"],
["        self.mainUtilityCoinVault = dapper.borrow<&", ftSchema!.contractName, ".Vault>(from: ", ftSchema!.storagePath, ")"],
["            ?? panic(\"Cannot borrow UtilityCoin vault from account storage\")"],
["        self.balanceBeforeTransfer = self.mainUtilityCoinVault.balance"],
["        self.paymentVault <- self.mainUtilityCoinVault.withdraw(amount: self.salePrice)"],
[""],
["        // Get the collection from the buyer so the NFT can be deposited into it"],
["        self.nftCollection = buyer.borrow<&", nftPublicLink, ">("],
["            from: ", nftSchema!.storagePath, ""],
["        ) ?? panic(\"Cannot borrow NFT collection receiver from account\")"],
[""],
["         // Fetch the commission amt."],
["        let commissionAmount = self.listing.getDetails().commissionAmount"],
[""],
["        if commissionRecipient != nil && commissionAmount != 0.0 {"],
["            // Access the capability to receive the commission."],
["            let _commissionRecipientCap = getAccount(commissionRecipient!).getCapability<&{FungibleToken.Receiver}>(", ftSchema!.publicPath, ")"],
["            assert(_commissionRecipientCap.check(), message: \"Commission Recipient doesn't have flowtoken receiving capability\")"],
["            self.commissionRecipientCap = _commissionRecipientCap"],
["        } else if commissionAmount == 0.0 {"],
["            self.commissionRecipientCap = nil"],
["        } else {"],
["            panic(\"Commission recipient can not be empty when commission amount is non zero\")"],
["        }"],
["    }"],
[""],
["    // Check that the price is right"],
["    pre {"],
["        self.salePrice == expectedPrice: \"unexpected price\""],
["        merchantAccountAddress == ", params!["merchantAddress"]!, ""],
["    }"],
[""],
["    execute {"],
["        let item <- self.listing.purchase("],
["            payment: <-self.paymentVault,"],
["            commissionRecipient: self.commissionRecipientCap"],
["        )"],
[""],
["        self.nftCollection.deposit(token: <-item)"],
["    }"],
[""],
["    // Check that all utilityCoin was routed back to Dapper"],
["    post {"],
["        self.mainUtilityCoinVault.balance == self.balanceBeforeTransfer: \"UtilityCoin leakage\""],
["    }"],
["}"],
[""],
[""]]
var combinedLines: [String] = []
for line in lines {
combinedLines.append(StringUtils.join(line, ""))
}
return StringUtils.join(combinedLines, "\n")
}
pub fun DapperGetPrimaryListingMetadataTemplate(nftSchema: TransactionGenerationUtils.NFTSchema?, ftSchema: TransactionGenerationUtils.FTSchemaV2?, params: {String: String}?): String {

    var nftPublicLink = ""
    var nftPrivateLink = ""
    var ftPublicLink = ""
    var ftPrivateLink = ""
    if nftSchema != nil {
      nftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.publicLinkedType)
      nftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.privateLinkedType)
    }
    if ftSchema != nil {
      ftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.publicLinkedType)
      ftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.privateLinkedType)
    }
  
let lines: [[String]] = [
["// This script was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)"],
["//"],
["// This script retrieves information about a StorefrontV2 listing."],
["// "],
["// Collection Identifier: ", nftSchema!.identifier, ""],
["//"],
["// Version: 0.1.1"],
[""],
["pub struct PurchaseData {"],
["    pub let id: UInt64"],
["    pub let name: String"],
["    pub let amount: UFix64"],
["    pub let description: String"],
["    pub let imageURL: String"],
["    pub let paymentVaultTypeID: Type"],
[""],
["    init(id: UInt64, name: String, amount: UFix64, description: String, imageURL: String, paymentVaultTypeID: Type) {"],
["        self.id = id"],
["        self.name = name"],
["        self.amount = amount"],
["        self.description = description"],
["        self.imageURL = imageURL"],
["        self.paymentVaultTypeID = paymentVaultTypeID"],
["    }"],
["}"],
[""],
["// IMPORTANT: Parameter list below should match the parameter list passed to the associated purchase txn"],
["// Please also make sure that the argument order list should be same as that of the associated purchase txn"],
["pub fun main(merchantAccountAddress: Address, address: Address, listingResourceID: UInt64, expectedPrice: UFix64): PurchaseData {"],
[""],
["    let account = getAuthAccount(address)"],
["    let marketCollectionRef = account"],
["        .getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>("],
["            NFTStorefrontV2.StorefrontPublicPath"],
["        )"],
["        .borrow()"],
["        ?? panic(\"Could not borrow market collection from address\")"],
[""],
["    let saleItem = marketCollectionRef.borrowListing(listingResourceID: listingResourceID)"],
["        ?? panic(\"No item with that ID\")"],
[""],
["    let listingDetails = saleItem.getDetails()!"],
[""],
["    let collectionIdentifier = \"", nftSchema!.identifier, "\""],
["    let tempPathStr = \"catalog\".concat(collectionIdentifier)"],
["    let tempPublicPath = PublicPath(identifier: tempPathStr)!"],
["    account.link<&{MetadataViews.ResolverCollection}>("],
["        tempPublicPath,"],
["        target: ", nftSchema!.storagePath, ""],
["    )"],
["    let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)"],
[""],
["    let nftResolver = collectionCap.borrow()!.borrowViewResolver(id: listingDetails.nftID)"],
[""],
["    if let view = nftResolver.resolveView(Type<MetadataViews.Display>()) {"],
[""],
["        let display = view as! MetadataViews.Display"],
[""],
["        let purchaseData = PurchaseData("],
["            id: listingDetails.nftID,"],
["            name: display.name,"],
["            amount: listingDetails.salePrice,"],
["            description: display.description,"],
["            imageURL: display.thumbnail.uri(),"],
["            paymentVaultTypeID: listingDetails.salePaymentVaultType"],
["        )"],
["        "],
["        return purchaseData"],
["    }"],
["     panic(\"No NFT\")"],
["}"],
[""]]
var combinedLines: [String] = []
for line in lines {
combinedLines.append(StringUtils.join(line, ""))
}
return StringUtils.join(combinedLines, "\n")
}
pub fun DapperGetSecondaryListingMetadataTemplate(nftSchema: TransactionGenerationUtils.NFTSchema?, ftSchema: TransactionGenerationUtils.FTSchemaV2?, params: {String: String}?): String {

    var nftPublicLink = ""
    var nftPrivateLink = ""
    var ftPublicLink = ""
    var ftPrivateLink = ""
    if nftSchema != nil {
      nftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.publicLinkedType)
      nftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(nftSchema!.privateLinkedType)
    }
    if ftSchema != nil {
      ftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.publicLinkedType)
      ftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(ftSchema!.privateLinkedType)
    }
  
let lines: [[String]] = [
["// This script was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)"],
["//"],
["// This script retrieves information about a StorefrontV2 listing."],
["// "],
["// Collection Identifier: ", nftSchema!.identifier, ""],
["//"],
["// Version: 0.1.1"],
[""],
["pub struct PurchaseData {"],
["    pub let id: UInt64"],
["    pub let name: String"],
["    pub let amount: UFix64"],
["    pub let description: String"],
["    pub let imageURL: String"],
["    pub let paymentVaultTypeID: Type"],
[""],
["    init(id: UInt64, name: String, amount: UFix64, description: String, imageURL: String, paymentVaultTypeID: Type) {"],
["        self.id = id"],
["        self.name = name"],
["        self.amount = amount"],
["        self.description = description"],
["        self.imageURL = imageURL"],
["        self.paymentVaultTypeID = paymentVaultTypeID"],
["    }"],
["}"],
[""],
["// IMPORTANT: Parameter list below should match the parameter list passed to the associated purchase txn"],
["// Please also make sure that the argument order list should be same as that of the associated purchase txn"],
["pub fun main(storefrontAddress: Address, listingResourceID: UInt64,  expectedPrice: UFix64, commissionRecipient: Address?): PurchaseData {"],
[""],
["    let account = getAuthAccount(storefrontAddress)"],
["    let marketCollectionRef = account"],
["        .getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>("],
["            NFTStorefrontV2.StorefrontPublicPath"],
["        )"],
["        .borrow()"],
["        ?? panic(\"Could not borrow market collection from address\")"],
[""],
["    let saleItem = marketCollectionRef.borrowListing(listingResourceID: listingResourceID)"],
["        ?? panic(\"No item with that ID\")"],
[""],
["    let listingDetails = saleItem.getDetails()!"],
[""],
["    let collectionIdentifier = \"", nftSchema!.identifier, "\""],
["    let tempPathStr = \"catalog\".concat(collectionIdentifier)"],
["    let tempPublicPath = PublicPath(identifier: tempPathStr)!"],
["    account.link<&{MetadataViews.ResolverCollection}>("],
["        tempPublicPath,"],
["        target: ", nftSchema!.storagePath, ""],
["    )"],
["    let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)"],
[""],
["    let nftResolver = collectionCap.borrow()!.borrowViewResolver(id: listingDetails.nftID)"],
[""],
["    if let view = nftResolver.resolveView(Type<MetadataViews.Display>()) {"],
[""],
["        let display = view as! MetadataViews.Display"],
[""],
["        let purchaseData = PurchaseData("],
["            id: listingDetails.nftID,"],
["            name: display.name,"],
["            amount: listingDetails.salePrice,"],
["            description: display.description,"],
["            imageURL: display.thumbnail.uri(),"],
["            paymentVaultTypeID: listingDetails.salePaymentVaultType"],
["        )"],
["        "],
["        return purchaseData"],
["    }"],
["     panic(\"No NFT\")"],
["}"],
[""]]
var combinedLines: [String] = []
for line in lines {
combinedLines.append(StringUtils.join(line, ""))
}
return StringUtils.join(combinedLines, "\n")
}
}
