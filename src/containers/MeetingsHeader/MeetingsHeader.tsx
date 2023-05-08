import React from 'react';

import { Checkbox } from '@chakra-ui/react';

import { DataListCell, DataListHeader } from '../../components/DataList';

type MeetingsHeaderProps = {
  selected: boolean;
  toggleSelectedAll: () => void;
};

export const MeetingsHeader = ({ selected, toggleSelectedAll }: MeetingsHeaderProps) => {
  return (
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
        NextSteps
      </DataListCell>
      <DataListCell colName="actions" colWidth="4rem" align="flex-end" />
    </DataListHeader>
  );
};
// {meetings.isError && (
// <Center p={4}>
// <Alert status="error">
// <AlertIcon />
// <AlertTitle>
// {t("meetings:feedbacks.loadingUserError.title")}
// </AlertTitle>
// <AlertDescription>
// {t("meetings:feedbacks.loadingUserError.description")}
// <Button
// colorScheme="error"
// variant="ghost"
// size="sm"
// leftIcon={<FiRefreshCw />}
// isLoading={meetings.isLoadingPage}
// onClick={() => meetings.refetch()}
// >
// {t("meetings:list.actions.refetch")}
// </Button>
// </AlertDescription>
// </Alert>
// </Center>
// )}
