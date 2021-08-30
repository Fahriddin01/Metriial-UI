import React, { useState, useEffect, useContext } from 'react';
import {
  Typography,
  Grid,
  CssBaseline,
  Hidden,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Form } from '../../../../../Submission/useForm';
import Controls from '../../../../../Submission/Controls/Controls';
import useAxios from 'axios-hooks';
import { SnackbarStatus, NotificationSnackBarContext } from '../../../../../App';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import { CloseIcon } from '@material-ui/data-grid';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import Button from '../../../../../Submission/Controls/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop:'120px',
    paddingLeft:'70px',
    display:'flex',
    justifyContent:'space-between',
    maxWidth:'1580px',
    width:'100%',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      paddingLeft:'0',
    },
     [theme.breakpoints.down('md')]: {
      paddingLeft:'0',
      md: false,
      maxWidth: '100%',
     
    },
  },
  image: {
    marginTop:'70px',
    paddingLeft:'30px',
    paddingRight:'30px',
    textAlign:'end',
    [theme.breakpoints.down('sm')]: {
      marginTop:'40px',
      maxWidth: '98%',
      addingLeft:0,
      paddingRight:0,
      textAlign:'center',
      marginBottom:60,
    },
    
    // alignItems: 'center',
    // flexDirection: 'column',
    // display: 'flex',
    // width: '430px',
    // margin: theme.spacing(12.5, -1, 1, -18),
  },
  paper: {
   
    [theme.breakpoints.down('sm')]: {
      
      maxWidth: '98%',
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
      maxWidth: 730,
     
      // right: '160px',
    },
    // margin: theme.spacing(8, 20, 1, -28),
    // width: '730px',
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',
    
  },
  btnColor: {
    marginLeft: '8px',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 2, 2, 1),
      height: '50px',
      width: '100%',
    
    },
  },
  text: {
    paddingBottom:'40px',
    [theme.breakpoints.down('md')]: {
      marginRight: '40px', 
      maxWidth:'100%',
    },
  },
  paragraph: {
    marginTop:'75px',
    marginLeft: '70px',
    textAlign:'end',
    
  }
}));

export default function Settings() {
  // -- local states --
  const classes = useStyles();
  const [disabled, setDisabled] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const notificationContext = useContext(NotificationSnackBarContext);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    password: '',
  });
  const [
    { data: userSaveData, error: userSaveError, loading: userSaveLoading },
    execute,
  ] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/users/create-or-update-user`,
    },
    { manual: true },
    {
      useCache: false,
    },
  );

  // -- local functions --
  const onHandleChange = (key) => (e) => {
    setUserProfile({
      ...userProfile,
      [key]: e.target.value,
    });
  };
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const onSave = () => {
    execute({
      url: `${process.env.REACT_APP_API_URL}/users/create-or-update-user`,
      method: 'post',
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
      },
      data: {
        id: user.id,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        password: userProfile.password,
      },
    });
  };

  const buttonEnable = () => {
    setDisabled(!disabled);
    setBtnDisabled(!btnDisabled);
  };

  // -- local effects --
  useEffect(() => {
    if (!user) return;
    setUserProfile({
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
    });
    if (userSaveError) {
      notificationContext.notify('Ошибка при сохранении', SnackbarStatus.Error);
    } else if (userSaveData) {
      notificationContext.notify(
        'Учетные данные были изменены',
        SnackbarStatus.Success,
      );
    }
  }, [userSaveError, userSaveData]);

  //
  // --render --
  return (
    <Form>
      <Grid container component="main" className={classes.root}>     
        <Grid item xs={12} sm={12} md={8}>
          <div className={classes.paper}>
            <Typography variant="h6" className={classes.text}>
              Данные Пользователя
              <Hidden only={['sm', 'md', 'xl', 'lg']}>
                <HelpOutlineOutlinedIcon
                  fontSize="small"
                  style={{ fontSize: 24 }}
                  onClick={handleClickOpen}
                />
                <Dialog
                  fullScreen={fullScreen}
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle id="responsive-dialog-title">
                    {'Что мы можем сделать здесь?'}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText >
                      На этой странице вы можете изменить свое имя, фамилию и пароль.
                      Для изменения, нажмите "Изменить", введите необходимые данные и
                      нажмите "Сохранить"приветиии
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      color="secondary"
                      text="Закрыть"
                      startIcon={<CloseIcon fontSize="small" />}
                    ></Button>
                  </DialogActions>
                </Dialog>
              </Hidden>
            </Typography>
            <TextField 
            label="Имя Пользователя" 
            variant="outlined" 
            name="firstName"
            disabled={disabled}
            value={userProfile.firstName}
            onChange={onHandleChange('firstName')}
            />
            <TextField 
            id="outlined-basic" 
            label="Фамилия Пользователя" 
            variant="outlined" 
            name="lastname"
            disabled={disabled}
            value={userProfile.lastName}
            onChange={onHandleChange('lastName')}
            />
            <TextField            
            label="Пароль" 
            variant="outlined" 
            name="password"
            disabled={disabled}
            value={userProfile.password}
            onChange={onHandleChange('password')}
            />
            <Grid container spacing={1}>
              <Grid item xs={6} sm={6} md={4} lg={4}>
                {disabled === true ? (
                  <Controls.Button
                    className={classes.btnColor}
                    startIcon={<EditIcon fontSize="small" />}
                    text="Изменить"
                    color="primary"
                    onClick={buttonEnable}
                  />
                ) : (
                  <Controls.Button
                    className={classes.btnColor}
                    startIcon={<CloseIcon fontSize="small" />}
                    text="Отменить"
                    color="secondary"
                    onClick={buttonEnable}
                  />
                )}
              </Grid>
              <Grid item xs={6} sm={6} md={4} lg={4}>
                <Controls.Button
                  className={classes.btnColor}
                  startIcon={<SaveIcon fontSize="small" />}
                  disabled={btnDisabled}
                  disabled={userSaveLoading}
                  text="Сохранить"
                  color="primary"
                  onClick={onSave}
                />
              </Grid>
            </Grid>
          </div>
        </Grid>{' '}
        <Hidden only="xs">
        <Grid item xs={false} sm={12} md={4} className={classes.image}>
            <Typography variant="h6" >Что мы можем сделать здесь ?</Typography>
            <Typography>
              На этой странице вы можете изменить свое имя, фамилию и пароль. Для
              изменения, нажмите "Изменить", введите необходимые данные и нажмите
              "Сохранить"gggg
            </Typography>
          </Grid>
        </Hidden>
      </Grid>
    </Form>
  );
}
