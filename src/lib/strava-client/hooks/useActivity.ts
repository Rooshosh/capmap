import { useQuery } from '@tanstack/react-query';
import { ActivitiesService } from '../generated/services/ActivitiesService';

export function useActivity(activityId: number) {
  return useQuery({
    queryKey: ['strava', 'activity', activityId],
    queryFn: () => ActivitiesService.getActivityById({
      id: activityId,
    }),
    enabled: !!activityId,
  });
} 