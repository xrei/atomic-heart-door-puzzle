import {combine, createEffect, createEvent, createStore, sample} from 'effector'
import {spread} from 'patronum'
import {
  shuffle,
  MAX_LENGTH,
  genMap,
  fillDifficulties,
  wait,
  getSliceIdxs,
  compareArrays,
} from './utils'

type GameConfig = {
  difficulty: number
}

export const createGameFactory = () => {
  const SLICE_LEN = 3

  const gameStarted = createEvent()
  const $isGameStarted = createStore(false).on(gameStarted, (s) => !s)

  const $difficulties = createStore<number[]>(fillDifficulties())
  const difficultyChanged = createEvent<number>()
  const $selectedDifficulty = createStore($difficulties.getState()[1]).on(
    difficultyChanged,
    (_, d) => d
  )

  const init = createEffect(({difficulty}: GameConfig) => {
    const correctMap = genMap(difficulty)
    const shuffledMap = shuffle(correctMap)

    return {
      correctMap,
      shuffledMap,
      startIdx: 0,
      endIdx: SLICE_LEN - 1,
      stopwatchStarted: true,
    }
  })

  // maps
  const $correctMap = createStore<number[]>([])
  const $shuffledMap = createStore<number[]>([])

  // slice
  const $startIdx = createStore(0)
  const $endIdx = createStore(SLICE_LEN - 1)
  const $sliceIdxs = combine({start: $startIdx, end: $endIdx}, ({start, end}) =>
    getSliceIdxs(start, end)
  )

  const $isComplete = combine($correctMap, $shuffledMap, compareArrays)

  const prev = createEvent()
  const next = createEvent()
  const shift = createEvent()
  const resetGame = createEvent()

  // - 2 because SLICE_LEN = 3 but indexes starting with 0
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
      // shift slice to the right by 1 position
      const shiftedSlice = sliceIdxs.map((idx, i) => {
        const prevIdx = sliceIdxs[i === 0 ? sliceIdxs.length - 1 : i - 1]
        return shuffledMap[prevIdx]
      })
      // insert shifted slice to shuffledMap
      return shuffledMap.map((val, idx) => {
        if (sliceIdxs.includes(idx)) {
          return shiftedSlice[sliceIdxs.indexOf(idx)]
        }
        return val
      })
    },
    target: $shuffledMap,
  })

  const $secondsCount = createStore(0)
  const stopwatchFx = createEffect(async () => {
    await wait(1000)
  })

  sample({
    clock: stopwatchFx.doneData,
    source: {
      s: $secondsCount,
      completion: $isComplete,
    },
    filter: ({completion}) => !completion,
    fn: ({s}) => s + 1,
    target: [$secondsCount, stopwatchFx],
  })

  sample({
    clock: gameStarted,
    source: {
      difficulty: $selectedDifficulty,
    },
    target: init,
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
    clock: init.doneData,
    target: stopwatchFx,
  })

  $isGameStarted.reset(resetGame)
  $secondsCount.reset(resetGame)

  $correctMap.updates.watch((v) => console.log('correctMap: ', v))
  $shuffledMap.updates.watch((v) => console.log('shuffledMap: ', v))
  $secondsCount.watch((s) => console.log('wasted s: ', s))

  return {
    $isGameStarted,
    $selectedDifficulty,
    $difficulties,
    $correctMap,
    $shuffledMap,
    $sliceIdxs,
    $isComplete,
    $secondsCount,
    gameStarted,
    difficultyChanged,
    prev,
    next,
    shift,
    resetGame,
  }
}

export type GameModel = ReturnType<typeof createGameFactory>

export const gameModel = createGameFactory()
