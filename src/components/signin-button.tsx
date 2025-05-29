import Image from "next/image"
import { signIn } from "@/auth"
 
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("strava")
      }}
    >
      <button type="submit">
        <Image src="/btn_strava_connect_with_orange.svg" alt="Connect with Strava" width={200} height={20} />
      </button>
    </form>
  )
}