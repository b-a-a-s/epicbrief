import React from 'react';

import { Box, Button, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { DateRange, DayPicker } from 'react-day-picker';
import { BiCalendar, BiFilter, BiSort } from 'react-icons/bi';
import { FiChevronDown, FiEdit, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { useToastError, useToastSuccess } from '../../components/Toast/Toast';
import { useMeetingRemove } from '../../services/meetings.service';
import { MeetingFilterType, MeetingSortType } from '../../types/meetings.types';

type MeetingsActionsProps = {
  sort: string;
  setSort: (sort: MeetingSortType) => void;
  filter: string;
  setFilter: (filter: MeetingFilterType) => void;
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
  selected: string[];
  selectedAll: boolean;
  toggleSelectedAll: () => void;
  invertSelected: () => void;
};

const FilterOptions = ({ filter, setFilter }: Pick<MeetingsActionsProps, 'filter' | 'setFilter'>) => (
  <MenuList>
    <MenuItem onClick={() => setFilter('ALL')}>{filter == 'ALL' ? <b>All</b> : 'All'}</MenuItem>
    <MenuItem onClick={() => setFilter('SCHEDULED')}>{filter == 'SCHEDULED' ? <b>Scheduled</b> : 'Scheduled'}</MenuItem>
    <MenuItem onClick={() => setFilter('COMPLETED')}>{filter == 'COMPLETED' ? <b>Completed</b> : 'Completed'}</MenuItem>
    <MenuItem onClick={() => setFilter('CANCELLED')}>{filter == 'CANCELLED' ? <b>Cancelled</b> : 'Cancelled'}</MenuItem>
  </MenuList>
);

const ActionsOptions = ({
  selectedAll,
  toggleSelectedAll,
  invertSelected,
  removeMeeting,
}: Pick<MeetingsActionsProps, 'selectedAll' | 'toggleSelectedAll' | 'invertSelected'> & { removeMeeting: () => void }) => (
  <MenuList>
    <MenuItem onClick={toggleSelectedAll}>{selectedAll ? <b>Unselect All</b> : 'Select All'}</MenuItem>
    <MenuItem onClick={invertSelected}>Invert Selection</MenuItem>
    <MenuItem onClick={() => removeMeeting()}>Delete Selected</MenuItem>
  </MenuList>
);

const SortOptions = ({ sort, setSort }: Pick<MeetingsActionsProps, 'sort' | 'setSort'>) => (
  <MenuList>
    <MenuItem onClick={() => setSort('NEWEST')}>{sort == 'NEWEST' ? <b>Newest</b> : 'Newest'}</MenuItem>
    <MenuItem onClick={() => setSort('OLDEST')}>{sort == 'OLDEST' ? <b>Oldest</b> : 'Oldest'}</MenuItem>
  </MenuList>
);

export const MeetingsActions = ({
  sort,
  setSort,
  filter,
  setFilter,
  range,
  setRange,
  selected,
  selectedAll,
  toggleSelectedAll,
  invertSelected,
}: MeetingsActionsProps) => {
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const meetingRemove = useMeetingRemove({
    onSuccess: (_, { id }) => {
      toastSuccess({ title: 'Meeting deleted', description: `Meeting ${id} has been deleted.` });
    },
    onError: (_, { id }) => {
      toastError({ title: 'Meeting delete error', description: `Meeting ${id} could not be deleted.` });
    },
  });
  const removeMeeting = () => meetingRemove.mutate({ id: selected.join(',') });
  const isRemovalLoading = meetingRemove.isLoading;

  let period = 'Period';
  if (range?.from) {
    if (!range.to) {
      period = dayjs(range.from).format('DD, MMM YYYY');
    } else if (range.to) {
      period = `${dayjs(range.from).format('DD, MMM YYYY')}– ${dayjs(range.to).format('DD, MMM YYYY')} `;
    }
  }
  return (
    <HStack mb="4" alignItems="left">
      <Box>
        <Menu>
          <MenuButton
            as={Button}
            aria-label="Filters"
            leftIcon={<BiFilter />}
            rightIcon={<FiChevronDown />}
            display={{ base: 'none', md: 'flex' }}
          >
            Filter: {filter.charAt(0) + filter.slice(1).toLowerCase()}
          </MenuButton>
          <FilterOptions filter={filter} setFilter={setFilter} />
        </Menu>
        <Menu>
          <MenuButton as={IconButton} aria-label="Filters" icon={<BiFilter />} variant="outline" display={{ base: 'flex', md: 'none' }} />
          <FilterOptions filter={filter} setFilter={setFilter} />
        </Menu>
      </Box>
      <Box>
        <Menu>
          <MenuButton
            as={Button}
            leftIcon={<FiEdit />}
            rightIcon={<FiChevronDown />}
            display={{ base: 'none', md: 'flex' }}
            isLoading={isRemovalLoading}
          >
            Actions
          </MenuButton>
          <ActionsOptions
            selectedAll={selectedAll}
            toggleSelectedAll={toggleSelectedAll}
            invertSelected={invertSelected}
            removeMeeting={removeMeeting}
          />
        </Menu>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<FiEdit />}
            variant="outline"
            display={{ base: 'flex', md: 'none' }}
            isLoading={isRemovalLoading}
          />
          <ActionsOptions
            selectedAll={selectedAll}
            toggleSelectedAll={toggleSelectedAll}
            invertSelected={invertSelected}
            removeMeeting={removeMeeting}
          />
        </Menu>
      </Box>
      <Box>
        <Menu>
          <MenuButton as={Button} leftIcon={<BiSort />} rightIcon={<FiChevronDown />} display={{ base: 'none', md: 'flex' }}>
            Sort: {sort.charAt(0) + sort.slice(1).toLowerCase()}
          </MenuButton>
          <SortOptions sort={sort} setSort={setSort} />
        </Menu>
        <Menu>
          <MenuButton as={IconButton} aria-label="Sort" icon={<BiSort />} variant="outline" display={{ base: 'flex', md: 'none' }} />
          <SortOptions sort={sort} setSort={setSort} />
        </Menu>
      </Box>
      <Box flex="1">
        <Menu>
          <MenuButton as={Button} leftIcon={<BiCalendar />} rightIcon={<FiChevronDown />} display={{ base: 'none', md: 'flex' }}>
            {period}
          </MenuButton>
          <MenuList>
            <DayPicker id="period" mode="range" selected={range} onSelect={setRange} />
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={IconButton} aria-label="Options" icon={<BiCalendar />} variant="outline" display={{ base: 'flex', md: 'none' }} />
          <MenuList>
            <DayPicker id="period" mode="range" selected={range} onSelect={setRange} />
          </MenuList>
        </Menu>
      </Box>
      <Box>
        <Button display={{ base: 'none', sm: 'flex' }} as={Link} to="meetings/new" variant="@primary" leftIcon={<FiPlus />}>
          New Meeting
        </Button>
        <IconButton
          display={{ base: 'flex', sm: 'none' }}
          aria-label="New Meeting"
          as={Link}
          to="meetings/new"
          size="sm"
          variant="@primary"
          icon={<FiPlus />}
        />
      </Box>
    </HStack>
  );
};
