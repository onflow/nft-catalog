type BadgeColor = 'yellow' | 'blue' | 'green'

type BadgeProps = {
  color: BadgeColor,
  text: string
}

export function Badge({ color, text }: BadgeProps) {
  switch (color) {
    case 'yellow':
      return <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900">{text}</span>
    case 'blue':
      return <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">{text}</span>
    case 'green':
      return <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">{text}</span>
  }
}