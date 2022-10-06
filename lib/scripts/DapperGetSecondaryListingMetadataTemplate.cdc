// This script was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)
//
// This script retrieves information about a StorefrontV2 listing.
// 
// Collection Identifier: ${cI.identifier}
//
// Version: ${version}

pub struct PurchaseData {
    pub let id: UInt64
    pub let name: String
    pub let amount: UFix64
    pub let description: String
    pub let imageURL: String
    pub let paymentVaultTypeID: Type

    init(id: UInt64, name: String, amount: UFix64, description: String, imageURL: String, paymentVaultTypeID: Type) {
        self.id = id
        self.name = name
        self.amount = amount
        self.description = description
        self.imageURL = imageURL
        self.paymentVaultTypeID = paymentVaultTypeID
    }
}

// IMPORTANT: Parameter list below should match the parameter list passed to the associated purchase txn
// Please also make sure that the argument order list should be same as that of the associated purchase txn
pub fun main(storefrontAddress: Address, listingResourceID: UInt64,  expectedPrice: UFix64, commissionRecipient: Address?): PurchaseData {

    let account = getAuthAccount(storefrontAddress)
    let marketCollectionRef = account
        .getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(
            NFTStorefrontV2.StorefrontPublicPath
        )
        .borrow()
        ?? panic("Could not borrow market collection from address")

    let saleItem = marketCollectionRef.borrowListing(listingResourceID: listingResourceID)
        ?? panic("No item with that ID")

    let listingDetails = saleItem.getDetails()!

    let collectionIdentifier = "${cI.identifier}"
    let tempPathStr = "catalog".concat(collectionIdentifier)
    let tempPublicPath = PublicPath(identifier: tempPathStr)!
    account.link<&{MetadataViews.ResolverCollection}>(
        tempPublicPath,
        target: ${cI.storagePath}
    )
    let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)

    let nftResolver = collectionCap.borrow()!.borrowViewResolver(id: listingDetails.nftID)

    if let view = nftResolver.resolveView(Type<MetadataViews.Display>()) {

        let display = view as! MetadataViews.Display

        let purchaseData = PurchaseData(
            id: listingDetails.nftID,
            name: display.name,
            amount: listingDetails.salePrice,
            description: display.description,
            imageURL: display.thumbnail.uri(),
            paymentVaultTypeID: listingDetails.salePaymentVaultType
        )
        
        return purchaseData
    }
     panic("No NFT")
}