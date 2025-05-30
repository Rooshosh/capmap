"use client";
import { useState } from "react";

type MetaAthlete = {
  id: number;
  resource_state: number;
};

type PolylineMap = {
  id: string;
  summary_polyline: string;
  resource_state: number;
};

type StravaActivitySummary = {
  id: number;
  external_id?: string;
  upload_id?: number;
  athlete: MetaAthlete;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  elev_high?: number;
  elev_low?: number;
  type: string; // Deprecated, but present
  sport_type: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  start_latlng?: number[];
  end_latlng?: number[];
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  total_photo_count: number;
  map: PolylineMap;
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  flagged: boolean;
  workout_type?: number | null;
  upload_id_str?: string;
  average_speed: number;
  max_speed: number;
  has_kudoed: boolean;
  hide_from_home?: boolean;
  gear_id?: string | null;
  kilojoules?: number;
  average_watts?: number;
  device_watts?: boolean;
  max_watts?: number;
  weighted_average_watts?: number;
  resource_state?: number;
  utc_offset?: number;
  location_city?: string | null;
  location_state?: string | null;
  location_country?: string | null;
  visibility?: string;
  has_heartrate?: boolean;
  average_heartrate?: number;
  max_heartrate?: number;
  heartrate_opt_out?: boolean;
  display_hide_heartrate_option?: boolean;
  from_accepted_tag?: boolean;
  pr_count?: number;
  suffer_score?: number;
};

export function FetchActivities() {
  const [activities, setActivities] = useState<StravaActivitySummary[] | null>(null);
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
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred");
      }
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