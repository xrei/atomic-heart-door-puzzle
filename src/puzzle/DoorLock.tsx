import clsx from 'clsx'
import {useUnit} from 'effector-react'
import {ButtonHTMLAttributes, forwardRef, ReactNode} from 'react'
import {GameModel, gameModel} from './model'

export const Game = () => {
  return <DoorLock gameModel={gameModel} />
}

type Props = {
  gameModel: GameModel
}

const DoorLock = ({gameModel}: Props) => {
  const [isComplete, isStarted] = useUnit([gameModel.$isComplete, gameModel.$isGameStarted])

  return (
    <div className="flex flex-col items-center justify-center gap-4 m-4 p-6 bg-slate-300 rounded-sm shadow-lg shadow-neutral-800 max-w-lg w-full max-h-[256px] flex-1">
      {isStarted ? (
        isComplete ? (
          <CompleteScreen gameModel={gameModel} />
        ) : (
          <GameScreen gameModel={gameModel} />
        )
      ) : (
        <SettingsScreen gameModel={gameModel} />
      )}
    </div>
  )
}

const SettingsScreen = ({gameModel}: Props) => {
  const [val, difficulties, difficultyChanged] = useUnit([
    gameModel.$selectedDifficulty,
    gameModel.$difficulties,
    gameModel.difficultyChanged,
  ])

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">🚪 Door puzzle 🧩</h1>
      <div className="flex gap-2 items-center">
        <label htmlFor="difficulty-select">⚙️ Difficulty:</label>
        <select
          className="p-1 px-3 rounded-md border border-solid border-stone-400"
          defaultValue={val}
          name="difficulty-select"
          id="difficulty-select"
          onChange={(e) => difficultyChanged(Number(e.target.value))}
        >
          {difficulties.map((v) => (
            <option key={v} value={v}>
              {v < 5 && '🟢'}
              {v >= 5 && v <= 6 && '🟠'}
              {v > 6 && '🔴'} {v}
            </option>
          ))}
        </select>
      </div>
      <div className="flex mt-8">
        <Button onClick={() => gameModel.gameStarted()}>Start 🚪</Button>
      </div>
    </div>
  )
}

const colorMap: {[key: number]: string} = {
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
const Dot = ({value}: DotProps) => {
  return <span className={clsx('rounded-full w-5 h-5', colorMap[value])}></span>
}

const GameScreen = ({gameModel}: Props) => {
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
        <Button onClick={() => gameModel.prev()}>Prev</Button>
        <Button onClick={() => gameModel.next()}>Next</Button>

        <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => gameModel.shift()}>
          Shift
        </Button>
      </div>
    </>
  )
}

const CompleteScreen = ({gameModel}: Props) => {
  const [secondsCount] = useUnit([gameModel.$secondsCount])

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <span className="mb-2 text-4xl">👑</span>
      <h1 className="mb-2 text-2xl font-bold uppercase tracking-widest">Completed!</h1>
      <p className="mb-10 text-gray-800 from-black uppercase tracking-wider">
        in {secondsCount} seconds
      </p>
      <Button onClick={() => gameModel.resetGame()}>🎲 new game 🎲</Button>
    </div>
  )
}

const Button = forwardRef<
  HTMLButtonElement,
  {children?: ReactNode} & ButtonHTMLAttributes<HTMLButtonElement>
>(({children, className, ...rest}, ref) => {
  return (
    <button
      className={clsx(
        'transition-colors px-4 uppercase tracking-wider text-lg py-3 bg-blue-500 hover:bg-blue-600 rounded-sm text-white',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
})
