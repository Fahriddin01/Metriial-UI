import {
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select as MuiSelect,
  makeStyles,
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '62px',
    fontSize: '22px',
    width: '100%',
  },
  notchedOutline: {
    borderWidth: '1px',
  },
}));

export default function UsersSelect(props) {
  const classes = useStyles();
  const { name, label, value, onChange, error = null, options } = props;
  return (
    <FormControl {...(error && { error: true })}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        variant="outlined"
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        className={classes.root}
        inputProps={{ style: { fontSize: 20 } }} // font size of input text
        InputLabelProps={{ style: { fontSize: 20 } }} // font size of input label
      >
       
        {options.filter(item => item.role ==="clientAdmin" || item.role ==="supervisorAdmin").map((item) => (
          <MenuItem key={item.id} value={item.id} style={{ fontSize: '20px' }}>
            { item.name }
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
