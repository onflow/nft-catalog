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
    <form className="w-7/12 mt-2" onSubmit={(e) => {
      e.preventDefault();
      const address = showLogIn ? user.addr : sampleAddress
      if (storagePath.indexOf("/storage/") !== 0) {
        setError("The storage path must include the /storage/ prefix")
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
      <p className="mt-2"></p>
      <TextInput
        value={storagePath}
        updateValue={setStoragePath}
        placeholder="Enter storage path (e.g. '/storage/exampleNFTCollection')"
      />
      {
        possibleStoragePahts.length > 0 &&
        <>
          <p className="mt-4 mb-2 text-sm w-7/12 text-stone-600 italic">We found some possible paths from your contract:</p>
          {
            possibleStoragePahts.map((path) => {
              return (
                <a className="py-2 px-6 shadow-md no-underline cursor-pointer border border-black rounded-full font-bold text-sm text-black text-center inline-flex items-center hover:bg-gray-100 focus:outline-none active:shadow-none mr-2" key={path}
                  onClick={() => setStoragePath(path)}>{path}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                  </svg></a>
              )
            })
          }
        </>
      }
      <br />

      {
        showLogIn && (
          <>
            <b>Log In to an account that holds this NFT</b><br />
            <p className="mt-4 text-sm w-7/12 text-stone-600 mb-4">
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
          <div className='mt-8'>
            <b>
              Enter an account address that holds this NFT
            </b>
            <br />
            <p className="mt-2 text-sm w-7/12 text-stone-600">
              <a className="cursor-pointer hover:underline" onClick={() => { setShowLogIn(!showLogIn) }}>Click here </a>
              to log in to an account that holds this NFT.
            </p>
            <br />
            <TextInput
              value={sampleAddress}
              updateValue={setSampleAddress}
              placeholder="e.g. 0x123456abcdef"
            />
          </div>
        )
      }

      <br />

      {
        (!showLogIn || (showLogIn && user.loggedIn)) && (
          <>
            <input
              type="submit"
              value={"Next step"}
              className="cursor-pointer bg-black hover:bg-gray-100 text-white text-sm hover:text-black py-4 px-6 rounded-md"
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