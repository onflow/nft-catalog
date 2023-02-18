import * as fcl from "@onflow/fcl"
import { useEffect, useState } from "react"
import { acceptProposal, createAdminProxy, deleteProposal, getAccountHasAdminProxy, getIsAdmin, rejectProposal } from "../../../flow/utils"
import { Button } from "../shared/button"
import { Spinner } from "../shared/spinner"

export function ProposalActions({ proposal, proposalID }: { proposal: any, proposalID: string }) {
  const proposer = proposal.proposer
  const [loading, setLoading] = useState<boolean>(false)
  const [address, setAddress] = useState<string | null>(null)
  const [hasAdminProxy, setHasAdminProxy] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [forceState, setForceState] = useState<number>(0)

  useEffect(() => {
    const setup = async () => {
      if (address) {
        const hasAdminProxy = await getAccountHasAdminProxy(address)
        const isAdmin = await getIsAdmin(address)
        setHasAdminProxy(hasAdminProxy)
        setIsAdmin(isAdmin)
      }
    }
    setup()
  }, [address])


  useEffect(() => {
    const setupUser = async () => {
      const user = await fcl.currentUser().snapshot()
      const userAddress = user && user.addr ? user.addr : null
      setAddress(userAddress)
    }
    setupUser()
  }, [forceState])

  const loggedIn = address !== null

  if (!loggedIn) {
    return (
      <>
        <Button
          key="login"
          onClick={
            async () => {
              setLoading(true)
              await fcl.logIn()
              setForceState(forceState + 1)
              setLoading(false)
            }
          }
        >
          Log In
        </Button>
      </>
    )
  }

  if (loading) {
    return <Spinner />
  }

  const buttons: Array<any> = []
  if (isAdmin && proposal.status === 'IN_REVIEW') {
    buttons.push(
      <Button
        key="accept"
        onClick={async () => {
          setLoading(true)
          await acceptProposal(proposalID)
          setForceState(forceState + 1)
          window.location.reload()
          setLoading(false)
        }}
      >
        Accept Proposal
      </Button>
    )
    buttons.push(
      <Button
        key="reject"
        onClick={async () => {
          setLoading(true)
          await rejectProposal(proposalID)
          setForceState(forceState + 1)
          window.location.reload()
          setLoading(false)
        }}
      >
        Reject Proposal
      </Button>
    )
  }

  if (address !== null && proposer === address || isAdmin) {
    buttons.push(
      <Button
        key="delete"
        onClick={async () => {
          setLoading(true)
          await deleteProposal(proposalID)
          setForceState(forceState + 1)
          window.location.reload()
          setLoading(false)
        }}
      >
        Delete Proposal
      </Button>
    )
  }

  return (
    <>

      <div className="text-md"><b>Contract: </b>{proposal.metadata.contractAddress} - {proposal.metadata.contractName}</div>
      <div className="text-md"><b>Submitted:</b> {proposal.proposer} on {(new Date(proposal.createdTime * 1000)).toLocaleDateString("en-US")}</div>
      <div className="text-md"><b>Message: </b>{proposal.message}</div>
      {
        buttons.map((b) => {
          return b
        })
      }
      {
        buttons.length === 0 && (
          <>
            Logged in as <b>{address}</b>
            <br />
            You must be the creator of this proposal or an admin to take any actions.
          </>
        )
      }
    </>
  )
}