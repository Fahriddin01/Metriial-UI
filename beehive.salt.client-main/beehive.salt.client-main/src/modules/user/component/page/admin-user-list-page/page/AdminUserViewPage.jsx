import React, { useEffect } from 'react';
import { Grid, Typography, Card, CardContent, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, Link, Redirect } from 'react-router-dom';
import useAxios from 'axios-hooks';
import Controls from './../../../../../../Submission/Controls/Controls';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';

const useStyles = makeStyles((theme) => ({
  paper: {
      margin: theme.spacing(4, 0, 4, 0),
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
    
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
     
    },
  },
  UvRow : {
    paddingLeft:'70px',
      width: '100%',
  [theme.breakpoints.down('md')]: {
    paddingLeft:'20px',
    },
  },

}));

export default function AdminUserViewPage() {
  // -- local states --
  const classes = useStyles();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const [{ data: userData }, loadById] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/users/${id}`,
    },
    { manual: true },
  );
  // -- local effects --
  useEffect(() => {
    if (!id) return;
    loadById({
      url: `${process.env.REACT_APP_API_URL}/users/${id}`,
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
      <div className={classes.UvRow}>
          <Grid item xs={12} sm={12} md={12} >
        <div className={classes.paper}>
          <Grid item xs={12} sm={10} md={12} >
            <Controls.Button
              style={{ marginTop: '20px', marginBotton:'15px' }}
              text="Пользователи"
              variant="outlined"
              color="12"
              component={Link}
              to="/users"
              startIcon={<ArrowBackRoundedIcon fontSize="medium" />}
            ></Controls.Button>
          </Grid>
        </div>
        <Grid container spacing={1} >
          <Grid item xs={12} sm={12} md={6}>
            {' '}
            <Card className={classes.card}>
              <CardContent>
                {userData?.name && (
                  <>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Пользователь
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      style={{ marginBottom: '3%' }}
                    >
                      {userData?.name}
                    </Typography>
                  </>
                )}
                {userData?.firstName && (
                  <>
                    {' '}
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Имя
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      style={{ marginBottom: '3%' }}
                    >
                      {userData?.firstName}
                    </Typography>
                  </>
                )}

                {userData?.lastName && (
                  <>
                    {' '}
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Фамилия
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      style={{ marginBottom: '3%' }}
                    >
                      {userData?.lastName}
                    </Typography>
                  </>
                )}

                {userData?.phoneNumber && (
                  <>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Номер телефона
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      style={{ marginBottom: '3%' }}
                    >
                      {userData?.phoneNumber}
                    </Typography>
                  </>
                )}

                {userData?.organization && (
                  <>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Роль
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      style={{ marginBottom: '3%' }}
                    >
                      {userData?.role}
                    </Typography>
                  </>
                )}

                {userData?.organization ? (
                  <>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Организация
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      style={{ marginBottom: '3%' }}
                    >
                      {userData?.organization.name}
                    </Typography>
                  </>
                ) : null}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      {
        (
          user.role === "curator" ||
          user.role === "hr" ||
          user.role === "client" ||
          user.role === "clientAdmin"
        )  ?
        <Redirect to="/"/> : null
      }
      </div>
    
    </Grid>

    // <Grid container direction="column">
    //   <div className={classes.root}>
    //     <Grid item xs={4}>
    //       {' '}
    //     </Grid>
    //     <Grid item xs={8}>
    //       <div
    //         style={{
    //           height: 750,
    //           width: '85%',
    //           marginLeft: '100px',
    //         }}
    //       >
    //         <Card className={classes.card}>
    //           <CardContent>
    //             <Typography
    //               className={classes.title}
    //               color="textSecondary"
    //               gutterBottom
    //             >
    //               Пользователь
    //             </Typography>
    //             <Typography variant="h5" component="h2">
    //               {userData?.name}
    //             </Typography>
    //             <Typography
    //               className={classes.title}
    //               color="textSecondary"
    //               gutterBottom
    //             >
    //               Имя
    //             </Typography>
    //             <Typography variant="h5" component="h2">
    //               {userData?.firstName}
    //             </Typography>
    //             <Typography
    //               className={classes.title}
    //               color="textSecondary"
    //               gutterBottom
    //             >
    //               Фамилия
    //             </Typography>
    //             <Typography variant="h5" component="h2">
    //               {userData?.lastName}
    //             </Typography>
    //             <Typography
    //               className={classes.title}
    //               color="textSecondary"
    //               gutterBottom
    //             >
    //               Номер телефона
    //             </Typography>
    //             <Typography variant="h5" component="h2">
    //               {userData?.phoneNumber}
    //             </Typography>
    //             <Typography
    //               className={classes.title}
    //               color="textSecondary"
    //               gutterBottom
    //             >
    //               Роль
    //             </Typography>
    //             <Typography variant="h5" component="h2">
    //               {userData?.role}
    //             </Typography>
    //             {userData?.organization ? (
    //               <>
    //                 <Typography
    //                   className={classes.title}
    //                   color="textSecondary"
    //                   gutterBottom
    //                 >
    //                   Организация
    //                 </Typography>
    //                 <Typography variant="h5" component="h2">
    //                   {userData?.organization.name}
    //                 </Typography>
    //               </>
    //             ) : null}
    //           </CardContent>
    //         </Card>
    //         <div className={classes.paper}>
    //           {' '}
    //           <Controls.Button
    //             text="Назад"
    //             color="secondary"
    //             component={Link}
    //             to="/users"
    //           />
    //         </div>
    //       </div>
    //     </Grid>
    //   </div>
    // </Grid>
  );
}
