import React from 'react';

import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, Center, Checkbox } from '@chakra-ui/react';
import { UseQueryResult } from '@tanstack/react-query';
import { FiRefreshCw } from 'react-icons/fi';

import { MeetingList } from '@/types/meetings.types';

import { DataListCell, DataListHeader } from '../../components/DataList/DataList';

type MeetingsHeaderProps = {
  selected: boolean;
  toggleSelectedAll: () => void;
  meetings: UseQueryResult<MeetingList, unknown>;
};

export const MeetingsHeader = ({ selected, toggleSelectedAll, meetings }: MeetingsHeaderProps) => {
  return (
    <>
      <DataListHeader isVisible={{ base: false, md: true }}>
        <DataListCell colName="checkbox" colWidth="2rem">
          <Checkbox isChecked={selected} onChange={() => toggleSelectedAll()} />
        </DataListCell>
        <DataListCell colName="name"> Name </DataListCell>
        <DataListCell colName="time" isVisible={{ base: false, lg: true }}>
          Time
        </DataListCell>
        <DataListCell colName="account" isVisible={{ base: false, lg: true }}>
          Account
        </DataListCell>
        <DataListCell colName="nextSteps" isVisible={{ base: false, md: true }}>
          Notes
        </DataListCell>
        <DataListCell colName="actions" colWidth="4rem" align="flex-end" />
      </DataListHeader>
      {meetings.isError && (
        <Center p={4}>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Meetings could not be loaded.</AlertTitle>
            <AlertDescription>
              Please try again later or contact support if the problem persists.
              <Button
                colorScheme="error"
                variant="ghost"
                size="sm"
                leftIcon={<FiRefreshCw />}
                isLoading={meetings.isLoading}
                onClick={() => meetings.refetch()}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </Center>
      )}
    </>
  );
};
