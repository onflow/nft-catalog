type AlertStatus = 'success' | 'error' | 'warning';

export function Alert({ status, title, body }: { status: AlertStatus, title: any, body: any }) {
  const classText = getClassText(status);
  const svgClassColor = getSvgClassColor(status);

  const padding = body !== '' ? 'py-4' : 'py-0'
  return (
    <div className={`${classText} border-t-4 rounded-b px-4 py-4 shadow-md text-xs`} role="alert">
      <div className="flex">
        <div className={padding}><svg className={`fill-current h-6 w-6 ${svgClassColor} mr-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg></div>
        <div>
          <p className="font-bold">{title}</p>
          <p>{body}</p>
        </div>
      </div>
    </div>
  )
}


function getClassText(status: AlertStatus): string {
  switch (status) {
    case 'success':
      return 'text-green-500'
    case 'error':
      return 'text-red-500'
    case 'warning':
      return 'text-yellow-500'
  }
}

function getSvgClassColor(status: AlertStatus): string {
  switch (status) {
    case 'success':
      return 'bg-green-100 border-green-500 text-green-900'
    case 'error':
      return 'bg-red-100 border-red-500 text-red-900'
    case 'warning':
      return 'bg-yellow-100 border-yellow-500 text-yellow-900'
  }
}
