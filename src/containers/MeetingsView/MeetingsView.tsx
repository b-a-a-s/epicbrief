import React, { useState } from 'react';

import { Box, HStack, Heading } from '@chakra-ui/react';
import { DateRange } from 'react-day-picker';

import { DataList } from '../../components/DataList/DataList';
import { filterMeetingList, rangeMeetingList, sortMeetingList, useMeetingList } from '../../services/meetings.service';
import { Meeting, MeetingFilterType, MeetingSortType } from '../../types/meetings.types';
import { MeetingsActions } from '../MeetingsActions/MeetingsActions';
import { MeetingsFooter } from '../MeetingsFooter/MeetingsFooter';
import { MeetingsHeader } from '../MeetingsHeader/MeetingsHeader';
import { MeetingsRow } from '../MeetingsRow/MeetingsRow';
import { Page, PageContent } from '../Page/Page';
import { usePaginationFromUrl } from '../Router/Router';

const MeetingsView = () => {
  const { page, setPage } = usePaginationFromUrl();
  const [sort, setSort] = useState<MeetingSortType>('NEWEST');
  const [filter, setFilter] = useState<MeetingFilterType>('ALL');
  const [range, setRange] = useState<DateRange | undefined>();
  const [selected, setSelected] = useState<string[]>([]);
  const pageSize = 20;
  const data = useMeetingList({ page: page - 1, size: pageSize });
  const sortedMeetings = sortMeetingList(data?.meetings || [], sort);
  const filteredMeetings = filterMeetingList(sortedMeetings, filter);
  const rangedMeetings = rangeMeetingList(filteredMeetings, range);
  const pagedMeetings = rangedMeetings.slice(pageSize * (page - 1), pageSize * page);
  const selectedAll = !!selected.length && selected.length === rangedMeetings.length;
  const toggleSelectedAll = () => (selectedAll ? setSelected([]) : setSelected(rangedMeetings.map((m: Meeting) => m.id)));
  const invertSelected = () => setSelected(rangedMeetings.map((m: Meeting) => m.id).filter((id) => !selected.includes(id)));

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
          selected={selected}
          selectedAll={selectedAll}
          toggleSelectedAll={toggleSelectedAll}
          invertSelected={invertSelected}
        />
        <DataList>
          <MeetingsHeader selected={selectedAll} toggleSelectedAll={toggleSelectedAll} meetings={data} />
          {pagedMeetings.map((meeting) => (
            <MeetingsRow
              meeting={meeting}
              contacts={data.contacts}
              selected={selected.includes(meeting.id)}
              setSelected={(id: string) =>
                selected.includes(id) ? setSelected([...selected.filter((i) => i != id)]) : setSelected([id, ...selected])
              }
            />
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
