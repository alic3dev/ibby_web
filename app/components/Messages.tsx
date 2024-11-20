'use client'

import React from 'react'

import styles from './Messages.module.css'

interface MessageData {
  id: number
  candidate_id: string
  chat_id: string
  create_time: string
  raw_content: string
}

export function Messages(): React.ReactNode {
  const [message, setMessage] = React.useState<MessageData | undefined>()

  const getMessage = React.useCallback((): void => {
    fetch('/api/messages', { method: 'POST' })
      .then((res) => res.json())
      .then((body) => {
        if (body && body.data) {
          setMessage(body.data)
        }
      })
  }, [])

  return (
    <div className={`${styles.messages} surface`}>
      <button className={styles.get} onClick={getMessage}>
        Get Message
      </button>

      <table className={styles.meta}>
        <tbody>
          <tr>
            <td>Candidate ID:</td>
            <td>{message?.candidate_id}</td>
          </tr>
          <tr>
            <td>Chat ID:</td>
            <td>{message?.chat_id}</td>
          </tr>
          <tr>
            <td>Create Time:</td>
            <td>{message?.create_time}</td>
          </tr>
          <tr>
            <td>ID:</td>
            <td>{message?.id}</td>
          </tr>
        </tbody>
      </table>

      {message?.raw_content && (
        <p className={styles.message}>{message?.raw_content}</p>
      )}
    </div>
  )
}
