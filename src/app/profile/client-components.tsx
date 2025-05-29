"use client"

import { Session } from "next-auth"
import { signIn, signOut } from "next-auth/react"
import Image from "next/image";

export function LoggedInView({ session }: { session: Session }) {
    return (
        <>
          Signed in as {session.user?.name || "(no name)"} <br />

          <pre>{JSON.stringify(session, null, 2)}</pre>

            <br/>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )
}

export function LoggedOutView() {
    return (
        <>
            <button onClick={() => signIn("strava")}>
                <Image
                    src="/btn_strava_connect_with_orange.svg"
                    alt="Connect with Strava"
                    width={200}
                    height={40}
                />
            </button>
        </>
    )
}