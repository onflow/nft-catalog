import path from 'path';
import {
    emulator,
    init,
    shallPass,
    shallResolve,
    getAccountAddress,
    shallRevert
} from 'flow-js-testing';
import {
    deployNFTCatalog,
    addToCatalogAdmin,
    setupNFTCatalogAdminProxy,
    sendAdminProxyCapability,
    addToCatalog,
    proposeNFTToCatalog,
    getNFTProposalForID,
    approveNFTProposal,
    rejectNFTProposal,
    removeNFTProposal,
    withdrawNFTProposalFromCatalog,
    getNFTCollectionsForNFTType,
    removeFromNFTCatalog,
    updateNFTCatalogEntry,
    hasAdminProxy,
    isCatalogAdmin,
    getNFTMetadataForCollectionIdentifier,
    getInitFunction
} from '../src/nftcatalog';
import {
    deployExampleNFT,
    getExampleNFTType,
    mintExampleNFT,
    setupExampleNFTCollection
} from '../src/examplenft';
import { getNFTInAccountFromPath, deployNFTRetrieval } from '../src/nftviews'
import { TIMEOUT } from '../src/common';

const TEST_NFT_NAME = 'Test Name';
const TEST_NFT_DESCRIPTION = 'Test Description';
const TEST_NFT_THUMBNAIL = 'https://flow.com/';

jest.setTimeout(TIMEOUT);

