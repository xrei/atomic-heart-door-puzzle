import clsx from 'clsx'
import {useUnit} from 'effector-react'
import {ReactElement, useMemo} from 'react'
import {GameModel} from '../model'
import {Dot} from './Dot'
import styles from './styles.module.css'

const calcTheta = (n: number) => {
  const theta = []
  const d = 360 / n
  for (var i = 0; i <= n; i++) {
    theta.push((d / 180) * i * Math.PI)
  }
  return theta
}

type getPositionParams = {
  centerX: number
  centerY: number
  theta: number[]
  idx: number
}
const getPosition = ({idx, theta, centerX, centerY}: getPositionParams) => {
  const r = centerX
  const x = centerY - Math.round(r * Math.cos(theta[idx]))
  const y = centerY + Math.round(r * Math.sin(theta[idx]))
  return [x, y]
}

type Props = {
  arr: number[]
  width: number
  height: number
  children(el: number, idx: number): ReactElement
  className?: string
}

const CircleRenderer = ({arr, width, height, children, className}: Props) => {
  const len = arr.length
  const theta = calcTheta(len)
  const centerX = width / 2 - 14 // 14 is half h of dot
  const centerY = height / 2 - 14 // fix maybe get actual h

  return (
    <div className={clsx(className, 'absolute')} style={{width, height}}>
      {arr.map((el, idx) => {
        const [x, y] = getPosition({idx, centerX, centerY, theta})
        return (
          <div
            key={idx}
            className="absolute flex items-center justify-center"
            style={{top: y, left: x}}
          >
            {children(el, idx)}
          </div>
        )
      })}
    </div>
  )
}

type CircleModeProps = {
  gameModel: GameModel
}
export const CircleMode = ({gameModel}: CircleModeProps) => {
  const [correctMap, shuffledMap, sliceIdxs] = useUnit([
    gameModel.$correctMap,
    gameModel.$shuffledMap,
    gameModel.$sliceIdxs,
  ])

  const memoCircle = useMemo(
    () => (
      <CircleRenderer width={320} height={320} arr={correctMap}>
        {(v) => (
          <div className="p-1 flex">
            <Dot value={v} />
          </div>
        )}
      </CircleRenderer>
    ),
    [correctMap]
  )

  return (
    <div className="flex justify-center relative w-[320px] h-[320px]">
      <div className="absolute inset-0 w-full h-full">
        {memoCircle}
        <CircleRenderer
          className={clsx('m-[60px]', styles['circle-border'])}
          width={200}
          height={200}
          arr={shuffledMap}
        >
          {(v, idx) => (
            <div
              key={idx}
              className={clsx(
                'flex p-1',
                sliceIdxs.some((v) => v === idx)
                  ? 'bg-gray-500 bg-opacity-40 rounded-full'
                  : 'transparent'
              )}
            >
              <Dot value={v} />
            </div>
          )}
        </CircleRenderer>
      </div>
    </div>
  )
}
