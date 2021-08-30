import React, { useState, useContext, useEffect } from 'react';
import {
  Grid,
  Typography,
  makeStyles,
  CssBaseline,
  useTheme,
  useMediaQuery,
  Hidden,
  Card,
  CardContent,
  Button,
} from '@material-ui/core';
import { Form } from '../../../../Submission/useForm';
import Controls from '../../../../Submission/Controls/Controls';
import useAxios from 'axios-hooks';

import { SnackbarStatus, NotificationSnackBarContext } from '../../../../App';
import { useForm } from '../../../../Submission/useForm';
import ImageUploader from './../../../upload/ImageUploader';
import { Redirect, Link, useParams } from 'react-router-dom';
import * as Services from '../../../../Submission/Services/Services';
import SendIcon from '@material-ui/icons/Send';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Suspense } from 'react';
import useCurrentUser from '../../../hooks/useCurrentUser';
const FileScreenModalLoadable = React.lazy(() =>
  import('../../../main/component/file-screen-modal/FileScreenModal'),
);

const useStyles = makeStyles((theme) => ({
  root: {
    height: '80vh',
    justifyContent:'space-between',
    paddingLeft:'70px',
    [theme.breakpoints.down('lg')]: {
      paddingLeft:'20px',
      // right: '160px',
    },
  },
  image: {
    maxWidth:'430px',
    paddingTop:'30px',
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
     
      // right: '160px',
    },
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(1, 1, 1, 3),
      
      maxWidth:'100%',
    },
  },
  paper: {
    maxWidth:'730px',
    [theme.breakpoints.down('md')]: {
      maxWidth: '95%',
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
      // right: '160px',
    },
  },
  btnColor: {
    marginLeft: '8px',
    // height: '50px',
    // width: '180px',
    [theme.breakpoints.down('sm')]: {
      height: '50px',
      width: '100%',
    },
  },
  btnColor1: {
    marginLeft: '8px',
    // height: '50px',
    // width: '180px',
    [theme.breakpoints.down('sm')]: {
      height: '50px',
      width: '100%',
    },
  },
  text: {
    marginLeft: '8px',
    [theme.breakpoints.down('md')]: {
      marginRight: '125px',
    },
  },
  wrapIcon: {
    display: 'inline-block',
    height: '175px',
    width: '155px',
    margin: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: theme.spacing(-2, -5, 1, 0),
      // display: 'inline-block',
    },
  },
  wrapIcon1: {
    margin: theme.spacing(0.5),

    [theme.breakpoints.down('sm')]: {
      width: '100%',
      // display: 'inline-block',
    },
  },
  imgBtn: {
    // marginLeft: '8px',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 1, 2, 0),
      width: '100%',
    },
    margin: theme.spacing(0, 1, 4, 0),

    height: '62px',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  Box :{
    maxWidth:'730px',
    width:'100%',
    [theme.breakpoints.down('lg')]: {
       maxWidth:'100%',
    },
  }
}));

