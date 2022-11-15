import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import ExampleNFT from "../contracts/ExampleNFT.cdc"
import DapperStorageRent from "../contracts/DapperStorageRent.cdc"

// This transaction is for transferring and NFT from
// one account to another

transaction(recipient: Address, withdrawID: UInt64) {

    prepare(signer: AuthAccount) {
        // get the recipients public account object
        let recipientPublicAccount = getAccount(recipient)

        // borrow a reference to the signer's NFT collection
        let collectionRef = signer
            .borrow<&ExampleNFT.Collection>(from: ExampleNFT.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

        // borrow a public reference to the receivers collection
        let depositRef = recipientPublicAccount
            .getCapability(ExampleNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow a reference to the receiver's collection")

        // Attempt to refuel recipient before depositing NFT
        DapperStorageRent.tryRefill(recipient)

        // withdraw the NFT from the owner's collection
        let nft <- collectionRef.withdraw(withdrawID: withdrawID)

        // Deposit the NFT in the recipient's collection
        depositRef.deposit(token: <-nft)
    }
}