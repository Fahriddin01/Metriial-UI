import React, { useState, useEffect, useContext } from 'react';
import {
  CssBaseline,
  Grid,
  Hidden,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { Form, useForm } from '../../../../../../Submission/useForm';
import Controls from '../../../../../../Submission/Controls/Controls';
import useAxios from 'axios-hooks';
import { Link, Redirect, useParams } from 'react-router-dom';
import { SnackbarStatus, NotificationSnackBarContext } from '../../../../../../App';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { makeStyles } from '@material-ui/core/styles';
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
   
    [theme.breakpoints.up('lg')]: {
    paddingLeft:'70px',
    },
    [theme.breakpoints.up('md')]: {
    paddingLeft:'30px',
    },
  },
  image: {
    [theme.breakpoints.up('lg')]: {
      paddingLeft:'50px',
     justifyContent:'center',
      // right: '160px',
    },
  },
  paper: {
    
    [theme.breakpoints.down('md')]: {
    
      width: '90%',
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
     
      // right: '160px',
    },
  },
  btnColor: {
    marginLeft: '8px',

    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 2, 2, 1),
      height: '50px',
      width: '145px',
    },
  },
  textC: {
    marginLeft: '8px',
    [theme.breakpoints.down('sm')]: {
      marginRight: '30px',
    },
  },
  textE: {
    marginLeft: '8px',
    [theme.breakpoints.down('sm')]: {
      marginRight: '5px',
    },
  },
  Lrow : {
  maxWidth:'730px',
  width:'100%',
    [theme.breakpoints.down('lg')]: {
      maxWidth:'100%',
    },
  }
}));

const initialValues = {
  name: '',
  adminId: null,
  type: '',
  curatorId: null,
};

const organizationTypes = ['supervisor', 'client'];

