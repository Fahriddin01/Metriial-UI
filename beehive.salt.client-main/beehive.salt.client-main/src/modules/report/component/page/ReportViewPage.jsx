import React, { useEffect, useState, useRef } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CssBaseline,
  TextareaAutosize,
  Button,
  Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect, useParams } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { Suspense } from 'react';
import { ReportUtils } from '../../utils/ReportUtils';
import Controls from '../../../../Submission/Controls/Controls';
import { Link } from 'react-router-dom';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';

const FileScreenModalLoadable = React.lazy(() =>
  import('../../../main/component/file-screen-modal/FileScreenModal'),
);

const useStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.down('md')]: {  
      width: '100%',
    },
    display: 'flex',
 
  },
  mainDiv: {
    [theme.breakpoints.down('md')]: {     
    },
    [theme.breakpoints.up('lg')]: {
    
    },
  },
  title: {
    fontSize: '14px',
    // fontWeight: 'bold',
  },
  card: {
    [theme.breakpoints.down('md')]: {
    },
    backgroundColor: '#ebeded',
    
    display: 'flex',
    flexDirection: 'column',
    minHeight:'300px',
    width:'100%',
  },
  RCrad: {
    [theme.breakpoints.down('md')]: {
      marginBottom:'20px',
      }
  },
  CardRow: {
    padding:'0px',
  },
  CardBox:{
    paddingLeft:'70px',
    paddingTop:'40px',
     [theme.breakpoints.down('md')]: {
       paddingLeft:'20px',
      }
  },
}));

