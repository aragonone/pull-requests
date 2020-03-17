import { h } from 'preact'
import htm from 'htm'

export { css } from 'emotion'

export const html = htm.bind(h)

export function flatten(arr) {
  return arr.reduce((acc, arr) => acc.concat(arr), [])
}
