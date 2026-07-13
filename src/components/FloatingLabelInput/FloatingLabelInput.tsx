import { useState } from 'react';
import { Textarea, TextInput } from '@mantine/core';
import classes from './FloatingLabelInput.module.css';

export function FloatingLabelInput({isTextArea=false, required=false, label, placeholder, value, onChange}: {isTextArea?: boolean, required?: boolean, label?: string, placeholder?: string, value?: string, onChange: (value: string) => void}) {
  const [focused, setFocused] = useState(false);
  const floating = value?.trim().length !== 0 || focused || undefined;

  return (isTextArea ? (
    <Textarea
      label={label}
      placeholder={placeholder}
      required={required}
      classNames={classes}
      value={value}
      onChange={(e) => { onChange(e.currentTarget.value); }}
      onFocus={() => { setFocused(true); }}
      onBlur={() => { setFocused(false); }}
      mt="md"
      pb="sm"
      autoComplete="nope"
      data-floating={floating}
      labelProps={{ 'data-floating': floating }}
    />
  ) : (
    <TextInput
      label={label}
      placeholder={placeholder}
      required={required}
      classNames={classes}
      value={value}
      onChange={(e) => { onChange(e.currentTarget.value); }}
      onFocus={() => { setFocused(true); }}
      onBlur={() => { setFocused(false); }}
      mt="md"
      pb="sm"
      autoComplete="nope"
      data-floating={floating}
      labelProps={{ 'data-floating': floating }}
    />
  )
  );
}