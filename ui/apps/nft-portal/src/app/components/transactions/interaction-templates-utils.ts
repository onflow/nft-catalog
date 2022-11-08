import * as FLIX_Generators from '@onflow/interaction-template-generators';

export const TRANSACTION_TYPES: any = {
  CollectionInitialization: {
    type: 'transaction',
    messages: ({ projectName }: { projectName: string }) => [
      FLIX_Generators.message({
        tag: 'title',
        translations: [
          FLIX_Generators.messageTranslation({
            bcp47tag: 'en-US',
            translation: `This transaction initializes a user's collection to support a ${projectName} NFT`,
          }),
        ],
      }),
    ],
    args: ({ projectName }: { projectName: string }) => [],
  },
  StorefrontListItem: {
    type: 'transaction',
    messages: ({ projectName }: { projectName: string }) => [
      FLIX_Generators.message({
        tag: 'title',
        translations: [
          FLIX_Generators.messageTranslation({
            bcp47tag: 'en-US',
            translation: `This transaction facilitates the listing of a ${projectName} NFT with the StorefrontV2 contract`,
          }),
        ],
      }),
    ],
    args: ({ projectName }: { projectName: string }) => [],
  },
  StorefrontBuyItem: {
    type: 'transaction',
    messages: ({ projectName }: { projectName: string }) => [
      FLIX_Generators.message({
        tag: 'title',
        translations: [
          FLIX_Generators.messageTranslation({
            bcp47tag: 'en-US',
            translation: `This transaction facilitates the purchase of a listed ${projectName} NFT with the StorefrontV2 contract`,
          }),
        ],
      }),
    ],
    args: ({ projectName }: { projectName: string }) => [],
  },
  StorefrontRemoveItem: {
    type: 'transaction',
    messages: ({ projectName }: { projectName: string }) => [
      FLIX_Generators.message({
        tag: 'title',
        translations: [
          FLIX_Generators.messageTranslation({
            bcp47tag: 'en-US',
            translation: `This transaction facilitates the removal of a ${projectName} NFT listing with the StorefrontV2 contract`,
          }),
        ],
      }),
    ],
    args: ({ projectName }: { projectName: string }) => [],
  },
  DapperBuyNFTMarketplace: {
    messages: ({ projectName }: { projectName: string }) => [
      FLIX_Generators.message({
        tag: 'title',
        translations: [
          FLIX_Generators.messageTranslation({
            bcp47tag: 'en-US',
            translation: `This transaction purchases a ${projectName} NFT from a p2p marketplace.`,
          }),
        ],
      }),
    ],
    args: ({ projectName }: { projectName: string }) => [],
  },
  DapperCreateListing: {
    type: 'transaction',
    messages: ({ projectName }: { projectName: string }) => [
      FLIX_Generators.message({
        tag: 'title',
        translations: [
          FLIX_Generators.messageTranslation({
            bcp47tag: 'en-US',
            translation: `This transaction purchases a ${projectName} NFT from a dapp directly (i.e. **not** on a peer-to-peer marketplace).`,
          }),
        ],
      }),
    ],
    args: ({ projectName }: { projectName: string }) => [],
  },
  DapperBuyNFTDirect: {
    type: 'transaction',
    messages: ({ projectName }: { projectName: string }) => [
      FLIX_Generators.message({
        tag: 'title',
        translations: [
          FLIX_Generators.messageTranslation({
            bcp47tag: 'en-US',
            translation: `This transaction purchases a ${projectName} NFT from a dapp directly (i.e. **not** on a peer-to-peer marketplace).`,
          }),
        ],
      }),
    ],
    args: ({ projectName }: { projectName: string }) => [],
  },
  DapperGetPrimaryListingMetadata: {
    type: 'script',
    messages: ({ projectName }: { projectName: string }) => [
      FLIX_Generators.message({
        tag: 'title',
        translations: [
          FLIX_Generators.messageTranslation({
            bcp47tag: 'en-US',
            translation: `This script retrieves information about a StorefrontV2 ${projectName} listing.`,
          }),
        ],
      }),
    ],
    args: ({ projectName }: { projectName: string }) => [],
  },
  DapperGetSecondaryListingMetadata: {
    type: 'script',
    messages: ({ projectName }: { projectName: string }) => [
      FLIX_Generators.message({
        tag: 'title',
        translations: [
          FLIX_Generators.messageTranslation({
            bcp47tag: 'en-US',
            translation: `This script retrieves information about a a StorefrontV2 ${projectName} listing.`,
          }),
        ],
      }),
    ],
    args: ({ projectName }: { projectName: string }) => [],
  },
};
