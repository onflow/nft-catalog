import { useEffect, useState } from "react"
import { Spinner } from "../shared/spinner";
import { Alert } from "../shared/alert";
import { getGeneratedTransaction } from "apps/nft-portal/src/flow/utils";
import CodeMirror from '@uiw/react-codemirror';
import { Button } from "../shared/button";
import { networks, Network } from "../../constants/networks"
import { changeFCLEnvironment } from "../../../flow/setup"
import * as FLIX_Generators from "@onflow/interaction-template-generators"
import { TRANSACTION_TYPES } from "./interaction-templates-utils";
import * as fcl from "@onflow/fcl"
import { TransactionAuditStatus } from "./transaction-audit-status"

export function TransactionContent({ identifier, transaction, network, vault }: { identifier: string | undefined, transaction: string | undefined, network: Network, vault: string | undefined }) {
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null)

    const [error, setError] = useState<string | null>(null)
    const [transactionData, setTransactionData] = useState<string | null>(null);
    const [interactionTemplateData, setInteractionTemplateData] = useState<string | null>(null);
    const [interactionTemplateAudits, setInteractionTemplateAudits] = useState<any[] | null>(null);

    useEffect(() => {
        if (!loading) {
            setLoadingMessage(null)
        }
    }, [loading])

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

    useEffect(() => {
        setInteractionTemplateData(null)
        setInteractionTemplateAudits(null)
    }, [transactionData])

    useEffect(() => {
        async function getInteractionTemplateAudits() {
            if (interactionTemplateData) {
                const auditors = await fetch(`https://flix.flow.com/v1/auditors?network=${network}`)
                    .then((res) => res.status === 200 ? res.json() : [])

                await fcl.config().put("flow.network", network)

                const interactionTemplateAudits = await fcl.InteractionTemplateUtils.getInteractionTemplateAudits({
                    template: JSON.parse(interactionTemplateData),
                    auditors: auditors.map((a: any) => a.address),
                })

                if (interactionTemplateAudits) {
                    const audits = auditors.map((auditor: any) => 
                    interactionTemplateAudits[auditor.address] !== undefined ?
                        {
                            auditor,
                            isAudited: interactionTemplateAudits[auditor.address]
                        }
                        : null
                    ).filter((a: any) => a !== null)

                    if (audits) setInteractionTemplateAudits(audits)
                }
            }
        }
        getInteractionTemplateAudits()
    }, [interactionTemplateData])

    useEffect(() => {
        async function getInteractionTemplate() {
            if (transactionData) {
                const interactionTemplate = await getInteractionTemplateForInteraction(network, btoa(transactionData)) 
                if (interactionTemplate) setInteractionTemplateData(JSON.stringify(interactionTemplate, null, 2))
            }
        }
        getInteractionTemplate()
    }, [transactionData, network])

    async function getInteractionTemplateForInteraction(network: string, cadence_base64: string) {
        return await fetch("https://flix.flow.com/v1/templates/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cadence_base64,
                network,
            })
        }).then((res) => res.status === 200 ? res.json() : null)
    }

    async function generateInteractionTemplate() {
        if (!transactionData) return

        setLoadingMessage("Generating Interaction Template. This may take a while...")
        setLoading(true)
        if (identifier != null && identifier !== '' && transaction != null && transaction !== '') {

            // { network: address }
            const cadenceByNetwork: Map<Network, string> = new Map()
            // { placholder: { network: address } }
            const addressByNetwork: Map<string, Map<Network, string>> = new Map()

            let cadence = ""
            for (let network of networks) {
                changeFCLEnvironment(network.value)
                const res = await getGeneratedTransaction(transaction, identifier, vault ?? "flow")

                cadenceByNetwork.set(network.value, res)
               
                let importsReg = /import (\w|,| )+ from 0x\w+/g
                let fileImports = res.match(importsReg) || []

                for (let fileImport of fileImports) {
                    let placeholder: string = ""
                    let address: string = ""

                    fileImport = fileImport.replace(
                        /(?:import ((\w|,| )+) from (0x\w+))/g, 
                        function(...args: any[]) { 
                            address = args[3]
                            placeholder = args[1]
                            return "import " + placeholder + " from 0x" + placeholder
                        }
                    )

                    addressByNetwork.get(placeholder) ?
                        addressByNetwork.get(placeholder)?.set(network.value, address)
                        :
                        addressByNetwork.set(placeholder, (new Map()).set(network.value, address))
                }

                cadence = res.replace(
                    /(?:import ((\w|,| )+) from (0x\w+))/g, 
                    function(...args: any[]) { 
                        return "import " + args[1] + " from 0x" + args[1]
                    }
                )
            }

            changeFCLEnvironment(network)
            
            // Check if cadence bodies match
            let doCadenceBodiesMatch = true
            addressByNetwork.forEach((networkAddresses) => {
                let count = 0
                for (const networkAddress of networkAddresses) count++
                if (count !== networks.length) doCadenceBodiesMatch = false
            })

            if (!doCadenceBodiesMatch) {
                setError(JSON.stringify({ error: "Sorry, this project is not compatible with Interaction Templates"}, null, 2))
                setLoading(false)
                return
            }

            const template = await FLIX_Generators.template({
                iface: "",
                type: TRANSACTION_TYPES[transaction] ?
                TRANSACTION_TYPES[transaction].type : null,
                cadence: cadence,
                messages: FLIX_Generators.messages(
                    TRANSACTION_TYPES[transaction] ?
                        TRANSACTION_TYPES[transaction].messages({ projectName: identifier }) : []
                ),
                args: FLIX_Generators.args(
                    TRANSACTION_TYPES[transaction] ?
                        TRANSACTION_TYPES[transaction].args({ projectName: identifier }) : []
                ),
                dependencies: FLIX_Generators.dependencies(
                    Array.from(addressByNetwork).map(([key, value]) => 
                        FLIX_Generators.dependency({
                            addressPlaceholder: `0x${key}`,
                            contracts: [
                                FLIX_Generators.dependencyContract({
                                    contractName: key,
                                    networks: networks.map(networkOption => 
                                        FLIX_Generators.dependencyContractByNetwork({
                                            network: networkOption.value,
                                            contractName: key,
                                            address: value.get(networkOption.value),
                                            fqAddress: `A.${value.get(networkOption.value)}.${key}`,
                                        }, (() => {
                                            if (networkOption.value === "testnet") {
                                                return { "node": "https://rest-testnet.onflow.org" }
                                            }
                                            if (networkOption.value === "mainnet") {
                                                return { "node": "https://rest-mainnet.onflow.org" }
                                            }
                                            return {}
                                        })())
                                    )
                                })
                            ]
                        })
                    )
                )
            })

            setInteractionTemplateData(JSON.stringify(template, null, 2))
        } else {
            setInteractionTemplateData(JSON.stringify({ error: "Sorry, this project is not compatible with Interaction Templates"}, null, 2))
        }

        setLoading(false)
    }

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
        return <Spinner message={loadingMessage} />
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
        { transactionData && !(interactionTemplateData) && 
            <div className="my-4">
                <Button onClick={generateInteractionTemplate}
                >Generate Interaction Template</Button>
            </div>
        }
        { interactionTemplateData && 
            <>
                <div className="font-semibold text-h1 mb-4">
                    Interaction Template:
                </div>
                <div className="my-4">
                    <Button onClick={() => { navigator.clipboard.writeText(interactionTemplateData ?? "") }}
                    >Copy Interaction Template</Button>
                </div>
            </>
        }
        { interactionTemplateAudits && 
            <>
                <div className="text-lg mb-4">
                    Audits:
                </div>
                <div className="flex flex-row">
                    {
                        interactionTemplateAudits.map(audit => 
                            <TransactionAuditStatus 
                                isAudited={audit.isAudited as boolean}
                                auditorName={audit.auditor.name as string}
                            />
                        )
                    }
                </div>
            </>
        }
        {
            interactionTemplateData &&
            <div className="my-4">
                <CodeMirror
                    value={interactionTemplateData ?? ""}
                    height="auto"
                />
            </div>
        }
    </div>
}