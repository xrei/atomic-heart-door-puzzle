import {append, mapAccum, repeat, unfold} from 'ramda'

/** global, describes max elements
 *
 *  FIXME: actually many functions relies on it, fix?
 */
export const MAX_LENGTH = 8

export const shuffle = (arr: number[]): number[] => {
  const res = [...arr]
  // Fisher-Yates shuffle algo
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[res[i], res[j]] = [res[j], res[i]]
  }
  return res
}

const elMap: {[key: string]: number} = {
  empty: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
}

/** generate game map based on difficulty */
export const genMap = (difficulty: number): number[] => {
  const elKeys = Object.keys(elMap) // Get the keys of the element map
  const result = Array(MAX_LENGTH).fill(elMap.empty) // Initialize the result array with MAX_LENGTH zeros

  // Choose random non-zero values and set them at random indices
  const indices = new Set<number>()
  while (indices.size < difficulty) {
    const randomIndex = Math.floor(Math.random() * MAX_LENGTH)
    if (result[randomIndex] === elMap.empty) {
      const randomValue = elKeys[Math.floor(Math.random() * (elKeys.length - 1)) + 1] // Choose a random non-zero element from the element map
      result[randomIndex] = elMap[randomValue] // Set the chosen index to the chosen value
      indices.add(randomIndex)
    }
  }

  return result
}

const plusOne = (prev: number, _: number) => [prev + 1, prev + 1] as [number, number]
// fill array from 2 to MAX_LENGTH
export const fillDifficulties = () => mapAccum(plusOne, 1, repeat(2, MAX_LENGTH - 1))[1]

export const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

export const getSliceIdxs = (start: number, end: number) => {
  /** pure magic ok */
  const sliceIdxs = unfold((idx) => (idx === end ? false : [idx, (idx + 1) % MAX_LENGTH]), start)
  return append(end, sliceIdxs)
}

/** probably stupid way to compare */
export const compareArrays = (xs: number[], ys: number[]) => xs.toString() === ys.toString()
