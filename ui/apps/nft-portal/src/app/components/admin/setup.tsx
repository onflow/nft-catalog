import * as fcl from "@onflow/fcl";
import { useEffect, useState } from "react"
import { createAdminProxy, getAccountHasAdminProxy, getIsAdmin } from "../../../flow/utils"
import { Button } from "../shared/button";

export function AdminSetup() {
  const [address, setAddress] = useState<string | null>(null)
  const [hasAdminProxy, setHasAdminProxy] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [forceState, setForceState] = useState<number>(0)
    
  useEffect(() => {
    const setupUser = async () => {
      const user = await fcl.currentUser().snapshot()
      const userAddress = user && user.addr ? user.addr : null
      setAddress(userAddress)
    }
    setupUser()
  }, [forceState])

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

  const loggedIn = address !== null

  if (!loggedIn) {
    return (
      <>
        <Button
          key="login"
          onClick={
            async () => {
              await fcl.logIn()
              setForceState(forceState + 1)
            }
          }
        >
          Log In
        </Button>
      </>
    )
  }
  if (!hasAdminProxy) {
    return (
      <>
        Logged in as <b>{address}</b> 
        <br />
        <Button key="setup" onClick={async () => {
          await createAdminProxy()
          setForceState(forceState + 1)
          window.location.reload()
        }}>
          Create Admin Proxy
        </Button>
      </>
    )
  }
  if (!isAdmin) {
    return (
      <>
        Logged in as <b>{address}</b>
        <br />
        You have created an admin proxy, an existing admin must transfer admin capabilities to you.
      </>
    )
  }
  return (
    <>
      Logged in as <b>{address}</b>
      <br />
      You are an admin already.
    </>
  )
}