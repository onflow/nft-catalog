import TransactionGenerationUtils from "../contracts/TransactionGenerationUtils.cdc"

pub fun main(collectionIdentifier: String) : String {
    return TransactionGenerationUtils.createCollectionInitializationTx(collectionIdentifier: collectionIdentifier)!
}
