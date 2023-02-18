type BadgeColor = 'red' | 'blue' | 'green'

type BadgeProps = {
  color: BadgeColor,
  text: string
}

export function Badge({ color, text }: BadgeProps) {
  switch (color) {
    case 'red':
      return <span className="text-sm bg-red-100 text-black border-2 border-red-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-yellow-900 pt-1">{text}</span>
    case 'blue':
      return <span className="text-sm bg-blue-100 text-black border-2 border-blue-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 pt-1">{text}</span>
    case 'green':
      return <span className="text-sm bg-green-100 text-black border-2 border-green-300 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900 pt-1">{text}</span>
  }
}