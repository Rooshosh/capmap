"use client"

import { Session } from "next-auth"
import { signIn, signOut } from "next-auth/react"

export function LoggedInView({ session }: { session: Session }) {
    return (
        <>
          Signed in as {session.user?.name || "(no name)"} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )
}

export function LoggedOutView() {
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}