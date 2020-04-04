/** @jsx jsx */
import { jsx, css } from "@emotion/core"
import { motion } from "framer-motion"
import { formatNumber } from "../utils/format"

export const KillList = ({ currentStep }) => {
  if (!currentStep) return null
  const states = (
    currentStep?.payload?.keyed ?? [
      {
        name: currentStep?.search ?? currentStep?.name,
        value: currentStep?.payload,
      },
    ]
  ).filter(({ value }) => (value?.totalCases ?? 0) > 0)

  return (
    <>
      {states.map(({ name, value }) => (
        <motion.div
          positionTransition
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              delay: 2,
            },
          }}
          css={css`
            margin: 10px 10px 0;
          `}
        >
          <div
            css={css`
              background: rgba(255, 255, 255, 0.7);
              border-radius: 9999px;
              padding: 5px 12px 5px;
              text-transform: uppercase;
              float: right;
              font-weight: 700;

              display: flex;
              align-items: center;
            `}
          >
            <div
              css={css`
                color: #f44336;
              `}
            >
              COVID-19
            </div>
            <svg
              css={css`
                width: 24px;
                height: 24px;
                margin: 0 12px;
              `}
              viewBox="0 0 24 24"
            >
              <path fill="black" d="M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z" />
            </svg>
            <div
              css={css`
                margin-right: 30px;
                color: #2196f3;
              `}
            >
              {name}
            </div>
            <div
              css={css`
                text-align: right;
              `}
            >
              {formatNumber(value?.totalCases ?? 0)}
            </div>
          </div>
        </motion.div>
      ))}
    </>
  )
}
