import TransactionGeneration from "../contracts/TransactionGeneration.cdc"

pub fun main(tx: String, collectionIdentifier: String) : String {
    return TransactionGeneration.getTx(tx: tx, params: {
        "collectionIdentifier": collectionIdentifier,
        "vaultIdentifier": "flow"
    })!
}
