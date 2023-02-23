import { useCallback, useState } from "react"
import { useParams } from "react-router-dom";
import { Network } from "./network-dropdown";
import { CatalogExplore } from "./catalog-explore";
import { useNavigate } from "react-router-dom"

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

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const tabSelectedStyle = "font-bold text-black border-b-4 border-black rounded dark:text-gray-500 dark:border-gray-500"
  const tabUnselectedStyle = "text-gray-400 border-transparent dark:text-gray-400 dark:border-transparent"

  return (
    <>
      <div className="overflow-hidden">
        <div className="max-h-60 bg-gradient-catalog-1"></div>
        <div className="max-h-60 bg-gradient-catalog-2"></div>
      </div>
      <div className="mx-auto px-4 md:px-4 lg:px-32 pt-16">
        <header className="font-display font-bold text-2xl relative z-20">
          Explore {type === 'Catalog' ? 'the catalog' : 'NFT Catalog Proposals'}
        </header>
        
        <div className="flex flex-col lg:flex-row pt-4">
          <div className="flex flex-1">
            <div className="flex-grow">
              
              <input
                style={{
                  borderWidth: 1
                }}
                className="w-full h-12 px-4 border-primary-gray-dark rounded-lg focus:outline-none relative z-20"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {
              type === 'Proposals' && (
                <select 
                  multiple={false}
                  defaultValue="ALL"
                  className="border-primary-gray-dark rounded-lg focus:outline-none relative z-20"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">Show All</option>
                    <option value="IN_REVIEW">Show Pending</option>
                    <option value="APPROVED">Show Approved</option>
                    <option value="REJECTED">Show Rejected</option>
                </select>
              )
            }
          </div>
        </div>
        <div style={{borderBottomWidth:"1px", borderColor: 'rgba(0,0,0,.11)'}} className="text-sm mt-10 font-medium text-center text-gray-500 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                  <a href={type === 'Catalog' ? "/catalog/mainnet" : "/proposals/mainnet"} className={`inline-block p-4 rounded-t-lg ${network === 'mainnet' ? tabSelectedStyle : tabUnselectedStyle}`}>Mainnet</a>
              </li>
              <li className="mr-2">
                  <a href={type === 'Catalog' ? "/catalog/testnet" : "/proposals/testnet"} className={`inline-block p-4 rounded-t-lg ${network === 'testnet' ? tabSelectedStyle : tabUnselectedStyle}`} aria-current="page">Testnet</a>
              </li>
          </ul>
        </div>
        <CatalogExplore statusFilter={statusFilter} search={search} type={type} selected={identifier} network={network} />
      </div>
    </>
  )
}
