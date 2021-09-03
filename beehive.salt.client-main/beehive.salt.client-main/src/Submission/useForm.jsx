import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';

export function useForm(initialValues, validateOnChange = false, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    if (validateOnChange) validate({ [name]: value });
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '100px',
     [theme.breakpoints.down('sm')]: {
       marginTop: '30px',
    },
    // marginTop: theme.spacing(1),
    '& .MuiFormControl-root': {
      width: '100%',
      margin: theme.spacing(1),
      // marginTop: theme.spacing(1),
    },
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));
export function Form(props) {
  const classes = useStyles();
  const { children, ...other } = props;
  return (
    <form
      className={classes.root}
      autoComplete="off"
      {...other}
      helperText="*Это поле обязательно для заполнения"
    >
      {props.children}
    </form>
  );
}
