import React, { useEffect, useState } from 'react';
import { Grid, Typography, Card, CardContent, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, Link, Redirect } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { Suspense } from 'react';
import Controls from '../../../../Submission/Controls/Controls';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';

const FileScreenModalLoadable = React.lazy(() =>
  import('../../../main/component/file-screen-modal/FileScreenModal'),
);

const useStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(12, 1, 1, 0),
      width: '100%',
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
      position: 'fixed',
      left: '410px',
      top: '175px',
      right: '200px',
    },
  },
  card: {
    backgroundColor: '#ebeded',
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(1, 1, 2, 1),
      width: '100%',
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
      position: 'fixed',
      left: '420px',
      top: '240px',
      right: '200px',
      width: '40%',
      height: '60%',
    },
    // width: '652px',
    // height: '410px',
    // margin: theme.spacing(2, 2, 1, -28),
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',
  },
}));

export default function ComplainViewPage() {
  // --local state --
  const classes = useStyles();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const [openImage, setOpenImage] = useState(false);
  const [{ data: complainData }, loadById] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/complaints/${id}`,
    },
    { manual: true },
  );
  // -- local effects --
  useEffect(() => {
    if (!id) return;
    loadById({
      url: `${process.env.REACT_APP_API_URL}/complaints/${id}`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
      },
    });
  }, [id]);

  // -- render --
  return (
    <Grid xs={12} container alignItems="center" spacing={2}>
      <CssBaseline />
      <Grid item xs={12} sm={10} md={8}>
        <div>
          <div className={classes.paper}>
            <Grid item xs={12} sm={10} md={12}>
              <Controls.Button
                style={{ marginLeft: '10px' }}
                text="Жалобы"
                variant="outlined"
                color="12"
                component={Link}
                to="/complains"
                startIcon={<ArrowBackRoundedIcon fontSize="medium" />}
              ></Controls.Button>
              {/* <Typography color="12" component={Link} to="/complains" variant="h6">
                <ArrowBackRoundedIcon fontSize="small" /> Жалобы
              </Typography> */}
            </Grid>
          </div>
          <Card className={classes.card}>
            <CardContent>
              {complainData?.createdDate && (
                <>
                  {' '}
                  <Typography color="textSecondary" gutterBottom>
                    Дата создания
                  </Typography>
                  <Typography
                    variant="h5"
                    component="h2"
                    style={{ marginBottom: '5%' }}
                  >
                    {complainData?.createdDate}
                  </Typography>
                </>
              )}

              {complainData?.author.name && (
                <>
                  {' '}
                  <Typography color="textSecondary" gutterBottom>
                    Автор
                  </Typography>
                  <Typography
                    variant="h5"
                    component="h2"
                    style={{ marginBottom: '5%' }}
                  >
                    {complainData?.author.name}
                  </Typography>
                </>
              )}

              {complainData?.description && (
                <>
                  <Typography color="textSecondary" gutterBottom>
                    Описание
                  </Typography>
                  <Typography
                    variant="h5"
                    component="h2"
                    style={{ marginBottom: '5%' }}
                  >
                    {complainData?.description}
                  </Typography>
                </>
              )}

              {complainData?.file && (
                <>
                  <Typography color="textSecondary" gutterBottom>
                    Прикрепленный файл
                  </Typography>
                  <Typography
                    variant="h5"
                    component="h2"
                    style={{ marginBottom: '5%' }}
                  >
                    {complainData?.file ? (
                      <img
                        alt="file_image"
                        onClick={(e) => setOpenImage(true)}
                        width="100px"
                        height="100px"
                        src={`${process.env.REACT_APP_UPLOAD_IMAGE_URL}/${complainData.file.fileName}`}
                      />
                    ) : null}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </Grid>

      <Suspense>
        <FileScreenModalLoadable
          openDialog={openImage}
          dialogClose={() => setOpenImage(false)}
          image={complainData?.file}
        />
      </Suspense>
      {
        user.role === "mainAdmin" ? <Redirect to= "/"/> : null
      }
    </Grid>
  );
}
