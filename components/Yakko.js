/** @jsx jsx */
import { Howl } from "howler"
import { jsx, css } from "@emotion/core"
import { useRef, useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { binarySearch } from "../utils/search"
import { formatNumber } from "../utils/format"
import { Footer } from "./Footer"
import { KillList } from "./KillList"
import { Dot } from "./Pointer"

export const Yakko = ({ timings }) => {
  const videoRef = useRef()
  const renderRef = useRef()

  const [shouldExplode, setShouldExplode] = useState(false)

  const [dotIndex, setDotIndex] = useState(null)
  const [finished, setFinished] = useState(false)
  const [paused, setPaused] = useState(false)

  const handleReplay = (shouldExplode = false) => {
    setShouldExplode(shouldExplode)

    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current?.play()
    }
  }

  const handlePlayButton = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current?.play()
      } else {
        videoRef.current?.pause()
      }
    }
  }

  const animate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime
      const duration = videoRef.current.duration

      setPaused(videoRef.current.paused)

      const timing = binarySearch(
        timings ?? [],
        current,
        (a, b) => a.time < b.time
      )

      setDotIndex(timing)
      setFinished(current === duration)
    }

    renderRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    // preload explosion file
    new Howl({ src: "/explosion.mp3" })

    renderRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(renderRef.current)
  }, [renderRef, timings])

  const currentStep = timings?.[dotIndex]

  return (
    <>
      <div
        css={css`
          position: relative;
          overflow: hidden;
        `}
      >
        <video
          ref={videoRef}
          css={css`
            width: 100%;
            max-width(100vw - 20px);
          `}
          onClick={handlePlayButton}
          src="/yakko.mp4"
          autoPlay
        />

        <AnimatePresence>
          {currentStep && !finished && (
            <Dot
              key={currentStep?.name}
              coords={currentStep?.coords}
              number={currentStep?.payload?.totalCases}
              shouldExplode={shouldExplode}
            />
          )}
        </AnimatePresence>
        <div
          css={css`
            position: absolute;
            right: 0;
            top: 0;
            display: flex;
            flex-direction: column;
            font-size: 12px;
          `}
        >
          <AnimatePresence>
            {currentStep?.payload && !finished && (
              <KillList key={currentStep?.name} currentStep={currentStep} />
            )}
          </AnimatePresence>
        </div>
        {currentStep?.accumulative && (
          <div
            css={css`
              position: absolute;
              top: 2em;
              bottom: 2em;
              right: 2em;
              left: 2em;

              color: white;
              text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
                1px 1px 0 #000;
              pointer-events: none;

              display: flex;
              flex-direction: column;
              align-items: ${finished ? "center" : "flex-start"};
              justify-content: ${finished ? "center" : "flex-end"};

              text-align: center;
            `}
          >
            <h1
              css={css`
                margin: 0;
                font-size: 3em;
              `}
            >
              Total cases
            </h1>
            <h2
              css={css`
                margin: 0;
                font-size: 6em;
              `}
            >
              {formatNumber(currentStep?.accumulative)}
            </h2>
            {!shouldExplode && finished && (
              <p
                css={css`
                  pointer-events: all;
                  cursor: pointer;

                  &:hover {
                    text-decoration: underline;
                  }
                `}
                onClick={handleReplay}
              >
                Replay with boom boom
              </p>
            )}
          </div>
        )}
      </div>
      {paused && !finished && (
        <button
          css={css`
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);

            border: 0;
            font-size: 100%;
            background: transparent;
            color: white;
          `}
          onClick={() => videoRef.current?.play()}
        >
          <svg
            css={css`
              width: 72px;
              height: 72px;
            `}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z"
            />
          </svg>
        </button>
      )}

      {finished && <Footer />}
    </>
  )
}
