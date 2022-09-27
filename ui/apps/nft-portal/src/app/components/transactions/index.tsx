import { useCallback, useState } from "react"
import { NetworkDropDown, Network } from "../catalog/network-dropdown";
import { useParams, useNavigate } from "react-router-dom";
import { CatalogSelect } from "../catalog/catalog-select";
import { changeFCLEnvironment } from "apps/nft-portal/src/flow/setup";
import { TransactionContent } from "./transaction-content";
import { TextInput } from "../shared/text-input";
import { DropDown } from "../shared/drop-down";

type TransactionParams = {
    network: Network;
    identifier: string;
    transaction: string;
    vault: string;
}

export default function Layout() {

    const { network = 'testnet', transaction, identifier, vault = 'flow' } = useParams<TransactionParams>()

    const [collectionIdentifier, setCollectionIdentifier] = useState<string>(identifier ?? "")
    const [ftVault, setFTVault] = useState<string>(vault ?? "flow")

    const navigate = useNavigate()

    const onNetworkChange = useCallback((network: Network) => {
        changeFCLEnvironment(network)
        navigate(`/transactions/${network}`)
    }, [])

    return (
        <div className="mx-auto px-0 md:px-4 lg:px-32 pt-4">
            <div className="text-h1 p-2 max-w-full overflow-hidden text-ellipsis !text-2xl md:!text-4xl sm:border-0">
                Transactions
            </div>
            <div
                className="flex w-full h-full items-center text-center bg-white rounded-2xl sm:flex-col md:flex-row"
            >
                <div className="flex-col lg:hidden w-full">
                    <div className="flex w-full items-center">
                        <div className="grow">
                            <NetworkDropDown network={network} onNetworkChange={onNetworkChange} />
                            <TransactionForm collectionIdentifier={collectionIdentifier} setCollectionIdentifier={setCollectionIdentifier} ftVault={ftVault} setFTVault={setFTVault} />
                        </div>
                    </div>
                    <CatalogSelect type="Transactions" network={network} selected={transaction} collectionIdentifier={collectionIdentifier} ftVault={ftVault} />
                    <TransactionContent network={network} identifier={identifier} vault={vault ?? "flow"} transaction={transaction} />
                </div>
                <div className="lg:flex hidden overflow-hidden">
                    <div className="flex-1 border-accent-light-gray sm:border-0 md:border-r-2 self-start min-h-screen w-full md:max-w-xs lg:max-w-sm">
                        <div className="flex-col">
                            <NetworkDropDown network={network} onNetworkChange={onNetworkChange} />
                            <TransactionForm collectionIdentifier={collectionIdentifier} setCollectionIdentifier={setCollectionIdentifier} ftVault={ftVault} setFTVault={setFTVault} />
                            <CatalogSelect type="Transactions" network={network} selected={transaction} collectionIdentifier={collectionIdentifier} ftVault={ftVault} />
                        </div>
                    </div>
                    <div className="px-10 w-3/4 self-start py-10 justify-self-start text-left">
                        <TransactionContent network={network} identifier={identifier} vault={vault ?? "flow"} transaction={transaction} />
                    </div>
                </div>
            </div>
        </div>
    )
}

type TransactionFormParams = {
    collectionIdentifier: string;
    setCollectionIdentifier: (collectionIdentifier: string) => void,
    setFTVault: (vault: string) => void;
    ftVault: string;
}

function TransactionForm({ collectionIdentifier, setCollectionIdentifier, setFTVault, ftVault }: TransactionFormParams) {
    return <><div className="md:flex md:items-center my-6">
        <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Collection Identifier
            </label>
        </div>
        <div className="md:w-2/3 px-2">
            <TextInput
                value={collectionIdentifier ?? ""}
                placeholder="UFCStrike"
                updateValue={setCollectionIdentifier}
            />
        </div>
    </div>
        <div>
            <DropDown
                value={ftVault ?? ""}
                label="Fungible Token"
                options={[
                    { value: "flow", label: "Flow" },
                    { value: "fut", label: "Flow Utility Token" },
                    { value: "duc", label: "Dapper Utility Coin" }
                ]}
                onChange={setFTVault}
            />

        </div></>
}