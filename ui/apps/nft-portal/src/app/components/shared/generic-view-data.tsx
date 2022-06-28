export function GenericViewData({ data } : { data: any }) {
  return (
    <>
      {
        data && Object.keys(data).map((key) => {
          return (
            <div>
              {key} : {data[key]}
            </div>
          )
        })
      }
    </>
  )
}