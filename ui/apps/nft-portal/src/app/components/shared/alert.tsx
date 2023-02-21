type AlertStatus = 'success' | 'error' | 'warning';

export function Alert({
  status,
  title,
  body,
}: {
  status: AlertStatus;
  title: any;
  body: any;
}) {
  const classColor = getClassColor(status);

  return (
    <div
      className={`bg-${classColor} border-2 border-solid border-${getBorderColor(
        status
      )} rounded px-4 py-4 shadow-md text-xs`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
        </div>
        <div className="flex items-center space-x-10">
          <p className="text-lg font-bold">{title}</p>
          <p className="text-sm text-gray-800">{body}</p>
        </div>
      </div>
    </div>
  );
}

function getBorderColor(status: AlertStatus): string {
  switch (status) {
    case 'success':
      return 'green-300';
    case 'error':
      return 'red-300';
    case 'warning':
      return 'yellow-300';
  }
}

function getClassColor(status: AlertStatus): string {
  switch (status) {
    case 'success':
      return 'green-100';
    case 'error':
      return 'red-100';
    case 'warning':
      return 'yellow-100';
  }
}
