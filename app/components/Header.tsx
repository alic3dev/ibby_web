'use client'

import React from 'react'

import * as constants from '@/app/constants'

import styles from './Header.module.css'

export function Header({
  isLoggedIn = false,
}: {
  isLoggedIn: boolean
}): React.ReactNode {
  const login = React.useCallback((): void => {
    window.location.href = window.location.origin
  }, [])

  const logout = React.useCallback((): void => {
    document.cookie = `${constants.cookies.iaAuthKey}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;Max-Age=0`

    window.location.reload()
  }, [])

  return (
    <nav className={styles.header}>
      {isLoggedIn ? (
        <button className={styles.item} onClick={logout}>
          ⤦
        </button>
      ) : (
        <button className={styles.item} onClick={login}>
          🅯
        </button>
      )}
    </nav>
  )
}
