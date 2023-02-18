export function Button(props: any) {
    return (
      <button
        className="cursor-pointer bg-black hover:bg-gray-100 text-white text-sm hover:text-black py-4 px-6 rounded-md"
        { ...props }
      >
        {props.children}
      </button>
    )
  }