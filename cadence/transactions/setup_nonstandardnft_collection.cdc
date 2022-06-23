import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import NonStandardNFT from "../contracts/NonStandardNFT.cdc"
import MetadataViews from "../contracts/MetadataViews.cdc"

// This transaction is what an account would run
// to set itself up to receive NFTs

transaction {

    prepare(signer: AuthAccount) {
        // Return early if the account already has a collection
        if signer.borrow<&NonStandardNFT.Collection>(from: NonStandardNFT.CollectionStoragePath) != nil {
            return
        }

        // Create a new empty collection
        let collection <- NonStandardNFT.createEmptyCollection()

        // save it to the account
        signer.save(<-collection, to: NonStandardNFT.CollectionStoragePath)

        // create a public capability for the collection
        signer.link<&{NonFungibleToken.CollectionPublic, NonStandardNFT.NonStandardNFTCollectionPublic, MetadataViews.ResolverCollection}>(
            NonStandardNFT.CollectionPublicPath,
            target: NonStandardNFT.CollectionStoragePath
        )
    }
}