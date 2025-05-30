import { auth } from "@/auth"
import { SignIn } from "@/components/signin-button"
import { SignOut } from "@/components/signout-button"
import UserAvatar from "@/components/UserAvatar"
import { FetchActivities } from "@/components/FetchActivities"
import Link from "next/link"

export default async function ProfilePage() {
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
        <FetchActivities />
        <br />
        <SignOut />
        <Link
            href="/"
            className="fixed bottom-6 right-6 z-50 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors border border-gray-200"
            aria-label="Go to home"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4.5 10.5V21h15V10.5" />
            </svg>
        </Link>
    </>
}