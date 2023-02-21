import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllNFTsInAccountFromCatalog,
  getSupportedGeneratedTransactions,
  getSupportedGeneratedScripts,
  getAllCollections,
  getAllProposals,
} from '../../../flow/utils';
import { Network } from './network-dropdown';
import { changeFCLEnvironment } from '../../../flow/setup';
import { Badge } from '../shared/badge';
import { Alert } from '../shared/alert';

export function CatalogSelect({
  type,
  network,
  selected,
  userAddress = null,
  collectionIdentifier = null,
  ftVault = null,
}: {
  type: 'Catalog' | 'Proposals' | 'NFTs' | 'Transactions';
  network: Network;
  selected: string | undefined;
  userAddress?: string | null;
  collectionIdentifier?: string | null;
  ftVault?: string | null;
}) {
  const navigate = useNavigate();
  const [items, setItems] = useState<null | Array<any>>(null);
  const [search, setSearch] = useState('');
  const loading = !items;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    const setup = async () => {
      changeFCLEnvironment(network);
      // retrieve list of proposals or
      if (type === 'Proposals') {
        const proposals = await getAllProposals();
        const items = Object.keys(proposals).map((proposalID) => {
          const proposal = proposals[proposalID];
          return {
            name: `#${proposalID} - ${proposal.collectionIdentifier}`,
            subtext: `Created ${new Date(
              proposal.createdTime * 1000
            ).toLocaleDateString('en-US')}`,
            id: proposalID,
            status: proposal.status,
          };
        });
        setItems(items);
      } else if (type === 'Catalog') {
        const catalogCollections = (await getAllCollections()) || [];
        const items = Object.keys(catalogCollections).map((catalogKey) => {
          const catalog = catalogCollections[catalogKey];
          return {
            name: `${catalogKey}`,
            subtext: `${catalog.nftType.typeID}`,
            id: catalogKey,
          };
        });
        setItems(items);
      } else if (type == 'NFTs') {
        console.log(userAddress);
        if (userAddress != null && userAddress !== '') {
          let nftTypes: any;
          try {
            nftTypes = await getAllNFTsInAccountFromCatalog(userAddress);
          } catch (e: any) {
            console.log(e);
            setError(e.errorMessage);
          }
          if (nftTypes == null) {
            setItems([]);
            return;
          }
          const items = Object.keys(nftTypes)
            .map((nftKey) => {
              const nfts = nftTypes[nftKey];
              return nfts.map((nft: any) => {
                return {
                  name: `${nft.name}`,
                  subtext: `${nft.collectionName}`,
                  collectionIdentifier: nftKey,
                  id: nft.id,
                };
              });
            })
            .flat();
          setItems(items);
        } else {
          setItems([]);
          setError(null);
        }
      } else if (type == 'Transactions') {
        const supportedTransactions = await getSupportedGeneratedTransactions();
        const supportedScripts = await getSupportedGeneratedScripts();
        const combined = supportedTransactions.concat(supportedScripts);
        if (combined == null) {
          setItems([]);
          return;
        }
        const items = combined.map((tx: string) => {
          return {
            name: tx,
            subtext: '',
            id: tx,
          };
        });
        setItems(items ?? []);
      }
    };
    setup();
  }, [type, network, userAddress]);

  if (error) {
    return (
      <Alert
        status="error"
        title={`Cannot Read ${type} from Account`}
        body={''}
      />
    );
  }

  return (
    <a className="border-t-1 my-4">
      <div className="py-4">
        <span className="mr-2 rounded px-1 py-1 text-m text-gray-500">
          Select {type}
        </span>
        <div className="flex-grow pt-4 px-4">
          <input
            style={{
              borderWidth: 1,
            }}
            className="w-full h-12 px-4 border-primary-gray-dark rounded-lg focus:outline-none"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {items &&
        items
          .filter((item) => {
            if (search === '') {
              return true;
            } else {
              return item.name.toLowerCase().includes(search.toLowerCase());
            }
          })
          .map((item, i) => {
            const selectedStyle =
              selected && item.id === selected
                ? 'border-x-primary-purple border-l-4'
                : '';
            return (
              <div
                key={i}
                className={`flex-col p-8 hover:bg-gray-300 cursor-pointer border-t-2 text-left ${selectedStyle}`}
                onClick={() => {
                  if (type === 'NFTs') {
                    navigate(
                      `/nfts/${network}/${userAddress}/${item.collectionIdentifier}/${item.id}`
                    );
                  } else if (type === 'Proposals') {
                    navigate(`/proposals/${network}/${item.id}`);
                  } else if (type === 'Transactions') {
                    if (
                      collectionIdentifier == null ||
                      collectionIdentifier === ''
                    ) {
                      navigate(
                        `/transactions/${network}/${item.id}/${collectionIdentifier}`
                      );
                    } else {
                      navigate(
                        `/transactions/${network}/${item.id}/${collectionIdentifier}/${ftVault}`
                      );
                    }
                  } else {
                    navigate(`/catalog/${network}/${item.id}`);
                  }
                }}
              >
                <div className="font-semibold">{item.name}</div>
                {item.status && (
                  <Badge
                    color={
                      item.status === 'IN_REVIEW'
                        ? 'blue'
                        : item.status === 'APPROVED'
                        ? 'green'
                        : 'red'
                    }
                    text={item.status}
                  />
                )}
                <div className="whitespace-pre text-xs">{item.subtext}</div>
              </div>
            );
          })}

      {loading &&
        [0, 0, 0, 0, 0, 0, 0, 0, 0].map((item, i) => {
          return (
            <div key={i} className={`flex-col p-8 cursor-pointer border-t-2`}>
              <div className="font-semibold"> </div>
              <div className=""> </div>
            </div>
          );
        })}
      {items != null && items.length === 0 && (
        <div className={`flex-col p-8 cursor-pointer border-t-2`}>
          <div className="font-semibold">No Items</div>
          <div className=""> </div>
        </div>
      )}
    </a>
  );
}
