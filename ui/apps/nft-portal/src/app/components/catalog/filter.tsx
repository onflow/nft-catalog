import { useState } from "react";
import { TextInput } from "../shared/text-input";

export function Filter({

}: {}) {

  const [filter, setFilter] = useState("")
  return (
    <div className="px-8 py-4">
      <form>
        <TextInput value={filter} updateValue={setFilter} placeholder="Filter Results" />
      </form>
    </div>
  )
}