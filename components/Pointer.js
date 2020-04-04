/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Howl } from "howler"
import { formatNumber } from "../utils/format"

const spriteBomb = keyframes`
  from {
    background-position: 0px;
  }
  to {
    background-position: -2048px;
  }
`

export const Dot = ({ coords, number, shouldExplode }) => {
  useEffect(() => {
    if (shouldExplode) {
      new Howl({
        src: "/explosion.mp3",
        volume: Math.max(0, Math.log(number ?? 0) / 42),
      }).play()
    }
  }, [shouldExplode, coords, number])

  if (!coords) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          delay: 0.5,
        },
      }}
      css={css`
        position: absolute;
        text-align: center;

        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
          1px 1px 0 #000;
        font-weight: 700;
        color: #fff;
      `}
      style={{
        left: `${coords[0] * 100}%`,
        top: `${coords[1] * 100}%`,
      }}
    >
      <span
        css={css`
          display: block;
          font-size: 1.5em;
          position: relative;
          z-index: 1;
          transform: translate(-50%, -50%);
        `}
      >
        {number && formatNumber(number)}
      </span>
      {shouldExplode && (
        <div
          css={css`
            position: absolute;
            width: 128px;
            height: 128px;
            background: url("/explosion.png");
            animation: ${spriteBomb} 0.8s steps(16);
            animation-iteration-count: 1;
            animation-fill-mode: forwards;
            background-repeat: no-repeat;
            left: 0;
            top: 0;
            transform: translate(-50%, -50%) scale(${Math.log10(number ?? 10)});
          `}
        />
      )}
    </motion.div>
  )
}
