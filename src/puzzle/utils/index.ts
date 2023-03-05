import {mapAccum, repeat} from 'ramda'

export const shuffle = (arr: number[]): number[] => {
  const res = [...arr]
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[res[i], res[j]] = [res[j], res[i]]
  }
  return res
}

export const MAX_LENGTH = 8

const elMap: {[key: string]: number} = {
  empty: 0,
  blue: 1,
  red: 2,
  green: 3,
}

export const genMap = (difficulty: number): number[] => {
  const elKeys = Object.keys(elMap) // Get the keys of the element map
  const result = Array(MAX_LENGTH).fill(elMap.empty) // Initialize the result array with MAX_LENGTH zeros

  // Choose two random non-zero values and set them at random indices
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
export const fillDifficulties = () => mapAccum(plusOne, 1, repeat(2, MAX_LENGTH - 1))[1]

export const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
