import TransactionGenerationUtils from "../contracts/TransactionGenerationUtils.cdc"

pub fun main(tx: String, collectionIdentifier: String) : String {
    return TransactionGenerationUtils.getTx(tx: tx, params: {
        "collectionIdentifier": collectionIdentifier,
        "vaultIdentifier": "flow"
    })!
}
