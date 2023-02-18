import { useCallback, useState } from 'react';
import { NetworkDropDown, Network } from '../catalog/network-dropdown';
import { useParams, useNavigate } from 'react-router-dom';
import { CatalogSelect } from '../catalog/catalog-select';
import { changeFCLEnvironment } from 'apps/nft-portal/src/flow/setup';
import { TransactionContent } from './transaction-content';
import { TextInput } from '../shared/text-input';
import { DropDown } from '../shared/drop-down';

type TransactionParams = {
  network: Network;
  identifier: string;
  transaction: string;
  vault: string;
};

export default function Layout() {
  const {
    network = 'testnet',
    transaction,
    identifier,
    vault = 'flow',
  } = useParams<TransactionParams>();

  const [collectionIdentifier, setCollectionIdentifier] = useState<string>(
    identifier ?? ''
  );
  const [ftVault, setFTVault] = useState<string>(vault ?? 'flow');
  const [merchantAddress, setMerchantAddress] =
    useState<string>('0x9999999999999999');

  const navigate = useNavigate();

  const onNetworkChange = useCallback((network: Network) => {
    changeFCLEnvironment(network);
    navigate(`/transactions/${network}`);
  }, []);

  const classes =
    'flex flex-col items-start items-center px-4 py-6 md:px-15 md:py-12';

  return (
    <div className="bg-gradient-to-r from-violet-600 to-blue-500">
      <div className="container">
        <div className={classes}>
          <header className="flex-1 text-2xl md:text-5xl text-center font-display text-white font-bold my-2 md:mb-3">
            Generate Transactions
          </header>
          <p className="md:max-w-sm overflow-hidden text-ellipsis text-white mt-2 mb-8">
            Generate Cadence code for transactions
          </p>
          <div className="flex flex-col w-full">
            <TransactionForm
              collectionIdentifier={collectionIdentifier}
              setCollectionIdentifier={setCollectionIdentifier}
              ftVault={ftVault}
              setFTVault={setFTVault}
              network={network}
              onNetworkChange={onNetworkChange}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full h-full items-center text-center bg-white sm:flex-col md:flex-row">
        <div className="flex-col lg:hidden w-full">
          <CatalogSelect
            type="Transactions"
            network={network}
            selected={transaction}
            collectionIdentifier={collectionIdentifier}
            ftVault={ftVault}
          />
          <TransactionContent
            network={network}
            identifier={identifier}
            vault={vault ?? 'flow'}
            transaction={transaction}
            merchantAddress={merchantAddress}
          />
        </div>
        <div className="lg:flex hidden overflow-hidden">
          <div className="flex-1 border-accent-light-gray sm:border-0 md:border-r-2 self-start min-h-screen w-full md:max-w-xs lg:max-w-sm">
            <div className="flex-col">
              <CatalogSelect
                type="Transactions"
                network={network}
                selected={transaction}
                collectionIdentifier={collectionIdentifier}
                ftVault={ftVault}
              />
            </div>
          </div>
          <div className="px-10 w-3/4 self-start py-10 justify-self-start text-left">
            <TransactionContent
              network={network}
              identifier={identifier}
              vault={vault ?? 'flow'}
              transaction={transaction}
              merchantAddress={merchantAddress}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type TransactionFormParams = {
  collectionIdentifier: string;
  setCollectionIdentifier: (collectionIdentifier: string) => void;
  setFTVault: (vault: string) => void;
  ftVault: string;
  network: Network;
  onNetworkChange: any;
};

function TransactionForm({
  collectionIdentifier,
  setCollectionIdentifier,
  setFTVault,
  ftVault,
  network,
  onNetworkChange,
}: TransactionFormParams) {
  return (
    <div className="flex flex-col md:flex-row w-full items-start items-center space-x-4">
      <div className="flex flex-col w-full">
        <span className="px-1 py-1 text-s text-white">Fungible token</span>
        <DropDown
          value={ftVault ?? ''}
          label="Fungible Token"
          options={[
            { value: 'flow', label: 'Flow' },
            { value: 'fut', label: 'Flow Utility Token' },
            { value: 'duc', label: 'Dapper Utility Coin' },
          ]}
          onChange={setFTVault}
        />
      </div>

      <div className="flex flex-col w-full">
        <span className="px-1 py-1 text-s text-white">
          Collection Identifier
        </span>
        <TextInput
          value={collectionIdentifier ?? ''}
          placeholder="UFCStrike"
          updateValue={setCollectionIdentifier}
        />
      </div>

      <div className="flex flex-col w-full">
        <span className="px-1 py-1 text-s text-white">Flow network</span>
        <NetworkDropDown network={network} onNetworkChange={onNetworkChange} />
      </div>
    </div>
  );
}
