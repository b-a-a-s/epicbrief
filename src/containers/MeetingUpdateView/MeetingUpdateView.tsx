import React from 'react';

import { Box, Button, ButtonGroup, HStack, Heading, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';

import { ErrorPage } from '../../components/ErrorPage/ErrorPage';
import { useToastError, useToastSuccess } from '../../components/Toast/Toast';
import { useMeeting, useMeetingUpdate } from '../../services/meetings.service';
import { Meeting } from '../../types/meetings.types';
import { MeetingForm } from '../MeetingForm/MeetingForm';
import { Page, PageBottomBar, PageContent, PageTopBar } from '../Page/Page';
import { Loader } from '../Router/Router';

export const MeetingUpdateView = () => {
  const regex = /(?<=<[^>]*>)[^<>]+(?=<)/g;
  const cleanNote = (note: string) => (new RegExp('<[^>]+>', 'g').test(note) ? note.match(regex)?.join('') || '' : note);
  const { id } = useParams();
  const navigate = useNavigate();
  const data = useMeeting(id || '', { refetchOnWindowFocus: false, enabled: !!id });
  const meeting = (data?.meeting || {}) as Meeting;
  const initialValues = {
    name: meeting?.properties?.hs_meeting_title,
    time: dayjs(meeting?.properties?.hs_meeting_start_time).format('YYYY-MM-DDTHH:mm'),
    account: meeting?.associations?.contacts?.results?.[0]?.id,
    notes: cleanNote(meeting?.properties?.hs_internal_meeting_notes),
  };

  const form = useForm({ subscribe: false });

  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const { mutate: editMeeting, isLoading: editMeetingIsLoading } = useMeetingUpdate({
    onError: (error) => {
      if (error.response) {
        const { title, errorKey } = error.response.data;
        toastError({ title: "Couldn't update meeting", description: `${title} - ${errorKey}` });
      }
    },
    onSuccess: () => {
      toastSuccess({
        title: 'Meeting updated',
      });
      navigate(-1);
    },
  });
  const submitEditMeeting = (values: Meeting) => {
    const meetingToSend = { ...values, id: meeting?.id, oldAccount: initialValues.account };
    editMeeting(meetingToSend);
  };

  return (
    <Page containerSize="md" isFocusMode>
      <PageTopBar showBack onBack={() => navigate(-1)}>
        <HStack spacing="4">
          <Box flex="1">
            {data.isLoading || data.isError ? (
              <SkeletonText maxW="6rem" noOfLines={2} />
            ) : (
              <Stack spacing="0">
                <Heading size="sm">{initialValues.name}</Heading>
                <Text fontSize="xs" color="gray.600" _dark={{ color: 'gray.300' }}>
                  {initialValues.time}
                </Text>
              </Stack>
            )}
          </Box>
        </HStack>
      </PageTopBar>
      {data.isFetching && <Loader />}
      {data.isError && !data.isFetching && <ErrorPage errorCode={404} />}
      {!data.isError && !data.isFetching && (
        <Formiz id="create-meeting-form" onValidSubmit={submitEditMeeting} connect={form} initialValues={initialValues}>
          <form noValidate onSubmit={form.submit}>
            <PageContent>
              <MeetingForm contacts={data?.contacts || []} />
            </PageContent>
            <PageBottomBar>
              <ButtonGroup justifyContent="space-between">
                <Button onClick={() => navigate(-1)}>Cancel</Button>
                <Button type="submit" variant="@primary" isLoading={editMeetingIsLoading}>
                  Save
                </Button>
              </ButtonGroup>
            </PageBottomBar>
          </form>
        </Formiz>
      )}
    </Page>
  );
};

export default MeetingUpdateView;
