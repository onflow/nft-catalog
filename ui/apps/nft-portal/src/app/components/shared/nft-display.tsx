export function NFTDisplay({ display } : { display: any }) {
  return (
    <>
      <div className="text-2xl">{display.name}</div>
      <a className="text-sm hover:underline text-blue-600" href="https://test.com" target="_blank">Visit Website</a>
      <div className="text-md">
        {display.description}
      </div>
    </>
  )
}