export default function ComplainViewPage() {
  // --local state --
  const classes = useStyles();
  const { id } = useParams();
  const [openImage, setOpenImage] = useState(false);
  const [originalStatus, setOriginalStatus] = useState('');
  const [status, setStatus] = useState('approved');
  const [rejectText, setRejectText] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const [
    { data: reportsData, loading: reportsLoading, error: reportsError },
    loadById,
  ] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/reports/${id}`,
    },
    { manual: true },
  );
  const [
    { data: reportSaveData, loading, error: reportSaveError },
    updateReportStatus,
  ] = useAxios({ manual: true });
  // -- local effects --
  useEffect(() => {
    if (!id) return;
    loadById({
      url: `${process.env.REACT_APP_API_URL}/reports/${id}`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
      },
    });
  }, [id]);

  const translateCategory = (value) => {
    switch (value) {
      case 'EXTRA':
        return 'Экстра';
      case 'FIRSTGRADESALT':
        return 'Намаки оши- навьи якум';
      case 'SECONDGRADESALT':
        return 'Намаки оши - навьи дуюм';
      case 'DRINKINGSALT':
        return 'Намаки ошомидани';
      case 'TECHSALT':
        return 'Намаки техники';
      case 'ROCKSALT':
        return 'Намаки санги';

      default:
        return null;
    }
  };

  const translateMeasure = (value) => {
    switch (value) {
      case 'ton':
        return 'Тонна';
      case 'kg':
        return 'Кг';
      default:
        return null;
    }
  };
  const translateStatus = (value) => {
    switch (value) {
      case 'inProgress':
        return 'В процессе';
      case 'concidered':
        return 'Рассмотрено';
      case 'approved':
        return 'Принято';
      default:
        return null;
    }
  };
  const translateAction = (value) => {
    switch (value) {
      case 'store':
        return 'Продажа';
      case 'sale':
        return 'Складировать';
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!reportsData) return;
    if (['approved', 'rejected'].includes(reportsData.status)) {
      setStatus(reportsData.status);
    }
    setOriginalStatus(reportsData.status);
    setRejectText(reportsData.rejectText);
  }, [reportsData]);

  const onSave = () => {
    updateReportStatus({
      url: `${process.env.REACT_APP_API_URL}/reports/update-status`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
      },
      data: {
        status,
        rejectText,
        reportId: reportsData.id,
      },
    });
  };

  useEffect(() => {
    if (!reportSaveData) return;
    setOriginalStatus(reportSaveData.report.status);
  });

  // -- render --
  return (
    <Box  className={classes.CardBox}>
       <div className={classes.mainDiv}>
        <CssBaseline />
        <Grid item xs={12} sm={12} md={12} >
          <div className={classes.paper}>
            <Grid item xs={12} sm={10} md={12}>
              <Controls.Button
                style={{ marginLeft: '10px' }}
                text="Отчеты"
                variant="outlined"
                color="12"
                component={Link}
                to="/reports"
                startIcon={<ArrowBackRoundedIcon fontSize="medium" />}
              ></Controls.Button>
            </Grid>
          </div>
          <div className={classes.paper}>
            <Grid item xs={12} sm={10} md={12}>
              
            </Grid>
          </div>
          <Grid container spacing={10} style={{margin:'0px',
          width:'100%',
          justifyContent:'space-around',
          paddingTop:'30px'}}>
            <Grid item xs={12} sm={4} md={4} lg={4} style={{padding:'0px',margin:'15px'}}  className={classes.RCrad}>
              {' '}
              <Card className={classes.card}>
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textPrimary"
                    gutterBottom
                  >
                    Подробная информация
                  </Typography>
                  {reportsData?.id && (
                    <>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        ID
                      </Typography>
                      <Typography>{reportsData?.id}</Typography>
                    </>
                  )}
                  {reportsData?.createdDate && (
                    <>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Дата создания
                      </Typography>
                      <Typography>{reportsData?.createdDate}</Typography>
                    </>
                  )}

                  {reportsData?.status && (
                    <>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Статус
                      </Typography>
                      <Typography>{translateStatus(reportsData?.status)}</Typography>
                    </>
                  )}
                  {reportsData?.updatedDate && (
                    <>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Дата обновления
                      </Typography>
                      <Typography>{reportsData?.updatedDate}</Typography>
                    </>
                  )}

                  {reportsData?.action && (
                    <>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Действие
                      </Typography>
                      <Typography>{translateAction(reportsData?.action)}</Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4} style={{padding:'0px',margin:'15px'}}  className={classes.RCrad}>
              
              {' '}
              <Card className={classes.card}>
                <CardContent>
                  {reportsData?.batchNumberIn && (
                    <>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Номер Партии (поступление)
                      </Typography>
                      <Typography>{reportsData?.batchNumberIn}</Typography>
                    </>
                  )}

                  {reportsData?.batchNumberOut && (
                    <>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Номер Партии (на выходе)
                      </Typography>
                      <Typography>{reportsData?.batchNumberOut}</Typography>
                    </>
                  )}

                  {reportsData?.client && (
                    <>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Kлиент
                      </Typography>
                      <Typography>{reportsData?.client}</Typography>
                    </>
                  )}

                  {reportsData?.description && (
                    <>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Описание
                      </Typography>
                      <Typography>{reportsData?.description}</Typography>
                    </>
                  )}

                  {reportsData?.iodineСoncentration && (
                    <>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Концентрация Йода
                      </Typography>
                      <Typography>{reportsData?.iodineСoncentration}</Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4} style={{padding:'0px',margin:'15px'}}  className={classes.RCrad}>
              {' '}
              <Card className={classes.card}>
                <CardContent>
                  {reportsData?.labResult && (
                    <>
                      {' '}
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Лабораторные результаты
                      </Typography>
                      <Typography>{reportsData?.labResult}</Typography>
                    </>
                  )}

                  {reportsData?.organization.name && (
                    <>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Название организации
                      </Typography>
                      <Typography>{reportsData?.organization.name}</Typography>
                    </>
                  )}

                  {reportsData?.organizationId && (
                    <>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Идентификатор организации(ID)
                      </Typography>
                      <Typography>{reportsData?.organizationId}</Typography>
                    </>
                  )}

                  {reportsData?.saltCategoryIn && (
                    <>
                      {' '}
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Категории соли (поступление)
                      </Typography>
                      <Typography>
                        {translateCategory(reportsData?.saltCategoryIn)}
                      </Typography>
                    </>
                  )}

                  {reportsData?.saltCategoryOut && (
                    <>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Категории соли (на выходе)
                      </Typography>
                      <Typography>
                        {translateCategory(reportsData?.saltCategoryOut)}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4} style={{padding:'0px',margin:'15px'}} className={classes.RCrad}>
              <Card className={classes.card}>
                <CardContent>
                  {reportsData?.totalVolumeIn && (
                    <>
                      {' '}
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Общий Объем (поступление)
                      </Typography>
                      <Typography>{reportsData?.totalVolumeIn}</Typography>
                    </>
                  )}

                  {reportsData?.measureIn && (
                    <>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Единица веса
                      </Typography>
                      <Typography>
                        {translateMeasure(reportsData?.measureIn)}
                      </Typography>
                    </>
                  )}

                  {reportsData?.totalVolumeOut && (
                    <>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Общий Объем (на выходе)
                      </Typography>
                      <Typography>{reportsData?.totalVolumeOut}</Typography>
                    </>
                  )}

                  {reportsData?.measureOut && (
                    <>
                      {' '}
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Единица веса
                      </Typography>
                      <Typography>
                        {translateMeasure(reportsData?.measureOut)}
                      </Typography>
                    </>
                  )}
                  {reportsData?.files?.originalName && (
                    <>
                      {' '}
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        File name
                      </Typography>
                      <Typography>{reportsData?.files?.originalName}</Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4} style={{padding:'0px',margin:'15px'}}className={classes.RCrad}>
              <Card className={classes.card} style={{padding:'16px'}} >
                <CardContent>
                  {reportsData?.files && (
                    <>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        Прикрепленный файл
                      </Typography>
                      <Typography>
                        {reportsData?.files
                          ? reportsData.files.map((img, index) => {
                              return (
                                <div key={index}>
                                  <img
                                    alt="file_image"
                                    onClick={(e) => setOpenImage(true)}
                                    width="100px"
                                    height="100px"
                                    src={`${process.env.REACT_APP_UPLOAD_IMAGE_URL}/${img.fileName}`}
                                  />
                                  <Suspense>
                                    <FileScreenModalLoadable
                                      openDialog={openImage}
                                      dialogClose={() => setOpenImage(false)}
                                      image={img}
                                    />
                                  </Suspense>
                                </div>
                              );
                            })
                          : null}
                      </Typography>
                    </>
                  )}
                </CardContent>
                {user.role === 'curator' && (
                    <div>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Выберите статус</FormLabel>
                        <RadioGroup
                          aria-label="status"
                          name="status"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <FormControlLabel
                            value="approved"
                            control={<Radio />}
                            label="Принять"
                          />
                          <FormControlLabel
                            value="rejected"
                            control={<Radio />}
                            label="Отклонить"
                          />
                        </RadioGroup>
                      </FormControl>
                      {status === 'rejected' && (
                        <TextareaAutosize
                          aria-label="Укажите причину"
                          placeholder="Укажите причину"
                          onChange={(e) => setRejectText(e.target.value)}
                          value={rejectText}
                        />
                      )}
                      <Button
                        disabled={
                          originalStatus === status &&
                          rejectText === reportsData.rejectText
                        }
                        variant="contained"
                        color="primary"
                        onClick={() => onSave()}
                      >
                        Применить
                      </Button>
                    </div>
                  )}
              </Card>
              
            </Grid>
          </Grid>
          {/* <Card className={classes.card}>
          <CardContent>
            <Grid item xs={12} sm={10} md={4}></Grid>
          </CardContent>
        </Card> */}
        </Grid>
      </div>
    <Grid xs={12} container  >
     
    </Grid>
    </Box>
   
  );
}
