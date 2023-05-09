import React from 'react';

import { DataListFooter } from '../../components/DataList/DataList';
import {
  Pagination,
  PaginationButtonFirstPage,
  PaginationButtonLastPage,
  PaginationButtonNextPage,
  PaginationButtonPrevPage,
  PaginationInfo,
} from '../../components/Pagination/Pagination';

type MeetingsFooterProps = {
  isLoadingPage: boolean;
  setPage: (page: number) => void;
  page: number;
  pageSize: number;
  totalItems: number;
};

export const MeetingsFooter = ({ isLoadingPage, setPage, page, pageSize, totalItems }: MeetingsFooterProps) => {
  return (
    <DataListFooter>
      <Pagination isLoadingPage={isLoadingPage} setPage={setPage} page={page} pageSize={pageSize} totalItems={totalItems}>
        <PaginationButtonFirstPage />
        <PaginationButtonPrevPage />
        <PaginationInfo flex="1" />
        <PaginationButtonNextPage />
        <PaginationButtonLastPage />
      </Pagination>
    </DataListFooter>
  );
};