describe('NFT Catalog Test Suite', () => {
    beforeEach(async () => {
        const basePath = path.resolve(__dirname, '../../');
        const port = 7002;
        await init(basePath, { port });
        await emulator.start(port, false);
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

    it('main admin should add to catalog', async () => {
        await deployNFTCatalog();

        let res = await deployExampleNFT();
        const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

        const [nftTypeIdentifier, _] = await getExampleNFTType();

        const Alice = await getAccountAddress('Alice');
        await setupExampleNFTCollection(Alice);
        await shallPass(mintExampleNFT(Alice, TEST_NFT_NAME, TEST_NFT_DESCRIPTION, TEST_NFT_THUMBNAIL, [], [], []));

        const collectionIdentifier = nftCreationEvent.data.contract

        await shallPass(addToCatalogAdmin(
            collectionIdentifier,
            nftCreationEvent.data.contract,
            nftCreationEvent.data.address,
            nftTypeIdentifier,
            Alice,
            0,
            'exampleNFTCollection',
        ));

        let [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier('ExampleNFT'));
        expect(result).not.toBe(null);
        expect(result.contractName).toBe(nftCreationEvent.data.contract);
        expect(error).toBe(null);
    });

    it('should add to catalog with two collections in a single type', async () => {
        await deployNFTCatalog();

        let res = await deployExampleNFT();
        const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

        const [nftTypeIdentifier, _] = await getExampleNFTType();

        const Alice = await getAccountAddress('Alice');
        await setupExampleNFTCollection(Alice);
        await shallPass(mintExampleNFT(Alice, TEST_NFT_NAME, TEST_NFT_DESCRIPTION, TEST_NFT_THUMBNAIL, [], [], []));


        await shallPass(addToCatalogAdmin(
            'ExampleNFT1',
            nftCreationEvent.data.contract,
            nftCreationEvent.data.address,
            nftTypeIdentifier,
            Alice,
            0,
            'exampleNFTCollection',
        ));

        await shallRevert(addToCatalogAdmin(
            'ExampleNFT1',
            nftCreationEvent.data.contract,
            nftCreationEvent.data.address,
            nftTypeIdentifier,
            Alice,
            0,
            'exampleNFTCollection',
        ));

        await shallPass(addToCatalogAdmin(
            'ExampleNFT2',
            nftCreationEvent.data.contract,
            nftCreationEvent.data.address,
            nftTypeIdentifier,
            Alice,
            0,
            'exampleNFTCollection',
        ));

        let [result, error] = await shallResolve(getNFTCollectionsForNFTType(nftTypeIdentifier));
        expect(Object.keys(result).length).toBe(2);
        expect(result['ExampleNFT1']).not.toBe(null);
        expect(result['ExampleNFT2']).not.toBe(null);
        expect(error).toBe(null);
    });

    it('should remove from catalog', async () => {
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

        await shallPass(removeFromNFTCatalog(
            Alice,
            nftCreationEvent.data.contract
        ));

        let [result, error] = await shallResolve(getNFTCollectionsForNFTType(nftTypeIdentifier));
        expect(result).toBe(null);

        [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier('ExampleNFT'));
        expect(result).toBe(null);

        await shallPass(addToCatalog(
            Alice,
            'ExampleNFT1',
            nftCreationEvent.data.contract,
            nftCreationEvent.data.address,
            nftTypeIdentifier,
            Alice,
            0,
            'exampleNFTCollection'
        ));

        await shallPass(addToCatalog(
            Alice,
            'ExampleNFT2',
            nftCreationEvent.data.contract,
            nftCreationEvent.data.address,
            nftTypeIdentifier,
            Alice,
            0,
            'exampleNFTCollection'
        ));

        await shallPass(removeFromNFTCatalog(
            Alice,
            'ExampleNFT1'
        ));

        [result, error] = await shallResolve(getNFTCollectionsForNFTType(nftTypeIdentifier));
        expect(Object.keys(result).length).toBe(1);
        expect(result['ExampleNFT2']).not.toBe(null);


        [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier('ExampleNFT1'));
        expect(result).toBe(null);

        await shallPass(removeFromNFTCatalog(
            Alice,
            'ExampleNFT2'
        ));

        [result, error] = await shallResolve(getNFTCollectionsForNFTType(nftTypeIdentifier));
        expect(result).toBe(null);


        [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier('ExampleNFT1'));
        expect(result).toBe(null);
    });

    it('should update catalog', async () => {
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


        await shallPass(updateNFTCatalogEntry(
            Alice,
            nftCreationEvent.data.contract,
            'ExampleNFT2',
            nftCreationEvent.data.address,
            nftTypeIdentifier,
            Alice,
            'exampleNFTCollection'
        ));

        let [result, error] = await shallResolve(getNFTCollectionsForNFTType(nftTypeIdentifier));
        expect(Object.keys(result).length).toBe(1);
        expect(result[nftCreationEvent.data.contract]).not.toBe(null);

        [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier(nftCreationEvent.data.contract));
        expect(result.contractName).toBe('ExampleNFT2');

        const tempNewIdentifer = nftTypeIdentifier.replace('.NFT', '.Collection'); // hacky way to test another type

        await shallPass(updateNFTCatalogEntry(
            Alice,
            nftCreationEvent.data.contract,
            'ExampleNFT2',
            nftCreationEvent.data.address,
            tempNewIdentifer,
            Alice,
            'exampleNFTCollection'
        ));

        [result, error] = await shallResolve(getNFTCollectionsForNFTType(nftTypeIdentifier));
        expect(result).toBe(null);

        [result, error] = await shallResolve(getNFTCollectionsForNFTType(tempNewIdentifer));
        expect(Object.keys(result).length).toBe(1);
        expect(result[nftCreationEvent.data.contract]).not.toBe(null);

        [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier(nftCreationEvent.data.contract));
        expect(result.contractName).toBe('ExampleNFT2');
        expect(result.nftType.typeID).toBe(tempNewIdentifer);
    });

    it('non-admin accounts should be able to receive admin capability', async () => {
        await deployNFTCatalog();

        const Alice = await getAccountAddress('Alice');

        let [result, error] = await shallResolve(isCatalogAdmin(Alice));
        expect(result).toBe(false);
        [result, error] = await shallResolve(hasAdminProxy(Alice));
        expect(result).toBe(false);

        await shallResolve(setupNFTCatalogAdminProxy(Alice));
        [result, error] = await shallResolve(isCatalogAdmin(Alice));
        expect(result).toBe(false);
        [result, error] = await shallResolve(hasAdminProxy(Alice));
        expect(result).toBe(true);

        await shallResolve(sendAdminProxyCapability(Alice));
        [result, error] = await shallResolve(isCatalogAdmin(Alice));
        expect(result).toBe(true);
        [result, error] = await shallResolve(hasAdminProxy(Alice));
        expect(result).toBe(true);
    });

    it('non-admin accounts with proxies should be able to add NFT to catalog', async () => {
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

        let [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier('ExampleNFT'));
        expect(result).not.toBe(null);
        expect(result.contractName).toBe(nftCreationEvent.data.contract);
        expect(error).toBe(null);
    });

    it('should be able to approve proposals', async () => {
        await deployNFTCatalog();
        await deployNFTRetrieval();

        const Alice = await getAccountAddress('Alice');

        await shallResolve(setupNFTCatalogAdminProxy(Alice));

        await shallResolve(sendAdminProxyCapability(Alice));

        let res = await deployExampleNFT();
        const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

        const Bob = await getAccountAddress('Bob');

        const [nftTypeIdentifier, _] = await getExampleNFTType();

        await setupExampleNFTCollection(Bob);
        await shallPass(mintExampleNFT(Bob, TEST_NFT_NAME, TEST_NFT_DESCRIPTION, TEST_NFT_THUMBNAIL, [], [], []));

        let [result, error] = await shallResolve(getNFTInAccountFromPath(Bob, 'exampleNFTCollection', 0));

        await proposeNFTToCatalogWithData(Bob, nftCreationEvent, nftTypeIdentifier, result);

        [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier('ExampleNFT'));
        expect(result).toBe(null);

        [result, error] = await shallResolve(getNFTProposalForID(1));
        expect(result.status).toBe("IN_REVIEW");
        expect(result.collectionIdentifier).toBe(nftCreationEvent.data.contract);

        await shallPass(approveNFTProposal(Alice, 1));

        [result, error] = await shallResolve(getNFTProposalForID(1));
        expect(result.status).toBe("APPROVED");

        [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier('ExampleNFT'));
        expect(result).not.toBe(null);
        expect(result.contractName).toBe(nftCreationEvent.data.contract);
        expect(error).toBe(null);
    });


    it('should be able to make proposals to update', async () => {
        await deployNFTCatalog();
        await deployNFTRetrieval();

        const Alice = await getAccountAddress('Alice');

        await shallResolve(setupNFTCatalogAdminProxy(Alice));

        await shallResolve(sendAdminProxyCapability(Alice));

        let res = await deployExampleNFT();
        const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

        const Bob = await getAccountAddress('Bob');

        const [nftTypeIdentifier, _] = await getExampleNFTType();

        await setupExampleNFTCollection(Bob);
        await shallPass(mintExampleNFT(Bob, TEST_NFT_NAME, TEST_NFT_DESCRIPTION, TEST_NFT_THUMBNAIL, [], [], []));

        let [result, error] = await shallResolve(getNFTInAccountFromPath(Bob, 'exampleNFTCollection', 0));

        await proposeNFTToCatalogWithData(Bob, nftCreationEvent, nftTypeIdentifier, result);

        [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier('ExampleNFT'));
        expect(result).toBe(null);

        [result, error] = await shallResolve(getNFTProposalForID(1));
        expect(result.status).toBe("IN_REVIEW");
        expect(result.collectionIdentifier).toBe(nftCreationEvent.data.contract);

        await shallPass(approveNFTProposal(Alice, 1));

        [result, error] = await shallResolve(getNFTProposalForID(1));
        expect(result.status).toBe("APPROVED");

        [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier('ExampleNFT'));
        expect(result).not.toBe(null);
        expect(result.contractName).toBe(nftCreationEvent.data.contract);
        expect(error).toBe(null);

        // test updating path
        [result, error] = await shallResolve(getNFTInAccountFromPath(Bob, 'exampleNFTCollection', 0));

        await proposeNFTToCatalogWithData(Bob, nftCreationEvent, nftTypeIdentifier, result);

        [result, error] = await shallResolve(getNFTProposalForID(2));
        expect(result.status).toBe("IN_REVIEW");
        expect(result.collectionIdentifier).toBe(nftCreationEvent.data.contract);

        await shallPass(approveNFTProposal(Alice, 2));

        [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier('ExampleNFT'));
        expect(result).not.toBe(null);
        expect(result.contractName).toBe(nftCreationEvent.data.contract);
        expect(error).toBe(null);
    });

    it('should be able to reject proposals', async () => {
        await deployNFTCatalog();
        await deployNFTRetrieval();

        const Alice = await getAccountAddress('Alice');

        await shallResolve(setupNFTCatalogAdminProxy(Alice));

        await shallResolve(sendAdminProxyCapability(Alice));

        let res = await deployExampleNFT();
        const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

        const Bob = await getAccountAddress('Bob');

        const [nftTypeIdentifier, _] = await getExampleNFTType();

        await setupExampleNFTCollection(Bob);
        await shallPass(mintExampleNFT(Bob, TEST_NFT_NAME, TEST_NFT_DESCRIPTION, TEST_NFT_THUMBNAIL, [], [], []));

        let [result, error] = await shallResolve(getNFTInAccountFromPath(Bob, 'exampleNFTCollection', 0));

        await proposeNFTToCatalogWithData(Bob, nftCreationEvent, nftTypeIdentifier, result);

        [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier('ExampleNFT'));
        expect(result).toBe(null);

        [result, error] = await shallResolve(getNFTProposalForID(1));
        expect(result.status).toBe("IN_REVIEW");
        expect(result.collectionIdentifier).toBe(nftCreationEvent.data.contract);

        await shallPass(rejectNFTProposal(Alice, 1));

        [result, error] = await shallResolve(getNFTProposalForID(1));
        expect(result.status).toBe("REJECTED");

        [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier('ExampleNFT'));
        expect(result).toBe(null);
    });

    it('should be able to remove proposals', async () => {
        await deployNFTCatalog();
        await deployNFTRetrieval();

        const Alice = await getAccountAddress('Alice');

        await shallResolve(setupNFTCatalogAdminProxy(Alice));

        await shallResolve(sendAdminProxyCapability(Alice));

        let res = await deployExampleNFT();
        const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

        const Bob = await getAccountAddress('Bob');

        const [nftTypeIdentifier, _] = await getExampleNFTType();

        await setupExampleNFTCollection(Bob);
        await shallPass(mintExampleNFT(Bob, TEST_NFT_NAME, TEST_NFT_DESCRIPTION, TEST_NFT_THUMBNAIL, [], [], []));

        let [result, error] = await shallResolve(getNFTInAccountFromPath(Bob, 'exampleNFTCollection', 0));

        await proposeNFTToCatalogWithData(Bob, nftCreationEvent, nftTypeIdentifier, result);

        [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier('ExampleNFT'));
        expect(result).toBe(null);

        [result, error] = await shallResolve(getNFTProposalForID(1));
        expect(result.status).toBe("IN_REVIEW");
        expect(result.collectionIdentifier).toBe(nftCreationEvent.data.contract);

        await shallPass(removeNFTProposal(Alice, 1));

        [result, error] = await shallResolve(getNFTProposalForID(1));
        expect(result).toBe(null);

        [result, error] = await shallResolve(getNFTMetadataForCollectionIdentifier('ExampleNFT'));
        expect(result).toBe(null);
    });

    it('should be able to withdraw proposals', async () => {
        await deployNFTCatalog();
        await deployNFTRetrieval();

        let res = await deployExampleNFT();
        const nftCreationEvent = res[0].events.find(element => element.type === 'flow.AccountContractAdded');

        const Bob = await getAccountAddress('Bob');

        const [nftTypeIdentifier, _] = await getExampleNFTType();

        await setupExampleNFTCollection(Bob);
        await shallPass(mintExampleNFT(Bob, TEST_NFT_NAME, TEST_NFT_DESCRIPTION, TEST_NFT_THUMBNAIL, [], [], []));

        let [result, error] = await shallResolve(getNFTInAccountFromPath(Bob, 'exampleNFTCollection', 0));

        await proposeNFTToCatalogWithData(Bob, nftCreationEvent, nftTypeIdentifier, result);

        [result, error] = await shallResolve(getNFTProposalForID(1));
        expect(result.status).toBe("IN_REVIEW");
        expect(result.collectionIdentifier).toBe(nftCreationEvent.data.contract);

        const Alice = await getAccountAddress('Alice');
        await shallRevert(withdrawNFTProposalFromCatalog(Alice, 1));

        await shallPass(withdrawNFTProposalFromCatalog(Bob, 1));

        [result, error] = await shallResolve(getNFTProposalForID(1));
        expect(result).toBe(null);
    });

});

const proposeNFTToCatalogWithData = async (account, nftCreationEvent, nftTypeIdentifier, struct) => {
    let socialsObj = {}
    for (const key in struct.NFTCollectionDisplay.socials) {
        socialsObj[key] = struct.NFTCollectionDisplay.socials[key].url
    }
    return await shallPass(proposeNFTToCatalog(
        account,
        nftCreationEvent.data.contract,
        nftCreationEvent.data.contract,
        nftCreationEvent.data.address,
        nftTypeIdentifier,
        struct.NFTCollectionData.storagePath.identifier,
        struct.NFTCollectionData.publicPath.identifier,
        struct.NFTCollectionData.privatePath.identifier,
        struct.NFTCollectionData.publicLinkedType.type.type.typeID,
        buildRestrictions(struct.NFTCollectionData.publicLinkedType.type),
        struct.NFTCollectionData.privateLinkedType.type.type.typeID,
        buildRestrictions(struct.NFTCollectionData.privateLinkedType.type),
        struct.NFTCollectionDisplay.collectionName,
        struct.NFTCollectionDisplay.collectionDescription,
        struct.ExternalURL.externalURL,
        struct.NFTCollectionDisplay.collectionSquareImage.file.url,
        struct.NFTCollectionDisplay.collectionSquareImage.mediaType,
        struct.NFTCollectionDisplay.collectionBannerImage.file.url,
        struct.NFTCollectionDisplay.collectionBannerImage.mediaType,
        socialsObj,
        'Please add my NFT to the Catalog',

    ));
}

const buildRestrictions = (restrictedType) => {
    let res = []
    restrictedType.restrictions.forEach(value => {
        res.push(value.typeID);
    })
    return res
} 