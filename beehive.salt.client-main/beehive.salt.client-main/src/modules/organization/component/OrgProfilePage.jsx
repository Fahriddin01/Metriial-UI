import React, { useState, useEffect, useContext, Suspense } from 'react';
import {
  Card,
  CardContent,
  CssBaseline,
  Grid,
  Hidden,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Form } from '../../../Submission/useForm';
import Controls from '../../../Submission/Controls/Controls';
import EditIcon from '@material-ui/icons/Edit';
import ImageUploader from '../../upload/ImageUploader';
import useAxios from 'axios-hooks';
import { makeStyles } from '@material-ui/core/styles';
import { SnackbarStatus, NotificationSnackBarContext } from '../../../App';
import { Redirect } from 'react-router-dom';
import SaveIcon from '@material-ui/icons/Save';
import { CloseIcon } from '@material-ui/data-grid';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '../../../Submission/Controls/Button';

const FileScreenModalLoadable = React.lazy(() =>
  import('../../main/component/file-screen-modal/FileScreenModal'),
);
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '-70px',
    width: '102%',
    [theme.breakpoints.down('md')]: {
      width: '102%',
    },
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '200px',
  },

  btnColor: {
    marginLeft: '8px',
    height: '50px',
    width: '180px',
    [theme.breakpoints.down('sm')]: {
      height: '50px',
      width: '100%',
    },
  },
  btnColoras1: {
    marginLeft: '-150px',
    height: '50px',
    width: '180px',
    [theme.breakpoints.down('md')]: {
      height: '50px',
      width: '100%',
      marginLeft: '-1px',
    },
  },
  image: {
    
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',   
      top: '120px',
      width: '20%',
      // right: '160px',
    },
  
    [theme.breakpoints.down('md')]: {
      textAlign:'center',
      padding:'center',
      width: '100%',
    },
     [theme.breakpoints.down('sm')]: {
   
      width: '100%',
    },
  },
  paper: {
      maxWidth:'730px',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '95%',
    },
    
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
      paddingLeft:'70px',
      // right: '160px',
    },
    
  },

  root: {
    height: '80vh',
    justifyContent:'space-between',
  },
  text: {
    marginLeft: '8px',
    [theme.breakpoints.down('md')]: {
      marginRight: '50px',
    },
  },
  wrapIcon: {
    display: 'inline-block',
    height: '175px',
    width: '155px',
    margin: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: theme.spacing(1, 1, 1, 1),
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
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(6, 1, 3, 0),
      width: '100%',
    },
    margin: theme.spacing(5, 3, 4, 0),
    // width: '360px',
    height: '62px',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default function OrgProfilePage() {
  // -- local states --
  const classes = useStyles();
  const [disabled, setDisabled] = useState(true);
  const notificationContext = useContext(NotificationSnackBarContext);
  const [openImage, setOpenImage] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState({
    id: null,
    name: '',
    inn: '',
    evidence: '',
    passport: '',
    certificate: {
      certificateFileId: null,
      expireDate: null,
    },
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const userFromStorage = localStorage.getItem('user');
  const user = userFromStorage ? JSON.parse(userFromStorage) : null;

  const [
    { data: currentUserData, loading: currentUserLoading },
    fetchCurrentUser,
  ] = useAxios({
    manual: true,
  });

  const [{ data: organizationData }] = useAxios({
    url: `${process.env.REACT_APP_API_URL}/organizations/admin-organization`,
    headers: {
      Authorization: user ? `Bearer ${user.authToken}` : null,
      method: 'get',
    },
  });

  const [
    { data: orgDetails, error: orgDetailsError, loading: orgLoading },
    saveOrgDetails,
  ] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/organizations/details/save`,
    },
    { manual: true },
    {
      useCache: false,
    },
  );

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
    if (!organizationData || !organizationData.detail) return;
    setDetails({
      ...organizationData.detail,
    });
  }, [organizationData]);

  useEffect(() => {
    if (orgDetailsError) {
      notificationContext.notify('Ошибка при сохранении', SnackbarStatus.Error);
    } else if (orgDetails) {
      notificationContext.notify(
        'Данные организации изменены',
        SnackbarStatus.Success,
      );
    }
  }, [orgDetails, orgDetailsError]);

  // -- local functions --
  const onSave = () => {
    const userFromStorage = localStorage.getItem('user');
    const user = userFromStorage ? JSON.parse(userFromStorage) : null;
    saveOrgDetails({
      url: `${process.env.REACT_APP_API_URL}/organizations/details/save`,
      method: 'post',
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
      },
      data: {
        id: details.id,
        inn: details.inn,
        evidence: details.evidence,
        passport: details.passport,
        certificateId: details.certificate?.id,
        certificate: details.certificate
          ? {
              id: details.certificate.id,
              certificateFileId: details.certificate.certificateFileId,
              expireDate: details.certificate.expireDate,
            }
          : null,
      },
    });
  };
  // -- local functions --
  const onUploadComplete = (images) => {
    setDetails({
      ...details,
      certificate: {
        ...details.certificate,
        certificateFileId: images[0].id,
      },
    });
  };
  const buttonEnable = () => {
    setDisabled(!disabled);
    setBtnDisabled(!btnDisabled);
  };
  const onDetailsChange = (key) => (e) => {
    setDetails({
      ...details,
      [key]: e.target.value,
    });
  };

  // --render --
  return (
    <Form>
      <Grid container component="main" className={classes.root} spacing={0}>
        <CssBaseline />
        <Grid item xs={12} sm={12} md={8}>
          <div className={classes.paper}>
            <Typography variant="h6" className={classes.text}>
              Данные Oрганизации
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
                    {'Для чего это нужно?'}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      На этой странице вы можете изменять данные вашей организации,
                      для изменения данных нажмите "Изменить", введите нобходимые
                      данные, загрузите сертификат (Загрузите свой файл) и нажмите
                      "Сохранить"
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
            <Controls.OrgDetailsInput
              label="ИНН"
              name="inn"
              value={details.inn}
              onChange={onDetailsChange('inn')}
              disabled={disabled}
            />{' '}
            <Controls.OrgDetailsInput
              label="Номер Свидетельства"
              name="evidence"
              value={details.evidence}
              onChange={onDetailsChange('evidence')}
              disabled={disabled}
            />{' '}
            <Controls.OrgDetailsInput
              label="Номер Паспорта"
              name="passport"
              value={details.passport}
              onChange={onDetailsChange('passport')}
              disabled={disabled}
            />{' '}
            <form className={classes.container}>
              <TextField
                variant="outlined"
                id="date"
                name="expireDate"
                label="Срок Истечения Сертификата"
                type="date"
                disabled={disabled}
                inputProps={{ style: { fontSize: 18 } }} // font size of input text
                InputLabelProps={{ style: { fontSize: 20 } }} // font size of input label
                value={details.certificate.expireDate}
                className={classes.textField}
                onChange={(e) => {
                  setDetails({
                    ...details,
                    certificate: {
                      ...details.certificate,
                      expireDate: e.target.value,
                    },
                  });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
            <br />
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
              <ImageUploader
                onUploadComplete={onUploadComplete}
                // className={classes.imgBtn}
              />
            </Grid>
            {details.certificate.certificateFile ? (
              <div style={{ display: 'inline-block' }}>
                <Grid item xs={12} sm={12} md={12} lg={2}>
                  <Card className={classes.wrapIcon}>
                    <CardContent>
                      {' '}
                      <img
                        alt="image_certificate"
                        onClick={(e) => setOpenImage(true)}
                        style={{ height: '100px' }}
                        src={`${process.env.REACT_APP_UPLOAD_IMAGE_URL}/${details.certificate.certificateFile.fileName}`}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </div>
            ) : null}
            <Grid container spacing={2}>
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
                  text="Сохранить"
                  color="primary"
                  disabled={btnDisabled}
                  disabled={orgLoading}
                  onClick={onSave}
                />
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Hidden only="xs">
          {' '}
          <Grid item xs={12} sm={12} md={4} className={classes.image}>
            <Typography variant="h5">Для чего это нужно?</Typography>
            <Typography>
              На этой странице вы можете изменять данные вашей организации, для
              изменения данных нажмите "Изменить", введите нобходимые данные,
              загрузите сертификат (Загрузите свой файл) и нажмите "Сохранить"
            </Typography>
          </Grid>
        </Hidden>
      </Grid>
      <Suspense>
        <FileScreenModalLoadable
          openDialog={openImage}
          dialogClose={() => setOpenImage(false)}
          image={details?.certificate.certificateFile}
        />
      </Suspense>
      {
        (
          user.role === "supervisorAdmin" ||
          user.role === "mainAdmin" ||
          user.role === "curaator" ||
          user.role === "client" ||
          user.role === "hr"
        ) ? <Redirect to="/"/> : null
      }
    </Form>
  );
}
