import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput } from '../shared/text-input';
import { withPrefix } from '@onflow/fcl';
import { Button } from '../shared/button';
import * as fcl from '@onflow/fcl'

export function SampleNFTPrompt({
  contractCode,
  defaultValues,
  setError
}: {
  contractCode: string,
  defaultValues: any,
  setError: any
}) {
  const navigate = useNavigate()
  const [storagePath, setStoragePath] = useState<string>(defaultValues.storagePath || "")
  const [sampleAddress, setSampleAddress] = useState<string>(defaultValues.sampleAddress || "")
  const [showLogIn, setShowLogIn] = useState<boolean>(false)
  const possibleStoragePahts: Array<string> = contractCode.match(/\/storage\/[A-Za-z0-9]*/gmi) || []
  const [user, setUser] = useState({ loggedIn: null, addr: null })

  useEffect(() => fcl.currentUser().subscribe(setUser), [])

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const address = showLogIn ? user.addr : sampleAddress
      if (storagePath.indexOf("/storage/") !== 0) {
        setError("The public path must include the /public/ prefix")
        return false
      }
      if (withPrefix(address).length !== 18) {
        setError("The provided address is not valid ")
        return false
      }
      navigate({
        pathname: window.location.pathname,
        search: `?path=${storagePath}&sampleAddress=${address}`
      })
      return false;
    }}>
      <p></p>
      <b>Enter the storage path your NFT collection uses</b>
      {
        possibleStoragePahts.length > 0 &&
          <>
            <p className="text-xs pb-2">We found some possible paths from your contract, you may click one to autofill</p>
            {
              possibleStoragePahts.map((path) => {
                return (
                  <a
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 dark:hover:bg-blue-300 cursor-pointer"
                    key={path}
                    onClick={() => setStoragePath(path)}
                  >
                    {path}
                  </a>
                )
              })
            }
          </>
      }
      <p className="mt-2"></p>
      <TextInput
        value={storagePath}
        updateValue={setStoragePath}
        placeholder="e.g. /storage/exampleNFTCollection"
      />
      <br />
      
      {
        showLogIn && (
          <>
            <b>Log In to an account that holds this NFT</b><br/>
            <p className="text-xs mb-4">
              <a className="cursor-pointer hover:underline" onClick={() => { setShowLogIn(!showLogIn) }}>Click here </a>
              to enter a different account that holds this NFT.
            </p>
            {
              user.loggedIn && (
                <div>
                  <div className="text-sm">
                    Logged in as <span className="font-semibold">{user.addr}</span>
                    <a
                      className="ml-2 text-xs cursor-pointer hover:underline text-blue-500"
                      onClick={() => {
                        fcl.unauthenticate()
                      }}
                    >
                      Log Out
                    </a>
                  </div>
                </div>
              )
              
            }
            {
              !user.loggedIn && (
                <>
                  <Button onClick={async (e: any) => {
                    e.preventDefault()
                    const user = await fcl.logIn()
                    setSampleAddress(user.addr)
                    return false
                  }}>Log In</Button>
                </>
              )
            }
          </>
        )
      }

      {
        !showLogIn && (
            <>
              <b>
                Enter an account address that holds this NFT
              </b>
              <br/>
              <p className="text-xs">
                <a className="cursor-pointer hover:underline" onClick={() => { setShowLogIn(!showLogIn) }}>Click here </a>
                to log in to an account that holds this NFT.
              </p>
              <br />
              <TextInput
                value={sampleAddress}
                updateValue={setSampleAddress}
                placeholder="e.g. 0x123456abcdef"
              />
            </>
          )
      }

      <br />

      {
        (!showLogIn || (showLogIn && user.loggedIn)) && (
          <>
            <input
              type="submit"
              value={"Continue"}
              className="mt-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            />
          </>
        )
      }

      <br />
      {/*
        <p>Sample account w/ a testnet topshot NFT: <a onClick={() => { setSampleAddress("0xd80d84b4b0a88782") }}>0xd80d84b4b0a88782</a></p>
        <p>Sample account w/ a testnet goatedgoat NFT: <a onClick={() => { setSampleAddress("0xe27bf406ede951f7") }}>0xe27bf406ede951f7</a></p>
      */}
    </form>
  )
}