import { GenericViewToggle } from "./generic-view-toggle"

type GenericViewProps = {
  view: any
}

export function DisplayView({ view }: GenericViewProps) {
  let { thumbnail } = view
  if (thumbnail.startsWith('ipfs://')) {
    thumbnail = "https://ipfs.io/ipfs/" + thumbnail.substring(7)
  }
  return (
    <>
      <div className="text-2xl">{view.name}</div>
      <div className="text-md mt-2">
        {view.description}
      </div>
      <img src={thumbnail} width="50" height="50"></img>
      <hr className="my-2" />
      <GenericViewToggle view={view} />
    </>
  )
}