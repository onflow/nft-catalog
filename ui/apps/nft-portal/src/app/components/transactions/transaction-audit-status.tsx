export function TransactionAuditStatus({
  isAudited,
  auditorName,
}: { isAudited: boolean, auditorName: string }) {
  return (
    <div className="w-1/4 p-4 rounded-xl border-2 mb-4 mr-4">
      <div className="text-2xl">{auditorName}</div>
      <div className="text-md mt-2 text-md mt-2 p-4 border-x-primary-purple border-l-4">
        {isAudited ? "Audited" : "Not Audited"}
      </div>
    </div>
  )
}