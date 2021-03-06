import React, { useState, useContext, useEffect } from 'react';
import { Link, useParams, Redirect } from 'react-router-dom';
import {
  Grid,
  makeStyles,
  CssBaseline,
  Typography,
  Hidden,
  Card,
  CardContent,
  Button,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import useAxios from 'axios-hooks';
import { useForm, Form } from '../../../../Submission/useForm';
import * as Services from '../../../../Submission/Services/Services';
import Controls from '../../../../Submission/Controls/Controls';
import ImageUploader from '../../../upload/ImageUploader';
import ClearIcon from '@material-ui/icons/Clear';
import { ReportUtils } from '../../utils/ReportUtils';
import { SnackbarStatus, NotificationSnackBarContext } from '../../../../App';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { Suspense } from 'react';
const FileScreenModalLoadable = React.lazy(() =>
  import('../../../main/component/file-screen-modal/FileScreenModal'),
);

const useStyles = makeStyles((theme) => ({
  root: {
    height: '80vh',
    paddingLeft:'70px',
    justifyContent:'space-between',
     [theme.breakpoints.down('md')]: {
      paddingLeft:'20px',
    },
    // position: 'fixed',
    // width: '50hw',
    // margin: theme.spacing(8, 1, 1, 10),
  },
  image: {
    paddingTop:'50px',
    maxWidth:'430px',
    [theme.breakpoints.down('lg')]: {
      flexDirection: 'column',
      maxWidth:'95%',
      textAlign:'center',
     
      // right: '160px',
    },
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(1, 1, 1, 3),
    },
  },
  btn: {
    alignItems: 'center',
    display: 'flex',
    width: '96%',
   
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(1, 1, 2, 1),
    },
  },
  btnColor: {
    marginRight: '20px',
    height: '50px',
    width: '180px',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 1, 2, 1),
      height: '50px',
      width: '135px',
    },
  },
  btnColor1: {
   marginRight: '20px',
    height: '50px',
    width: '180px',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 1, 2, 1),
      height: '50px',
      width: '135px',
    },
  },
  paper1: {
    maxWidth: '730px',
    [theme.breakpoints.down('md')]: {
    
    },
  
     [theme.breakpoints.down('lg')]: {
        maxWidth: '100%',
     // right: '160px',
    },
    flexDirection: 'column',
    alignItems: 'center',
  },
  imgBtn: {
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 1, 2, 1),
      width: '100%',
    },
    margin: theme.spacing(2, 2, 1, 1),
    // width: '360px',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
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
}));

const initialValues = {
  id: null,
  activity: '', // "production" | "processing" | "packaging" | "sale"
  batchNumberIn: '',
  batchNumberOut: '',
  saltCategoryIn: '',
  saltCategoryOut: '',
  totalVolumeIn: '',
  totalVolumeOut: '',
  description: '',
  measureIn: '',
  measureOut: '', // "ton" | "kg",
  action: '', // "sale" | "store",
  labResult: '',
  client: '',
  iodine??oncentration: '',
  processing: '',
  potassiumIodate: '',
  potassiumIodateMeasure: '',
  invoiceNumber: '',
  files: [],
};

