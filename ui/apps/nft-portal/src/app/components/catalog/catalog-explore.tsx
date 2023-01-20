import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAllNFTsInAccountFromCatalog, getSupportedGeneratedTransactions, getSupportedGeneratedScripts, getAllCollections, getAllProposals } from "../../../flow/utils"
import { Network } from "./network-dropdown";
import { changeFCLEnvironment } from "../../../flow/setup";
import { Badge } from "../shared/badge";

export function CatalogExplore({
  search,
  network,
  selected,
  userAddress = null,
  collectionIdentifier = null,
  ftVault = null
}: {
  search: string,
  type: "Catalog" | "Proposals" | "NFTs" | "Transactions",
  network: Network
  selected: string | undefined,
  userAddress?: string | null,
  collectionIdentifier?: string | null,
  ftVault?: string | null
}) {
  const navigate = useNavigate()
  const [items, setItems] = useState<null | Array<any>>(null)
  const loading = !items

  useEffect(() => {
    const setup = async () => {
      changeFCLEnvironment(network);
      const catalogCollections = await getAllCollections() || []
      const items = Object.keys(catalogCollections).map((catalogKey) => {
        const catalog = catalogCollections[catalogKey]
        return {
          name: `${catalogKey}`,
          subtext: `${catalog.nftType.typeID}`,
          id: catalogKey,
        }
      })
      setItems(items)
    }
    setup()
  }, [network, userAddress])

  return (
    <a className="border-t-1 my-4">
      {
        items && items.map((item, i) => {
          const selectedStyle = selected && item.id === selected ? 'border-x-primary-purple border-l-4' : ''
          return (
            <div key={i} className={`flex-col p-8 hover:bg-gray-300 cursor-pointer border-t-2 text-left ${selectedStyle}`} onClick={
              () => {
                navigate(`/catalog/${network}/${item.id}`)
              }
            }>
              <div className="font-semibold">{item.name}</div>
              {
                item.status && (
                  <Badge color={item.status === 'IN_REVIEW' ? 'blue' : item.status === 'APPROVED' ? 'green' : 'yellow'} text={item.status} />
                )
              }
              <div className="whitespace-pre text-xs">{item.subtext}</div>
            </div>
          )
        })
      }

      {
        loading && [0, 0, 0, 0, 0, 0, 0, 0, 0].map((item, i) => {
          return (
            <div key={i} className={`flex-col p-8 cursor-pointer border-t-2`}>
              <div className="font-semibold">{" "}</div>
              <div className="">{" "}</div>
            </div>
          )
        })
      }
      {
        items != null && items.length === 0 &&
        (
          <div className={`flex-col p-8 cursor-pointer border-t-2`}>
            <div className="font-semibold">No Items</div>
            <div className="">{" "}</div>
          </div>
        )

      }
    </a>
  )
}
