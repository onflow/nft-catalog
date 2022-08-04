import TransactionGenerationUtils from "../contracts/TransactionGenerationUtils.cdc"

pub fun main(collectionIdentifier: String) : String {
    return TransactionGenerationUtils.createInitTransaction(collectionIdentifier: collectionIdentifier)!
}
