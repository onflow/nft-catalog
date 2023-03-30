# NFT Catalog

The NFT Catalog is an on chain registry listing NFT collections that exists on Flow which adhere to the NFT metadata standard. This empowers dApp developers to easily build on top of and discover interoperable NFT collections on Flow.

## Live Site

Checkout the catalog [site](https://www.flow-nft-catalog.com/) to submit your NFT collection both on testnet and mainnet.

## NPM Module

We exposed an interface to the catalog via a consumable NPM module. This library will expose a number of methods that can be called to interact with the catalog.

### Methods

Method signatures and their associating parameters/responses can be found in the `cadence/` folder of this repo.

#### Scripts

```
checkForRecommendedV1Views
genTx
getAllNftsAndViewsInAccount
getAllNftsInAccount
getExamplenftCollectionLength
getExamplenftType
getNftAndViewsInAccount
getNftCatalog
getNftCatalogCount
getNftCatalogIdentifiers
getNftCatalogProposals
getNftCatalogProposalsCount
getNftCollectionsForNftType
getNftIdsInAccount
getNftInAccount
getNftInAccountFromPath
getNftMetadataForCollectionIdentifier
getNftProposalForId
getNftsCountInAccount
getNftsInAccount
getNftsInAccountFromIds
getNftsInAccountFromPath
getSupportedGeneratedScripts
getSupportedGeneratedTransactions
hasAdminProxy
isCatalogAdmin
```

#### Transactions

```
addToNftCatalog
addToNftCatalogAdmin
approveNftCatalogProposal
mintExampleNft
mintNonstandardNft
proposeNftToCatalog
rejectNftCatalogProposal
removeFromNftCatalog
removeNftCatalogProposal
sendAdminCapabilityToProxy
setupExamplenftCollection
setupNftCatalogAdminProxy
setupNonstandardnftCollection
setupStorefront
transferExamplenft
updateNftCatalogEntry
withdrawNftProposalFromCatalog
```

### Installation

```
npm install flow-catalog
```

or

```
yarn add flow-catalog
```

### Usage

Methods can be imported as follows, all nested methods live under the `scripts` or `transactions` variable.

NOTE: In order to properly bootstrap the method, you will need to run and `await` on the `getAddressMaps()` method, passing it into all of the methods as shown below.

```
import { getAddressMaps, scripts } from "flow-catalog";

const main = async () => {
    const addressMap = await getAddressMaps();
    console.log(await scripts.getNftCatalog(addressMap));
};

main();
```

The response of any method is a tuple-array, with the first element being the result, and the second being the error (if applicable).

For example, the result of the method above would look like -

```
[
  {
    BILPlayerCollection: {
      contractName: 'Player',
      contractAddress: '0x9e6cdb88e34fa1f3',
      nftType: [Object],
      collectionData: [Object],
      collectionDisplay: [Object]
    },
    ...
    SoulMadeComponent: {
      contractName: 'SoulMadeComponent',
      contractAddress: '0x421c19b7dc122357',
      nftType: [Object],
      collectionData: [Object],
      collectionDisplay: [Object]
    }
  },
  null
]
```

## Contract Addresses

`NFTCatalog.cdc`: This contract contains the NFT Catalog

| Network | Address            |
| ------- | ------------------ |
| Mainnet | 0x49a7cda3a1eecc29 |
| Testnet | 0x324c34e1c517e4db |

`NFTRetrieval.cdc`: This contract contains helper functions to make it easier to discover NFTs within accounts and from the catalog

| Network | Address            |
| ------- | ------------------ |
| Mainnet | 0x49a7cda3a1eecc29 |
| Testnet | 0x324c34e1c517e4db |

## Submitting a Collection to the NFT Catalog

1. Visit [here](https://www.flow-nft-catalog.com/v)
2. Enter the address containing the NFT contract which contains the collection and select the contract

 <img width="1509" alt="Screen Shot 2023-02-08 at 9 40 01 AM" src="https://user-images.githubusercontent.com/5430668/217561873-54beb50e-0ea2-46fb-b9f8-8dbe758ee12f.png">

3. Enter the storage path where the NFTs are stored and enter an address that holds a sample NFT or log in if you have access to an account that owns the NFT
   <img width="1508" alt="Screen Shot 2023-02-08 at 9 42 54 AM" src="https://user-images.githubusercontent.com/5430668/217562366-e6cbf3cb-38b8-45cb-943e-e20185565743.png">

4. The application will verify that your NFT collection implements the required Metadata views.

    1. The required metadata views include…
        1. NFT Display
            1. How to display an individual NFT part of the collection
        2. External URL
            1. A website for the NFT collection
        3. Collection Data
            1. Information needed to store and retrieve an NFT
        4. Collection Display
            1. How to display information about the NFT collection the NFT belongs to
        5. Royalties
            1. Any royalties that should be accounted for during marketplace transactions
    2. You can find sample implementations of all these views in this example NFT [contract](https://github.com/onflow/flow-nft/blob/master/contracts/ExampleNFT.cdc).
    3. If you are not implementing a view, the app will communicate this and you can update your NFT contract and try resubmitting.

     <img width="738" alt="Screen Shot 2023-02-08 at 9 46 56 AM" src="https://user-images.githubusercontent.com/5430668/217563435-86863297-183b-4345-9615-61f9d4212fe9.png">

5. Submit proposal transaction to the NFT catalog by entering a unique url safe identifier for the collection and a message including any additional context (like contact information).

 <img width="1503" alt="Screen Shot 2023-02-08 at 9 48 45 AM" src="https://user-images.githubusercontent.com/5430668/217563785-65065f51-37bc-49c7-8b3e-ba5d1dda3b24.png">

6. Once submitted you can view all proposals [here](https://www.flow-nft-catalog.com/proposals/mainnet) to track the review of your NFT.

If you would like to make a proposal manually, you may submit the following transaction with all parameters filled in: [https://github.com/dapperlabs/nft-catalog/blob/main/cadence/transactions/propose_nft_to_catalog.cdc](https://github.com/dapperlabs/nft-catalog/blob/main/cadence/transactions/propose_nft_to_catalog.cdc)

Proposals should be reviewed and approved within a few days. Reasons for a proposal being rejected may include:

-   Providing duplicate path or name information of an existing collection on the catalog
-   Providing a not url safe or inaccurate name as the identifier

## Using the Catalog (For marketplaces and other NFT applications)

All of the below examples use the catalog in mainnet, you may replace the imports to the testnet address when using the testnet network.

**Example 1 - Retrieve all NFT collections on the catalog**

```cadence
import NFTCatalog from 0x49a7cda3a1eecc29

/*
    The catalog is returned as a `String: NFTCatalogMetadata`
    The key string is intended to be a unique identifier for a specific collection.
    The NFTCatalogMetadata contains collection-level views corresponding to each
    collection identifier.
    Due to the large size of the response, only the first 10 entries are returned.
*/
pub fun main(): {String: NFTCatalog.NFTCatalogMetadata} {
    let catalogKeys = NFTCatalog.getCatalogKeys()
    let keys = catalogKeys.slice(from: 0, upTo: 10)
    let collections: {String: NFTCatalog.NFTCatalogMetadata} = {}

    for key in keys {
        collections[key] = catalog[key]
    }

    return collections
}
```

**Example 2 - Retrieve all collection names in the catalog**

```cadence
import NFTCatalog from 0x49a7cda3a1eecc29

pub fun main(): [String] {
    let catalogKeys: {String: NFTCatalog.NFTCatalogMetadata} = NFTCatalog.getCatalogKeys()
    let catalogNames: [String] = []

    for collectionIdentifier in catalogKeys {
        catalogNames.append(catalog[collectionIdentifier]!.collectionDisplay.name)
    }

    return catalogNames
}
```

**Example 3 - Retrieve NFT collections and counts owned by an account**

```cadence
import MetadataViews from 0x1d7e57aa55817448
import NFTCatalog from 0x49a7cda3a1eecc29
import NFTRetrieval from 0x49a7cda3a1eecc29

pub fun main(ownerAddress: Address): {String: Number} {
    let account = getAuthAccount(ownerAddress)
    let items: {String: Number} = {}

    NFTCatalog.forEachCatalogKey(fun (collectionIdentifier: String):Bool {
        let value = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)!
        let keyHash = String.encodeHex(HashAlgorithm.SHA3_256.hash(collectionIdentifier.utf8))
        let tempPathStr = "catalog".concat(keyHash)
        let tempPublicPath = PublicPath(identifier: tempPathStr)!

        account.link<&{MetadataViews.ResolverCollection}>(
            tempPublicPath,
            target: value.collectionData.storagePath
        )

        let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)

        if !collectionCap.check() {
            return true
        }

        let count = NFTRetrieval.getNFTCountFromCap(collectionIdentifier: collectionIdentifier, collectionCap: collectionCap)

        if count != 0 {
            items[collectionIdentifier] = count
        }
        return true
    })

    return items
}
```

`Sample Response...`

```text
{
    "schmoes_prelaunch_token": 1
}
```

**Example 4 - Retrieve all NFTs including metadata owned by an account**

```cadence
import MetadataViews from 0x1d7e57aa55817448
import NFTCatalog from 0x49a7cda3a1eecc29
import NFTRetrieval from 0x49a7cda3a1eecc29

pub struct NFT {
    pub let id: UInt64
    pub let name: String
    pub let description: String
    pub let thumbnail: String
    pub let externalURL: String
    pub let storagePath: StoragePath
    pub let publicPath: PublicPath
    pub let privatePath: PrivatePath
    pub let publicLinkedType: Type
    pub let privateLinkedType: Type
    pub let collectionName: String
    pub let collectionDescription: String
    pub let collectionSquareImage: String
    pub let collectionBannerImage: String
    pub let collectionExternalURL: String
    pub let royalties: [MetadataViews.Royalty]

    init(
        id: UInt64,
        name: String,
        description: String,
        thumbnail: String,
        externalURL: String,
        storagePath: StoragePath,
        publicPath: PublicPath,
        privatePath: PrivatePath,
        publicLinkedType: Type,
        privateLinkedType: Type,
        collectionName: String,
        collectionDescription: String,
        collectionSquareImage: String,
        collectionBannerImage: String,
        collectionExternalURL: String,
        royalties: [MetadataViews.Royalty]
    ) {
        self.id = id
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
        self.externalURL = externalURL
        self.storagePath = storagePath
        self.publicPath = publicPath
        self.privatePath = privatePath
        self.publicLinkedType = publicLinkedType
        self.privateLinkedType = privateLinkedType
        self.collectionName = collectionName
        self.collectionDescription = collectionDescription
        self.collectionSquareImage = collectionSquareImage
        self.collectionBannerImage = collectionBannerImage
        self.collectionExternalURL = collectionExternalURL
        self.royalties = royalties
    }
}

pub fun main(ownerAddress: Address): {String: [NFT]} {
    let account = getAuthAccount(ownerAddress)
    let items: [MetadataViews.NFTView] = []
    let data: {String: [NFT]} = {}

    NFTCatalog.forEachCatalogKey(fun (collectionIdentifier: String):Bool {
        let value = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)!
        let keyHash = String.encodeHex(HashAlgorithm.SHA3_256.hash(collectionIdentifier.utf8))
        let tempPathStr = "catalog".concat(keyHash)
        let tempPublicPath = PublicPath(identifier: tempPathStr)!

        account.link<&{MetadataViews.ResolverCollection}>(
            tempPublicPath,
            target: value.collectionData.storagePath
        )

        let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)

        if !collectionCap.check() {
            return true
        }

        let views = NFTRetrieval.getNFTViewsFromCap(collectionIdentifier: collectionIdentifier, collectionCap: collectionCap)
        let items: [NFT] = []

        for view in views {
            let displayView = view.display
            let externalURLView = view.externalURL
            let collectionDataView = view.collectionData
            let collectionDisplayView = view.collectionDisplay
            let royaltyView = view.royalties

            if (displayView == nil || externalURLView == nil || collectionDataView == nil || collectionDisplayView == nil || royaltyView == nil) {
                // Bad NFT. Skipping....
                return true
            }

            items.append(
                NFT(
                    id: view.id,
                    name: displayView!.name,
                    description: displayView!.description,
                    thumbnail: displayView!.thumbnail.uri(),
                    externalURL: externalURLView!.url,
                    storagePath: collectionDataView!.storagePath,
                    publicPath: collectionDataView!.publicPath,
                    privatePath: collectionDataView!.providerPath,
                    publicLinkedType: collectionDataView!.publicLinkedType,
                    privateLinkedType: collectionDataView!.providerLinkedType,
                    collectionName: collectionDisplayView!.name,
                    collectionDescription: collectionDisplayView!.description,
                    collectionSquareImage: collectionDisplayView!.squareImage.file.uri(),
                    collectionBannerImage: collectionDisplayView!.bannerImage.file.uri(),
                    collectionExternalURL: collectionDisplayView!.externalURL.url,
                    royalties: royaltyView!.getRoyalties()
                )
            )
        }

        data[collectionIdentifier] = items
        return true
    })

    return data
}
```

`Sample Response...`

```text
{
    "FlovatarComponent": [],
    "schmoes_prelaunch_token": [
        s.aa16be98aac20e8073f923261531cbbdfae1464f570f5be796b57cdc97656248.NFT(
            id: 1006,
            name: "Schmoes Pre Launch Token #1006",
            description: "",
            thumbnail: "https://gateway.pinata.cloud/ipfs/QmXQ1iBke5wjcjYG22ACVXsCvtMJKEkwFiMf96UChP8uJq",
            externalURL: "https://schmoes.io",
            storagePath: /storage/SchmoesPreLaunchTokenCollection,
            publicPath: /public/SchmoesPreLaunchTokenCollection,
            privatePath: /private/SchmoesPreLaunchTokenCollection,
            publicLinkedType: Type<&A.6c4fe48768523577.SchmoesPreLaunchToken.Collection{A.1d7e57aa55817448.NonFungibleToken.CollectionPublic,A.  1d7e57aa55817448.NonFungibleToken.Receiver,A.1d7e57aa55817448.MetadataViews.ResolverCollection}>(),
            privateLinkedType: Type<&A.6c4fe48768523577.SchmoesPreLaunchToken.Collection{A.1d7e57aa55817448.NonFungibleToken.CollectionPublic,A.1d7e57aa55817448.NonFungibleToken.Provider,A.1d7e57aa55817448.MetadataViews.ResolverCollection}>(),
            collectionName: "Schmoes Pre Launch Token",
            collectionDescription: "",
            collectionSquareImage: "https://gateway.pinata.cloud/ipfs/QmXQ1iBke5wjcjYG22ACVXsCvtMJKEkwFiMf96UChP8uJq",
            collectionBannerImage: "https://gateway.pinata.cloud/ipfs/QmXQ1iBke5wjcjYG22ACVXsCvtMJKEkwFiMf96UChP8uJq",
            royalties: []
        )
    ],
    "Flovatar": []
}
```

**Example 5 - Retrieve all NFTs including metadata owned by an account for large wallets**

For Wallets that have a lot of NFTs you may run into memory issues. The common pattern to get around this for now is to retrieve just the ID's in a wallet by calling the following script

```cadence
import MetadataViews from 0x1d7e57aa55817448
import NFTCatalog from 0x49a7cda3a1eecc29
import NFTRetrieval from 0x49a7cda3a1eecc29

pub fun main(ownerAddress: Address) : {String : [UInt64]} {
    let account = getAuthAccount(ownerAddress)

    let items : {String : [UInt64]} = {}

    NFTCatalog.forEachCatalogKey(fun (collectionIdentifier: String):Bool {
        let value = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)!
        let tempPathStr = "catalogIDs".concat(key)
        let tempPublicPath = PublicPath(identifier: tempPathStr)!
        account.link<&{MetadataViews.ResolverCollection}>(
            tempPublicPath,
            target: value.collectionData.storagePath
        )

        let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)
        if !collectionCap.check() {
            return true
        }

        let ids = NFTRetrieval.getNFTIDsFromCap(collectionIdentifier : key, collectionCap : collectionCap)

        if ids.length > 0 {
            items[key] = ids
        }
        return true
    }
    return items

}
```

and then use the ids to retrieve the full metadata for only those ids by calling the following script and passing in a map of collectlionIdentifer -> [ids]

```cadence
import MetadataViews from 0x1d7e57aa55817448
import NFTCatalog from 0x49a7cda3a1eecc29
import NFTRetrieval from 0x49a7cda3a1eecc29

pub struct NFT {
    pub let id: UInt64
    pub let name: String
    pub let description: String
    pub let thumbnail: String
    pub let externalURL: String
    pub let storagePath: StoragePath
    pub let publicPath: PublicPath
    pub let privatePath: PrivatePath
    pub let publicLinkedType: Type
    pub let privateLinkedType: Type
    pub let collectionName: String
    pub let collectionDescription: String
    pub let collectionSquareImage: String
    pub let collectionBannerImage: String
    pub let collectionExternalURL: String
    pub let royalties: [MetadataViews.Royalty]

    init(
        id: UInt64,
        name: String,
        description: String,
        thumbnail: String,
        externalURL: String,
        storagePath: StoragePath,
        publicPath: PublicPath,
        privatePath: PrivatePath,
        publicLinkedType: Type,
        privateLinkedType: Type,
        collectionName: String,
        collectionDescription: String,
        collectionSquareImage: String,
        collectionBannerImage: String,
        collectionExternalURL: String,
        royalties: [MetadataViews.Royalty]
    ) {
        self.id = id
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
        self.externalURL = externalURL
        self.storagePath = storagePath
        self.publicPath = publicPath
        self.privatePath = privatePath
        self.publicLinkedType = publicLinkedType
        self.privateLinkedType = privateLinkedType
        self.collectionName = collectionName
        self.collectionDescription = collectionDescription
        self.collectionSquareImage = collectionSquareImage
        self.collectionBannerImage = collectionBannerImage
        self.collectionExternalURL = collectionExternalURL
        self.royalties = royalties
    }
}

pub fun main(ownerAddress: Address, collections: {String: [UInt64]}): {String: [NFT]} {
    let data: {String: [NFT]} = {}
    let account = getAuthAccount(ownerAddress)

    for collectionIdentifier in collections.keys {
        if NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier) != nil {
            let value = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)!
            let identifierHash = String.encodeHex(HashAlgorithm.SHA3_256.hash(collectionIdentifier.utf8))
            let tempPathStr = "catalog".concat(identifierHash)
            let tempPublicPath = PublicPath(identifier: tempPathStr)!

            account.link<&{MetadataViews.ResolverCollection}>(
                tempPublicPath,
                target: value.collectionData.storagePath
            )

            let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)

            if !collectionCap.check() {
                return data
            }

            let views = NFTRetrieval.getNFTViewsFromIDs(collectionIdentifier: collectionIdentifier, ids: collections[collectionIdentifier]!, collectionCap: collectionCap)

            let items: [NFT] = []

            for view in views {
                let displayView = view.display
                let externalURLView = view.externalURL
                let collectionDataView = view.collectionData
                let collectionDisplayView = view.collectionDisplay
                let royaltyView = view.royalties

                if (displayView == nil || externalURLView == nil || collectionDataView == nil || collectionDisplayView == nil || royaltyView == nil) {
                    // Bad NFT. Skipping....
                    continue
                }

                items.append(
                    NFT(
                        id: view.id,
                        name: displayView!.name,
                        description: displayView!.description,
                        thumbnail: displayView!.thumbnail.uri(),
                        externalURL: externalURLView!.url,
                        storagePath: collectionDataView!.storagePath,
                        publicPath: collectionDataView!.publicPath,
                        privatePath: collectionDataView!.providerPath,
                        publicLinkedType: collectionDataView!.publicLinkedType,
                        privateLinkedType: collectionDataView!.providerLinkedType,
                        collectionName: collectionDisplayView!.name,
                        collectionDescription: collectionDisplayView!.description,
                        collectionSquareImage: collectionDisplayView!.squareImage.file.uri(),
                        collectionBannerImage: collectionDisplayView!.bannerImage.file.uri(),
                        collectionExternalURL: collectionDisplayView!.externalURL.url,
                        royalties: royaltyView!.getRoyalties()
                    )
                )
            }

            data[collectionIdentifier] = items
        }
    }

    return data
}
```

**Example 6 - Retrieve all MetadataViews for NFTs in a wallet**

If you're looking for some MetadataViews that aren't in the [core view list](https://github.com/onflow/flow-nft/blob/master/contracts/MetadataViews.cdc#L36) you can leverage this script to grab all the views each NFT supports. Note: You lose some typing here but get more data.

```cadence
import MetadataViews from 0x1d7e57aa55817448
import NFTCatalog from 0x49a7cda3a1eecc29
import NFTRetrieval from 0x49a7cda3a1eecc29

pub struct NFTCollectionData {
    pub let storagePath: StoragePath
    pub let publicPath: PublicPath
    pub let privatePath: PrivatePath
    pub let publicLinkedType: Type
    pub let privateLinkedType: Type

    init(
        storagePath: StoragePath,
        publicPath: PublicPath,
        privatePath: PrivatePath,
        publicLinkedType: Type,
        privateLinkedType: Type,
    ) {
        self.storagePath = storagePath
        self.publicPath = publicPath
        self.privatePath = privatePath
        self.publicLinkedType = publicLinkedType
        self.privateLinkedType = privateLinkedType
    }
}

pub fun main(ownerAddress: Address): {String: {String: AnyStruct}} {
    let account = getAuthAccount(ownerAddress)
    let items: [MetadataViews.NFTView] = []
    let data: {String: {String: AnyStruct}} = {}

    NFTCatalog.forEachCatalogKey(fun (collectionIdentifier: String):Bool {
        let value = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)!
        let keyHash = String.encodeHex(HashAlgorithm.SHA3_256.hash(collectionIdentifier.utf8))
        let tempPathStr = "catalog".concat(keyHash)
        let tempPublicPath = PublicPath(identifier: tempPathStr)!

        account.link<&{MetadataViews.ResolverCollection}>(
            tempPublicPath,
            target: value.collectionData.storagePath
        )

        let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)

        if !collectionCap.check() {
            return true
        }

        var views = NFTRetrieval.getAllMetadataViewsFromCap(collectionIdentifier: collectionIdentifier, collectionCap: collectionCap)

        if views.keys.length == 0 {
            return true
        }

        // Cadence doesn't support function return types, lets manually get rid of it
        let nftCollectionDisplayView = views[Type<MetadataViews.NFTCollectionData>().identifier] as! MetadataViews.NFTCollectionData?
        let collectionDataView = NFTCollectionData(
            storagePath: nftCollectionDisplayView!.storagePath,
            publicPath: nftCollectionDisplayView!.publicPath,
            privatePath: nftCollectionDisplayView!.providerPath,
            publicLinkedType: nftCollectionDisplayView!.publicLinkedType,
            privateLinkedType: nftCollectionDisplayView!.providerLinkedType,
        )
        views.insert(key: Type<MetadataViews.NFTCollectionData>().identifier, collectionDataView)

        data[collectionIdentifier] = views

        return true
    })

    return data
}
```

**Example 7 - Setup a user’s account to receive a specific collection**

1. Run the following script to retrieve some collection-level information for an NFT collection identifier from the catalog

```cadence
// Assuming file name is `get_nft_collection_data.cdc`
import MetadataViews from 0x1d7e57aa55817448
import NFTCatalog from 0x49a7cda3a1eecc29
import NFTRetrieval from 0x49a7cda3a1eecc29

pub struct NFTCollection {
    pub let contractName: String
    pub let contractAddress: String
    pub let storagePath: StoragePath
    pub let publicPath: PublicPath
    pub let privatePath: PrivatePath
    pub let publicLinkedType: Type
    pub let privateLinkedType: Type
    pub let collectionName: String
    pub let collectionDescription: String
    pub let collectionSquareImage: String
    pub let collectionBannerImage: String

    init(
        contractName: String,
        contractAddress: String,
        storagePath: StoragePath,
        publicPath: PublicPath,
        privatePath: PrivatePath,
        publicLinkedType: Type,
        privateLinkedType: Type,
        collectionName: String,
        collectionDescription: String,
        collectionSquareImage: String,
        collectionBannerImage: String
    ) {
        self.contractName = contractName
        self.contractAddress = contractAddress
        self.storagePath = storagePath
        self.publicPath = publicPath
        self.privatePath = privatePath
        self.publicLinkedType = publicLinkedType
        self.privateLinkedType = privateLinkedType
        self.collectionName = collectionName
        self.collectionDescription = collectionDescription
        self.collectionSquareImage = collectionSquareImage
        self.collectionBannerImage = collectionBannerImage
    }
}

pub fun main(collectionIdentifier : String) : NFTCollection? {
    pre {
        NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier) != nil : "Invalid collection identifier"
    }

    let contractView = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)!
    let collectionDataView = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)!.collectionData
    let collectionDisplayView = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)!.collectionDisplay

    return NFTCollection(
        contractName: contractView.contractName,
        contractAddress: contractView.contractAddress.toString(),
        storagePath: collectionDataView!.storagePath,
        publicPath: collectionDataView!.publicPath,
        privatePath: collectionDataView!.privatePath,
        publicLinkedType: collectionDataView!.publicLinkedType,
        privateLinkedType: collectionDataView!.privateLinkedType,
        collectionName: collectionDisplayView!.name,
        collectionDescription: collectionDisplayView!.description,
        collectionSquareImage: collectionDisplayView!.squareImage.file.uri(),
        collectionBannerImage: collectionDisplayView!.bannerImage.file.uri()
    )
}
```

2. This script result can then be used to form a transaction by inserting the relevant variables from above into a transaction template like the following:

```cadence
// Assuming file name is `setup_collection_template.cdc`
import NonFungibleToken from 0x1d7e57aa55817448
import MetadataViews from 0x1d7e57aa55817448
import {CONTRACT_NAME} from {CONTRACT_ADDRESS}

transaction {

    prepare(signer: AuthAccount) {
        // Create a new empty collection
        let collection <- {CONTRACT_NAME}.createEmptyCollection()

        // save it to the account
        signer.save(<-collection, to: {STORAGE_PATH})

        // create a public capability for the collection
        signer.link<&{PUBLIC_LINKED_TYPE}>(
            {PUBLIC_PATH},
            target: {STORAGE_PATH}
        )

        // create a private capability for the collection
        signer.link<&{PRIVATE_LINKED_TYPE}>(
            {PRIVATE_PATH},
            target: {STORAGE_PATH}
        )
    }
}
```

We can achieve this with JavaScript, for example:

```javascript
import { readFileSync, writeFileSync } from "fs";
import * as fcl from "@onflow/fcl";

fcl.config()
    .put("accessNode.api", "https://rest-mainnet.onflow.org")
    .put("flow.network", "mainnet");

const args = process.argv.slice(2);

const collectionIdentifier = args[0];
if (collectionIdentifier === undefined) {
    console.error("You need to pass the Collection identifier as an argument.");
    process.exit(1);
}

try {
    const scriptPath = new URL("get_nft_collection_data.cdc", import.meta.url);
    const scriptCode = readFileSync(scriptPath, { encoding: "utf8" });

    const nftCollection = await fcl.query({
        cadence: scriptCode,
        args: (arg, t) => [arg(collectionIdentifier, t.String)],
    });

    console.log(nftCollection);

    const filePath = new URL("setup_collection_template.cdc", import.meta.url);
    const transactionTemplate = readFileSync(filePath, { encoding: "utf8" });

    const transaction = transactionTemplate
        .replaceAll("{CONTRACT_NAME}", nftCollection.contractName)
        .replaceAll("{CONTRACT_ADDRESS}", nftCollection.contractAddress)
        .replaceAll(
            "{STORAGE_PATH}",
            `/${nftCollection.storagePath.domain}/${nftCollection.storagePath.identifier}`
        )
        .replaceAll(
            "{PUBLIC_PATH}",
            `/${nftCollection.publicPath.domain}/${nftCollection.publicPath.identifier}`
        )
        .replaceAll(
            "{PRIVATE_PATH}",
            `/${nftCollection.privatePath.domain}/${nftCollection.privatePath.identifier}`
        )
        .replaceAll(
            "{PUBLIC_LINKED_TYPE}",
            nftCollection.publicLinkedType.typeID.replace(/A\.\w{16}\./g, "")
        )
        .replaceAll(
            "{PRIVATE_LINKED_TYPE}",
            nftCollection.privateLinkedType.typeID.replace(/A\.\w{16}\./g, "")
        );

    const transactionPath = `setup_${nftCollection.contractName}_collection.cdc`;
    writeFileSync(transactionPath, transaction);

    console.log(transaction);
} catch (err) {
    console.error(err.message);
}
```

Running the above with:

```bash
node setupCollection.mjs "ChainmonstersRewards"
```

will generate a file called `setup_ChainmonstersRewards_collection.cdc`, containing:

```cadence
import NonFungibleToken from 0x1d7e57aa55817448
import MetadataViews from 0x1d7e57aa55817448
import ChainmonstersRewards from 0x93615d25d14fa337

transaction {

    prepare(signer: AuthAccount) {
        // Create a new empty collection
        let collection <- ChainmonstersRewards.createEmptyCollection()

        // save it to the account
        signer.save(<-collection, to: /storage/ChainmonstersRewardCollection)

        // create a public capability for the collection
        signer.link<&ChainmonstersRewards.Collection{ChainmonstersRewards.ChainmonstersRewardCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(
            /public/ChainmonstersRewardCollection,
            target: /storage/ChainmonstersRewardCollection
        )

        // create a private capability for the collection
        signer.link<&ChainmonstersRewards.Collection{ChainmonstersRewards.ChainmonstersRewardCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(
            /private/ChainmonstersRewardsCollectionProvider,
            target: /storage/ChainmonstersRewardCollection
        )
    }
}
```

## Developer Usage

### 1. [Install the Flow CLI](https://github.com/onflow/flow-cli)

### 2. [Install Node](https://nodejs.org/en/)

### 3. Clone the project

```sh
git clone --depth=1 https://github.com/onflow/nft-catalog.git
```

### 4. Install packages

-   Run `npm install` in the root of the project

### 5. Run Test Suite

-   Run `npm test` in the root of the project

## License

The works in these files:

-   [FungibleToken.cdc](cadence/contracts/FungibleToken.cdc)
-   [NonFungibleToken.cdc](cadence/contracts/NonFungibleToken.cdc)
-   [ExampleNFT.cdc](cadence/contracts/ExampleNFT.cdc)
-   [MetadataViews.cdc](cadence/contracts/MetadataViews.cdc)
-   [NFTCatalog.cdc](cadence/contracts/NFTCatalog.cdc)
-   [NFTCatalogAdmin.cdc](cadence/contracts/NFTCatalogAdmin.cdc)
-   [NFTRetrieval.cdc](cadence/contracts/NFTRetrieval.cdc)

are under the [Unlicense](LICENSE).
