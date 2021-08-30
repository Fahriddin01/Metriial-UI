import React, { useState, useEffect, useContext } from 'react';
import {
  CssBaseline,
  Grid,
  Hidden,
  Typography,
  useMediaQuery,
  useTheme,Box
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Form, useForm } from '../../../../../../Submission/useForm';
import Controls from '../../../../../../Submission/Controls/Controls';
import useAxios from 'axios-hooks';
import { Link, useParams, Redirect } from 'react-router-dom';
import { SnackbarStatus, NotificationSnackBarContext } from '../../../../../../App';
import * as Services from '../../../../../../Submission/Services/Services';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '../../../../../../Submission/Controls/Button';
const useStyles = makeStyles((theme) => ({
  root: {
    height: '80vh',
    justifyContent:'space-between',

  },
  image: {
    paddingTop:'40px',
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
    
      width: '20%',
      // right: '160px',
    },
    [theme.breakpoints.down('md')]: {
   
    },
  },
  paper: {
    maxWidth:'730px',
    [theme.breakpoints.down('md')]: {
      maxWidth:'95%',
     
    },
    [theme.breakpoints.up('lg')]: {
    
      // right: '160px',
    },
  },
  btnColor: {
   
    height: '50px',
 
    [theme.breakpoints.down('md')]: {
      height: '50px',
      width:'100%',
    },
     [theme.breakpoints.down('sm')]: {
      height: '50px',
      width:'100%',
    
    },
  },

  textC: {
    // marginRight: '420px',
    marginLeft: '10px',
    [theme.breakpoints.down('md')]: {
    
    },
  },
  textE: {
    marginBottom: '40px',
    [theme.breakpoints.down('md')]: {
    
    },
  },
  esRow : {
     paddingLeft:'70px',
     [theme.breakpoints.down('md')]: {
      paddingLeft:'30px',  
    },
  }
}));

const initialValues = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  password: '',
  role: '',
  organizationId: '',
};

