import React, { useEffect, useState } from 'react';
import { Grid, Typography, Card, CardContent, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, Link, Redirect } from 'react-router-dom';
import useAxios from 'axios-hooks';
import Controls from '../../../../../../Submission/Controls/Controls';
import { Suspense } from 'react';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';

const FileScreenModalLoadable = React.lazy(() =>
  import('../../../../../main/component/file-screen-modal/FileScreenModal'),
);

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingTop:'20px',
    marginBottom:'20px',
    [theme.breakpoints.down('md')]: { 
    width: '100%',
 
    },
    
  },
  card: {
    backgroundColor: '#ebeded',
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(1, 1, 2, 1),
      width: '100%',
    },
    [theme.breakpoints.up('lg')]: {
      
    },
  },
  RvRow: {
    width: '100%',
    paddingLeft:'70px',
    [theme.breakpoints.down('md')]: { 
      paddingLeft:'20px',
    },
    
  },
}));

export default function AdminOrgViewPage() {
  // -- local states --
  const classes = useStyles();
  const { id } = useParams();
  const [openImage, setOpenImage] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [{ data: orgData }, loadById] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/organizations/${id}`,
    },
    { manual: true },
  );
  // -- local effects --
  useEffect(() => {
    if (!id) return;
    loadById({
      url: `${process.env.REACT_APP_API_URL}/organizations/${id}`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
      },
    });
  }, [id]);
  // -- render --
  return (
    <Grid xs={12} container alignItems="center" spacing={2} column>
      <CssBaseline />
      <div  className={classes.RvRow}>
           <Grid item xs={12} sm={12} md={12}>
        <div className={classes.paper}>
          <Grid item xs={12} sm={10} md={12}>
            <Controls.Button
              
              text="Организации"
              variant="outlined"
              color="12"
              component={Link}
              to="/organizations"
              startIcon={<ArrowBackRoundedIcon fontSize="medium" />}
            ></Controls.Button>
          </Grid>
        </div>
        <Grid container spacing={1} >
          <Grid item xs={12} sm={12} md={6}>
            {' '}
            <Card className={classes.card}>
              <CardContent>
                {orgData?.name && (
                  <>
                    <Typography color="textSecondary" gutterBottom>
                      Название организации
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      style={{ marginBottom: '3%' }}
                    >
                      {orgData?.name}
                    </Typography>
                  </>
                )}
                {orgData?.detail?.inn && (
                  <>
                    <Typography color="textSecondary" gutterBottom>
                      ИНН
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      style={{ marginBottom: '3%' }}
                    >
                      {orgData?.detail?.inn}
                    </Typography>
                  </>
                )}
                {orgData?.detail?.passport && (
                  <>
                    <Typography color="textSecondary" gutterBottom>
                      Паспорт
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      style={{ marginBottom: '3%' }}
                    >
                      {orgData?.detail?.passport}
                    </Typography>
                  </>
                )}

                {orgData?.type && (
                  <>
                    {' '}
                    <Typography color="textSecondary" gutterBottom>
                      Тип
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      style={{ marginBottom: '3%' }}
                    >
                      {orgData?.type}
                    </Typography>
                  </>
                )}

                {orgData?.detail?.evidence && (
                  <>
                    {' '}
                    <Typography color="textSecondary" gutterBottom>
                      Свидетельство
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      style={{ marginBottom: '3%' }}
                    >
                      {orgData?.detail?.evidence}
                    </Typography>
                  </>
                )}

                {orgData?.admin?.name && (
                  <>
                    {' '}
                    <Typography color="textSecondary" gutterBottom>
                      Администратор
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      style={{ marginBottom: '3%' }}
                    >
                      {orgData?.admin?.name}
                    </Typography>
                  </>
                )}

                {orgData?.certificate?.expireDate && (
                  <>
                    <Typography color="textSecondary" gutterBottom>
                      Срок истечения сертификата
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      style={{ marginBottom: '3%' }}
                    >
                      {orgData?.detail?.certificate?.expireDate}
                    </Typography>
                  </>
                )}

                {orgData?.detail?.certificate && (
                  <>
                    <Typography color="textSecondary" gutterBottom>
                      Сертификат
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      style={{ marginBottom: '3%' }}
                    >
                      {orgData?.detail?.certificate ? (
                        <img
                          alt="file_image"
                          onClick={(e) => setOpenImage(true)}
                          width="100px"
                          height="100px"
                          src={`${process.env.REACT_APP_UPLOAD_IMAGE_URL}/${orgData.detail.certificate.certificateFile.fileName}`}
                        />
                      ) : null}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Suspense>
        <FileScreenModalLoadable
          openDialog={openImage}
          dialogClose={() => setOpenImage(false)}
          image={orgData?.detail?.certificate?.certificateFile}
        />
      </Suspense>
      {
        (
          user.role === "client" ||
          user.role === "clientAdmin" ||
          user.role === "hr"
        ) ?
        <Redirect to="/"/> : null
      }
      </div> 
    </Grid>

    // <Grid container direction="column">
    //   <div>
    //     <Grid item xs={8}>
    //       <div
    //         style={{
    //           height: 750,
    //           width: '83%',
    //           marginLeft: '100px',
    //         }}
    //       >
    //         <Card className={classes.card}>
    //           <CardContent>

    //           </CardContent>
    //         </Card>
    //         <div className={classes.paper}>
    //           {' '}
    //           <Controls.Button
    //             text="Назад"
    //             color="secondary"
    //             component={Link}
    //             to="/organizations"
    //           />
    //         </div>
    //       </div>
    //     </Grid>
    //   </div>

    // </Grid>
  );
}
