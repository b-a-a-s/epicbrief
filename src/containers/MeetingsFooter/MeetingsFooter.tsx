import { DataListFooter } from "../../components/DataList";
import {
  Pagination,
  PaginationButtonFirstPage,
  PaginationButtonLastPage,
  PaginationButtonNextPage,
  PaginationButtonPrevPage,
  PaginationInfo,
} from "../../components/Pagination";
import React from "react";

type MeetingsFooterProps = {
  isLoadingPage: boolean;
  setPage: (page: number) => void;
  page: number;
  pageSize: number;
  totalItems: number;
};

export const MeetingsFooter = ({
  isLoadingPage,
  setPage,
  page,
  pageSize,
  totalItems,
}: MeetingsFooterProps) => {
  return (
    <DataListFooter>
      <Pagination
        isLoadingPage={isLoadingPage}
        setPage={setPage}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
      >
        <PaginationButtonFirstPage />
        <PaginationButtonPrevPage />
        <PaginationInfo flex="1" />
        <PaginationButtonNextPage />
        <PaginationButtonLastPage />
      </Pagination>
    </DataListFooter>
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
