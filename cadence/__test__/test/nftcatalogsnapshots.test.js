import path from 'path';
import {
    emulator,
    init,
    shallPass,
    shallResolve,
    getAccountAddress
} from '@onflow/flow-js-testing';
import {
    deployNFTCatalog,
    addToCatalogAdmin,
    getNFTMetadataForCollectionIdentifier,
    getFullCatalog,
    updateSnapshotAdmin,
    removeFromNFTCatalog,
    setupNFTCatalogAdminProxy,
    sendAdminProxyCapability,
    addToCatalog,
    getNFTCollectionsForNFTType,
    updateShouldUseSnapshotAdmin
} from '../src/nftcatalog';
import {
    deployExampleNFT,
    getExampleNFTType,
    mintExampleNFT,
    setupExampleNFTCollection
} from '../src/examplenft';
import { TIMEOUT, getAdminAddress } from '../src/common';

const TEST_NFT_NAME = 'Test Name';
const TEST_NFT_DESCRIPTION = 'Test Description';
const TEST_NFT_THUMBNAIL = 'https://flow.com/';

jest.setTimeout(TIMEOUT);

describe('NFT Catalog Snapshots Test Suite', () => {
    beforeEach(async () => {
        const basePath = path.resolve(__dirname, '../../');
        await init(basePath);
        await emulator.start(false);
        return new Promise((resolve) => setTimeout(resolve, 1000));
    });

    // Stop emulator, so it could be restarted
    afterEach(async () => {
        await emulator.stop();
        return new Promise((resolve) => setTimeout(resolve, 1000));
    });

    it('should deploy NFTCatalog contract', async () => {
        await shallPass(deployNFTCatalog());
    });

    it('should snapshot current state of catalog and persist it despite catalog changes', async () => {
        await deployNFTCatalog();

        const Alice = await getAccountAddress('Alice');

        await shallResolve(setupNFTCatalogAdminProxy(Alice));
        await shallResolve(sendAdminProxyCapability(Alice));

        let res = await deployExampleNFT();
        const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

        const [nftTypeIdentifier, _] = await getExampleNFTType();

        await setupExampleNFTCollection(Alice);
        await shallPass(mintExampleNFT(Alice, TEST_NFT_NAME, TEST_NFT_DESCRIPTION, TEST_NFT_THUMBNAIL, [], [], []));

        await shallPass(addToCatalog(
            Alice,
            nftCreationEvent.data.contract,
            nftCreationEvent.data.contract,
            nftCreationEvent.data.address,
            nftTypeIdentifier,
            Alice,
            0,
            'exampleNFTCollection'
        ));

        const catalog = await getFullCatalog();
        expect(Object.keys(catalog[0]).length).toEqual(1)

        const NFTCatalogAdmin = await getAdminAddress()

        await shallPass(updateSnapshotAdmin(NFTCatalogAdmin, ['ExampleNFT']));
        const updatedCatalog = await getFullCatalog();
        expect(Object.keys(updatedCatalog[0]).length).toEqual(1)

        await shallPass(removeFromNFTCatalog(
            Alice,
            nftCreationEvent.data.contract
        ));
        
        
        const fullCatalogAfterRemoval = await getFullCatalog();
        expect(Object.keys(fullCatalogAfterRemoval[0]).length).toEqual(0)

        // Switch to use the snapshot, which still has the previous state of the catalog
        await shallPass(updateShouldUseSnapshotAdmin(NFTCatalogAdmin, true));

        // Even though the catalog is empty, the snapshot should still be there
        // ensuring that the snapshot doesn't change as the catalog changes.
        const snapshottedCatalogAfterRemoval = await getFullCatalog();
        expect(Object.keys(snapshottedCatalogAfterRemoval[0]).length).toEqual(1)
    
    });
});
