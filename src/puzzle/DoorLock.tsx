import clsx from 'clsx'
import {useUnit} from 'effector-react'
import {gameModel} from './model'

export const DoorLock = () => {
  const [isComplete] = useUnit([gameModel.$isComplete])

  return (
    <div className="flex flex-col gap-4 m-4 p-8 bg-slate-100 rounded-sm shadow-md max-w-lg w-full ">
      {isComplete ? <CompleteScreen /> : <GameScreen />}
    </div>
  )
}

const SettingsScreen = () => {
  return (
    <div className="flex flex-col">
      <div className="flex gap-2"></div>
    </div>
  )
}

const colorMap: {[key: number]: string} = {
  0: 'border-2 border-solid border-stone-500',
  1: 'bg-cyan-500',
  2: 'bg-rose-500',
  3: 'bg-green-500',
}

type DotProps = {
  value: number
}
const Dot = ({value}: DotProps) => {
  return <span className={clsx('rounded-full w-5 h-5', colorMap[value])}></span>
}

const GameScreen = () => {
  const [correctMap, shuffledMap, sliceIdxs] = useUnit([
    gameModel.$correctMap,
    gameModel.$shuffledMap,
    gameModel.$sliceIdxs,
  ])
  return (
    <>
      <div className="text-xl flex flex-col gap-2">
        <div className="flex justify-center">
          {correctMap.map((v, idx) => (
            <div key={idx} className={clsx('flex py-2 px-2')}>
              <Dot value={v} />
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          {shuffledMap.map((v, idx) => (
            <div
              key={idx}
              className={clsx(
                'flex px-2 py-2',
                sliceIdxs.some((v) => v === idx) ? 'bg-emerald-400 bg-opacity-30' : 'transparent'
              )}
            >
              <Dot value={v} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4 text-white mt-8 items-center justify-center">
        <button className="px-3 py-1 bg-cyan-700 rounded-sm" onClick={() => gameModel.prev()}>
          Prev
        </button>
        <button className="px-3 py-1 bg-cyan-700 rounded-sm" onClick={() => gameModel.next()}>
          Next
        </button>

        <button className="px-3 py-1 bg-cyan-700 rounded-sm" onClick={() => gameModel.shift()}>
          Shift
        </button>
      </div>
    </>
  )
}

const CompleteScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <span className="mb-2 text-4xl">👑</span>
      <h1 className="mb-10 text-2xl font-bold uppercase tracking-widest">Completed!</h1>
      <button
        className="transition-colors px-5 uppercase tracking-wider text-lg py-4 bg-sky-400 hover:bg-sky-600 rounded-sm text-white"
        onClick={() => gameModel.resetGame()}
      >
        🎲 new game 🎲
      </button>
    </div>
  )
}
