import React from 'react';
import { Button as MuiButton, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0.5),
    fontSize: '18px',
    height: '50px',
    width: '180px',
    [theme.breakpoints.down('sm')]: {
      height: '50px',
      width: '160px',
    },
  },
  label: {
    textTransform: 'none',
  },
}));

export default function Button(props) {
  const { text, size, color, variant, onClick,value, ...other } = props;
  const classes = useStyles();

  return (
    <MuiButton
      variant={variant || 'contained'}
      size={size || 'large'}
      color={color || 'primary'}
      onClick={onClick}
      {...other}
      classes={{ root: classes.root, label: classes.label }}
    >
      {text}
    </MuiButton>
  );
}
