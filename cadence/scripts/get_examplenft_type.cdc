import "NonFungibleToken"
import "ExampleNFT"

access(all) fun main(): String {
    return Type<@ExampleNFT.NFT>().identifier
}