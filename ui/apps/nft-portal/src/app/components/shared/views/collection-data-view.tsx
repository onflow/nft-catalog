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