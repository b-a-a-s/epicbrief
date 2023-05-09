import React from 'react';

import { Button, ButtonGroup, Heading } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { useNavigate } from 'react-router-dom';

import { useToastError, useToastSuccess } from '../../components/Toast/Toast';
import { useMeetingCreate, useMeetingList } from '../../services/meetings.service';
import { Meeting } from '../../types/meetings.types';
import { MeetingForm } from '../MeetingForm/MeetingForm';
import { Page, PageBottomBar, PageContent, PageTopBar } from '../Page/Page';

export const MeetingCreateView = () => {
  const navigate = useNavigate();
  const form = useForm({ subscribe: false });

  const toastError = useToastError();
  const toastSuccess = useToastSuccess();

  const data = useMeetingList();
  const contacts = data?.contacts || [];

  const createMeeting = useMeetingCreate({
    onError: (error) => {
      if (error.response) {
        const { title, errorKey } = error.response.data;
        toastError({
          title: "Couldn't create meeting",
          description: title + ` (${errorKey})`,
        });
      }
    },
    onSuccess: () => {
      toastSuccess({ title: 'Meeting created' });
      navigate('/');
    },
  });

  const submitCreateMeeting = (values: Meeting) => createMeeting.mutate(values);

  return (
    <Page containerSize="md" isFocusMode>
      <Formiz id="create-meeting-form" onValidSubmit={submitCreateMeeting} connect={form}>
        <form noValidate onSubmit={form.submit}>
          <PageTopBar showBack onBack={() => navigate(-1)}>
            <Heading size="md">New Meeting</Heading>
          </PageTopBar>
          <PageContent>
            <MeetingForm contacts={contacts} />
          </PageContent>
          <PageBottomBar>
            <ButtonGroup justifyContent="space-between">
              <Button onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" variant="@primary" isLoading={createMeeting.isLoading}>
                Save
              </Button>
            </ButtonGroup>
          </PageBottomBar>
        </form>
      </Formiz>
    </Page>
  );
};

export default MeetingCreateView;
