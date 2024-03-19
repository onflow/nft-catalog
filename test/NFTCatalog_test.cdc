import Test
import "test_helpers.cdc"
import "FungibleToken"
import "NonFungibleToken"

access(all) let admin = Test.createAccount()
access(all) let nftCreator = Test.createAccount()
access(all) let user = Test.createAccount()
access(all) let catalogAccount = Test.getAccount(0x0000000000000007)
access(all) let exampleNFTAccount = Test.getAccount(0x0000000000000008)
access(all) var nftCount = 1

access(all) fun mintNFTToUser() {
    // Mint some example NFTs to the user
    let code = loadCode("mint_example_nft.cdc", "cadence/transactions")
    let tx = Test.Transaction(
        code: code,
        authorizers: [exampleNFTAccount.address],
        signers: [exampleNFTAccount],
        arguments: [user.address, "NFT".concat(nftCount.toString()), "nft descrip", "https://test", [], [], []]
    )
    nftCount = nftCount + 1
    let txResult = Test.executeTransaction(tx)
    Test.expect(txResult, Test.beSucceeded())
}

access(all)
fun setup() {
    let serviceAccount = Test.serviceAccount()

    deploy("NFTCatalog", "../cadence/contracts/NFTCatalog.cdc")
    deploy("NFTCatalogAdmin", "../cadence/contracts/NFTCatalogAdmin.cdc")
    deploy("NFTRetrieval", "../cadence/contracts/NFTRetrieval.cdc")
    deploy("ExampleNFT", "../cadence/contracts/exampleNFT.cdc")

    // Setup example nft
    var code = loadCode("setup_examplenft_collection.cdc", "cadence/transactions")
    var tx = Test.Transaction(
        code: code,
        authorizers: [user.address],
        signers: [user],
        arguments: [],
    )
    var txResult = Test.executeTransaction(tx)
    Test.expect(txResult, Test.beSucceeded())

    mintNFTToUser()

    let typ = Type<NonFungibleToken.Deposited>()
    let events = Test.eventsOfType(typ)
    Test.assertEqual(1, events.length)
}

access(all)
fun testAdminSetup() {
    var hasAdminProxy = (scriptExecutor("has_admin_proxy.cdc", [admin.address])) as! Bool?
    Test.assertEqual(hasAdminProxy!, false)

    let setupAdminProxyCode = loadCode("setup_nft_catalog_admin_proxy.cdc", "cadence/transactions")
    var txResult = Test.executeTransaction(
        Test.Transaction(
            code: setupAdminProxyCode,
            authorizers: [admin.address],
            signers: [admin],
            arguments: [],
        )
    )
    Test.expect(txResult, Test.beSucceeded())

    hasAdminProxy = (scriptExecutor("has_admin_proxy.cdc", [admin.address])) as! Bool?
    Test.assertEqual(hasAdminProxy!, true)

    var isAdmin = (scriptExecutor("is_catalog_admin.cdc", [admin.address])) as! Bool?
    Test.assertEqual(isAdmin!, false)

    // make admin a catalog admin
    let sendAdminCapabilityCode = loadCode("send_admin_capability_to_proxy.cdc", "cadence/transactions")
    txResult = Test.executeTransaction(
        Test.Transaction(
            code: sendAdminCapabilityCode,
            authorizers: [catalogAccount.address],
            signers: [catalogAccount],
            arguments: [admin.address],
        )
    )
    Test.expect(txResult, Test.beSucceeded())


    isAdmin = (scriptExecutor("is_catalog_admin.cdc", [admin.address])) as! Bool?
    Test.assertEqual(isAdmin!, true)


}


/*
access(all)
fun testSetupAccount() {
    let code = loadCode("setup_account.cdc", "transactions")
    let tx = Test.Transaction(
        code: code,
        authorizers: [seller.address],
        signers: [seller],
        arguments: [],
    )
    let txResult = Test.executeTransaction(tx)
    Test.expect(txResult, Test.beSucceeded())
}

access(all)
fun testSellItem() {
    var code = loadCode("get_ids.cdc", "scripts/example-nft")

    var result = Test.executeScript(code, [seller.address, /public/cadenceExampleNFTCollection])
    Test.expect(result, Test.beSucceeded())
    Test.assertEqual((result.returnValue! as! [UInt64]).length, 1)
    let nftID = (result.returnValue! as! [UInt64])[0]

    code = loadCode("sell_item.cdc", "transactions")
    var tx = Test.Transaction(
        code: code,
        authorizers: [seller.address],
        signers: [seller],
        arguments: [
            nftID, // sale item id
            10.0, // sale item price
            "Custom", // custom id
            0.1, // commission amount
            UInt64(2025908543), // 10 years in the future
            [] // Marketplaces address
        ],
    )
    var txResult = Test.executeTransaction(tx)
    Test.expect(txResult, Test.beSucceeded())
}
*/