import React, { useEffect, useState } from 'react';

import { Select } from '@chakra-ui/react';
import { FieldProps, useField } from '@formiz/core';

import { FormGroup, FormGroupProps } from '../FormGroup/FormGroup';

export type FieldSelectProps<Option> = FieldProps &
  FormGroupProps & {
    placeholder?: string;
    size?: 'sm' | 'md' | 'lg';
    options?: Option[];
    isClearable?: boolean;
    isSearchable?: boolean;
  };

export const FieldSelect = (props: FieldSelectProps<unknown>) => {
  const { errorMessage, id, isValid, isSubmitted, isPristine, resetKey, setValue, value, otherProps } = useField({ debounce: 0, ...props });
  const { required } = props;
  const { children, label, options = [], helper, isDisabled, ...rest } = otherProps || {};
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
    isDisabled,
    ...rest,
  };

  return (
    <FormGroup {...formGroupProps}>
      <Select name="type" placeholder="Select option" value={value} onChange={(e) => setValue(e.target.value)}>
        {options.map((option: Record<string, string>) => (
          <option key={option.value} value={option.value} selected={value === option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {children}
    </FormGroup>
  );
};
// <option value="option1" selected={value === 'option1'}>
// Option 1
// </option>
// <option value="option2" selected={value === 'option2'}>
// Option 2
// </option>
// <option value="option3" selected={value === 'option3'}>
// Option 3
// </option>
// <Select
// id={id}
// value={options?.find((option: TODO) => option.value === value) ?? undefined}
// onFocus={() => setIsTouched(false)}
// onBlur={() => setIsTouched(true)}
// placeholder={placeholder || 'Select...'}
// onChange={(fieldValue: TODO) => setValue(fieldValue ? fieldValue.value : null)}
// size={size}
// options={options}
// isDisabled={isDisabled}
// isClearable={isClearable}
// isSearchable={isSearchable}
// isError={showError}
// {...selectProps}
// />
