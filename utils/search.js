export const binarySearch = (arr, value) => {
  let min = 0
  let max = arr.length - 1

  while (min < max) {
    let guess = Math.ceil((min + max) / 2)

    if (value >= arr[guess].time) {
      min = guess
    } else {
      max = guess - 1
    }
  }

  if (value >= arr[max]?.time) {
    return max
  }

  return -1
}
