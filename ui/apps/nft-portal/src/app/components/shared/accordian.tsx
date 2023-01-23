/*
  Used from https://tailwind-elements.com/docs/standard/components/accordion/ as a base
*/

import React, { useState } from "react"

function Collapsible({ item, index, containsInvalids, backHref }: { item: any, index: number, containsInvalids: boolean, backHref : string }) {
  const [expand, setExpand] = useState(false)
  const shouldNotExpand = containsInvalids && item.isValid
  const statusColor = item.isValid ? "green" : "red"
  const borderClass = index > 0 ? 'border-t' : ''
  return (
    <div className={`accordion-item bg-white border-gray-300 ${borderClass}`}>
      <h2 className="accordion-header mb-0" id="headingOne">
        <button className="
            relative
            flex
            items-center
            w-full
            py-4
            px-5
            text-base text-gray-800 text-left
            bg-white
            border-0
            rounded-md
            transition
            focus:outline-none
          " type="button"
          onClick={() => {
            !shouldNotExpand && setExpand(!expand)
          }}
        >
          {item.isValid ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={statusColor} className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke={statusColor} className="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          }
          {item.isValid ? <span className="ml-4 font-bold">
            {item.title}
          </span> : <span className="ml-4 font-bold text-red-500">
            {item.title}
          </span>}
          <span className="ml-auto blue underline text-sm">
            {shouldNotExpand ? '' : !expand ? 'Show Details' : 'Hide Details'}
          </span>
        </button>
      </h2>
      {
        expand && (
          <>
            <div className="py-4 px-5">
              {item.content}
            </div>
            {!item.isValid && <div className="py-4 px-5">
              <p className="text-red-500">There's been an error with your {item.title}'s metadata view.</p> Please go <a href={backHref}><u><b>back to the previous step</b></u></a> and review your info.
            </div>}
          </>
        )
      }
    </div>
  )
}

export function Accordian({ items, backHref }: { items: Array<any>, backHref : string }) {
  const containsInvalids = items.filter((i) => {
    return !i.isValid
  }).length > 0
  return (
    <div className="accordion border border-gray-300 rounded-sm" id="accordionExample">
      {
        items && items.map((item, i) => {
          return (
            <React.Fragment key={i}>
              <Collapsible key={i} item={item} index={i} containsInvalids={containsInvalids} backHref={backHref}/>
            </React.Fragment>
          )
        })
      }
    </div>
  )
}
