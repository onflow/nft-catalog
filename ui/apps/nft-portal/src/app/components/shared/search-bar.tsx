import { useState } from "react"
import { TextInput } from "./text-input"
import { Button } from "./button-v2"

export function SearchBar({
  onSubmit
}: {
  onSubmit: (text: string) => void
}) {
  const [value, setValue] = useState<string>("")
  return (
    <form
      className="mb-8"
      onSubmit={(e) => {
        onSubmit(value)
        e.preventDefault()
      }
      }>
      <div className="relative">
        <div className="flex gap-4 w-100">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <div className="grow">
            <TextInput
              value={value}
              updateValue={setValue}
              placeholder={"e.g. 0x123456abcdefg"}
            />
          </div>
          <Button
            type="submit">
            Enter
          </Button>
        </div>
      </div>
    </form>
  )
}





