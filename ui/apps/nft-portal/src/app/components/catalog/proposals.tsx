import { useCallback, useState } from "react"
import { useParams } from "react-router-dom";
import { NetworkDropDown, Network } from "./network-dropdown";
import { CatalogSelect } from "./catalog-select";
import { NftCollectionContent } from "./nft-collection-content";
import { ProposalContent } from "./proposal-content";
import { useNavigate } from "react-router-dom"
import { Hamburger } from "../shared/hamburger";

type CatalogParams = {
  network: Network;
  identifier: string;
};

export default function Layout({
  type
}: {
  type: "Catalog" | "Proposals",
}) {
  const { network = 'testnet', identifier } = useParams<CatalogParams>()

  const navigate = useNavigate()

  const onNetworkChange = useCallback((network: Network) => {
    navigate(type === 'Proposals' ? `/proposals/${network}` : `/catalog/${network}`)
  }, [])

  return (
    <div className="mx-auto px-0 md:px-4 lg:px-32 pt-4">
      <div className="text-h1 p-2 max-w-full overflow-hidden text-ellipsis !text-2xl md:!text-4xl sm:border-0">
        {type === 'Proposals' ? 'NFT Catalog Proposals' : 'NFT Catalog'}
      </div>
      <div className="text-xs px-2">
        Looking to add your collection to the catalog?
        <br />
        Complete the steps <a className="cursor-pointer text-blue-600 hover:underline" href="/v">here</a>
      </div>
      <div
        className="flex w-full h-full items-center text-center bg-white rounded-2xl sm:flex-col md:flex-row"
      >
        <div className="flex-col lg:hidden w-full">
          <div className="flex w-full items-center">
            <div className="grow">
              <NetworkDropDown network={network} onNetworkChange={onNetworkChange} />
            </div>
            <div>
              {
                /*
              <Hamburger onClick={() => {
                // Item selected
                if(identifier != null) {
                  navigate(type === 'Proposals' ? `/proposals/${network}` : `/catalog/${network}`)
                }
              }} />
              */
              }
            </div>
          </div>
          {identifier == null && <CatalogSelect type={type} selected={identifier} network={network} />}
          {identifier && type === 'Proposals' && <ProposalContent proposalID={identifier} />}
          {identifier && type === 'Catalog' && <NftCollectionContent collectionIdentifier={identifier} />}
        </div>
        <div className="lg:flex hidden overflow-hidden">
          <div className="flex-1 border-accent-light-gray sm:border-0 md:border-r-2 self-start min-h-screen md:max-w-xs lg:max-w-sm">
            <div className="flex-col">
              <NetworkDropDown network={network} onNetworkChange={onNetworkChange} />
              <CatalogSelect type={type} selected={identifier} network={network} />
            </div>
          </div>
          <div className="px-10 w-3/4 self-start py-10 justify-self-start text-left">
            {
              type === 'Proposals' && <ProposalContent proposalID={identifier} />
            }
            {
              type === 'Catalog' && <NftCollectionContent collectionIdentifier={identifier} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
