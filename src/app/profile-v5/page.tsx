import { auth } from "@/auth"
import { SignIn } from "@/components/signin-button"
import { SignOut } from "@/components/signout-button"
import UserAvatar from "@/components/UserAvatar"

export default async function Page() {
    const session = await auth()

    if (!session) return <>
        <div>No current session</div>
        <br />
        <SignIn />
    </>

    return <>
        <div>Found session</div>
        <UserAvatar />
        <div>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>

        <br />
        <SignOut />
    </>
}