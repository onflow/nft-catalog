
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
  NFTInitTemplate, StorefrontListItemTemplate
*/
pub fun NFTInitTemplate(nftSchema: TransactionGenerationUtils.NFTSchema?, ftSchema: TransactionGenerationUtils.FTSchema?): String {

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
pub fun StorefrontListItemTemplate(nftSchema: TransactionGenerationUtils.NFTSchema?, ftSchema: TransactionGenerationUtils.FTSchema?): String {

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
["transaction(saleItemID: UInt64, saleItemPrice: UFix64, customID: String?, commissionAmount: UFix64, expiry: UInt64, marketplacesAddress: [Address]) {"],
["    let ftReceiver: Capability<&AnyResource{FungibleToken.Receiver}>"],
["    let exampleNFTProvider: Capability<&AnyResource{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>"],
["    let storefront: &NFTStorefrontV2.Storefront"],
["    var saleCuts: [NFTStorefrontV2.SaleCut]"],
["    var marketplacesCapability: [Capability<&AnyResource{FungibleToken.Receiver}>]"],
[""],
["    prepare(acct: AuthAccount) {"],
["        self.saleCuts = []"],
["        self.marketplacesCapability = []"],
[""],
["        // Set up FT to make sure this account can receive the proper currency"],
["        if signer.borrow<&", ftSchema!.contractName, ".Vault>(from: ", ftSchema!.storagePath, ") == nil {"],
["            let vault <- ", ftSchema!.contractName, ".createEmptyVault()"],
["            signer.save(<-vault, to: ", ftSchema!.storagePath, ")"],
["        }"],
[""],
["        if signer.getCapability<&", ftPublicLink, ">(from: ", ftSchema!.publicPath, ") == nil {"],
["            signer.unlink(", ftSchema!.publicPath, ")"],
["            signer.link<&", ftPublicLink, ">(", ftSchema!.publicPath, ",target: ", ftSchema!.storagePath, ")"],
[""],
["        "],
["        // Set up NFT to make sure this account has NFT setup correctly"],
["        if signer.borrow<&", nftSchema!.contractName, ".Collection>(from: ", nftSchema!.storagePath, ") == nil {"],
["            let collection <- ", nftSchema!.contractName, ".createEmptyCollection()"],
["            signer.save(<-collection, to: ", nftSchema!.storagePath, ")"],
["            }"],
["        if (signer.getCapability<&", nftPublicLink, ">(", nftSchema!.publicPath, ").borrow() == nil) {"],
["            signer.unlink(", nftSchema!.publicPath, ")"],
["            signer.link<&", nftPublicLink, ">(", nftSchema!.publicPath, ", target: ", nftSchema!.storagePath, ")"],
["        }"],
[""],
["        if (signer.getCapability<&", nftPrivateLink, ">(", nftSchema!.privatePath, ").borrow() == nil) {"],
["            signer.unlink(", nftSchema!.privatePath, ")"],
["            signer.link<&", nftPrivateLink, ">(", nftSchema!.privatePath, ", target: ", nftSchema!.storagePath, ")"],
["        }"],
[""],
["        // We need a provider capability, but one is not provided by default so we create one if needed."],
["        let nftCollectionProviderPrivatePath = ${ci.privateLinkedType}"],
[""],
["        // Receiver for the sale cut."],
["        self.ftReceiver = acct.getCapability<&{FungibleToken.Receiver}>(", ftSchema!.publicPath, ")!"],
["        assert(self.ftReceiver.borrow() != nil, message: \"Missing or mis-typed Fungible Token receiver\")"],
[""],
["        self.nftProvider = acct.getCapability<", nftPrivateLink, ">(", nftSchema!.privatePath, ")!"],
["        let collection = acct"],
["            .getCapability(", nftSchema!.publicPath, ")"],
["            .borrow<", nftPublicLink, ">()"],
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
}
