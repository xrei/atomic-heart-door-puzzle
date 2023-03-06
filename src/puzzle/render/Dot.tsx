import clsx from 'clsx'

export const colorMap: {[key: number]: string} = {
  0: 'border-2 border-solid border-stone-500',
  1: 'bg-cyan-500',
  2: 'bg-rose-500',
  3: 'bg-green-500',
  4: 'bg-yellow-500',
  5: 'bg-indigo-500',
}

type DotProps = {
  value: number
}
export const Dot = ({value}: DotProps) => {
  return <span className={clsx('rounded-full w-5 h-5', colorMap[value])}></span>
}
