import { createQueryKeys, inferQueryKeys } from '@lukemorales/query-key-factory';
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Axios, { AxiosError } from 'axios';
import { DateRange } from 'react-day-picker';

import { Meeting, MeetingList } from '../types/meetings.types';

type MeetingWithIdOnly = { id: string; name?: string; date?: string; notes?: string };

type MeetingMutateError = {
  title: string;
  errorKey: 'meetingexists';
};
export const useMeetingUpdate = (config: UseMutationOptions<unknown, AxiosError<MeetingMutateError>, MeetingWithIdOnly> = {}) => {
  const queryClient = useQueryClient();
  return useMutation((payload: MeetingWithIdOnly) => Axios.patch(`/meetings/${payload.id}`, payload), {
    ...config,
    onSuccess: (data, payload, ...rest) => {
      queryClient.cancelQueries(meetingsKeys.meetings._def);
      queryClient
        .getQueryCache()
        .findAll(meetingsKeys.meetings._def)
        .forEach(({ queryKey }) => {
          queryClient.setQueryData<MeetingList | undefined>(queryKey, (cachedData) => {
            if (!cachedData) return;
            return {
              ...cachedData,
              content: (cachedData.meetings || []).map((meeting: Meeting) =>
                meeting.id === payload.id ? { ...meeting, ...payload } : meeting
              ),
            };
          });
        });
      queryClient.invalidateQueries(meetingsKeys.meetings._def);
      queryClient.invalidateQueries(meetingsKeys.meeting({ id: payload.id }));
      if (config.onSuccess) {
        config.onSuccess(data, payload, ...rest);
      }
    },
  });
};

export const useMeetingCreate = (config: UseMutationOptions<unknown, AxiosError<MeetingMutateError>, MeetingWithIdOnly> = {}) => {
  const queryClient = useQueryClient();
  return useMutation((payload) => Axios.post('/meetings', payload), {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(meetingsKeys.meetings._def);
      config?.onSuccess?.(...args);
    },
  });
};

export const useMeetingRemove = (config: UseMutationOptions<void, unknown, MeetingWithIdOnly> = {}) => {
  const queryClient = useQueryClient();
  return useMutation((meeting: MeetingWithIdOnly): Promise<void> => Axios.delete(`/meetings/${meeting.id}`), {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(meetingsKeys.meetings._def);
      config?.onSuccess?.(...args);
    },
  });
};

const meetingsKeys = createQueryKeys('meetingsService', {
  meetings: (params: { limit?: number; after?: number }) => [params],
  meeting: (params: { id?: string }) => [params],
});

export const useMeeting = (
  id: string,
  config: UseQueryOptions<Meeting, AxiosError, MeetingList, MeetingsKeys['meeting']['queryKey']> = {}
) => {
  const result = useQuery(meetingsKeys.meeting({ id }).queryKey, (): Promise<Meeting> => Axios.get(`/meetings/${id}`), {
    enabled: !!id,
    ...config,
  });

  return { ...result.data, ...result };
};

type MeetingsKeys = inferQueryKeys<typeof meetingsKeys>;

export const useMeetingList = (
  { page = 0, size = 10, limit = 20 } = {},
  config: UseQueryOptions<MeetingList, AxiosError, MeetingList, MeetingsKeys['meetings']['queryKey']> = {}
) => {
  const result = useQuery(
    meetingsKeys.meetings({ limit: 20, after: 0 }).queryKey,
    (): Promise<MeetingList> => Axios.get(`/meetings?limit=${limit}&after=${page}`),
    { keepPreviousData: true, ...config }
  );

  const { meetings, contacts } = result.data || {};
  const totalItems = meetings?.length;
  const totalPages = Math.ceil((totalItems ?? 0) / size);
  const hasMore = page + 1 < totalPages;
  const isLoadingPage = result.isFetching;

  return {
    meetings,
    contacts,
    totalItems,
    hasMore,
    totalPages,
    isLoadingPage,
    ...result,
  };
};

export const sortMeetingList = (meetings: Meeting[], sort: string) => {
  if (sort === 'NEWEST') {
    return meetings.sort((a, b) => {
      return new Date(b.properties.hs_meeting_start_time).getTime() - new Date(a.properties.hs_meeting_start_time).getTime();
    });
  } else if (sort === 'OLDEST') {
    return meetings.sort((a, b) => {
      return new Date(a.properties.hs_meeting_start_time).getTime() - new Date(b.properties.hs_meeting_start_time).getTime();
    });
  } else {
    return meetings;
  }
};

export const filterMeetingList = (meetings: Meeting[], filter: string) => {
  if (filter === 'ALL') {
    return meetings;
  } else {
    return meetings.filter((meeting) => {
      return meeting.properties.hs_meeting_outcome === filter;
    });
  }
};

export const rangeMeetingList = (meetings: Meeting[], range: DateRange | undefined) => {
  if (!range || !range.from || !range.to) {
    return meetings;
  } else {
    return meetings.filter((meeting) => {
      return (
        range.from &&
        new Date(meeting.properties.hs_meeting_start_time).getTime() >= range.from.getTime() &&
        range.to &&
        new Date(meeting.properties.hs_meeting_start_time).getTime() <= range.to.getTime()
      );
    });
  }
};