export default function AdminUserAddEditForm() {
  const classes = useStyles();
  // -- local states --
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const notificationContext = useContext(NotificationSnackBarContext);
  const [open, setOpen] = useState(false);
  const [userSaveArgs, setUserSaveArgs] = useState(initialValues);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [
    { data: userSaveData, loading: userSaveLoading, error: userSaveError },
    execute,
  ] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/users/create-or-update-user`,
    },
    { manual: true },
  );
  const [{ data: userData }, loadUserById] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/users/${id}`,
    },
    { manual: true },
  );
  const [{ data: orgsData }] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/organizations/get-by-filter`,
      params: {
        filter: {
          limit: null,
          offset: 0,
        },
      },
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
        method: 'get',
      },
    },
    {
      useCache: false,
    },
  );

  const validate = (fieldValues = userSaveArgs) => {
    let temp = { ...errors };

    if ('firstName' in fieldValues)
      temp.firstName = fieldValues.firstName
        ? ''
        : 'Это поле обязательно для заполнения';
    if ('lastName' in fieldValues)
      temp.lastName = fieldValues.lastName
        ? ''
        : 'Это поле обязательно для заполнения';
    if ('phoneNumber' in fieldValues)
      temp.phoneNumber = fieldValues.phoneNumber
        ? ''
        : 'Это поле обязательно для заполнения';
    if ('password' in fieldValues)
      temp.password = fieldValues.password
        ? ''
        : 'Это поле обязательно для заполнения';
    if ('role' in fieldValues)
      temp.role = fieldValues.role ? '' : 'Это поле обязательно для заполнения';
    if ('organizationId' in fieldValues)
      temp.organizationId = fieldValues.organizationId
        ? ''
        : 'Это поле обязательно для заполнения';
    setErrors({
      ...temp,
    });
  };
  const { errors, setErrors } = useForm(initialValues, true, validate);

  // -- local effects --
  useEffect(() => {
    if (userSaveError) {
      validate();
      notificationContext.notify('Ошибка при сохранении', SnackbarStatus.Error);
    } else if (userSaveData) {
      notificationContext.notify('Пользователь создан', SnackbarStatus.Success);
      resetForm();
    }
  }, [userSaveData, userSaveError]);

  useEffect(() => {
    if (!userData) return;
    setUserSaveArgs({
      ...userData,
    });
  }, [userData]);

  useEffect(() => {
    if (!id) return;
    loadUserById({
      url: `${process.env.REACT_APP_API_URL}/users/${id}`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
      },
    });
  }, [id]);
  // -- Local functions --

  const resetForm = () => {
    setUserSaveArgs(initialValues);
    setErrors({});
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      resetForm();
    }
  };

  const onUserSave = () => {
    execute({
      url: `${process.env.REACT_APP_API_URL}/users/create-or-update-user`,
      method: 'post',
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
      },
      data: {
        id,
        firstName: userSaveArgs.firstName,
        lastName: userSaveArgs.lastName,
        phoneNumber: userSaveArgs.phoneNumber,
        password: userSaveArgs.password,
        role: userSaveArgs.role,
        organizationId: userSaveArgs.organizationId,
      },
    });
  };
  
   const onUserSaveArgsChange = (key) => (e) => {
    setUserSaveArgs({
      ...userSaveArgs,
      [key]: e.target.value,
    });
  };
  if (userSaveData) {
    return <Redirect to="/users" />;
  }
  return (
    <Box  className={classes.esRow}>  
      <Form onSubmit={handleSubmit}>
      <Grid container xs={12}  className={classes.root}>
        <CssBaseline />
        <Grid item xs={12} sm={12} md={6}>
          <div className={classes.paper}>
            {id ? (
              <>
                <Typography variant="h6" className={classes.textE}>
                  Редактирование Пользователя
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
                        <DialogContentText>
                          Внестите необходимые изменения, укажите роль и нажмите
                          "Изменить"
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
              </>
            ) : (
              <>
                <Typography className={classes.textC}>
                  Создание Пользователя
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
                        <DialogContentText>
                          Заполните необходимые поля и нажмите "Создать"
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
              </>
            )}
            <Controls.Input
              label="Имя Пользователя"
              name="firstName"
              value={userSaveArgs.firstName}
              onChange={onUserSaveArgsChange('firstName')}
            />{' '}
            <br />
            <Controls.Input
              label="Фамилия Пользователя"
              name="lastName"
              value={userSaveArgs.lastName}
              onChange={onUserSaveArgsChange('lastName')}
            />{' '}
            <br />
            <Controls.Input
              label="Номер Телефона"
              name="phoneNumber"
              value={userSaveArgs.phoneNumber}
              onChange={onUserSaveArgsChange('phoneNumber')}
            />{' '}
            <br />
            <Controls.Input
              label="Пароль"
              name="password"
              value={userSaveArgs.password}
              onChange={onUserSaveArgsChange('password')}
            />{' '}
            <br />
            <Controls.Select
              name="role"
              label="&nbsp;&nbsp;Роль"
              value={userSaveArgs.role}
              onChange={onUserSaveArgsChange('role')}
              options={Services.userRole()}
            />
            {id ? (
              <Controls.OrganizationSelect
                name="organizationId"
                label="&nbsp;&nbsp;Организация"
                value={userSaveArgs.organizationId}
                onChange={onUserSaveArgsChange('organizationId')}
                options={orgsData ? orgsData.list : []}
              />
            ) : null}
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                {id ? (
                  <>
                    <Controls.Button
                      className={classes.btnColor}
                      startIcon={<EditIcon fontSize="small" />}
                      disabled={userSaveLoading}
                      text="Изменить"
                      type="submit"
                      color="primary"
                      onClick={onUserSave}
                    />
                  </>
                ) : (
                  <Controls.Button
                    className={classes.btnColor}
                    startIcon={<AddCircleOutlineIcon fontSize="small" />}
                    disabled={userSaveLoading}
                    text="Создать"
                    type="submit"
                    color="primary"
                    onClick={onUserSave}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <Controls.Button
                  className={classes.btnColor}
                  startIcon={<CloseIcon fontSize="small" />}
                  text="Отмена"
                  color="secondary"
                  onClick={resetForm}
                  component={Link}
                  to="/users"
                />
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Hidden only="xs">
          <Grid item xs={false} sm={12} md={4} className={classes.image}>
            {id ? (
              <>
                <Typography>
                  Внестите необходимые изменения, укажите роль и нажмите "Изменить"
                </Typography>
              </>
            ) : (
              <>
                <Typography>
                  Заполните необходимые поля и нажмите "Создать"
                </Typography>
              </>
            )}
          </Grid>
        </Hidden>
      </Grid>
      {
        (
          user.role === "curator" ||
          user.role === "hr" ||
          user.role === "client" ||
          user.role === "clientAdmin"
        ) ?
        <Redirect to="/"/> : null
      }
    </Form>
    </Box>
  
  );
}
