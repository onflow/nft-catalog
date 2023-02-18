export function Button(props: any) {
  return (
    <button
      className={`${props.bgColor || 'bg-white'} ${
        props.hoverColor || 'hover:bg-gray-100'
      } ${
        props.textColor || 'text-gray-800'
      } ${
        props.textSize || 'text-sm'
      } font-semibold py-4 px-8 border border-gray-400 rounded-lg shadow`}
      {...props}
    >
      {props.children}
    </button>
  );
}
