import { useState } from "react"

export function TextInput({
  value,
  updateValue,
  placeholder
}: {
  value: string,
  updateValue: (text: string) => void,
  placeholder: string
}) {
  return (
    <input
      type="search"
      id="default-search"
      value={value}
      onChange={(e) => { updateValue(e.target.value) }}
      className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder={placeholder}
    />
  )
}





