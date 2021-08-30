import { TextField, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: '18px',
    width: '100%',
  },
  notchedOutline: {
    borderWidth: '1px',
  },
}));

function Comment(props) {
  const classes = useStyles();
  const { name, label, value, onChange } = props;
  return (
    <TextField
      className={classes.root}
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      multiline
      rows={4}
      rowsMax={8}
      inputProps={{ style: { fontSize: 20 } }} // font size of input text
      InputLabelProps={{ style: { fontSize: 20 } }} // font size of input label
    />
  );
}

export default Comment;
