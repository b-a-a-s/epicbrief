export type MeetingSortType = 'OLDEST' | 'NEWEST';
export type MeetingFilterType = 'ALL' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export type Meeting = {
  id: string;
  properties: {
    hs_createdate: string;
    hs_internal_meeting_notes: string;
    hs_lastmodifieddate: string;
    hs_meeting_outcome: string;
    hs_meeting_start_time: string;
    hs_meeting_title: string;
    hs_object_id: string;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  associations: {
    contacts: {
      results: {
        id: string;
        type: string;
      }[];
    };
  };
  name?: string;
  time?: string;
  notes?: string;
};

export type Contact = {
  id: string;
  properties: {
    createdate: string;
    email: string;
    firstname: string;
    hs_object_id: string;
    lastmodifieddate: string;
    lastname: string;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
};

export type MeetingList = {
  meetings: Meeting[];
  meeting?: Meeting;
  contacts: Contact[];
  totalItems?: number;
};
