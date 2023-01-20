import { useCallback, useState } from "react"
import { useParams } from "react-router-dom";
import { NetworkDropDown, Network } from "./network-dropdown";
import { CatalogExplore } from "./catalog-explore";
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

  const [search, setSearch] = useState('')

  const onNetworkChange = useCallback((network: Network) => {
    navigate(type === 'Proposals' ? `/proposals/${network}` : `/catalog/${network}`)
  }, [])

  return (
    <div className="mx-auto px-0 md:px-4 lg:px-32 pt-8">
      <header className="font-display font-bold text-xl">Explore the catalog</header>
      
      <div className="flex flex-col lg:flex-row pt-4">
        <div className="flex flex-1">
          <div className="flex-grow">
            
            <input
              style={{
                borderWidth: 1
              }}
              className="w-full h-12 px-4 border-primary-gray-dark rounded-lg focus:outline-none"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-72 pl-4">
            <NetworkDropDown network={network} onNetworkChange={onNetworkChange} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap">
        {

        }
      </div>

      <CatalogExplore search={search} type={type} selected={identifier} network={network} />
    </div>
  )
}
