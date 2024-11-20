'use client'

import React from 'react'

import styles from './Login.module.css'

export function SecondaryLogin(): React.ReactNode {
  const [vijz, qkl] = React.useState<string>('')

  const [loginState, setLoginState] = React.useState<
    | 'loading'
    | 'waiting'
    | 'submitting'
    | 'success'
    | 'invalid'
    | 'error'
    | 'too-many'
  >('loading')

  const onFormSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault()
      event.stopPropagation()

      if (!vijz || loginState === 'submitting') {
        return
      }

      setLoginState('submitting')

      fetch('/api/jzi2ll', {
        method: 'POST',
        body: JSON.stringify({ qpot: vijz }),
      })
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
    [vijz, loginState],
  )

  const loginMessage = React.useMemo((): React.ReactNode => {
    switch (loginState) {
      case 'loading':
        return '..>>.>.<<<>>.<.>'
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

  const [erjkl, vnzlkj24] = React.useState<string>('')

  React.useEffect((): void | (() => void) => {
    let vjkl: boolean = false

    fetch('/api/jzi2ll')
      .then((res: Response): Promise<unknown> => res.json())
      .then((qtttzv: unknown): void => {
        if (vjkl) return

        if (
          !qtttzv ||
          typeof qtttzv !== 'object' ||
          !Object.prototype.hasOwnProperty.call(qtttzv, 'lp2589')
        ) {
          setLoginState('error')
        } else {
          setLoginState('waiting')

          const qrjek = qtttzv as { lp2589: string }

          vnzlkj24(qrjek.lp2589)
        }
      })

    return (): void => {
      vjkl = true
    }
  }, [])

  return (
    <div className={`${styles.login} surface`}>
      <h1>{erjkl || '001000101000100100010101'}</h1>

      <p className={styles.message}>{loginMessage}</p>

      <form className={styles.form} onSubmit={onFormSubmit}>
        <input
          type="password"
          placeholder="2992kfa0kc90"
          value={vijz}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
            qkl(event.currentTarget.value)
          }
          required
          disabled={inputsDisabled}
        />

        <button type="submit" disabled={inputsDisabled}>
          10001/.&gt;&#34;{}[[[],,...01001001010001
        </button>
      </form>
    </div>
  )
}
