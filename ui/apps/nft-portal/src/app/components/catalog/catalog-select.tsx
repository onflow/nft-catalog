import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCollections, getProposals } from "../../../flow/utils"
import { Network } from "./network-dropdown";
import { changeFCLEnvironment } from "../../../flow/setup";
import { Badge } from "../shared/badge";

export function CatalogSelect({
  type,
  network,
  selected
}: {
  type: "Catalog" | "Proposals",
  network: Network
  selected: string | undefined
}) {
  const navigate = useNavigate()
  const [items, setItems] = useState<null | Array<any>>(null)
  const loading = !items

  useEffect(() => {
    const setup = async () => {
      changeFCLEnvironment(network);
      // retrieve list of proposals or 
      if (type === 'Proposals') {
        const proposals = await getProposals() || []
        const items = Object.keys(proposals).map((proposalID) => {
          const proposal = proposals[proposalID]
          return {
            name: `#${proposalID} - ${proposal.collectionIdentifier}`,
            subtext: `Created ${(new Date(proposal.createdTime * 1000)).toLocaleDateString("en-US")}`,
            id: proposalID,
            status: proposal.status
          }
        })
        setItems(items)
      } else if (type === 'Catalog') {
        const catalogCollections = await getCollections() || []
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
    }
    setup()
  }, [type, network])

  return (
    <a className="border-t-1 my-4">
      {
        items && items.map((item, i) => {
          const selectedStyle = selected && item.id === selected ? 'border-x-primary-purple border-l-4' : ''
          return (
            <div key={i} className={`flex-col p-8 hover:bg-gray-300 cursor-pointer border-t-2 text-left ${selectedStyle}`} onClick={
              () => {
                navigate(type === 'Proposals' ? `/proposals/${network}/${item.id}` : `/catalog/${network}/${item.id}`)
              }
            }>
              <div className="font-semibold">{item.name}</div>
              {
                item.status && (
                  <Badge color={item.status === 'IN_REVIEW' ? 'blue' : item.status === 'APPROVED' ? 'green' : 'yellow'} text={item.status} />
                )
              }
              <div className="">{item.subtext}</div>
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
    </a>
  )
}