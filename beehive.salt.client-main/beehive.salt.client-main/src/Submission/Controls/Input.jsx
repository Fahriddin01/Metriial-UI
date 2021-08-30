import { TextField } from '@material-ui/core';
import React from 'react';

function Input(props) {
  const { name, label, value, error = null, onChange } = props;
  return (
    <TextField
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...(error && { error: true, helperText: error })}
      inputProps={{ style: { fontSize: 20 } }} // font size of input text
      InputLabelProps={{ style: { fontSize: 20 } }} // font size of input label
    />
  );
}

export default Input;
