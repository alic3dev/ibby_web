'use client'

import React from 'react'

import styles from './Background.module.css'

const possibleChars: string[] = ['0', '1', 'A', 'I']

export function Background(): React.ReactNode {
  const backgroundRef = React.useRef<HTMLDivElement>(null)
  const iterationsRef = React.useRef<number>(0)
  const [content, setContent] = React.useState<string[]>([])

  React.useEffect((): (() => void) | void => {
    setContent((prevContent): string[] => {
      if (prevContent.length) return prevContent

      const initialContent: string[] = []
      const initialCols: number = Math.random() * 5 + 3

      for (let i: number = 0; i < initialCols; i++) {
        initialContent.push('')

        const randomValCount: number = Math.random() * 3000 + 4200

        for (let x: number = 0; x < randomValCount; x++) {
          initialContent[i] +=
            possibleChars[Math.floor(Math.random() * possibleChars.length)]
        }
      }

      return initialContent
    })

    let animationFrameHandle: number = 0
    let prevTime: number = -1

    const animationFrame: (time: number) => void = (time: number = 0): void => {
      const delta: number = time - prevTime

      if (delta < 10 && prevTime !== -1) {
        animationFrameHandle = window.requestAnimationFrame(animationFrame)
        return
      }

      setContent((prevContent: string[]): string[] => {
        const newContent: string[] =
          prevContent.length < 20 && (iterationsRef.current + 1) % 72 === 0
            ? [...prevContent, '']
            : [...prevContent]
        const numberOfIndexes: number = Math.floor(
          Math.random() * (newContent.length - 1) + 1,
        )

        for (let i: number = 0; i < numberOfIndexes; i++) {
          const randomIndex: number = Math.floor(
            Math.random() * newContent.length,
          )

          newContent[randomIndex] = `${
            possibleChars[Math.floor(Math.random() * possibleChars.length)]
          }${newContent[randomIndex]}`.substring(0, 7200)
        }

        return newContent
      })

      prevTime = time

      if (backgroundRef.current) {
        // backgroundRef.current.style.letterSpacing = `${
        //   50 - 50 * (time / 100000)
        // }vw`
      }

      iterationsRef.current++
      animationFrameHandle = window.requestAnimationFrame(animationFrame)
    }
    animationFrame(0)

    return (): void => {
      window.cancelAnimationFrame(animationFrameHandle)
    }
  }, [])

  return (
    <div ref={backgroundRef} className={styles.background}>
      {content.map(
        (col: string, index: number): React.ReactNode => (
          <div key={`${col}:${index}`} suppressHydrationWarning>
            {col}
          </div>
        ),
      )}
    </div>
  )
}
