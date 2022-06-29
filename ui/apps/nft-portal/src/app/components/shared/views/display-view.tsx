import { GenericViewToggle } from "./generic-view-toggle"

type GenericViewProps = {
  view: any
}

export function DisplayView({ view }: GenericViewProps) {
  return (
    <>
      <div className="text-2xl">{view.name}</div>
      <div className="text-md mt-2">
        {view.description}
      </div>
      <img src={view.thumbnail} width="50" height="50"></img>
      <hr className="my-2" />
      <GenericViewToggle view={view} />
    </>
  )
}