export default function AdminOrgAddEditForm() {
  const classes = useStyles();
  // -- local states --
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const notificationContext = useContext(NotificationSnackBarContext);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [orgSaveArgs, setOrgSaveArgs] = useState(initialValues);

  const [
    { data: orgSaveData, loading: orgSaveLoading, error: orgSaveError },
    execute,
  ] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/organizations/create-or-update`,
    },
    { manual: true },
  );
  const [{ data: orgData }, loadOrgById] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/organizations/${id}`,
    },
    { manual: true },
  );

  const [{ data: usersData }, loadUsers] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/users/get-by-filter`,
    },
    {
      manual: true,
    },
    {
      useCache: false,
    },
  );
  const validate = (fieldValues = orgSaveArgs) => {
    let temp = { ...errors };

    if ('name' in fieldValues)
      temp.name = fieldValues.name ? '' : 'Это поле обязательно для заполнения';
    if ('type' in fieldValues)
      temp.type = fieldValues.type ? '' : 'Это поле обязательно для заполнения';
    if ('curatorId' in fieldValues)
      temp.curatorId = fieldValues.curatorId
        ? ''
        : 'Это поле обязательно для заполнения';
    // if ('adminId' in fieldValues)
    //   temp.adminId = fieldValues.adminId
    //     ? ''
    //     : 'Это поле обязательно для заполнения';
    setErrors({
      ...temp,
    });
  };
  const { errors, setErrors } = useForm(initialValues, true, validate);

  // -- local effects --
  useEffect(() => {
    if (orgSaveError) {
      validate();
      notificationContext.notify('Ошибка при сохранении', SnackbarStatus.Error);
    } else if (orgSaveData) {
      notificationContext.notify('Организация создана', SnackbarStatus.Success);
      resetForm();
    }
  }, [orgSaveData, orgSaveError]);

  useEffect(() => {
    if (!orgData) return;
    setOrgSaveArgs({
      ...orgData,
    });
  }, [orgData]);

  useEffect(() => {
    const filterRoles = [];

    if (user.role === 'mainAdmin') {
      filterRoles.push('supervisorAdmin');
    } else if (user.role === 'supervisorAdmin') {
      filterRoles.push('clientAdmin');
      filterRoles.push('curator');
    }
    loadUsers({
      url: `${process.env.REACT_APP_API_URL}/users/get-by-filter`,
      method: 'get',
      params: {
        filter: {
          roles: filterRoles,
        },
      },
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
        method: 'get',
      },
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    loadOrgById({
      url: `${process.env.REACT_APP_API_URL}/organizations/${id}`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
      },
    });
  }, [id]);

  // -- Local functions --

  const resetForm = () => {
    setOrgSaveArgs(initialValues);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      resetForm();
    }
  };
  const onOrgSave = () => {
    execute({
      url: `${process.env.REACT_APP_API_URL}/organizations/create-or-update`,
      method: 'post',
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
      },
      data: {
        id,
        name: orgSaveArgs.name,
        adminId: orgSaveArgs.adminId,
        type: orgSaveArgs.type,
        curatorId: orgSaveArgs.curatorId,
      },
    });
  };
  const onOrgSaveArgsChange = (key) => (e) => {
    setOrgSaveArgs({
      ...orgSaveArgs,
      [key]: e.target.value,
    });
  };

  if (orgSaveData) {
    return <Redirect to="/organizations" />;
  }
  // -- render --
  return (
    <Form onSubmit={handleSubmit}>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid  className={classes.Lrow}>
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
                <Typography variant="h6" className={classes.textC}>
                  Создание Организации
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
              label="Название Организации"
              name="name"
              value={orgSaveArgs.name}
              onChange={onOrgSaveArgsChange('name')}
              error={errors.name}
            />
            <Controls.SelectType
              label="Тип организации"
              name="type"
              value={orgSaveArgs.type}
              onChange={onOrgSaveArgsChange('type')}
              options={organizationTypes}
              error={errors.type}
            />{' '}
            {orgSaveArgs.type === 'client' ? (
              <Controls.CuratorSelect
                label="&nbsp;&nbsp;Куратор"
                name="curatorId"
                value={orgSaveArgs.curatorId}
                onChange={onOrgSaveArgsChange('curatorId')}
                options={usersData ? usersData.list : []} // change to curators data
                error={errors.curatorId}
              />
            ) : null}
            <Controls.UsersSelect
              label="&nbsp;&nbsp;Администратор Организации"
              name="adminId"
              value={orgSaveArgs.adminId}
              onChange={onOrgSaveArgsChange('adminId')}
              options={usersData ? usersData.list : []}
              error={errors.adminId}
            />{' '}
            <Grid container spacing={1}>
              <Grid item xs={6} sm={6} md={4} lg={4}>
                {id ? (
                  <>
                    <Controls.Button
                      className={classes.btnColor}
                      startIcon={<EditIcon fontSize="large" />}
                      disabled={orgSaveLoading}
                      text="Изменить"
                      type="submit"
                      color="primary"
                      onClick={onOrgSave}
                    />
                  </>
                ) : (
                  <Controls.Button
                    className={classes.btnColor}
                    startIcon={<AddCircleOutlineIcon fontSize="small" />}
                    disabled={orgSaveLoading}
                    text="Создать"
                    type="submit"
                    color="primary"
                    onClick={onOrgSave}
                  />
                )}
              </Grid>
              <Grid item xs={6} sm={6} md={4} lg={12}>
                <Controls.Button
                  className={classes.btnColor}
                  startIcon={<CloseIcon fontSize="small" />}
                  text="Отмена"
                  color="secondary"
                  onClick={resetForm}
                  component={Link}
                  to="/organizations"
                />
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Hidden only="xs">
          <Grid item xs={12}  className={classes.image}>
            {id ? (
              <>
                <Typography>
                  Внестите необходимые изменения и нажмите "Изменить"
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
      {user.role === 'curator' ||
      user.role === 'hr' ||
      user.role === 'client' ||
      user.role === 'clientAdmin' ? (
        <Redirect to="/" />
      ) : null}
    </Form>
  );
}
