export function Spinner({ message }: { message?: string | null }) {
  return (
    <div className="flex items-center justify-center">
      { message ? message : "Loading..." }
    </div>
  )
}
