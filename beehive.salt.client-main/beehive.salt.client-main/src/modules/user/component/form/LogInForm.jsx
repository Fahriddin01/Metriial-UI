import React, { useState, useEffect, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons/';
import useAxios from 'axios-hooks';
import salt from './salt.png';
import { useForm } from '../../../../Submission/useForm';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      {/* <Link color="inherit" href="https:///">
        Your Website
      </Link>{' '} */}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
const initialValues = {
  phoneNumber: '',
  password: '',
};
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${salt})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 2,1,2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.secondary,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  const classes = useStyles();
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // const [errors, setErrors] = useState({ phoneNumber: '', showPassword: '' });
  const [showPassword] = useState(false);
  const [, setIsSuccessfulSubmit] = useState(false);
  const [logSave, setLogSave] = useState(initialValues);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [open, setOpen] = useState(false);

  const [{ data, loading, error }, execute] = useAxios(
    `${process.env.REACT_APP_API_URL}/users/authorization`,
    {
      manual: true,
    },
  );
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setErrors({ phoneNumber: '' });
  //   setPhoneNumber(value);
  //   let reg = new RegExp(/^\d*$/).test(value);
  //   if (!reg) {
  //     setErrors({ phoneNumber: 'Это поле обязательно для заполнения Number',
  //     setPassword: 'Это поле обязательно для заполнения Password' });
  //   }
  // };
  useEffect(() => {
    if (!data) return;
    localStorage.setItem('user', JSON.stringify(data));
    setIsSuccessfulSubmit(true);
    window.location.reload();
  }, [data]);

  const validate = () => {
    let temp = { ...errors };

    if ('phoneNumber')
      temp.phoneNumber =
        phoneNumber.length !== 0 ? '' : 'Это поле обязательно для заполнения';
    if ('password')
      temp.password =
        password.length !== 0 ? '' : 'Это поле обязательно для заполнения';
    setErrors({
      ...temp,
    });
  };
  const { errors, setErrors } = useForm(initialValues, true, validate);

  const onLogin = (e) => {
    execute({
      method: 'post',
      data: {
        phoneNumber,
        password,
      },
    });
    // validate();
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Войти
          </Typography>
          <form className={classes.form}>
            <TextField
              placeholder="(+992) 999-999-999"
              label="Номер телефона"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              type={'number' & '()+'}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              error={errors.phoneNumber}
              autoFocus
            />
            <TextField
              className={`${classes.textField} ${classes.margin}`}
              htmlFor="standard-adornment-password"
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              error={errors.password}
              label="Пароль"
              type="password"
              id="password"
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
              onClick={() => {
                onLogin();
                validate();
                handleClick();
              }}
            >
              Продолжить
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Забыл пароль?
                </Link>
              </Grid>
            </Grid>
            <Box
              mt={5}
              style={{
                position: 'absolute',
                bottom: '10px',
                justifyItems: 'center',
                alignContent: 'center',
              }}
            >
              <Copyright />
            </Box>
            {error ? (
              <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                  Произошла какая-то ошибка{' '}
                </Alert>
              </Snackbar>
            ) : null}
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
