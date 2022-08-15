
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
  StorefrontListItemTemplate
*/
pub fun StorefrontListItemTemplate(nftTemplate: TransactionGenerationUtils.NFTTemplate, ftTemplate: TransactionGenerationUtils.FTTemplate) {

    let nftPublicLink = TransactionGenerationUtils.createStaticTypeFromType(nftTemplate.publicLinkedType)
    let nftPrivateLink = TransactionGenerationUtils.createStaticTypeFromType(nftTemplate.privateLinkedType)
  
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
["        // Receiver for the sale cut."],
["        self.ftReceiver = acct.getCapability<&{FungibleToken.Receiver}>(", ftTemplate.publicPath, ")!"],
["        assert(self.ftReceiver.borrow() != nil, message: \"Missing or mis-typed token receiver\")"],
[""],
["        // Set up NFT just to make sure the proper links are setup."],
["        "],
[""],
["        // Set up FT to make sure this account can receive the proper currency"],
["        "],
[""],
["        self.nftProvider = acct.getCapability<", nftPrivateLink, ">(", nftTemplate.privatePath, ")!"],
["        let collectionPub = acct"],
["            .getCapability(", nftTemplate.publicPath, ")"],
["            .borrow<", nftPublicLink, ">()"],
["            ?? panic(\"Could not borrow a reference to the collection\")"],
["        var totalRoyaltyCut = 0.0"],
["        let effectiveSaleItemPrice = saleItemPrice - commissionAmount"],
[""],
["        let metadataPub = acct"],
["            .getCapability(", nftTemplate.publicPath, ")"],
["            .borrow<MetadataViews.Resolver>()"],
["        if (metadataPub != nil && metadataPub!.getViews().contains(Type<MetadataViews.Royalties>())) {"],
["            let royaltiesRef = metadataPub!.resolveView(Type<MetadataViews.Royalties>())?? panic(\"Unable to retrieve the royalties\")"],
["            let royalties = (royaltiesRef as! MetadataViews.Royalties).getRoyalties()"],
["            for royalty in royalties {"],
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
["            // Here we are making a fair assumption that all given addresses would have"],
["            // the capability to receive the `FlowToken`"],
["            self.marketplacesCapability.append(getAccount(marketplace).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver))"],
["        }"],
["    }"],
[""],
["    execute {"],
["        // Create listing"],
["        self.storefront.createListing("],
["            nftProviderCapability: self.nftProvider,"],
["            nftType: Type<@", TransactionGenerationUtils.createStaticTypeFromType(nftTemplate.type), ">(),"],
["            nftID: saleItemID,"],
["            salePaymentVaultType: Type<@", TransactionGenerationUtils.createStaticTypeFromType(ftTemplate.type), ">(),"],
["            saleCuts: self.saleCuts,"],
["            marketplacesCapability: self.marketplacesCapability.length == 0 ? nil : self.marketplacesCapability,"],
["            customID: customID,"],
["            commissionAmount: commissionAmount,"],
["            expiry: expiry"],
["        )"],
["    }"],
["}"],
[""]]
}
}
