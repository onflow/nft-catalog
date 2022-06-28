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
    <nav className="mx-auto w-full max-w-7xl bg-transparent" aria-label="Progress Steps">
      <ol className="grid grid-flow-col pl-0">
        {steps.map((step, index) => (
          <div key={step.id} className="col-span-full sm:col-auto border-solid border-y-2">

            {step.isComplete &&
              <a href={step.href} onClick={step.onClick} className="group p-4 flex flex-col items-start border-l-4 sm:border-l-0 sm:border-t-4 sm:border-b-2 border-primary-purple hover:border-primary-purple">
                {/* ::Step number */}
                <p className="mb-1 font-bold font-display text-primary-gray-300 dark:text-primary-gray-200">{`STEP ${index + 1}`}</p>
                {/* ::Step title */}
                <span className="text-base text-gray-700 font-semibold">{step.title}</span>
              </a>
            }

            {step.isActive && !step.isComplete &&
              <a className="group p-4 flex flex-col items-start border-l-4 sm:border-l-0 sm:border-t-4 sm:border-b-2 border-primary-purple">
                {/* ::Step number */}
                <p className="mb-1 font-bold font-display text-primary-purple-300 dark:text-primary-purple-200">{`STEP ${index + 1}`}</p>
                {/* ::Step title */}
                <span className="text-base text-gray-700 font-semibold">{step.title}</span>
              </a>
            }

            {!step.isActive && !step.isComplete  &&
              <a className="group p-4 flex flex-col items-start border-l-4 sm:border-l-0 sm:border-t-4 sm:border-b-2 border-gray-300 hover:border-gray-500">
                {/* ::Step number */}
                <p className="mb-1 font-bold font-display text-primary-gray-300 dark:text-primary-gray-200">{`STEP ${index + 1}`}</p>
                {/* ::Step title */}
                <span className="text-base text-gray-700 font-semibold">{step.title}</span>
              </a>
            }

          </div>
        ))
        }
      </ol>
    </nav>
  )
}
