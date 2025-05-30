import Link from "next/link";

import FullScreenMap from "@/components/FullScreenMap";

export default function Home() {
  return (
    <>
      <FullScreenMap />
      <Link
        href="/profile"
        className="fixed bottom-6 right-6 z-50 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors border border-gray-200"
        aria-label="Go to profile"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
        </svg>
      </Link>
    </>
  );
}