export default function ReportAddEditForm() {
  const classes = useStyles();
  const { activity, id } = useParams();
  const [report, setReport] = useState(initialValues);
  const [progress, setProgress] = React.useState(false);
  const timer = React.useRef();
  const notificationContext = useContext(NotificationSnackBarContext);
  const [openImage, setOpenImage] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [
    { data: reportSaveData, loading, error: reportSaveError },
    execute,
  ] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/reports/save`,
    },
    { manual: true },
  );

  const [{ data: reportData }, loadReportById] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/reports/${id}`,
    },
    { manual: true },
  );

  useEffect(() => {
    if (!activity) return;
    setReport({
      ...report,
      activity,
    });
  }, [activity]);

  useEffect(() => {
    if (reportSaveError) {
      validate();
      notificationContext.notify('???????????? ?????? ????????????????????', SnackbarStatus.Error);
    } else if (reportSaveData) {
      notificationContext.notify('?????????? ?????????????? ????????????????', SnackbarStatus.Success);
      resetForm();
    }
  }, [reportSaveData, reportSaveError]);

  useEffect(() => {
    if (!reportData) return;
    setReport({
      ...reportData,
    });
  }, [reportData]);

  useEffect(() => {
    if (!id) return;
    loadReportById({
      url: `${process.env.REACT_APP_API_URL}/reports/${id}`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
      },
    });
  }, [id]);

  const validate = (fieldValues = report) => {
    let temp = { ...errors };

    if ('batchNumberOut' in fieldValues)
      temp.batchNumberOut =
        fieldValues.batchNumberOut.length !== 0
          ? ''
          : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    if ('description' in fieldValues)
      temp.description =
        fieldValues.description.length <= 0
          ? ''
          : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    if ('client' in fieldValues)
      temp.client =
        fieldValues.client.length !== 0 ? '' : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    if ('saltCategoryOut' in fieldValues)
      temp.saltCategoryOut = fieldValues.saltCategoryOut
        ? ''
        : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    if ('saltCategoryIn' in fieldValues)
      temp.saltCategoryIn = fieldValues.saltCategoryIn
        ? ''
        : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    if ('potassiumIodate' in fieldValues)
      temp.potassiumIodate = fieldValues.potassiumIodate
        ? ''
        : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    if ('potassiumIodateMeasure' in fieldValues)
      temp.potassiumIodateMeasure = fieldValues.potassiumIodateMeasure
        ? ''
        : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    if ('totalVolumeOut' in fieldValues)
      temp.totalVolumeOut =
        fieldValues.totalVolumeOut.length !== 0
          ? ''
          : '*?????? ???????? ?????????????????????? ?? ????????????????????.';

    if ('measureIn' in fieldValues)
      temp.measureIn =
        fieldValues.measureIn.length !== 0
          ? ''
          : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    if ('measureOut' in fieldValues)
      temp.measureOut =
        fieldValues.measureOut.length !== 0
          ? ''
          : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    if ('totalVolumeIn' in fieldValues)
      temp.totalVolumeIn =
        fieldValues.totalVolumeIn.length !== 0
          ? ''
          : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    if ('action' in fieldValues)
      temp.action = fieldValues.action ? '' : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    if ('labResult' in fieldValues)
      temp.labResult =
        fieldValues.labResult.length !== 0
          ? ''
          : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    if ('processing' in fieldValues)
      temp.processing = fieldValues.processing
        ? ''
        : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    if ('weightUnitSale' in fieldValues)
      temp.weightUnitSale =
        fieldValues.weightUnitSale.length !== 0
          ? ''
          : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    if ('invoiceNumber' in fieldValues)
      temp.invoiceNumber =
        fieldValues.invoiceNumber.length !== 0
          ? ''
          : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    if ('iodine??oncentration' in fieldValues)
      temp.iodine??oncentration =
        fieldValues.iodine??oncentration.length !== 0
          ? ''
          : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    if ('iodineConcentration' in fieldValues)
      temp.iodineConcentration = fieldValues.iodineConcentration
        ? ''
        : '*?????? ???????? ?????????????????????? ?? ????????????????????.';
    setErrors({
      ...temp,
    });
  };

  const { errors, setErrors } = useForm(initialValues, true, validate);

  const resetForm = () => {
    setReport(initialValues);
    setErrors({});
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      resetForm();
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);
  const handleButtonClick = () => {
    if (!progress) {
      setProgress(true);
      timer.current = window.setTimeout(() => {
        setProgress(false);
      }, 2000);
    }
  };

  const onReportUpdate = (key) => (e) => {
    setReport({
      ...report,
      [key]: e.target.value,
    });
  };

  const onSave = () => {
    execute({
      url: `${process.env.REACT_APP_API_URL}/reports/save`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
      },
      data: {
        report: {
          ...report,
          activity,
          totalVolumeIn: report.totalVolumeIn
            ? parseInt(report.totalVolumeIn)
            : null,
          totalVolumeOut: report.totalVolumeOut
            ? parseInt(report.totalVolumeOut)
            : null,
        },
      },
    });
  };

  const onUploadComplete = (images) => {
    setReport({
      ...report,
      files: report.files.concat(images),
    });
  };

  const activityName = report.activity
    ? ReportUtils.getNameByValue(report.activity)
    : null;
  if (reportSaveData) {
    return <Redirect to="/reports" />;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container column className={classes.root}>
        <CssBaseline />

        <Grid item xs={12} sm={12} md={6}>
          <div>
            {report.activity === 'sale' && (
              <div className={classes.paper1}>
                <Grid item xs={12} sm={12} md={12}>
                  {' '}
                  <Controls.Button
                    style={{ marginLeft: '10px' }}
                    variant="outlined"
                    color="12"
                    component={Link}
                    to="/reports/add"
                    text={activityName}
                    startIcon={<ArrowBackRoundedIcon fontSize="medium" />}
                  ></Controls.Button>
                </Grid>

                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Controls.Input
                      label="*K??????????"
                      name="client"
                      value={report.client}
                      onChange={onReportUpdate('client')}
                      error={errors.client}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}  style={{fontSize:'20px'}}>
                    <Controls.Select
                      name="saltCategoryOut"
                      label="&nbsp;&nbsp;*?????????????????? ???????? (???? ????????????)"
                      value={report.saltCategoryOut}
                      onChange={onReportUpdate('saltCategoryOut')}
                      options={Services.getProductCategory()}
                      error={errors.saltCategoryOut}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Controls.Input
                      label="*?????????? ???????????? (???? ????????????)"
                      type="number"
                      name="batchNumberOut"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.batchNumberOut}
                      onChange={onReportUpdate('batchNumberOut')}
                      error={errors.batchNumberOut}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Controls.Input
                      label="*?????????? ??????????????????"
                      name="invoiceNumber"
                      value={report.invoiceNumber}
                      onChange={onReportUpdate('invoiceNumber')}
                      error={errors.invoiceNumber}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  {' '}
                  <Controls.Comment
                    label="*?????????????? ??????????????????"
                    multiline
                    rows={2}
                    rowsMax={4}
                    name="description"
                    value={report.description}
                    onChange={onReportUpdate('description')}
                    error={errors.description}
                  />
                </Grid>

                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Controls.Input
                      label="*?????????? ?????????? (???? ????????????)"
                      type="number"
                      name="totalVolumeOut"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.totalVolumeOut}
                      onChange={onReportUpdate('totalVolumeOut')}
                      error={errors.totalVolumeOut}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Controls.Select
                      name="measureOut"
                      label="&nbsp;&nbsp;*????????"
                      value={report.measureOut}
                      onChange={onReportUpdate('measureOut')}
                      options={Services.getWeightUnit()}
                      error={errors.measureOut}
                    />
                  </Grid>
                </Grid>
              </div>
            )}
            {report.activity === 'mining' && (
              <div className={classes.paper1}>
                <Grid item xs={12} sm={12} md={12}>
                  <Controls.Button
                    style={{ marginLeft: '10px' }}
                    variant="outlined"
                    color="12"
                    component={Link}
                    to="/reports/add"
                    text={activityName}
                    startIcon={<ArrowBackRoundedIcon fontSize="medium" />}
                  ></Controls.Button>
                </Grid>

                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Controls.Select
                      name="saltCategoryOut"
                      label="&nbsp;&nbsp;*?????????????????? ???????? (???? ????????????)"
                      value={report.saltCategoryOut}
                      onChange={onReportUpdate('saltCategoryOut')}
                      options={Services.getProductCategory()}
                      error={errors.saltCategoryOut}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Controls.Input
                      label="*?????????? ???????????? (???? ????????????)"
                      type="number"
                      name="batchNumberOut"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.batchNumberOut}
                      onChange={onReportUpdate('batchNumberOut')}
                      error={errors.batchNumberOut}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  {' '}
                  <Controls.Comment
                    label="*??????????????
            ??????????????????"
                    multiline
                    rows={2}
                    rowsMax={4}
                    name="description"
                    value={report.description}
                    onChange={onReportUpdate('description')}
                    error={errors.description}
                    className={classes.input}
                  />
                </Grid>

                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Controls.Input
                      label="*?????????? ?????????? (???? ????????????)"
                      type="number"
                      name="totalVolumeOut"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.totalVolumeOut}
                      onChange={onReportUpdate('totalVolumeOut')}
                      error={errors.totalVolumeOut}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Controls.Select
                      name="measureOut"
                      label="&nbsp;&nbsp;*????????"
                      value={report.measureOut}
                      onChange={onReportUpdate('measureOut')}
                      options={Services.getWeightUnit()}
                      error={errors.measureOut}
                    />
                  </Grid>
                </Grid>
                <Controls.Select
                  name="action"
                  label="&nbsp;&nbsp;*????????????????"
                  value={report.action}
                  onChange={onReportUpdate('action')}
                  options={Services.getActionType()}
                  error={errors.action}
                />
              </div>
            )}
            {(report.activity === 'processing' ||
              report.activity === 'packaging' ||
              report.activity === 'production') && (
              <div className={classes.paper1}>
                <Grid item xs={12} sm={10} md={12}>
                  <Controls.Button
                    style={{ marginLeft: '10px' }}
                    variant="outlined"
                    color="12"
                    component={Link}
                    to="/reports/add"
                    text={activityName}
                    startIcon={<ArrowBackRoundedIcon fontSize="medium" />}
                  ></Controls.Button>
                </Grid>

                {report.activity === 'packaging' ||
                  ('processing' && (
                    <div>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={12} md={6}>
                          <Controls.Input
                            label="*?????????? ??????????"
                            name="potassiumIodate"
                            InputProps={{ inputProps: { min: 0 } }}
                            value={report.potassiumIodate}
                            onChange={onReportUpdate('potassiumIodate')}
                            error={errors.potassiumIodate}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                          <Controls.Select
                            name="potassiumIodateMeasure"
                            label="&nbsp;&nbsp;*????????"
                            value={report.potassiumIodateMeasure}
                            onChange={onReportUpdate('potassiumIodateMeasure')}
                            options={Services.getWeightUnit()}
                            error={errors.potassiumIodateMeasure}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                <Grid item xs={12} sm={12} md={12}>
                  <Controls.Comment
                    label="*??????????????
                 ??????????????????"
                    multiline
                    rows={2}
                    rowsMax={4}
                    name="description"
                    value={report.description}
                    onChange={onReportUpdate('description')}
                    error={errors.description}
                    className={classes.input}
                  />
                </Grid>

                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Controls.Input
                      label="*?????????? ???????????? (??????????????????????)"
                      type="number"
                      name="batchNumberIn"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.batchNumberIn}
                      onChange={onReportUpdate('batchNumberIn')}
                      error={errors.batchNumberIn}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Controls.Select
                      name="saltCategoryIn"
                      label="&nbsp;&nbsp;*?????????????????? ???????? (??????????????????????)"
                      value={report.saltCategoryIn}
                      onChange={onReportUpdate('saltCategoryIn')}
                      options={Services.getProductCategory()}
                      error={errors.saltCategoryIn}
                    />{' '}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Controls.Input
                      label="*?????????? ?????????? (??????????????????????)"
                      type="number"
                      name="totalVolumeIn"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.totalVolumeIn}
                      onChange={onReportUpdate('totalVolumeIn')}
                      error={errors.totalVolumeIn}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Controls.Select
                      name="measureIn"
                      label="&nbsp;&nbsp;*????????"
                      value={report.measureIn}
                      onChange={onReportUpdate('measureIn')}
                      options={Services.getWeightUnit()}
                      error={errors.measureIn}
                    />{' '}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={6}>
                    {' '}
                    <Controls.Select
                      name="processing"
                      label="&nbsp;&nbsp;*??????????????????????"
                      value={report.processing}
                      onChange={onReportUpdate('processing')}
                      options={Services.getProductCategory()}
                      error={errors.processing}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    {' '}
                    <Controls.Select
                      name="saltCategoryOut"
                      label="&nbsp;&nbsp;*?????????????????? ???????? (???? ????????????)"
                      value={report.saltCategoryOut}
                      onChange={onReportUpdate('saltCategoryOut')}
                      options={Services.getProductCategory()}
                      error={errors.saltCategoryOut}
                    />{' '}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Controls.Input
                      label="*?????????? ?????????? (???? ????????????)"
                      type="number"
                      name="totalVolumeOut"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.totalVolumeOut}
                      onChange={onReportUpdate('totalVolumeOut')}
                      error={errors.totalVolumeOut}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <Controls.Select
                      name="measureOut"
                      label="&nbsp;&nbsp;*????????"
                      value={report.measureOut}
                      onChange={onReportUpdate('measureOut')}
                      options={Services.getWeightUnit()}
                      error={errors.measureOut}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={6}>
                    {' '}
                    <Controls.Input
                      label="*?????????? ???????????? (???? ????????????)"
                      type="number"
                      name="batchNumberOut"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.batchNumberOut}
                      onChange={onReportUpdate('batchNumberOut')}
                      error={errors.batchNumberOut}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    {' '}
                    <Controls.Select
                      name="action"
                      label="&nbsp;&nbsp;*????????????????"
                      value={report.action}
                      onChange={onReportUpdate('action')}
                      options={Services.getActionType()}
                      error={errors.action}
                    />{' '}
                  </Grid>
                </Grid>

                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Controls.Select
                      name="iodine??oncentration"
                      label="&nbsp;&nbsp;*???????????????????????? ????????"
                      value={report.iodine??oncentration}
                      onChange={onReportUpdate('iodine??oncentration')}
                      options={Services.getIodineConcentration()}
                      error={errors.iodine??oncentration}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    {' '}
                    <Controls.Input
                      label="*???????????????????????? ????????????????????"
                      name="labResult"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.labResult}
                      onChange={onReportUpdate('labResult')}
                      error={errors.labResult}
                    />{' '}
                  </Grid>
                </Grid>

                <ImageUploader onUploadComplete={onUploadComplete} />

                {report.files?.map((file, index) => {
                  return (
                    <div style={{ display: 'inline-block' }}>
                      <Grid key={index} item xs={12} sm={12} md={12} lg={2}>
                        <Card className={classes.wrapIcon}>
                          <CardContent>
                            {' '}
                            <img
                              className={classes.wrapIcon1}
                              onClick={(e) => setOpenImage(true)}
                              alt="image_download"
                              width="120px"
                              height="100px"
                              key={file.id}
                              src={`${process.env.REACT_APP_UPLOAD_IMAGE_URL}/${file.fileName}`}
                            />{' '}
                            <Suspense>
                              <FileScreenModalLoadable
                                openDialog={openImage}
                                dialogClose={() => setOpenImage(false)}
                                image={file}
                              />
                            </Suspense>
                            <Button>
                              {' '}
                              ??????????????
                              <CancelOutlinedIcon
                                fontSize="medium"
                                onClick={() =>
                                  setReport({
                                    ...report,
                                    files: report.files.filter(
                                      (_, eachIndex) => eachIndex !== index,
                                    ),
                                  })
                                }
                              />
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    </div>
                  );
                })}
              </div>
            )}
            <Grid container spacing={0} className={classes.btn}>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                {' '}
                {id ? (
                  <>
                    <Controls.Button
                      className={classes.btnColor}
                      disabled={loading}
                      type="submit"
                      text="????????????????"
                      onClick={() => {
                        onSave();
                        {
                          reportSaveError && <Link to="/reports"></Link>;
                        }
                      }}
                    />
                  </>
                ) : (
                  <Controls.Button
                    className={classes.btnColor1}
                    disabled={loading}
                    startIcon={<SendIcon fontSize="small" />}
                    type="submit"
                    text="??????????????????"
                    onClick={() => {
                      onSave();
                      handleButtonClick();

                      {
                        reportSaveError && <Link to="/reports"></Link>;
                      }
                    }}
                  >
                    {progress && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </Controls.Button>
                )}
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <Controls.Button
                  className={classes.btnColor1}
                  startIcon={<ClearIcon fontSize="small" />}
                  text="????????????????"
                  color="secondary"
                  onClick={resetForm}
                  component={Link}
                  to="/reports"
                />
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Hidden only="xs">
          <Grid item xs={12} sm={12} md={4} className={classes.image}>
            <Typography>
              ???? ???????? ???????????????? ???? ???????????? ???????????????? ???????? ??????, ?????????????? ?? ????????????. ??????
              ??????????????????, ?????????????? "????????????????", ?????????????? ?????????????????????? ???????????? ?? ??????????????
              "??????????????????"
            </Typography>
          </Grid>
        </Hidden>
      </Grid>
      {
        (
          user.role === "supervisorAdmin" ||
          user.role === "mainAdmin" ||
          user.role === "hr" ||
          user.role === "curator"
        ) ? 
        <Redirect to="/"/> : null
      }
    </Form>
  );
}
