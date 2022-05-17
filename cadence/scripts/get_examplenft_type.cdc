import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import ExampleNFT from "../contracts/ExampleNFT.cdc"

pub fun main(): String {
    return Type<@ExampleNFT.NFT>().identifier
}