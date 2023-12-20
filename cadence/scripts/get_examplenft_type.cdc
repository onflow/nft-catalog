import NonFungibleToken from "NonFungibleToken"
import ExampleNFT from "ExampleNFT"

access(all) fun main(): String {
    let x = ReferenceType(entitlements: ["A.f8d6e0586b0a20c7.NonFungibleToken.Withdrawable"], type: CompositeType(Type<@ExampleNFT.Collection>().identifier)!)
    let y = ReferenceType(entitlements: [], type: CompositeType(Type<@ExampleNFT.Collection>().identifier)!)
    //let y = CompositeType("A.f8d6e0586b0a20c7.ExampleNFT.Collection")
    //return y!.identifier
    //return x!.identifier
    return Type<&ExampleNFT.NFT>().identifier


}