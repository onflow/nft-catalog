export function Box({children}: {children: any}) {
  return (
    <div className="p-4 rounded-xl border-2">
      {children}
    </div>
  )
}