import NFTCatalog from "../contracts/NFTCatalog.cdc"

pub fun main(): AnyStruct {
    return NFTCatalog.getCatalog()
}
