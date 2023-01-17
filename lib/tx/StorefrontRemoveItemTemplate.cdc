// This transaction was auto-generated with the NFT Catalog (https://github.com/dapperlabs/nft-catalog)
//
// This transaction facilitates the removal of a listing with the StorefrontV2 contract
// 
// Collection Identifier: ${cI.identifier}
//
// Version: ${version}

transaction(listingResourceID: UInt64) {
    /// `listingResourceID` - ID of the Storefront listing resource
    
    let storefront: &NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontManager}

    prepare(acct: AuthAccount) {
        self.storefront = acct.borrow<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontManager}>(from: NFTStorefrontV2.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefrontV2.Storefront")
    }

    execute {
        self.storefront.removeListing(listingResourceID: listingResourceID)
    }
}
