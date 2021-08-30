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
  root1: {
    height: '40px',
    fontSize: '14px',
    width: '150px',
  },
  notchedOutline: {
    borderWidth: '1px',
  },
}));

function SelectWeight(props) {
  const classes = useStyles();
  const { name, label, value, onChange, error = null, options } = props;
  return (
    <FormControl {...(error && { error: true })} className={classes.root}>
      <InputLabel
        className={classes.root}
        inputProps={{ style: { fontSize: 20 } }} // font size of input text
        InputLabelProps={{ style: { fontSize: 20 } }} // font size of input label
      >
        {label}
      </InputLabel>
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
        {/* <MenuItem value="" style={{ fontSize: '16px' }}>
          --------------
        </MenuItem> */}
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id} style={{ fontSize: '16px' }}>
            {item.title}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

export default SelectWeight;
