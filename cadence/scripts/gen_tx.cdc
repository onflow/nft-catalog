import "TransactionGeneration"

access(all) fun main(tx: String, collectionIdentifier: String, vaultIdentifier: String, merchantAddress: String) : String {
    return TransactionGeneration.getTx(tx: tx, params: {
        "collectionIdentifier": collectionIdentifier,
        "vaultIdentifier": vaultIdentifier,
        "merchantAddress": merchantAddress
    })!
}
