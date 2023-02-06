import { useCallback, useState } from 'react';
import { NetworkDropDown, Network } from '../catalog/network-dropdown';
import { useParams, useNavigate } from 'react-router-dom';
import { CatalogSelect } from '../catalog/catalog-select';
import { NFTContent } from './nft-content';
import { changeFCLEnvironment } from 'apps/nft-portal/src/flow/setup';
import { TextInput } from '../shared/text-input';

type NFTParams = {
  network: Network;
  address: string;
  identifier: string;
  nftID: string;
};

export default function Layout() {
  const {
    network = 'testnet',
    address,
    identifier,
    nftID,
  } = useParams<NFTParams>();

  const [addressProvided, setAddressProvided] = useState(address);

  const navigate = useNavigate();

  const onNetworkChange = useCallback((network: Network) => {
    changeFCLEnvironment(network);
    navigate(`/nfts/${network}`);
  }, []);

  const classes =
    'flex flex-col items-start items-center px-4 py-6 md:px-15 md:py-12';

  return (
    <div className="bg-gradient-to-r from-violet-600 to-blue-500">
      <div className="container">
        <div className={classes}>
          <header className="flex-1 text-2xl md:text-5xl text-center font-display text-white font-bold my-2 md:mb-3">
            View NFTs
          </header>
          <p className="md:max-w-sm overflow-hidden text-ellipsis text-white mt-2 mb-8">
            Build your next idea using Flow NFT collections.
          </p>
          <div className="flex flex-col md:flex-row w-full items-center space-x-4">
            <div className="flex flex-col w-full">
              <span className="px-1 py-1 text-s text-white">
                Flow account address
              </span>
              <TextInput
                value={addressProvided ?? ''}
                placeholder="0xabcdefghijklmnop"
                updateValue={setAddressProvided}
              />
            </div>
            <div className="flex flex-col w-full">
              <span className="px-1 py-1 text-s text-white">Flow network</span>
              <NetworkDropDown
                network={network}
                onNetworkChange={onNetworkChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full h-full items-center text-center bg-white sm:flex-col md:flex-row">
        <div className="flex-1 border-accent-light-gray sm:border-0 md:border-r-2 self-start min-h-screen w-full md:max-w-xs lg:max-w-sm">
          <div className="flex-col">
            <CatalogSelect
              userAddress={addressProvided}
              type="NFTs"
              network={network}
              selected={undefined}
            />
          </div>
        </div>

        <div className="px-10 w-3/4 self-start py-10 justify-self-start text-left">
          <NFTContent
            network={network}
            walletAddress={addressProvided}
            nftID={nftID}
            identifier={identifier}
          />
        </div>
      </div>
    </div>
  );
}
