import { GenericViewToggle } from "./generic-view-toggle"

type GenericViewProps = {
  view: any,
  withRawView: boolean
}

function convertToReadableType(type: string) {
  return type && type.replace ? type.replace(/A.[a-zA-Z0-9]+./g, '') : ''
}

export function CollectionDataView({ view, withRawView }: GenericViewProps) {
  const publicTypeID = view.publicLinkedType.typeID ? view.publicLinkedType.typeID : view.publicLinkedType.type.typeID
  const privateTypeID = view.privateLinkedType.typeID ? view.privateLinkedType.typeID : view.privateLinkedType.type.typeID
  return (
    <>
      <div className="flex flex-row justify-between py-16">
        <div className="text-2xl font-display font-bold">Contract Details</div>
        <div className="flex flex-row">
          <div className="text-sm mr-8">
            <a target="_blank">
              <svg width="12" height="14" className="mt-1 mr-2" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.05798 5.63057L12 3.84713L5.61546 0L0 3.3758V10.1401L6.38454 14V10.7771L12 7.38853L9.05798 5.63057ZM4.84639 11.1847L1.55035 9.19745V4.30573L5.61546 1.85987L8.89929 3.83439L4.84639 6.28026V11.1847ZM6.39674 7.23567L7.50763 6.56051L8.89929 7.38853L6.39674 8.9172V7.23567Z" fill="black"/>
              </svg>
              View Contract
            </a>
          </div>
        </div>
      </div>
      <div className="w-full overflow-x-auto text-md">
        <div><b>Storage Path:</b> /storage/{view.storagePath.identifier}</div>
        <div><b>Public Path:</b> /public/{view.storagePath.identifier}</div>
        <div><b>Private Path:</b> /private/{view.storagePath.identifier}</div>
        <div><b>Public Type:</b> {convertToReadableType(publicTypeID)}</div>
        <div><b>Private Type:</b> {convertToReadableType(privateTypeID)}</div>
      </div>
      {
        withRawView && (
          <>
            <hr className="my-2" />
            <GenericViewToggle view={view} />
          </>
        )
      }
      
    </>
  )
}