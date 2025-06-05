import { useQuery } from '@tanstack/react-query';
import { ActivitiesService } from '../generated/services/ActivitiesService';

export function useActivities(page = 1, perPage = 30) {
  return useQuery({
    queryKey: ['strava', 'activities', page, perPage],
    queryFn: () => ActivitiesService.getLoggedInAthleteActivities({
      page,
      perPage,
    }),
  });
} 