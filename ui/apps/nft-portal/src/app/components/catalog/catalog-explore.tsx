import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllCollections, getAllProposals } from '../../../flow/utils';
import { Network } from './network-dropdown';
import { changeFCLEnvironment } from '../../../flow/setup';
import { Badge } from '../shared/badge';

export function CatalogExplore({
  statusFilter,
  search,
  network,
  type,
  userAddress = null,
}: {
  statusFilter: string;
  search: string;
  type: 'Catalog' | 'Proposals' | 'NFTs' | 'Transactions';
  network: Network;
  selected: string | undefined;
  userAddress?: string | null;
  collectionIdentifier?: string | null;
  ftVault?: string | null;
}) {
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const [unfilteredItems, setUnfilteredItems] = useState<null | Array<any>>(
    null
  );
  const [items, setItems] = useState<null | Array<any>>(null);
  const loading = !items;
  const [numToShow, setNumToShow] = useState(18);
  const [itemsLength, setItemsLength] = useState(0);

  useEffect(() => {
    if (unfilteredItems && unfilteredItems.length > 0 && (search.length >= 2 || statusFilter !== 'ALL')) {
      const searchFilter = search.toLowerCase();
      // filter the items based on the search field
      const filteredItems = unfilteredItems.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchFilter || '') ||
          item.subtext.toLowerCase().includes(searchFilter || '')
        ) && (statusFilter === 'ALL' || item.status === statusFilter);
      });
      setItemsLength(filteredItems.length);
      setItems(filteredItems.slice(0, numToShow));
    } else {
      if (unfilteredItems) {
        setItemsLength(unfilteredItems.length);
        setItems(unfilteredItems.slice(0, numToShow));
      } else {
        setItems(unfilteredItems);
      }
    }
  }, [search, unfilteredItems, numToShow, statusFilter]);

  useEffect(() => {
    const setup = async () => {
      changeFCLEnvironment(network);
      let collections: [any] | [] = [];
      if (type === 'Catalog') {
        collections = (await getAllCollections()) || [];
      } else if (type === 'Proposals') {
        collections = (await getAllProposals()) || [];
      }
      let items = Object.keys(collections).map((catalogKey: any) => {
        const catalog = collections[catalogKey];
        return {
          name: `${
            catalog.metadata ? catalog.collectionIdentifier : catalogKey
          }`,
          subtext: `${
            catalog.metadata
              ? catalog.metadata.nftType.typeID
              : catalog.nftType.typeID
          }`,
          id: catalogKey,
          status: catalog.status,
        };
      });
      if (type === 'Proposals') {
        items = items.reverse();
      }
      setUnfilteredItems(items);
    };
    setup();
  }, [network, userAddress]);

  return (
    <div>
      <div className="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {items &&
          items.length > 0 &&
          items.map((item, i) => {
            return <CatalogItem key={i} item={item} network={network} />;
          })}
      </div>
      {items && items.length > 0 && (
        <>
          <p className="text-center text-gray-400 mt-8">
            You're viewing {numToShow > itemsLength ? itemsLength : numToShow}{' '}
            of {itemsLength} items
          </p>
          {itemsLength > numToShow && (
            <button
              className="border-2 w-full border-blue-700 text-blue-700 py-4 px-4 rounded-lg mt-4"
              onClick={() => setNumToShow(numToShow + 18)}
            >
              Load More
            </button>
          )}
        </>
      )}

      {loading && (
        <div className="p-8 w-full h-full">
          <div className="loader"></div>
        </div>
      )}
      {items != null && items.length === 0 && (
        <div className={`flex-col p-8 cursor-pointer border-t-2`}>
          <div className="font-semibold">No Items</div>
          <div className=""> </div>
        </div>
      )}
    </div>
  );
}

export function CatalogItem(props: any) {
  const item = props.item;
  const network = props.network;
  const readableStatus =
    item.status === 'IN_REVIEW'
      ? 'In Review'
      : item.status === 'APPROVED'
      ? 'Approved'
      : 'Rejected';
  return (
    <a
      className="flex flex-1 flex-row bg-white w-full h-full border-2 rounded-2xl h-50 justify-between"
      href={
        !item.status
          ? `/catalog/${network}/${item.name}`
          : `/proposals/${network}/${item.id}`
      }
    >
      <div className="flex flex-col p-6 w-full">
        <header className="font-display font-semibold text-xl truncate hover:text-clip">
          {item.name}
        </header>
        <div className="whitespace-pre text-xs h-16 pt-3.5">{item.subtext}</div>
        <div className="grow"></div>
        <div className="font-semibold text-sm">
          <a
            target="_blank"
            href={`https://${
              network === 'testnet' ? 'testnet.' : ''
            }flowscan.org/contract/${item.subtext.replace(/.NFT$/, '')}`}
            className="flex flex-row rounded bg-primary-gray-50 px-2 py-1 mb-2"
            style={{ width: 'fit-content' }}
            rel="noreferrer"
          >
            <svg
              width="12"
              height="14"
              className="mt-1 mr-2"
              viewBox="0 0 12 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.05798 5.63057L12 3.84713L5.61546 0L0 3.3758V10.1401L6.38454 14V10.7771L12 7.38853L9.05798 5.63057ZM4.84639 11.1847L1.55035 9.19745V4.30573L5.61546 1.85987L8.89929 3.83439L4.84639 6.28026V11.1847ZM6.39674 7.23567L7.50763 6.56051L8.89929 7.38853L6.39674 8.9172V7.23567Z"
                fill="black"
              />
            </svg>
            View Contract
          </a>
          {item.status && (
            <Badge
              color={
                item.status === 'IN_REVIEW'
                  ? 'blue'
                  : item.status === 'APPROVED'
                  ? 'green'
                  : 'red'
              }
              text={readableStatus}
            />
          )}
        </div>
      </div>
      {item.image && (
        <img className="xs:hidden md:inline-flex max-w-lg rounded-r-2xl" src={item.image}></img>
      )}
    </a>
  );
}
