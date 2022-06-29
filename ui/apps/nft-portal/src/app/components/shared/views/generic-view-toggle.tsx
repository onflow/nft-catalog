import { useState } from "react"
import { GenericView } from "./generic-view"

type GenericViewProps = {
  view: any
}
export function GenericViewToggle({ view }: GenericViewProps) {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <span
        className="ml-auto blue underline text-xs cursor-pointer"
        onClick={() => {
          setExpanded(!expanded)
        }}
      >
        { !expanded ? 'Show Raw View' : 'Hide Raw View' }
      </span>
      { 
        expanded && (
          <GenericView view={view} />
        )
      }
    </>
  )
}