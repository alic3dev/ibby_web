'use client'

import React from 'react'

import styles from './Login.module.css'
import { SecondaryLogin } from './SecondaryLogin'

export function Login(): React.ReactNode {
  const [i1, setI1] = React.useState<string>('')
  const [i2, setI2] = React.useState<string>('')

  const [loginState, setLoginState] = React.useState<
    'waiting' | 'submitting' | 'success' | 'invalid' | 'error' | 'too-many'
  >('waiting')

  const onFormSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault()
      event.stopPropagation()

      if (!i1 || !i2 || loginState === 'submitting') {
        return
      }

      setLoginState('submitting')

      fetch('/api/login', { method: 'POST', body: JSON.stringify({ i1, i2 }) })
        .then((res): void => {
          if (res.status === 200) {
            setLoginState('success')

            setTimeout((): void => {
              window.location.reload()
            }, 210)
          } else if (res.status === 401) {
            setLoginState('invalid')
          } else if (res.status === 429) {
            setLoginState('too-many')
          } else {
            setLoginState('error')
          }
        })
        .catch((): void => {
          setLoginState('error')
        })
    },
    [i1, i2, loginState],
  )

  const loginMessage = React.useMemo((): React.ReactNode => {
    switch (loginState) {
      case 'error':
        return '}!{;--#//.><<='
      case 'invalid':
        return '\\|-_0((%^>'
      case 'submitting':
        return '.:|:.:|:.'
      case 'too-many':
        return ':.:.:.:.:'
      case 'success':
        return '\\?=-^(;)-._.-(*)^-=?/'
      default:
        return <>&nbsp;</>
    }
  }, [loginState])

  const inputsDisabled = React.useMemo<boolean>((): boolean => {
    return loginState === 'submitting' || loginState === 'success'
  }, [loginState])

  const [usingIO2, setUsingIO2] = React.useState<boolean>(false)

  const useIO2 = React.useCallback((): void => {
    setUsingIO2(true)
  }, [])

  if (usingIO2) {
    return <SecondaryLogin />
  }

  return (
    <div className={`${styles.login} surface`}>
      <h1>001010100100</h1>

      <p className={styles.message}>{loginMessage}</p>

      <form className={styles.form} onSubmit={onFormSubmit}>
        <input
          type="text"
          placeholder="01010001"
          value={i1}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
            setI1(event?.currentTarget.value)
          }
          required
          disabled={inputsDisabled}
        />
        <input
          type="password"
          placeholder="11011001"
          value={i2}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
            setI2(event.currentTarget.value)
          }
          required
          disabled={inputsDisabled}
        />

        <button type="submit" disabled={inputsDisabled}>
          10110110
        </button>

        <button type="button" onClick={useIO2}>
          10001010
        </button>
      </form>
    </div>
  )
}
