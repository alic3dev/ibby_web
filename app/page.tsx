import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

import { cookies } from 'next/headers'

import { Login } from './components/Login'
import { Messages } from './components/Messages'
import { Header } from './components/Header'
import { Background } from './components/decorative/Background'

export default async function Home(): Promise<React.ReactNode> {
  const iaAuthKey: RequestCookie | undefined = (await cookies()).get('IA-Auth-Key')
  const isLoggedIn: boolean = !!iaAuthKey?.value

  return (
    <main>
      <Background />

      <Header isLoggedIn={isLoggedIn} />

      {isLoggedIn ? <Messages /> : <Login />}
    </main>
  )
}
