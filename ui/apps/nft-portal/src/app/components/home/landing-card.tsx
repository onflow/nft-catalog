import { Box } from "../shared/box"
import { Button } from "../shared/button"


export function LandingCard({
}: {}) {
  const classes = "flex flex-col items-start px-4 py-12 rounded-lg bg-primary-gray-100/30 md:flex-row md:px-20 md:py-24 dark:bg-[#1F232A]"
  return (
    <div className="container">
      <div className={classes}>
        <div className="flex flex-1 flex-col items-start md:mr-20">
          <span className="mr-2 rounded bg-primary-gray-50 px-1 py-1 font-mono text-xs text-primary-blue">
            #nftsOnFlow
          </span>
          <h2 className="text-h2 my-2 md:mb-3">NFT Interoperability Portal</h2>
          <p className="max-w-xs overflow-hidden text-ellipsis text-primary-gray-400 dark:text-primary-gray-100">
            Browse NFT Collections and their available metadata. Verify your NFT collection is well-formed, and have your NFT added to the catalog to unlock interoperability throughout the Flow ecosystem.
          </p>
        </div>
        <div className="flex w-full flex-1 flex-col items-stretch">
          
        </div>
      </div>
    </div>
  )
}