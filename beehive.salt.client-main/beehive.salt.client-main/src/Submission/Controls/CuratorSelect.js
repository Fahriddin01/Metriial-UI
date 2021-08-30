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
      width: '100%',
    },
  
    notchedOutline: {
      borderWidth: '1px',
    },
  }));
  
  
  function CuratorSelect(props) {
    const classes = useStyles();
    const { name, label, value, onChange, error = null, options } = props;

    return (
      <FormControl {...(error && { error: true })} className={classes.root}>
        <InputLabel className={classes.root}>{label}</InputLabel>
        <MuiSelect
          variant="outlined"
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          inputProps={{ style: { fontSize: 50 } }} // font size of input text
          InputLabelProps={{ style: { fontSize: 50 } }} // font size of input label
        >
          {options.filter(item => item.role === "curator").map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {
                  item.name
              }
            </MenuItem>
          ))}
        </MuiSelect>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    );
  }
  
  export default CuratorSelect;
  