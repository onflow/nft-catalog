
access(all) fun main(): String {
    return String.fromUTF8(getAccount(0xf8d6e0586b0a20c7).contracts.get(name: "NonFungibleToken")!.code)!
}