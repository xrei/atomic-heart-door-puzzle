import clsx from 'clsx'
import {useUnit} from 'effector-react'
import {GameModel} from '../model'
import {Dot} from './Dot'

type LineModeProps = {
  gameModel: GameModel
}
export const LineMode = ({gameModel}: LineModeProps) => {
  const [correctMap, shuffledMap, sliceIdxs] = useUnit([
    gameModel.$correctMap,
    gameModel.$shuffledMap,
    gameModel.$sliceIdxs,
  ])

  return (
    <div className="flex flex-col gap-4 justify-center relative">
      <div className="flex justify-center">
        {correctMap.map((v, idx) => (
          <div key={idx} className={clsx('flex py-2 px-2')}>
            <Dot value={v} />
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        {shuffledMap.map((v, idx) =>
          sliceIdxs.includes(idx) ? (
            <div key={idx} className="flex p-2 bg-emerald-400 bg-opacity-40">
              <Dot value={v} />
            </div>
          ) : (
            <div key={idx} className={clsx('flex p-2')}>
              <Dot value={v} />
            </div>
          )
        )}
      </div>
    </div>
  )
}
