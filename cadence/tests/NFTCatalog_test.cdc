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
    let code = loadCode("mint_example_nft.cdc", "./transactions")
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

    deploy("NFTCatalog", "../contracts/NFTCatalog.cdc")
    deploy("NFTCatalogAdmin", "../contracts/NFTCatalogAdmin.cdc")
    deploy("NFTRetrieval", "../contracts/NFTRetrieval.cdc")
    deploy("ExampleNFT", "../contracts/exampleNFT.cdc")

    // Setup example nft
    var code = loadCode("setup_examplenft_collection.cdc", "./transactions")
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
    Test.assertEqual(false, hasAdminProxy!)

    let setupAdminProxyCode = loadCode("setup_nft_catalog_admin_proxy.cdc", "./transactions")
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
    Test.assertEqual(true, hasAdminProxy!)

    var isAdmin = (scriptExecutor("is_catalog_admin.cdc", [admin.address])) as! Bool?
    Test.assertEqual(false, isAdmin!)

    // make admin a catalog admin
    let sendAdminCapabilityCode = loadCode("send_admin_capability_to_proxy.cdc", "./transactions")
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
    Test.assertEqual(true, isAdmin!)
}

access(all)
fun testAddNFTToCatalog() {
    // Add to the catalog as an admin.
    let addToCatalogCode = loadCode("add_to_nft_catalog.cdc", "./transactions")
    
    let nftID = (scriptExecutor("get_examplenft_collection_ids.cdc", [user.address]) as! [UInt64]?)![0]!
    let nftTypeIdentifier = "A.0000000000000008.ExampleNFT.NFT"

    var txResult = Test.executeTransaction(
        Test.Transaction(
            code: addToCatalogCode,
            authorizers: [admin.address],
            signers: [admin],
            arguments: ["TestCollection", "ExampleNFT", exampleNFTAccount.address, nftTypeIdentifier, user.address, nftID, "exampleNFTCollection"],
        )
    )
    Test.expect(txResult, Test.beSucceeded())
}

access(all)
fun testRemoveFromCatalog() {
    let removeFromCatalogCode = loadCode("remove_from_nft_catalog.cdc", "./transactions")
    
    let nftCatalogSize = (scriptExecutor("get_nft_catalog_count.cdc", []) as! Int?)!
    Test.assertEqual(nftCatalogSize, 1)

    var nftCatalogIdentifiers = (scriptExecutor("get_nft_catalog_identifiers.cdc", []) as! [String]?)!
    Test.assertEqual(nftCatalogIdentifiers.length, 1)

    var txResult = Test.executeTransaction(
        Test.Transaction(
            code: removeFromCatalogCode,
            authorizers: [admin.address],
            signers: [admin],
            arguments: ["TestCollection"]
        )
    )
    Test.expect(txResult, Test.beSucceeded())

    nftCatalogIdentifiers = (scriptExecutor("get_nft_catalog_identifiers.cdc", []) as! [String]?)!
    Test.assertEqual(nftCatalogIdentifiers.length, 0)
}

access(all)
fun testProposeAdditionToCatalog() {
    let proposeNFTToCatalogCode = loadCode("propose_nft_to_catalog.cdc", "./transactions")
    let nftTypeIdentifier = "A.0000000000000008.ExampleNFT.NFT"
    let socials: {String: String} = {}
    var txResult = Test.executeTransaction(
        Test.Transaction(
            code: proposeNFTToCatalogCode,
            authorizers: [user.address],
            signers: [user],
            arguments: [
                "TestCollection",
                "ExampleNFT",
                exampleNFTAccount.address,
                nftTypeIdentifier,
                "exampleNFTCollection",
                "exampleNFTCollection",
                nftTypeIdentifier,
                "TestCollection",
                "Test collection",
                "https://test.com",
                "https://squareimage.com",
                "png",
                "https://bannerimage.com",
                "png",
                socials,
                "Add the test collection to catalog"
            ]
        )
    )
    Test.expect(txResult, Test.beSucceeded())

    let res = (scriptExecutor("get_nft_catalog_proposals_count.cdc", []) as! Int?)!
    Test.assertEqual(res, 1)
}

access(all)
fun testApproveToCatalog() {
    let getNFTProposalsCode = loadCode("get_nft_catalog_proposal_ids.cdc", "./scripts")
    let approveToCatalogCode = loadCode("approve_nft_catalog_proposal.cdc", "./transactions")
    var res = (scriptExecutor("get_nft_catalog_proposal_ids.cdc", []) as! [UInt64]?)!

    var txResult = Test.executeTransaction(
        Test.Transaction(
            code: approveToCatalogCode,
            authorizers: [admin.address],
            signers: [admin],
            arguments: [res[0]!]
        )
    )
    Test.expect(txResult, Test.beSucceeded())
}

access(all)
fun testProposeUpdateToCatalog() {
    let proposeNFTToCatalogCode = loadCode("propose_nft_to_catalog.cdc", "./transactions")
    let nftTypeIdentifier = "A.0000000000000008.ExampleNFT.NFT"
    let socials: {String: String} = {}
    var txResult = Test.executeTransaction(
        Test.Transaction(
            code: proposeNFTToCatalogCode,
            authorizers: [user.address],
            signers: [user],
            arguments: [
                "TestCollection",
                "ExampleNFT",
                exampleNFTAccount.address,
                nftTypeIdentifier,
                "exampleNFTCollection",
                "exampleNFTCollection",
                nftTypeIdentifier,
                "TestCollection",
                "Test collection",
                "https://test.com",
                "https://squareimage.com",
                "png",
                "https://bannerimage.com",
                "png",
                socials,
                "Add the test collection to catalog"
            ]
        )
    )
    Test.expect(txResult, Test.beSucceeded())

    let res = (scriptExecutor("get_nft_catalog_proposals_count.cdc", []) as! Int?)!
    Test.assertEqual(res, 2)
}

access(all)
fun testRejectProposal() {
    let getNFTProposalsCode = loadCode("get_nft_catalog_proposal_ids.cdc", "./scripts")
    let rejectToCatalogCode = loadCode("reject_nft_catalog_proposal.cdc", "./transactions")
    var res = (scriptExecutor("get_nft_catalog_proposal_ids.cdc", []) as! [UInt64]?)!

    var txResult = Test.executeTransaction(
        Test.Transaction(
            code: rejectToCatalogCode,
            authorizers: [admin.address],
            signers: [admin],
            arguments: [res[1]!]
        )
    )
    Test.expect(txResult, Test.beSucceeded())
}

access(all)
fun testGetNFTsInAccount() {
    let res = (scriptExecutor("get_nft_ids_in_account.cdc", [user.address]) as! {String: [UInt64]}?)!
    Test.assert(res["TestCollection"] != nil, message: "Expected TestCollection to exist")
    Test.assertEqual(res.keys.length, 1)
}
