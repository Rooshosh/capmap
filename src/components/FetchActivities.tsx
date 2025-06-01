"use client";
import { useState, useRef } from "react";

type MetaAthlete = {
  id: number;
  resource_state: number;
};

type PolylineMap = {
  id: string;
  summary_polyline: string;
  resource_state: number;
};

type SummaryActivity = {
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

// Define a type for either summary or detailed activity
export type ActivityPreviewType = SummaryActivity & { imported?: boolean };

// ActivityPreview component
export function ActivityPreview({ activity, imported, hasTrack, onImport, onTrackImported }: { activity: ActivityPreviewType; imported: boolean; hasTrack: boolean; onImport?: () => Promise<void>; onTrackImported?: () => Promise<void> }) {
  const [importing, setImporting] = useState(false);
  const [fetchingTrack, setFetchingTrack] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = activity.name;
  const date = activity.start_date || activity.start_date_local;
  const distance = activity.distance;
  const time = activity.moving_time;

  async function handleImport() {
    setImporting(true);
    setError(null);
    try {
      const res = await fetch("/api/strava/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId: activity.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to import activity");
      }
      if (onImport) await onImport();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setImporting(false);
    }
  }

  async function handleFetchTrack() {
    setFetchingTrack(true);
    setError(null);
    try {
      const res = await fetch("/api/strava/activities/gps-track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId: activity.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch GPS track");
      }
      const data = await res.json();
      // Print the result in the browser console
      console.log("GPS Track for activity", activity.id, data);
      if (onTrackImported) await onTrackImported();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setFetchingTrack(false);
    }
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        padding: 20,
        margin: 8,
        minWidth: 220,
        maxWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{title}</div>
      <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>Date: {date}</div>
      <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>Time: {time} sec</div>
      <div style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>Distance: {distance} m</div>
      <div style={{ marginTop: 8, fontWeight: 500, color: imported ? '#388e3c' : '#bdbdbd' }}>
        {imported ? 'Imported' : 'Not Imported'}
      </div>
      {/* Import button for not imported */}
      {!imported && (
        <button
          onClick={handleImport}
          disabled={importing}
          style={{
            marginTop: 12,
            padding: '8px 16px',
            borderRadius: 6,
            border: 'none',
            background: importing ? '#bdbdbd' : '#1976d2',
            color: '#fff',
            fontWeight: 500,
            cursor: importing ? 'not-allowed' : 'pointer',
            fontSize: 15,
            transition: 'background 0.2s',
          }}
        >
          {importing ? 'Importing...' : 'Import'}
        </button>
      )}
      {/* GPS Track status for imported activities */}
      {imported && hasTrack && (
        <div style={{ marginTop: 12, color: '#388e3c', fontWeight: 500 }}>
          GPS Track Imported
        </div>
      )}
      {imported && !hasTrack && (
        <button
          onClick={handleFetchTrack}
          disabled={fetchingTrack || distance <= 0}
          style={{
            marginTop: 12,
            padding: '8px 16px',
            borderRadius: 6,
            border: 'none',
            background: fetchingTrack || distance <= 0 ? '#bdbdbd' : '#388e3c',
            color: '#fff',
            fontWeight: 500,
            cursor: fetchingTrack || distance <= 0 ? 'not-allowed' : 'pointer',
            fontSize: 15,
            transition: 'background 0.2s',
          }}
        >
          {distance <= 0
            ? 'No GPS Track Available'
            : fetchingTrack
            ? 'Fetching GPS Track...'
            : 'Fetch Activity GPS Track'}
        </button>
      )}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}

