import NonFungibleToken from "NonFungibleToken"
import ExampleNFT from "ExampleNFT"
import MetadataViews from "MetadataViews"

access(all) fun main(address: Address): [UInt64]? {

    let collectionData = ExampleNFT.resolveContractView(resourceType: nil, viewType: Type<MetadataViews.NFTCollectionData>()) as! MetadataViews.NFTCollectionData?
            ?? panic("ViewResolver does not resolve NFTCollectionData view")

    return getAccount(address).capabilities.borrow<&{NonFungibleToken.Collection}>(
        collectionData.publicPath
    )?.getIDs()
}