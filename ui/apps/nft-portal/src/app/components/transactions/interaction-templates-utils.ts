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
    args: ({ projectName }: { projectName: string }) => [
      FLIX_Generators.arg({
        tag: 'saleItemID',
        type: 'UInt64',
        index: 0,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation: 'ID of the NFT that is put on sale by the seller',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'saleItemPrice',
        type: 'UInt64',
        index: 1,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation:
                  'Amount of tokens (FT) buyer needs to pay for the purchase of listed NFT',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'customID',
        type: 'String?',
        index: 2,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation:
                  'Optional string to represent identifier of the dapp',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'commissionAmount',
        type: 'UFix64',
        index: 3,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation:
                  'Commission amount that will be taken away by the purchase facilitator',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'expiry',
        type: 'UFix64',
        index: 4,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation:
                  'Unix timestamp at which created listing become expired',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'marketplacesAddress',
        type: '[Address]',
        index: 5,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation:
                  'List of addresses that are allowed to get the commission',
              }),
            ],
          }),
        ],
      }),
    ],
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
    args: ({ projectName }: { projectName: string }) => [
      FLIX_Generators.arg({
        tag: 'listingResourceID',
        type: 'UInt64',
        index: 0,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation: 'ID of the Storefront listing resource',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'storefrontAddress',
        type: 'Address',
        index: 1,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation: 'The address that owns the storefront listing',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'commissionRecipient',
        type: 'Address?',
        index: 2,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation:
                  'Optional recipient for transaction commission if comission exists',
              }),
            ],
          }),
        ],
      }),
    ],
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
    args: ({ projectName }: { projectName: string }) => [
      FLIX_Generators.arg({
        tag: 'listingResourceID',
        type: 'UInt64',
        index: 0,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation: 'ID of the Storefront listing resource',
              }),
            ],
          }),
        ],
      }),
    ],
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
    args: ({ projectName }: { projectName: string }) => [
      FLIX_Generators.arg({
        tag: 'storefrontAddress',
        type: 'Address',
        index: 0,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation: 'The address that owns the storefront listing',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'listingResourceID',
        type: 'UInt64',
        index: 1,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation: 'ID of the Storefront listing resource',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'expectedPrice',
        type: 'UFix64',
        index: 2,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation: 'How much you expect to pay for the NFT',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'commissionRecipient',
        type: 'Address?',
        index: 3,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation:
                  'Optional recipient for transaction commission if comission exists',
              }),
            ],
          }),
        ],
      }),
    ],
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
    args: ({ projectName }: { projectName: string }) => [
      FLIX_Generators.arg({
        tag: 'saleItemID',
        type: 'UInt64',
        index: 0,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation: 'ID of the NFT that is put on sale by the seller',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'saleItemPrice',
        type: 'UFix64',
        index: 1,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation:
                  'Amount of tokens (FT) buyer needs to pay for the purchase of listed NFT',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'commissionAmount',
        type: 'UFix64',
        index: 2,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation:
                  'Commission amount that will be taken away by the purchase facilitator',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'marketplacesAddress',
        type: '[Address]',
        index: 3,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation:
                  'List of addresses that are allowed to get the commission',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'expiry',
        type: 'UInt64',
        index: 4,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation:
                  'Unix timestamp at which created listing become expired',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'customID',
        type: 'String?',
        index: 5,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation:
                  'Optional string to represent identifier of the dapp',
              }),
            ],
          }),
        ],
      }),
    ],
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
    args: ({ projectName }: { projectName: string }) => [
      FLIX_Generators.arg({
        tag: 'merchantAccountAddress',
        type: 'Address',
        index: 0,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation:
                  'The merchant account address provided by Dapper Labs',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'storefrontAddress',
        type: 'Address',
        index: 1,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation: 'The address that owns the storefront listing',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'listingResourceID',
        type: 'UInt64',
        index: 2,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation: 'ID of the Storefront listing resource',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'expectedPrice',
        type: 'UFix64',
        index: 3,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation: 'How much you expect to pay for the NFT',
              }),
            ],
          }),
        ],
      }),
      FLIX_Generators.arg({
        tag: 'commissionRecipient',
        type: 'Address?',
        index: 4,
        messages: [
          FLIX_Generators.message({
            tag: 'title',
            translations: [
              FLIX_Generators.messageTranslation({
                bcp47tag: 'en-US',
                translation:
                  'Optional recipient for transaction commission if comission exists',
              }),
            ],
          }),
        ],
      }),
    ],
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