export function FetchActivities() {
  const [activities, setActivities] = useState<SummaryActivity[] | null>(null);
  const [importedIds, setImportedIds] = useState<string[]>([]);
  const [activityIdsWithTrack, setActivityIdsWithTrack] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 30; // You can adjust this as needed
  const [lastFetchCount, setLastFetchCount] = useState<number | null>(null);
  const nextPageRef = useRef(1);

  async function handleFetch(fetchPage = 1, append = false) {
    setLoading(true);
    setError(null);
    if (!append) {
      setActivities(null);
      setImportedIds([]);
      setActivityIdsWithTrack([]);
      setPage(1);
      nextPageRef.current = 1;
    }
    try {
      // Debug: Log the URL being fetched
      const url = `/api/strava/activities?page=${fetchPage}&per_page=${perPage}`;
      console.log('Fetching:', url);
      // Fetch summary activities with pagination
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch activities");
      const data = await res.json();
      // Debug: Log the response data
      console.log('Fetched activities (page', fetchPage, '):', data);
      setLastFetchCount(Array.isArray(data) ? data.length : 0);
      if (append && activities) {
        // Filter out activities that are already present by id
        const existingIds = new Set(activities.map((a) => a.id));
        const newUnique = Array.isArray(data) ? data.filter((a: SummaryActivity) => !existingIds.has(a.id)) : [];
        setActivities(prev => {
          const updated = [...(prev || []), ...newUnique];
          // Debug: Log the updated activities list
          console.log('Updated activities list:', updated.map(a => a.id));
          return updated;
        });
      } else {
        setActivities(data);
        // Debug: Log the new activities list
        console.log('Set activities list:', Array.isArray(data) ? data.map((a: SummaryActivity) => a.id) : data);
      }
      // Fetch imported activity IDs
      await fetchImportedIds();
      // Fetch activity IDs with GPS track
      await fetchActivityIdsWithTrack();
      if (append) {
        setPage((prev) => prev + 1);
        nextPageRef.current = fetchPage + 1;
      } else {
        setPage(1);
        nextPageRef.current = 2;
      }
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

  async function fetchImportedIds() {
    const importedRes = await fetch("/api/strava/imported-activity-ids");
    if (importedRes.ok) {
      const ids = await importedRes.json();
      setImportedIds(ids.map((id: string | number) => id.toString()));
    }
  }

  async function fetchActivityIdsWithTrack() {
    const res = await fetch("/api/strava/activities-with-track");
    if (res.ok) {
      const ids = await res.json();
      setActivityIdsWithTrack(ids.map((id: string | number) => id.toString()));
    }
  }

  return (
    <div>
      <button onClick={() => handleFetch(1, false)} disabled={loading} style={{ marginTop: 16 }}>
        {loading && page === 1 ? "Loading..." : "Fetch Strava Activities"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {activities && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
              marginTop: 24,
            }}
          >
            {activities.map((activity) => (
              <ActivityPreview
                key={activity.id}
                activity={activity}
                imported={importedIds.includes(activity.id.toString())}
                hasTrack={activityIdsWithTrack.includes(activity.id.toString())}
                onImport={async () => {
                  await fetchImportedIds();
                  await fetchActivityIdsWithTrack();
                }}
                onTrackImported={fetchActivityIdsWithTrack}
              />
            ))}
          </div>
          {/* Load More button */}
          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <button
              onClick={() => handleFetch(nextPageRef.current, true)}
              disabled={loading || (lastFetchCount !== null && lastFetchCount < perPage)}
              style={{
                padding: '10px 24px',
                borderRadius: 8,
                border: 'none',
                background: '#1976d2',
                color: '#fff',
                fontWeight: 500,
                cursor: loading || (lastFetchCount !== null && lastFetchCount < perPage) ? 'not-allowed' : 'pointer',
                fontSize: 16,
                marginTop: 16,
                opacity: loading || (lastFetchCount !== null && lastFetchCount < perPage) ? 0.6 : 1,
              }}
            >
              {loading && page > 1 ? 'Loading...' : (lastFetchCount !== null && lastFetchCount < perPage) ? 'No More Activities' : 'Load More'}
            </button>
          </div>
        </>
      )}
    </div>
  );
} 