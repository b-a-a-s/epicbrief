import React from 'react';

import { Box, Button, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { format } from 'date-fns';
import { DateRange, DayPicker } from 'react-day-picker';
import { BiCalendar, BiFilter, BiSort } from 'react-icons/bi';
import { FiChevronDown, FiEdit, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { MeetingFilterType, MeetingSortType } from '../../types/meetings.types';

type MeetingsActionsProps = {
  sort: string;
  setSort: (sort: MeetingSortType) => void;
  filter: string;
  setFilter: (filter: MeetingFilterType) => void;
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
};

const FilterOptions = ({ filter, setFilter }: Pick<MeetingsActionsProps, 'filter' | 'setFilter'>) => (
  <MenuList>
    <MenuItem onClick={() => setFilter('ALL')}>{filter == 'ALL' ? <b>All</b> : 'All'}</MenuItem>
    <MenuItem onClick={() => setFilter('SCHEDULED')}>{filter == 'SCHEDULED' ? <b>Scheduled</b> : 'Scheduled'}</MenuItem>
    <MenuItem onClick={() => setFilter('COMPLETED')}>{filter == 'COMPLETED' ? <b>Completed</b> : 'Completed'}</MenuItem>
    <MenuItem onClick={() => setFilter('CANCELLED')}>{filter == 'CANCELLED' ? <b>Cancelled</b> : 'Cancelled'}</MenuItem>
  </MenuList>
);

const ActionsOptions = () => (
  <MenuList>
    <MenuItem>Download</MenuItem>
    <MenuItem>Create a Copy</MenuItem>
    <MenuItem>Mark as Draft</MenuItem>
    <MenuItem>Delete</MenuItem>
    <MenuItem>Attend a Workshop</MenuItem>
  </MenuList>
);

const SortOptions = ({ sort, setSort }: Pick<MeetingsActionsProps, 'sort' | 'setSort'>) => (
  <MenuList>
    <MenuItem onClick={() => setSort('NEWEST')}>{sort == 'NEWEST' ? <b>Newest</b> : 'Newest'}</MenuItem>
    <MenuItem onClick={() => setSort('OLDEST')}>{sort == 'OLDEST' ? <b>Oldest</b> : 'Oldest'}</MenuItem>
  </MenuList>
);

export const MeetingsActions = ({ sort, setSort, filter, setFilter, range, setRange }: MeetingsActionsProps) => {
  let period = 'Period';
  if (range?.from) {
    if (!range.to) {
      period = `${format(range.from, 'dd, MMM yyyy')}`;
    } else if (range.to) {
      period = ` ${format(range.from, 'dd, MMM yyyy')}– ${format(range.to, 'dd, MMM yyyy')} `;
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
          <MenuButton as={Button} leftIcon={<FiEdit />} rightIcon={<FiChevronDown />} display={{ base: 'none', md: 'flex' }}>
            Actions
          </MenuButton>
          <ActionsOptions />
        </Menu>
        <Menu>
          <MenuButton as={IconButton} aria-label="Options" icon={<FiEdit />} variant="outline" display={{ base: 'flex', md: 'none' }} />
          <ActionsOptions />
        </Menu>
      </Box>
      <Box>
        <Menu>
          <MenuButton as={Button} leftIcon={<BiSort />} rightIcon={<FiChevronDown />} display={{ base: 'none', md: 'flex' }}>
            `Sort: {sort.charAt(0) + sort.slice(1).toLowerCase()}
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
        <Button display={{ base: 'none', sm: 'flex' }} as={Link} to="create" variant="@primary" leftIcon={<FiPlus />}>
          New Meeting
        </Button>
        <IconButton
          display={{ base: 'flex', sm: 'none' }}
          aria-label="New Meeting"
          as={Link}
          to="create"
          size="sm"
          variant="@primary"
          icon={<FiPlus />}
        />
      </Box>
    </HStack>
  );
};
