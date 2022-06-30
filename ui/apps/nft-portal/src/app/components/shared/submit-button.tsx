export function SubmitButton(props: any) {
  return (
    <input
      type="submit"
      className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
      { ...props }
    >
      {props.children}
    </input>
  )
}