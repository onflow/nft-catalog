import { GenericViewToggle } from "./generic-view-toggle"

type GenericViewProps = {
  view: any
}

export function RoyaltiesView({ view }: GenericViewProps) {
  const royalties = view.royalties
  return (
    <>
      {
        royalties.map((royalty: any, i: number) => {
          return (
            <div className="text-md mt-2" key={i}>
              <b>{royalty.cut * 100}%</b> to <b>{royalty.receiver.address}</b>
            </div>
          )
        })
      }
      {
        !royalties || royalties.length === 0 && (
          <div className="text-md mt-2">
            No royalties set
          </div>
        )
      }
      <hr className="my-2" />
      <GenericViewToggle view={view} />
    </>
  )
}