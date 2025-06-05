"use client";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import type { ActivityPreviewType } from "@/server/routers/_app";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "@/server/routers/_app";

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

// ActivityPreview component
export function ActivityPreview({ activity, imported, hasTrack, onImport, onTrackImported }: { 
  activity: ActivityPreviewType; 
  imported: boolean; 
  hasTrack: boolean; 
  onImport?: () => Promise<void>; 
  onTrackImported?: () => Promise<void> 
}) {
  const [error, setError] = useState<string | null>(null);

  const importMutation = trpc.activities.import.useMutation({
    onSuccess: async () => {
      if (onImport) await onImport();
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      setError(error.message);
    },
  });

  const fetchTrackMutation = trpc.activities.fetchTrack.useMutation({
    onSuccess: async () => {
      if (onTrackImported) await onTrackImported();
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      setError(error.message);
    },
  });

  const title = activity.name;
  const date = activity.start_date || activity.start_date_local;
  const distance = activity.distance;
  const time = activity.moving_time;

  async function handleImport() {
    setError(null);
    importMutation.mutate({ activityId: activity.id });
  }

  async function handleFetchTrack() {
    setError(null);
    fetchTrackMutation.mutate({ activityId: activity.id });
  }

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        border: '1px solid #e0e0e0',
        background: '#fff',
      }}
    >
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>{title}</h3>
      <p style={{ margin: '8px 0', color: '#666' }}>
        {new Date(date).toLocaleDateString()}
      </p>
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        <div>
          <div style={{ fontSize: 14, color: '#666' }}>Distance</div>
          <div style={{ fontWeight: 500 }}>
            {(distance / 1000).toFixed(2)} km
          </div>
        </div>
        <div>
          <div style={{ fontSize: 14, color: '#666' }}>Time</div>
          <div style={{ fontWeight: 500 }}>
            {Math.floor(time / 60)}m {time % 60}s
          </div>
        </div>
      </div>
      {!imported && (
        <button
          onClick={handleImport}
          disabled={importMutation.isPending}
          style={{
            marginTop: 12,
            padding: '8px 16px',
            borderRadius: 6,
            border: 'none',
            background: importMutation.isPending ? '#bdbdbd' : '#1976d2',
            color: '#fff',
            fontWeight: 500,
            cursor: importMutation.isPending ? 'not-allowed' : 'pointer',
            fontSize: 15,
            transition: 'background 0.2s',
          }}
        >
          {importMutation.isPending ? 'Importing...' : 'Import Activity'}
        </button>
      )}
      {imported && !hasTrack && (
        <button
          onClick={handleFetchTrack}
          disabled={fetchTrackMutation.isPending || distance <= 0}
          style={{
            marginTop: 12,
            padding: '8px 16px',
            borderRadius: 6,
            border: 'none',
            background: fetchTrackMutation.isPending || distance <= 0 ? '#bdbdbd' : '#388e3c',
            color: '#fff',
            fontWeight: 500,
            cursor: fetchTrackMutation.isPending || distance <= 0 ? 'not-allowed' : 'pointer',
            fontSize: 15,
            transition: 'background 0.2s',
          }}
        >
          {distance <= 0
            ? 'No GPS Track Available'
            : fetchTrackMutation.isPending
            ? 'Fetching GPS Track...'
            : 'Fetch Activity GPS Track'}
        </button>
      )}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}

export function FetchActivities() {
  const [page, setPage] = useState(1);
  const perPage = 30;

  const { data: activities, isLoading: isLoadingActivities } = trpc.activities.list.useQuery(
    { page, perPage },
    { placeholderData: (previousData: ActivityPreviewType[] | undefined) => previousData }
  );

  const { data: importedIds } = trpc.activities.getImportedIds.useQuery();
  const { data: activityIdsWithTrack } = trpc.activities.getIdsWithTrack.useQuery();

  return (
    <div>
      <button 
        onClick={() => setPage(1)} 
        disabled={isLoadingActivities} 
        style={{ marginTop: 16 }}
      >
        {isLoadingActivities && page === 1 ? "Loading..." : "Fetch Strava Activities"}
      </button>
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
            {activities.map((activity: ActivityPreviewType) => (
              <ActivityPreview
                key={activity.id}
                activity={activity}
                imported={importedIds?.includes(activity.id.toString()) ?? false}
                hasTrack={activityIdsWithTrack?.includes(activity.id.toString()) ?? false}
                onImport={async () => {
                  // The queries will automatically refetch due to the mutation's onSuccess
                }}
                onTrackImported={async () => {
                  // The queries will automatically refetch due to the mutation's onSuccess
                }}
              />
            ))}
          </div>
          {/* Load More button */}
          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={isLoadingActivities || (activities.length < perPage)}
              style={{
                padding: '10px 24px',
                borderRadius: 8,
                border: 'none',
                background: '#1976d2',
                color: '#fff',
                fontWeight: 500,
                cursor: isLoadingActivities || (activities.length < perPage) ? 'not-allowed' : 'pointer',
                fontSize: 16,
                marginTop: 16,
                opacity: isLoadingActivities || (activities.length < perPage) ? 0.6 : 1,
              }}
            >
              {isLoadingActivities && page > 1 ? 'Loading...' : (activities.length < perPage) ? 'No More Activities' : 'Load More'}
            </button>
          </div>
        </>
      )}
    </div>
  );
} 