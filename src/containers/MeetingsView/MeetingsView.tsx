import { DataList } from "../../components/DataList";
import {
  useMeetingList,
  sortMeetingList,
  filterMeetingList,
  rangeMeetingList,
} from "../../services/meetings.service";
import { MeetingSortType, MeetingFilterType } from "../../types/meetings.types";
import { MeetingsActions } from "../MeetingsActions/MeetingsActions";
import { MeetingsFooter } from "../MeetingsFooter/MeetingsFooter";
import { MeetingsHeader } from "../MeetingsHeader/MeetingsHeader";
import { MeetingsRow } from "../MeetingsRow/MeetingsRow";
import { Page, PageContent } from "../Page/Page";
import { usePaginationFromUrl } from "../Router/Router";
import { Box, HStack, Heading } from "@chakra-ui/react";
import React, { useContext, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

const MeetingsView = () => {
  const { page, setPage } = usePaginationFromUrl();
  const [sort, setSort] = useState<MeetingSortType>("NEWEST");
  const [filter, setFilter] = useState<MeetingFilterType>("ALL");
  const [range, setRange] = useState<DateRange | undefined>();
  const pageSize = 20;
  const data = useMeetingList({ page: page - 1, size: pageSize });
  const sortedMeetings = sortMeetingList(data?.meetings || [], sort);
  const filteredMeetings = filterMeetingList(sortedMeetings, filter);
  const rangedMeetings = rangeMeetingList(filteredMeetings, range);
  const pagedMeetings = rangedMeetings.slice(
    pageSize * (page - 1),
    pageSize * page
  );

  return (
    <Page containerSize="xl">
      <PageContent>
        <HStack mb="4">
          <Box flex="1">
            <Heading size="md">Meetings</Heading>
          </Box>
        </HStack>
        <MeetingsActions
          sort={sort}
          setSort={setSort}
          filter={filter}
          setFilter={setFilter}
          range={range}
          setRange={setRange}
        />
        <DataList>
          <MeetingsHeader />
          {pagedMeetings.map((meeting) => (
            <MeetingsRow meeting={meeting} contacts={data.contacts} />
          ))}
          <MeetingsFooter
            isLoadingPage={data?.isLoading}
            setPage={setPage}
            page={page}
            pageSize={pageSize}
            totalItems={rangedMeetings.length || 0}
          />
        </DataList>
      </PageContent>
    </Page>
  );
};

export default MeetingsView;
