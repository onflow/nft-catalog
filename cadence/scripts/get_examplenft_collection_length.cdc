import "NonFungibleToken"
import "ExampleNFT"
import "MetadataViews"

access(all) fun main(address: Address): Int {
    let collectionData = ExampleNFT.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
            ?? panic("ViewResolver does not resolve NFTCollectionData view")

    return getAccount(address).capabilities.borrow<&{NonFungibleToken.Collection}>(
        collectionData.publicPath
    )?.getIDs()?.length ?? panic("No Collection Capability found for the given address")
}