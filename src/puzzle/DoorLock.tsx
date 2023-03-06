import clsx from 'clsx'
import {useUnit} from 'effector-react'
import {ButtonHTMLAttributes, forwardRef, ReactNode} from 'react'
import {CircleMode, LineMode} from './render'
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
    <div className="flex flex-col items-center justify-center gap-4 m-4 p-6 bg-slate-300 rounded-sm shadow-lg shadow-neutral-800 max-w-lg w-full  flex-1">
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
  const [diff, difficulties, difficultyChanged, mode, modeChanged, modes] = useUnit([
    gameModel.$selectedDifficulty,
    gameModel.$difficulties,
    gameModel.difficultyChanged,
    gameModel.$gameMode,
    gameModel.modeChanged,
    gameModel.$modes,
  ])

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-6">🚪 Door puzzle 🧩</h1>
      <div className="flex flex-col items-start gap-2">
        <div className="flex gap-2 items-center">
          <label htmlFor="mode-select">⚙️ Mode:</label>
          <select
            className="p-1 px-3 rounded-md border border-solid border-stone-400"
            defaultValue={mode}
            name="mode-select"
            id="mode-select"
            onChange={(e) => modeChanged(e.target.value)}
          >
            {modes.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <label htmlFor="difficulty-select">⚙️ Difficulty:</label>
          <select
            className="p-1 px-3 rounded-md border border-solid border-stone-400"
            defaultValue={diff}
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
      </div>
      <div className="flex mt-8">
        <Button onClick={() => gameModel.gameStarted()}>Start 🚪</Button>
      </div>
    </div>
  )
}

const GameScreen = ({gameModel}: Props) => {
  const mode = useUnit(gameModel.$gameMode)

  return (
    <>
      <div className="text-xl flex flex-col gap-2 select-none">
        {mode === 'line' ? (
          <LineMode gameModel={gameModel} />
        ) : (
          <CircleMode gameModel={gameModel} />
        )}
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
      ref={ref}
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