export default function ComplainAddEditPage() {
  const classes = useStyles();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [openImage, setOpenImage] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // -- local states --
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [inputData, setInputData] = useState({
    category: '',
    description: '',
    fileId: null,
  });
  const [
    {
      data: complainSaveData,
      error: complainSaveError,
      loading: complainSaveLoading,
    },
    onComplainSave,
  ] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/complains/save`,
    },
    { manual: true },
  );
  const [{ data: complainData }, loadComplainById] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/complaints/${id}`,
    },
    { manual: true },
  );
  const notificationContext = useContext(NotificationSnackBarContext);

  const userFromStorage = localStorage.getItem('user');
  const user = userFromStorage ? JSON.parse(userFromStorage) : null;
  const [
    { data: currentUserData, loading: currentUserLoading },
    fetchCurrentUser,
  ] = useAxios({
    manual: true,
  });

  // const validate = (fieldValues = inputData) => {
  //   let temp = { ...errors };

  //   if ('category' in fieldValues)
  //     temp.category =
  //       fieldValues.category.length !== 0
  //         ? ''
  //         : '*Это поле обязательно к заполнению.';

  //   setErrors({
  //     ...temp,
  //   });
  // };
  // const { errors, setErrors } = useForm(true, validate);
  const onUploadComplete = (images) => {
    setInputData({
      ...inputData,
      file: images[0],
    });
  };

  // -- local effects --
  useEffect(() => {
    fetchCurrentUser({
      url: `${process.env.REACT_APP_API_URL}/users/current-user`,
      headers: {
        Authorization: user ? `Bearer ${user.authToken}` : null,
        method: 'get',
      },
    });
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (!id) return;
    loadComplainById({
      url: `${process.env.REACT_APP_API_URL}/complaints/${id}`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
      },
    });
  }, [id]);

  useEffect(() => {
    if (!complainData) return;
    setInputData({
      category: complainData.category,
      description: complainData.description,
      fileId: complainData.fileId,
    });
  }, [complainData]);

  useEffect(() => {
    if (complainSaveError) {
      notificationContext.notify('Ошибка при отправке', SnackbarStatus.Error);
    } else if (complainSaveData) {
      notificationContext.notify('Жалоба отправлена', SnackbarStatus.Success);
    }
  }, [complainSaveData, complainSaveError]);

  // -- local functions --

  const onHandleUpdate = (key) => (e) => {
    setInputData({
      ...inputData,
      [key]: e.target.value,
    });
    if (e.target.value) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  };

  const { resetForm } = useForm(true);

  const onHandleSave = () => {
    const userFromStorage = localStorage.getItem('user');
    const user = userFromStorage ? JSON.parse(userFromStorage) : null;
    // query api
    onComplainSave({
      url: `${process.env.REACT_APP_API_URL}/complaints/save`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
      },
      data: {
        complain: {
          category: inputData.category,
          description: inputData.description,
          fileId: inputData.file?.id,
        },
      },
    });
  };
  if (complainSaveData) {
    return <Redirect to="/complains" />;
  }
  return (
    <Form>
      <Grid container xs={12} className={classes.root}>
        <CssBaseline />
        <Grid item xs={12} sm={12} className={classes.Box} >
          <div className={classes.paper}>
            <Typography variant="h6" className={classes.text}>
              Форма Жалобы
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
                      На этой странице вы можете изменить свое имя, фамилию и пароль.
                      Для изменения, нажмите "Изменить", введите необходимые данные и
                      нажмите "Сохранить"
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Controls.Button
                      onClick={handleClose}
                      color="secondary"
                      text="Закрыть"
                      startIcon={<CloseIcon fontSize="small" />}
                    ></Controls.Button>
                  </DialogActions>
                </Dialog>
              </Hidden>
            </Typography>
            <Controls.Select
              inputProps={{ style: { fontSize: 14 } }} // font size of input text
              InputLabelProps={{ style: { fontSize: 16 } }} // font size of input label
              name="category"
              label="&nbsp;&nbsp;Кому"
              value={inputData.category}
              onChange={onHandleUpdate('category')}
              options={Services.complainCategory()}
            />
            <Controls.Comment
              label="Описание Проблемы"
              multiline
              rows={2}
              rowsMax={4}
              name="description"
              value={inputData.description}
              onChange={onHandleUpdate('description')}
            />{' '}
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              className={classes.imgBtn}
            >
              {' '}
              <ImageUploader onUploadComplete={onUploadComplete} />
            </Grid>
            {inputData.file ? (
              <div style={{ display: 'inline-block' }}>
                <Grid item xs={12} sm={12} md={12} lg={2}>
                  <Card className={classes.wrapIcon}>
                    <CardContent>
                      <img
                        className={classes.wrapIcon1}
                        onClick={(e) => setOpenImage(true)}
                        alt="image_complainn"
                        width="120px"
                        height="100px"
                        src={`${process.env.REACT_APP_UPLOAD_IMAGE_URL}/${inputData.file.fileName}`}
                      />
                      <Suspense>
                        <FileScreenModalLoadable
                          openDialog={openImage}
                          dialogClose={() => setOpenImage(false)}
                          image={inputData.file}
                        />
                      </Suspense>
                      <Button>
                        {' '}
                        Удалить
                        <CancelOutlinedIcon
                          fontSize="medium"
                          onClick={() =>
                            setInputData({
                              ...inputData.file,
                              file: null,
                            })
                          }
                        />
                      </Button>
                      {/* <button
                          onClick={() =>
                            setInputData({
                              ...inputData.file,
                              file: null,
                            })
                          }
                        >
                          Удалить
                        </button> */}
                    </CardContent>
                  </Card>
                </Grid>
              </div>
            ) : null}
            {/* <div> */}
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6} md={4} lg={4}>
                {id ? (
                  <Controls.Button
                    className={classes.btnColor}
                    startIcon={<EditIcon fontSize="small" />}
                    text="Изменить"
                    color="primary"
                    onClick={onHandleSave}
                    disabled={btnDisabled}
                    disabled={complainSaveLoading}
                  />
                ) : (
                  <Controls.Button
                    className={classes.btnColor}
                    startIcon={<SendIcon fontSize="small" />}
                    text="Отправить"
                    color="primary"
                    onClick={onHandleSave}
                    disabled={btnDisabled}
                    disabled={complainSaveLoading}
                  />
                )}
              </Grid>
              <Grid item xs={6} sm={6} md={4} lg={4}>
                <Controls.Button
                  className={classes.btnColor1}
                  startIcon={<CloseIcon fontSize="small" />}
                  text="Отмена"
                  color="secondary"
                  onClick={resetForm}
                  component={Link}
                  to="/complains"
                />
              </Grid>
            </Grid>
            {/* </div> */}
          </div>
        </Grid>
        <Hidden only="xs">
          {' '}
          <Grid item xs={false} sm={12}  className={classes.image}>
            {/* <Typography variant="h5">Жалобы</Typography> */}
            <Typography>
              Для того чтобы отправить жалобу, вы должны заполнить все имеющиеся
              поля, а так же загрузить изображение с вашей проблемой. Жалобы делятся
              на 2 типа, технические(которые связаны непосредственно с багами
              приложения ) и обычные. Чтобы отправить техническую жалобу в поле
              "Кому" необходимо выбрать "Администратор"ммм
            </Typography>
          </Grid>
        </Hidden>
      </Grid>
      
      {
        (
          user.role === "mainAdmin" ||
          user.role === "supervisorAdmin" ||
          user.role === "hr" || 
          user.role === "curator"
          ) ? 
          <Redirect to="/"/> 
          : null
      }
    </Form>
  );
}
