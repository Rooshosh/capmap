import { getServerSession } from "next-auth"
import { LoggedInView, LoggedOutView } from "./client-components"

export default async function ProfilePage() {
    const session = await getServerSession()

    if (session) {
        return <LoggedInView session={session} />
    }
    return <LoggedOutView />
}