/** @jsx jsx */
import { jsx, css } from "@emotion/core"
export const Footer = () => (
  <div
    css={css`
      pointer-events: all;
      position: absolute;
      bottom: 2em;
      left: 2em;
      right: 2em;
      text-align: center;
      color: white;
      text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
        1px 1px 0 #000;
    `}
  >
    <div>
      Sources:{" "}
      <a
        css={css`
          color: white;
          &:visited,
          &:hover,
          &:active {
            color: white;
          }
        `}
        href="https://www.worldometers.info/coronavirus/"
        target="_blank"
      >
        Worldometers.info
      </a>
      , Wikipedia (
      <a
        css={css`
          color: white;
          &:visited,
          &:hover,
          &:active {
            color: white;
          }
        `}
        href="https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_Puerto_Rico"
        target="_blank"
      >
        Puerto Rico
      </a>
      ,{" "}
      <a
        css={css`
          color: white;
          &:visited,
          &:hover,
          &:active {
            color: white;
          }
        `}
        href="https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_Guam"
        target="_blank"
      >
        Guam
      </a>
      ,{" "}
      <a
        css={css`
          color: white;
          &:visited,
          &:hover,
          &:active {
            color: white;
          }
        `}
        href="https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_Scotland"
        target="_blank"
      >
        Scotland
      </a>
      ,{" "}
      <a
        css={css`
          color: white;
          &:visited,
          &:hover,
          &:active {
            color: white;
          }
        `}
        href="https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_England"
        target="_blank"
      >
        England
      </a>
      )
    </div>
    <div>Stay safe ❤</div>
  </div>
)
