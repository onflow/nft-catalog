export function NFTCollectionDisplay({ display } : { display: any }) {
  return (
    <>
      <div className="text-2xl">{display.name}</div>
      <a className="text-xs hover:underline text-blue-600" href={display.externalURL} target="_blank">Visit Website</a>
      <div className="text-md mt-2">
        {display.description}
      </div>
      {
        display && display.socials && Object.keys(display.socials).map((social) => {
          return (
            <div>
              {social} : {display.socials[social]}
            </div>
          )
        })
      }
    </>
  )
}
