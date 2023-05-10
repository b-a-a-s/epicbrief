import React, { useState } from 'react';

import { Avatar, Box, Button, Checkbox, HStack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import { DataListCell, DataListRow } from '../../components/DataList/DataList';
import { Contact, Meeting } from '../../types/meetings.types';

type MeetingsHeaderProps = {
  meeting: Meeting;
  contacts: Contact[] | undefined;
  selected: boolean;
  setSelected: (id: string) => void;
};

export const MeetingsRow = ({ meeting, contacts, selected, setSelected }: MeetingsHeaderProps) => {
  const [showMore, setShowMore] = useState(false);
  const regex = /(?<=<[^>]*>)[^<>]+(?=<)/g;
  const cleanNote = (note: string) => (new RegExp('<[^>]+>', 'g').test(note) ? note.match(regex)?.join('') || '' : note);
  const getContactName = (id: string) => {
    const contact = contacts?.find((contact) => contact.id === id);
    return contact?.properties?.firstname + ' ' + contact?.properties?.lastname;
  };
  const getContactEmail = (id: string) => {
    const contact = contacts?.find((contact) => contact.id === id);
    return contact?.properties?.email;
  };

  const note = cleanNote(meeting?.properties.hs_internal_meeting_notes || '') || meeting.properties.hs_meeting_outcome;
  return (
    <DataListRow key={meeting.id}>
      <DataListCell colName="checkbox" colWidth="2rem">
        <Checkbox isChecked={selected} onChange={() => setSelected(meeting.id)} />
      </DataListCell>
      <DataListCell colName="name">
        <Link to={`meetings/${meeting.id}`}>
          <Text noOfLines={1} maxW="full" fontWeight="bold" color="brand.600" _dark={{ color: 'brand.300' }}>
            {meeting.properties.hs_meeting_title}
          </Text>
        </Link>
      </DataListCell>
      <DataListCell colName="time" fontSize="sm" position="relative" pointerEvents="none">
        <Text noOfLines={1} maxW="full">
          {dayjs(meeting.properties.hs_meeting_start_time).format('MMM D, YYYY h:mm A')}
        </Text>
      </DataListCell>
      <DataListCell colName="account">
        <HStack maxW="100%">
          <Avatar size="sm" name={meeting?.properties?.hs_meeting_title || ''} mx="1" />
          <Box minW="0">
            <Text noOfLines={1} maxW="full" fontWeight="bold">
              {getContactName(meeting.associations?.contacts?.results[0]?.id || '')}
            </Text>
            <Text noOfLines={1} maxW="full" fontSize="sm" color="gray.600" _dark={{ color: 'gray.300' }}>
              {getContactEmail(meeting.associations?.contacts?.results[0]?.id || '')}
            </Text>
          </Box>
        </HStack>
      </DataListCell>
      <DataListCell colName="nextSteps" fontSize="sm" position="relative">
        <Box display="inline-block" as="span">
          <Box noOfLines={showMore ? 100 : 3} maxW="full">
            <Text maxW="full">{note}</Text>
          </Box>
          {note?.length > 100 && (
            <Button size="sm" variant="link" colorScheme="slate" onClick={() => setShowMore(!showMore)}>
              {showMore ? 'Show Less' : 'Show More'}
            </Button>
          )}
        </Box>
      </DataListCell>
      <DataListCell colName="actions">{/*  <meetingActions meeting={meeting} /> */}</DataListCell>
    </DataListRow>
  );
};
