import {combine, createEffect, createEvent, createStore, sample} from 'effector'
import {spread} from 'patronum'
import {shuffle, MAX_LENGTH, genMap} from './utils'

export const createGameFactory = () => {
  const SLICE_LEN = 3
  const DIFFICULTY = 3

  const init = createEffect(() => {
    const correctMap = genMap(DIFFICULTY)
    const shuffledMap = shuffle(correctMap)

    return {
      correctMap,
      shuffledMap,
      startIdx: 0,
      endIdx: SLICE_LEN - 1,
    }
  })

  const $correctMap = createStore<number[]>([])
  const $shuffledMap = createStore<number[]>([])
  const $startIdx = createStore(0)
  const $endIdx = createStore(SLICE_LEN - 1)
  const $sliceIdxs = combine(
    {
      start: $startIdx,
      end: $endIdx,
    },
    ({start, end}) => {
      const len = MAX_LENGTH
      const res = []
      let i = start
      while (i !== end) {
        res.push(i)
        i = (i + 1) % len
      }
      res.push(end)
      return res
    }
  )
  const $isComplete = combine(
    {
      a: $correctMap,
      b: $shuffledMap,
    },
    ({a, b}) => a.toString() === b.toString()
  )

  const prev = createEvent()
  const next = createEvent()
  const shift = createEvent()
  const resetGame = createEvent()

  $startIdx.on(prev, (idx) => (idx + MAX_LENGTH - 2) % MAX_LENGTH)
  $endIdx.on(prev, (idx) => (idx + MAX_LENGTH - 2) % MAX_LENGTH)
  $startIdx.on(next, (idx) => (idx + MAX_LENGTH + 2) % MAX_LENGTH)
  $endIdx.on(next, (idx) => (idx + MAX_LENGTH + 2) % MAX_LENGTH)

  sample({
    clock: shift,
    source: {
      shuffledMap: $shuffledMap,
      sliceIdxs: $sliceIdxs,
    },
    fn: ({sliceIdxs, shuffledMap}) => {
      const shiftedSlice = sliceIdxs.map((idx, i) => {
        const prevIdx = sliceIdxs[i === 0 ? sliceIdxs.length - 1 : i - 1]
        return shuffledMap[prevIdx]
      })
      return shuffledMap.map((val, idx) => {
        if (sliceIdxs.includes(idx)) {
          return shiftedSlice[sliceIdxs.indexOf(idx)]
        }
        return val
      })
    },
    target: $shuffledMap,
  })

  sample({
    clock: init.doneData,
    target: spread({
      targets: {
        correctMap: $correctMap,
        shuffledMap: $shuffledMap,
        startIdx: $startIdx,
        endIdx: $endIdx,
      },
    }),
  })

  sample({
    clock: resetGame,
    target: init,
  })

  $correctMap.updates.watch((v) => console.log('correctMap: ', v))
  $shuffledMap.updates.watch((v) => console.log('shuffledMap: ', v))

  return {
    init,
    $correctMap,
    $shuffledMap,
    $sliceIdxs,
    $isComplete,
    prev,
    next,
    shift,
    resetGame,
  }
}

export const gameModel = createGameFactory()

gameModel.init()
