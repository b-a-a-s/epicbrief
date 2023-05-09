import React from 'react';

import { Stack } from '@chakra-ui/react';
import { isMaxLength, isMinLength } from '@formiz/validations';

import { FieldDayPicker } from '../../components/FieldDayPicker/FieldDayPicker';
import { FieldInput } from '../../components/FieldInput/FieldInput';
import { FieldSelect } from '../../components/FieldSelect/FieldSelect';
import { FieldTextarea } from '../../components/FieldTextarea/FieldTextarea';
import { Contact } from '../../types/meetings.types';

export const MeetingForm = ({ contacts }: { contacts: Contact[] }) => {
  const options = contacts.map((contact) => ({
    label: `${contact.properties.firstname} ${contact.properties.lastname}`,
    value: contact.id,
  }));
  return (
    <Stack direction="column" borderRadius="lg" spacing="6" shadow="md" bg="white" _dark={{ bg: 'gray.900' }} p="6">
      <FieldInput
        name="name"
        label="Name"
        required="required"
        validations={[
          { rule: isMinLength(2), message: 'Minimum length is 2' },
          { rule: isMaxLength(50), message: 'Maximum length is 50' },
        ]}
      />
      <FieldDayPicker name="time" label="Time" required="required" />
      <FieldSelect name="account" label="Account" required="required" options={options} />
      <FieldTextarea name="notes" label="Notes" />
    </Stack>
  );
};
