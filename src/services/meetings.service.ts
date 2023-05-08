import { createQueryKeys, inferQueryKeys } from '@lukemorales/query-key-factory';
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Axios, { AxiosError } from 'axios';
import { DateRange } from 'react-day-picker';

// import { useToastError, useToastSuccess } from '../../components/Toast';
import { Meeting, MeetingList } from '../types/meetings.types';

type MeetingWithIdOnly = { id: string };

// type UserMutateError = {
// title: string;
// errorKey: "userexists" | "emailexists";
// };

const MEETINGS_API_BASE_URL = 'https://us-central1-epicbrief-c47c8.cloudfunctions.net/meetings';
// const MEETINGS_API_BASE_URL = 'http://127.0.0.1:5001/epicbrief-c47c8/us-central1/meetings';

export const useMeetingRemove = (config: UseMutationOptions<void, unknown, MeetingWithIdOnly> = {}) => {
  const queryClient = useQueryClient();
  return useMutation((meeting: MeetingWithIdOnly): Promise<void> => Axios.delete(`${MEETINGS_API_BASE_URL}/${meeting.id}`), {
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries(meetingsKeys.meetings._def);
      config?.onSuccess?.(...args);
    },
  });
};

const meetingsKeys = createQueryKeys('usersService', {
  meetings: (params: { limit?: number; after?: number }) => [params],
});

type MeetingsKeys = inferQueryKeys<typeof meetingsKeys>;

export const useMeetingList = (
  { page = 0, size = 10, limit = 20 } = {},
  config: UseQueryOptions<MeetingList, AxiosError, MeetingList, MeetingsKeys['meetings']['queryKey']> = {}
) => {
  const result = useQuery(
    meetingsKeys.meetings({ limit: 20, after: 0 }).queryKey,
    (): Promise<MeetingList> => Axios.get(`${MEETINGS_API_BASE_URL}?limit=${limit}&after=${page}`),
    { keepPreviousData: true, ...config }
  );
  console.log('result', result.data);

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

// export const useUser = (
// userLogin?: string,
// config: UseQueryOptions<
// User,
// AxiosError,
// User,
// UsersKeys["user"]["queryKey"]
// > = {}
// ) => {
// const result = useQuery(
// usersKeys.user({ login: userLogin }).queryKey,
// (): Promise<User> => Axios.get(`${USERS_BASE_URL}/${userLogin}`),
// {
// enabled: !!userLogin,
// ...config,
// }
// );

// return { user: result.data, ...result };
// };

// export const useUserUpdate = (
// config: UseMutationOptions<User, AxiosError<UserMutateError>, User> = {}
// ) => {
// const queryClient = useQueryClient();
// return useMutation((payload) => Axios.put(USERS_BASE_URL, payload), {
// ...config,
// onSuccess: (data, payload, ...rest) => {
// queryClient.cancelQueries(usersKeys.users._def);
// queryClient
// .getQueryCache()
// .findAll(usersKeys.users._def)
// .forEach(({ queryKey }) => {
// queryClient.setQueryData<UserList | undefined>(
// queryKey,
// (cachedData) => {
// if (!cachedData) return;
// return {
// ...cachedData,
// content: (cachedData.content || []).map((user) =>
// user.id === data.id ? data : user
// ),
// };
// }
// );
// });
// queryClient.invalidateQueries(usersKeys.users._def);
// queryClient.invalidateQueries(usersKeys.user({ login: payload.login }));
// if (config.onSuccess) {
// config.onSuccess(data, payload, ...rest);
// }
// },
// });
// };

// export const useUserCreate = (
// config: UseMutationOptions<
// User,
// AxiosError<UserMutateError>,
// Pick<
// User,
// "login" | "email" | "firstName" | "lastName" | "langKey" | "authorities"
// >
// > = {}
// ) => {
// const queryClient = useQueryClient();
// return useMutation(
// ({ langKey = DEFAULT_LANGUAGE_KEY, ...payload }) =>
// Axios.post("/admin/users", { langKey, ...payload }),
// {
// ...config,
// onSuccess: (...args) => {
// queryClient.invalidateQueries(usersKeys.users._def);
// config?.onSuccess?.(...args);
// },
// }
// );
// };

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
