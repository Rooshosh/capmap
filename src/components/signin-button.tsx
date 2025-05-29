import { signIn } from "@/auth"
 
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("strava")
      }}
    >
      <button type="submit">Sign in With Strava</button>
    </form>
  )
}