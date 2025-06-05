import { auth } from '@/auth';
import { getValidStravaAccessToken } from '@/strava';

export async function fetchStravaActivity(skip: number, take: number, activityId?: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  const accessToken = await getValidStravaAccessToken(session.user.id);
  const url = activityId
    ? `https://www.strava.com/api/v3/activities/${activityId}`
    : `https://www.strava.com/api/v3/athlete/activities?page=${Math.floor(skip / take) + 1}&per_page=${take}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch activities');
  }

  const data = await res.json();
  return activityId ? [data] : data;
}

export async function fetchStravaTrack(activityId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  const accessToken = await getValidStravaAccessToken(session.user.id);
  const url = `https://www.strava.com/api/v3/activities/${activityId}/streams?keys=latlng&key_by_type=true`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch GPS track');
  }

  return res.json();
} 