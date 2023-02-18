import React from 'react'

/*
  https://fancytailwind.com/app/fancy-laboratory/molecules/steps/steps4 used as a base
  A free to use responsive component implementation
*/

export function StepsProgressBar({
  steps
}: {
  steps: Array<any>
}) {

  return (
    <nav className="max-w-7xl bg-transparent" aria-label="Progress Steps">
      <div className="flex flex-row w-100">
      <ol className="w-fit grid grid-cols-4 gap-0 items-end">
        {steps.map((step, index) => (
          <div key={step.id} className="grid-span-1">

            {step.isComplete &&
              <a href={step.href} onClick={step.onClick} className="group p-4 px-8 flex flex-col border-b-2 hover:border-primary-purple text-center">
                {/* ::Step number */}
                <p className="mb-1 text-primary-gray-300 dark:text-primary-gray-200">{`Step ${index + 1}`}</p>
                {/* ::Step title */}
                <span className="text-sm text-stone-500">{step.title}</span>
              </a>
            }

            {step.isActive && !step.isComplete &&
              <a className="group p-4 px-8 flex flex-col border-b-4 border-black text-center">
                {/* ::Step number */}
                <p className="mb-1 text-black font-bold dark:text-primary-gray-400 text-center">{`Step ${index + 1}`}</p>
                {/* ::Step title */}
                <span className="text-sm text-black">{step.title}</span>
              </a>
            }

            {!step.isActive && !step.isComplete  &&
              <a className="group p-4 px-8 flex flex-col border-b-2 border-gray-300 hover:border-gray-500 text-center">
                {/* ::Step number */}
                <p className="mb-1 text-primary-gray-300 dark:text-primary-gray-200">{`Step ${index + 1}`}</p>
                {/* ::Step title */}
                <span className="text-sm text-stone-500">{step.title}</span>
              </a>
            }

          </div>
        ))
        }
      </ol>
      <div className="border-b-2 border-gray-300 grow"></div>
      </div>
    </nav>
  )
}
