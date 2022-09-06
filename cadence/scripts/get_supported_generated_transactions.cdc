import TransactionGeneration from "../contracts/TransactionGeneration.cdc"

pub fun main() : [String] {
    return TransactionGeneration.getSupportedTx()
}