import { GenericViewToggle } from "./generic-view-toggle"
import { FiCopy } from 'react-icons/fi';

type GenericViewProps = {
  contractLink: string,
  view: any
}

function convertToReadableType(type: string) {
  return type && type.replace ? type.replace(/A.[a-zA-Z0-9]+./g, '') : ''
}

function ContractAttribute({ attribute, value }: { attribute: string, value: any }) {
  return (
    <div className="flex flex-row justify-between h-28 w-full bg-white rounded-[16px] my-4 p-6">
      <div className="flex flex-col">
        <div className="font-bold">{attribute}</div>
        <div className="text-gray-400 xs:max-w-sm md:max-w-2xl lg:max-w-5xl whitespace-nowrap truncate pt-4">{value}</div>
      </div>
      <div className="cursor-pointer" onClick={() => {
        navigator.clipboard.writeText(value)
      }}>
        <FiCopy size="24px" />
      </div>
    </div>
  )
}

export function ContractDetails({ contractLink, view }: GenericViewProps) {
  const publicTypeID = view.publicLinkedType.typeID ? view.publicLinkedType.typeID : view.publicLinkedType.type.typeID
  const privateTypeID = view.privateLinkedType.typeID ? view.privateLinkedType.typeID : view.privateLinkedType.type.typeID
  return (
    <>
      <div className="flex flex-row justify-between pt-16 pb-8">
        <div className="text-2xl font-display font-bold">Contract Details</div>
        <div className="flex flex-row">
          <div className="text-sm">
            <a href={contractLink.replace('}', '')} target="_blank" className="cursor-pointer flex flex-row rounded bg-primary-gray-50 px-2 py-1 border" style={{width: 'fit-content'}}>
              <svg width="12" height="14" className="mt-1 mr-2" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.05798 5.63057L12 3.84713L5.61546 0L0 3.3758V10.1401L6.38454 14V10.7771L12 7.38853L9.05798 5.63057ZM4.84639 11.1847L1.55035 9.19745V4.30573L5.61546 1.85987L8.89929 3.83439L4.84639 6.28026V11.1847ZM6.39674 7.23567L7.50763 6.56051L8.89929 7.38853L6.39674 8.9172V7.23567Z" fill="black"/>
              </svg>
              View Contract
            </a>
          </div>
        </div>
      </div>
      <div className="w-full overflow-x-auto text-md">
        <ContractAttribute attribute="Type" value={view.type} />
        <ContractAttribute attribute="Address" value={view.address} />
        <ContractAttribute attribute="Storage path" value={`/storage/${view.storagePath.identifier}`} />
        <ContractAttribute attribute="Public path" value={`/public/${view.publicPath.identifier}`} />
        <ContractAttribute attribute="Private path" value={`/private/${view.privatePath.identifier}`} />
        <ContractAttribute attribute="Public Type" value={convertToReadableType(publicTypeID)} />
        <ContractAttribute attribute="Private Type" value={convertToReadableType(privateTypeID)} />
      </div>
      
    </>
  )
}