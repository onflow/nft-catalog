import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAllNFTsInAccountFromCatalog, getCollections, getProposals, getSupportedGeneratedTransactions, getSupportedGeneratedScripts } from "../../../flow/utils"
import { Network } from "./network-dropdown";
import { changeFCLEnvironment } from "../../../flow/setup";
import { Badge } from "../shared/badge";

export function CatalogSelect({
  type,
  network,
  selected,
  userAddress = null,
  collectionIdentifier = null,
  ftVault = null
}: {
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
      } else if (type == 'NFTs') {
        if (userAddress != null) {
          const nftTypes = await getAllNFTsInAccountFromCatalog(userAddress)
          if (nftTypes == null) {
            setItems([])
            return
          }
          const items = Object.keys(nftTypes).map((nftKey) => {
            const nfts = nftTypes[nftKey]
            return nfts.map((nft: any) => {
              return {
                name: `${nft.name}`,
                subtext: `${nft.collectionName}`,
                collectionIdentifier: nftKey,
                id: nft.id,
              }
            })
          }).flat()
          setItems(items)
        } else {
          setItems([])
        }
      }
      else if (type == "Transactions") {
        const supportedTransactions = await getSupportedGeneratedTransactions()
        const supportedScripts = await getSupportedGeneratedScripts()
        const combined = supportedTransactions.concat(supportedScripts)
        if (combined == null) {
          setItems([])
          return
        }
        const items = combined.map((tx: string) => {
          return {
            name: tx,
            subtext: '',
            id: tx,
          }
        })
        setItems(items ?? [])
      }
    }
    setup()
  }, [type, network, userAddress])

  return (
    <a className="border-t-1 my-4">
      {
        items && items.map((item, i) => {
          const selectedStyle = selected && item.id === selected ? 'border-x-primary-purple border-l-4' : ''
          return (
            <div key={i} className={`flex-col p-8 hover:bg-gray-300 cursor-pointer border-t-2 text-left ${selectedStyle}`} onClick={
              () => {
                if (type === 'NFTs') {
                  navigate(`/nfts/${network}/${userAddress}/${item.collectionIdentifier}/${item.id}`)
                } else if (type === 'Proposals') {
                  navigate(`/proposals/${network}/${item.id}`)
                } else if (type === 'Transactions') {
                  if (collectionIdentifier == null || collectionIdentifier === '') {
                    navigate(`/transactions/${network}/${item.id}/${collectionIdentifier}`)
                  } else {
                    navigate(`/transactions/${network}/${item.id}/${collectionIdentifier}/${ftVault}`)
                  }
                } else {
                  navigate(`/catalog/${network}/${item.id}`)
                }
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