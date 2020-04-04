/** @jsx jsx */
import { jsx, css } from "@emotion/core"
import Head from "next/head"
import { Yakko } from "../components/Yakko"
import useSWR from "swr"
import { fetcher } from "../utils/fetcher"

const apiFetch = fetcher("")

const Page = ({}) => {
  const { data, isValidating } = useSWR("/api/covid", {
    fetcher: apiFetch,
  })

  return (
    <>
      <Head>
        <title>Yakkovid</title>
        <meta property="og:title" content="Yakkovid" />
        <meta property="og:description" content="Live map with Yakko Warner" />
        <meta property="og:image" content="/og.png" />
        <meta property="og:url" content="/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="" />

        <link rel="preload" href="/explosion.mp3" as="audio" />
        <link rel="preload" href="/explosion.png" as="image" />
      </Head>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: -system-ui, sans-serif;
          overflow: hidden;
          background: #000;
        }
      `}</style>
      <div
        css={css`
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        `}
      >
        {!data?.json && isValidating && (
          <p
            css={css`
              color: white;
            `}
          >
            Loading
          </p>
        )}
        {(data?.json || !isValidating) && <Yakko timings={data?.json} />}
      </div>
    </>
  )
}

export default Page
