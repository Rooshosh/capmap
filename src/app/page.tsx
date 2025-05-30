"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/FullScreenMap"), { ssr: false });

export default function Home() {
  return <Map />;
}