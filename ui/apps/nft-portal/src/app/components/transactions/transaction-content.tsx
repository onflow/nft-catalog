import { useEffect, useState } from "react"
import { Network } from "../catalog/network-dropdown";
import { Spinner } from "../shared/spinner";
import { Alert } from "../shared/alert";
import { getGeneratedTransaction } from "apps/nft-portal/src/flow/utils";
import CodeMirror from '@uiw/react-codemirror';
import { Button } from "../shared/button";

export function TransactionContent({ identifier, transaction, network, vault }: { identifier: string | undefined, transaction: string | undefined, network: Network, vault: string | undefined }) {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [transactionData, setTransactionData] = useState<string | null>(null);

    useEffect(() => {
        setError(null)
        const setup = async () => {
            setLoading(true)
            if (identifier != null && identifier !== '' && transaction != null && transaction !== '') {
                const res = await getGeneratedTransaction(transaction, identifier, vault ?? "flow")
                if (res) {
                    setTransactionData(res);
                } else {
                    setError(`Unable to generate transaction: ${transaction} for collection: ${identifier}. Please make sure you entered a valid collection identifier from the NFT Catalog.`)
                }
            } else {
                setTransactionData(null);
            }
            setLoading(false)
        }
        setup()
    }, [identifier, transaction, vault])

    if (transaction == null) {
        return (
            <div>
                <div className="text-md">
                    Please enter a collection identifier and select a transaction on the left.
                </div>
            </div>
        )

    }

    const hasIdentifier = identifier != null && identifier !== ''

    if (!hasIdentifier) {
        return (
            <div>
                <div className="text-md">
                    Enter a collection identifier from the NFT Catalog.
                </div>
            </div>
        )
    }

    if (loading) {
        return <Spinner />
    }

    if (error) {
        return <Alert status="error" title={error} body={""} />
    }

    return <div>
        <div className="my-4">
            <Button onClick={() => { navigator.clipboard.writeText(transactionData ?? "") }}
            >Copy Code</Button>
        </div>
        <div className="my-4">
            <CodeMirror
                value={transactionData ?? ""}
                height="auto"
            />
        </div>
    </div>
}