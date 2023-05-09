import React, { useEffect, useState } from 'react';

import { Input, InputGroup } from '@chakra-ui/react';
import { FieldProps, useField, useForm } from '@formiz/core';
import dayjs from 'dayjs';

import { FormGroup, FormGroupProps } from '../FormGroup/FormGroup';

export type FieldDayPickerProps = FieldProps &
  FormGroupProps & {
    invalidMessage?: string;
  };

export const FieldDayPicker = (props: FieldDayPickerProps) => {
  const { invalidMessage, ...fieldProps } = props;
  const { invalidateFields } = useForm({ subscribe: false });
  const { errorMessage, id, isValid, isSubmitted, isPristine, setValue, value, resetKey, otherProps } = useField({
    debounce: 0,
    ...fieldProps,
  });
  const { children, label, placeholder, helper, ...rest } = otherProps as Omit<FieldDayPickerProps, keyof FieldProps>;
  const { required } = props;
  const [isTouched, setIsTouched] = useState(false);
  const showError = !isValid && ((isTouched && !isPristine) || isSubmitted);

  useEffect(() => {
    setIsTouched(false);
  }, [resetKey]);

  const formGroupProps = {
    errorMessage,
    helper,
    id,
    isRequired: !!required,
    label,
    showError,
    ...rest,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, isValidDate: boolean) => {
    const date = dayjs(e.target.value).format('YYYY-MM-DDTHH:mm');
    if (e.target.value === '') {
      setValue(null);
    } else {
      setValue(date);
    }
    if (!isValidDate && e.target.value !== '') {
      invalidateFields({
        [props.name]: invalidMessage ?? "This date isn't valid",
      });
    }
  };

  return (
    <FormGroup {...formGroupProps}>
      <InputGroup>
        <Input
          type="datetime-local"
          id={id}
          value={value ?? ''}
          onChange={(e) => handleChange(e, e.target.validity.valid)}
          onBlur={() => setIsTouched(true)}
          placeholder={placeholder ? String(placeholder) : ''}
        />
      </InputGroup>
      {children}
    </FormGroup>
  );
};
