import { DataListCell, DataListRow } from "../../components/DataList";
import { Meeting, Contact } from "../../types/meetings.types";
import {
  Avatar,
  Box,
  HStack,
  LinkOverlay,
  Text,
  LinkBox,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

type MeetingsHeaderProps = {
  meeting: Meeting;
  contacts: Contact[] | undefined;
};

export const MeetingsRow = ({ meeting, contacts }: MeetingsHeaderProps) => {
  const getContactName = (id: string) => {
    const contact = contacts?.find((contact) => contact.id === id);
    return contact?.properties?.firstname + " " + contact?.properties?.lastname;
  };
  const getContactEmail = (id: string) => {
    const contact = contacts?.find((contact) => contact.id === id);
    return contact?.properties?.email;
  };
  return (
    <DataListRow as={LinkBox} key={meeting.id}>
      <DataListCell colName="name">
        <LinkOverlay as={Link} to={meeting.id}>
          <Text noOfLines={1} maxW="full">
            {meeting.properties.hs_meeting_title}
          </Text>
        </LinkOverlay>
      </DataListCell>
      <DataListCell
        colName="time"
        fontSize="sm"
        position="relative"
        pointerEvents="none"
      >
        <Text noOfLines={1} maxW="full">
          {meeting.properties.hs_meeting_start_time}
        </Text>
        {!!meeting.createdAt && (
          <Text
            noOfLines={1}
            maxW="full"
            pointerEvents="auto"
            color="gray.600"
            _dark={{ color: "gray.300" }}
          >
            {meeting.createdAt}
          </Text>
        )}
      </DataListCell>
      <DataListCell colName="account">
        <HStack maxW="100%">
          <Avatar size="sm" name={meeting.id} mx="1" />
          <Box minW="0">
            <Text noOfLines={1} maxW="full" fontWeight="bold">
              {getContactName(
                meeting.associations?.contacts?.results[0]?.id || ""
              )}
            </Text>
            <Text
              noOfLines={1}
              maxW="full"
              fontSize="sm"
              color="gray.600"
              _dark={{ color: "gray.300" }}
            >
              {getContactEmail(
                meeting.associations?.contacts?.results[0]?.id || ""
              )}
            </Text>
          </Box>
        </HStack>
      </DataListCell>
      <DataListCell
        colName="nextSteps"
        fontSize="sm"
        position="relative"
        pointerEvents="none"
      >
        <Text noOfLines={1} maxW="full">
          {meeting.properties.hs_internal_meeting_notes ||
            meeting.properties.hs_meeting_outcome}
        </Text>
      </DataListCell>
      <DataListCell colName="actions">
        {/*  <meetingActions meeting={meeting} /> */}
      </DataListCell>
    </DataListRow>
  );
};
