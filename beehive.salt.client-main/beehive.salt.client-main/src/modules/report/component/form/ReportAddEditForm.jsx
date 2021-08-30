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
    // position: 'fixed',
    // width: '50hw',
    // margin: theme.spacing(8, 1, 1, 10),
  },
  image: {
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
   
      right: '160px',
      top: '230px',
      width: '20%',
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
    margin: theme.spacing(1, 2, 1, -27),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(1, 1, 2, 1),
    },
  },
  btnColor: {
    marginLeft: '1px',
    height: '50px',
    width: '180px',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 1, 2, 1),
      height: '50px',
      width: '160px',
    },
  },
  btnColor1: {
    marginLeft: '1px',
    height: '50px',
    width: '180px',
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 1, 2, 1),
      height: '50px',
      width: '160px',
    },
  },
  paper1: {
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(1, 1, 2, 1),
      width: '90%',
    },

    margin: theme.spacing(9, 20, 1, -28),
    width: '730px',

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
  iodineСoncentration: '',
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
      notificationContext.notify('Ошибка при сохранении', SnackbarStatus.Error);
    } else if (reportSaveData) {
      notificationContext.notify('Отчет успешно сохранен', SnackbarStatus.Success);
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
          : '*Это поле обязательно к заполнению.';
    if ('description' in fieldValues)
      temp.description =
        fieldValues.description.length <= 0
          ? ''
          : '*Это поле обязательно к заполнению.';
    if ('client' in fieldValues)
      temp.client =
        fieldValues.client.length !== 0 ? '' : '*Это поле обязательно к заполнению.';
    if ('saltCategoryOut' in fieldValues)
      temp.saltCategoryOut = fieldValues.saltCategoryOut
        ? ''
        : '*Это поле обязательно к заполнению.';
    if ('saltCategoryIn' in fieldValues)
      temp.saltCategoryIn = fieldValues.saltCategoryIn
        ? ''
        : '*Это поле обязательно к заполнению.';
    if ('potassiumIodate' in fieldValues)
      temp.potassiumIodate = fieldValues.potassiumIodate
        ? ''
        : '*Это поле обязательно к заполнению.';
    if ('potassiumIodateMeasure' in fieldValues)
      temp.potassiumIodateMeasure = fieldValues.potassiumIodateMeasure
        ? ''
        : '*Это поле обязательно к заполнению.';
    if ('totalVolumeOut' in fieldValues)
      temp.totalVolumeOut =
        fieldValues.totalVolumeOut.length !== 0
          ? ''
          : '*Это поле обязательно к заполнению.';

    if ('measureIn' in fieldValues)
      temp.measureIn =
        fieldValues.measureIn.length !== 0
          ? ''
          : '*Это поле обязательно к заполнению.';
    if ('measureOut' in fieldValues)
      temp.measureOut =
        fieldValues.measureOut.length !== 0
          ? ''
          : '*Это поле обязательно к заполнению.';
    if ('totalVolumeIn' in fieldValues)
      temp.totalVolumeIn =
        fieldValues.totalVolumeIn.length !== 0
          ? ''
          : '*Это поле обязательно к заполнению.';
    if ('action' in fieldValues)
      temp.action = fieldValues.action ? '' : '*Это поле обязательно к заполнению.';
    if ('labResult' in fieldValues)
      temp.labResult =
        fieldValues.labResult.length !== 0
          ? ''
          : '*Это поле обязательно к заполнению.';
    if ('processing' in fieldValues)
      temp.processing = fieldValues.processing
        ? ''
        : '*Это поле обязательно к заполнению.';
    if ('weightUnitSale' in fieldValues)
      temp.weightUnitSale =
        fieldValues.weightUnitSale.length !== 0
          ? ''
          : '*Это поле обязательно к заполнению.';
    if ('invoiceNumber' in fieldValues)
      temp.invoiceNumber =
        fieldValues.invoiceNumber.length !== 0
          ? ''
          : '*Это поле обязательно к заполнению.';
    if ('iodineСoncentration' in fieldValues)
      temp.iodineСoncentration =
        fieldValues.iodineСoncentration.length !== 0
          ? ''
          : '*Это поле обязательно к заполнению.';
    if ('iodineConcentration' in fieldValues)
      temp.iodineConcentration = fieldValues.iodineConcentration
        ? ''
        : '*Это поле обязательно к заполнению.';
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

        <Grid item xs={12} sm={10} md={6}>
          <div>
            {report.activity === 'sale' && (
              <div className={classes.paper1}>
                <Grid item xs={12} sm={10} md={12}>
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
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Input
                      label="*Kлиент"
                      name="client"
                      value={report.client}
                      onChange={onReportUpdate('client')}
                      error={errors.client}
                    />
                  </Grid>
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Select
                      name="saltCategoryOut"
                      label="&nbsp;&nbsp;*Категории Соли (на выходе)"
                      value={report.saltCategoryOut}
                      onChange={onReportUpdate('saltCategoryOut')}
                      options={Services.getProductCategory()}
                      error={errors.saltCategoryOut}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Input
                      label="*Номер Партии (на выходе)"
                      type="number"
                      name="batchNumberOut"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.batchNumberOut}
                      onChange={onReportUpdate('batchNumberOut')}
                      error={errors.batchNumberOut}
                    />
                  </Grid>
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Input
                      label="*Номер Накладной"
                      name="invoiceNumber"
                      value={report.invoiceNumber}
                      onChange={onReportUpdate('invoiceNumber')}
                      error={errors.invoiceNumber}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={10} md={12}>
                  {' '}
                  <Controls.Comment
                    label="*Введите Сообщение"
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
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Input
                      label="*Общий Объем (на выходе)"
                      type="number"
                      name="totalVolumeOut"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.totalVolumeOut}
                      onChange={onReportUpdate('totalVolumeOut')}
                      error={errors.totalVolumeOut}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Select
                      name="measureOut"
                      label="&nbsp;&nbsp;*Тонн"
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

                <Grid container spacing={1}>
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Select
                      name="saltCategoryOut"
                      label="&nbsp;&nbsp;*Категории Соли (на выходе)"
                      value={report.saltCategoryOut}
                      onChange={onReportUpdate('saltCategoryOut')}
                      options={Services.getProductCategory()}
                      error={errors.saltCategoryOut}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Input
                      label="*Номер Партии (на выходе)"
                      type="number"
                      name="batchNumberOut"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.batchNumberOut}
                      onChange={onReportUpdate('batchNumberOut')}
                      error={errors.batchNumberOut}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={10} md={12}>
                  {' '}
                  <Controls.Comment
                    label="*Введите
            Сообщение"
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
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Input
                      label="*Общий Объем (на выходе)"
                      type="number"
                      name="totalVolumeOut"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.totalVolumeOut}
                      onChange={onReportUpdate('totalVolumeOut')}
                      error={errors.totalVolumeOut}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Select
                      name="measureOut"
                      label="&nbsp;&nbsp;*Тонн"
                      value={report.measureOut}
                      onChange={onReportUpdate('measureOut')}
                      options={Services.getWeightUnit()}
                      error={errors.measureOut}
                    />
                  </Grid>
                </Grid>
                <Controls.Select
                  name="action"
                  label="&nbsp;&nbsp;*Действие"
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
                        <Grid item xs={12} sm={10} md={6}>
                          <Controls.Input
                            label="*Калий Йодат"
                            name="potassiumIodate"
                            InputProps={{ inputProps: { min: 0 } }}
                            value={report.potassiumIodate}
                            onChange={onReportUpdate('potassiumIodate')}
                            error={errors.potassiumIodate}
                          />
                        </Grid>
                        <Grid item xs={12} sm={10} md={6}>
                          <Controls.Select
                            name="potassiumIodateMeasure"
                            label="&nbsp;&nbsp;*Тонн"
                            value={report.potassiumIodateMeasure}
                            onChange={onReportUpdate('potassiumIodateMeasure')}
                            options={Services.getWeightUnit()}
                            error={errors.potassiumIodateMeasure}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                <Grid item xs={12} sm={10} md={12}>
                  <Controls.Comment
                    label="*Введите
                 Сообщение"
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
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Input
                      label="*Номер Партии (поступление)"
                      type="number"
                      name="batchNumberIn"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.batchNumberIn}
                      onChange={onReportUpdate('batchNumberIn')}
                      error={errors.batchNumberIn}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Select
                      name="saltCategoryIn"
                      label="&nbsp;&nbsp;*Категории Соли (поступление)"
                      value={report.saltCategoryIn}
                      onChange={onReportUpdate('saltCategoryIn')}
                      options={Services.getProductCategory()}
                      error={errors.saltCategoryIn}
                    />{' '}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Input
                      label="*Общий Объем (поступление)"
                      type="number"
                      name="totalVolumeIn"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.totalVolumeIn}
                      onChange={onReportUpdate('totalVolumeIn')}
                      error={errors.totalVolumeIn}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Select
                      name="measureIn"
                      label="&nbsp;&nbsp;*Тонн"
                      value={report.measureIn}
                      onChange={onReportUpdate('measureIn')}
                      options={Services.getWeightUnit()}
                      error={errors.measureIn}
                    />{' '}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={10} md={6}>
                    {' '}
                    <Controls.Select
                      name="processing"
                      label="&nbsp;&nbsp;*Переработка"
                      value={report.processing}
                      onChange={onReportUpdate('processing')}
                      options={Services.getProductCategory()}
                      error={errors.processing}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={10} md={6}>
                    {' '}
                    <Controls.Select
                      name="saltCategoryOut"
                      label="&nbsp;&nbsp;*Категории Соли (на выходе)"
                      value={report.saltCategoryOut}
                      onChange={onReportUpdate('saltCategoryOut')}
                      options={Services.getProductCategory()}
                      error={errors.saltCategoryOut}
                    />{' '}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Input
                      label="*Общий Объем (на выходе)"
                      type="number"
                      name="totalVolumeOut"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.totalVolumeOut}
                      onChange={onReportUpdate('totalVolumeOut')}
                      error={errors.totalVolumeOut}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Select
                      name="measureOut"
                      label="&nbsp;&nbsp;*Тонн"
                      value={report.measureOut}
                      onChange={onReportUpdate('measureOut')}
                      options={Services.getWeightUnit()}
                      error={errors.measureOut}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={10} md={6}>
                    {' '}
                    <Controls.Input
                      label="*Номер Партии (на выходе)"
                      type="number"
                      name="batchNumberOut"
                      InputProps={{ inputProps: { min: 0 } }}
                      value={report.batchNumberOut}
                      onChange={onReportUpdate('batchNumberOut')}
                      error={errors.batchNumberOut}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={10} md={6}>
                    {' '}
                    <Controls.Select
                      name="action"
                      label="&nbsp;&nbsp;*Действие"
                      value={report.action}
                      onChange={onReportUpdate('action')}
                      options={Services.getActionType()}
                      error={errors.action}
                    />{' '}
                  </Grid>
                </Grid>

                <Grid container spacing={1}>
                  <Grid item xs={12} sm={10} md={6}>
                    <Controls.Select
                      name="iodineСoncentration"
                      label="&nbsp;&nbsp;*Концентрация Йода"
                      value={report.iodineСoncentration}
                      onChange={onReportUpdate('iodineСoncentration')}
                      options={Services.getIodineConcentration()}
                      error={errors.iodineСoncentration}
                    />{' '}
                  </Grid>
                  <Grid item xs={12} sm={10} md={6}>
                    {' '}
                    <Controls.Input
                      label="*Лабораторные Результаты"
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
                              Удалить
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
              <Grid item xs={6} sm={6} md={4} lg={4}>
                {' '}
                {id ? (
                  <>
                    <Controls.Button
                      className={classes.btnColor}
                      disabled={loading}
                      type="submit"
                      text="Изменить"
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
                    text="Отправить"
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
              <Grid item xs={6} sm={6} md={4} lg={4}>
                <Controls.Button
                  className={classes.btnColor1}
                  startIcon={<ClearIcon fontSize="small" />}
                  text="Отменить"
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
          <Grid item xs={12} sm={12} md={5} className={classes.image}>
            <Typography>
              На этой странице вы можете изменить свое имя, фамилию и пароль. Для
              изменения, нажмите "Изменить", введите необходимые данные и нажмите
              "Сохранить"
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
