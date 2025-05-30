"use client";
import { useState } from "react";

export function FetchActivities() {
  const [activities, setActivities] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFetch() {
    setLoading(true);
    setError(null);
    setActivities(null);
    try {
      const res = await fetch("/api/strava/activities");
      if (!res.ok) throw new Error("Failed to fetch activities");
      const data = await res.json();
      setActivities(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleFetch} disabled={loading} style={{ marginTop: 16 }}>
        {loading ? "Loading..." : "Fetch Strava Activities"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {activities && (
        <pre style={{ maxWidth: 600, overflowX: "auto" }}>
          {JSON.stringify(activities, null, 2)}
        </pre>
      )}
    </div>
  );
} 