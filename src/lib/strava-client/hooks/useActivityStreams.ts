import { useQuery } from '@tanstack/react-query';
import { StreamsService } from '../generated/services/StreamsService';

export function useActivityStreams(activityId: number) {
  return useQuery({
    queryKey: ['strava', 'activity-streams', activityId],
    queryFn: () => StreamsService.getActivityStreams({
      id: activityId,
      keys: ['latlng', 'distance', 'altitude', 'time'],
      keyByType: true,
    }),
    enabled: !!activityId,
  });
} 