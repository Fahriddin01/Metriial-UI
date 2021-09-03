import React, { useState, useEffect } from 'react';
import { CssBaseline, Grid, Card, CardContent, Typography,Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Chart from './Chart';
import { Redirect } from 'react-router-dom';
import useAxios from 'axios-hooks';
// import ButtonBase from '@material-ui/core/ButtonBase';
import  { Link }  from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 1, 1, 0),
    },
    '& .super-app-theme--header': {
      backgroundColor: '#ebeded',
    },
  },
  paper: {
    [theme.breakpoints.down('sm')]: {
   
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
     
    },
  },
  container: {
    display: 'flex',
    columnGap: '6%',
  },
  container2: {
    display: 'flex',
    columnGap: '6%',
  },
  card: {
    width: 275,
    minHeight: 125,
  },
  title: {
    fontSize: 14,
     [theme.breakpoints.down('sm')]: {
      fontSize: 10,
      marginLeft: '-10px',
    },
  },
  column: {
    marginTop: 15,
    display: 'flex',
    alignContent: 'flex-end',
    justifyContent: 'center',
    columnGap: '6%',
  },
  card2: {
    width: 275,
    minHeight: 125,
  
  },
  graphic: {
    display: 'flex',
    height: '100%',
    width: '78%',
  },
  dRow : {
    paddingTop: '20px',
    paddingLeft:'70px',
    [theme.breakpoints.down('sm')]: {
     paddingLeft:'20px',
    }
  
  }
}));

const cards = [
  {
    section: 1,
    name: 'Количество отчетов',
    value: 'reportsCount',
  },
  {
    section: 1,
    name: 'Количество пользователей',
    value: 'usersCount',
    link: '/users'
  },
  {
    section: 1,
    name: 'Количество организаций',
    value: 'organizationCount',
    link: '/organizations'
  },
  {
    section: 1,
    name: 'Количество жалоб',
    value: 'complaintsCount',
  },
  {
    section: 2,
    name: 'Количество йодированной соли',
    value: 'iodineTotalVolumeIn',
  },
  {
    section: 2,
    name: 'Количество добытой соли',
    value: 'totalVolumeIn',
  },
];

export default function Dashboard() {
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('user'));

  const [{ data: statData }, fetchStatData] = useAxios({
    url: `${process.env.REACT_APP_API_URL}/admins/get-general-statistic`,
    headers: {
      Authorization: `Bearer ${user ? user.authToken : null}`,
      method: 'get',
    },
  });
  useEffect(() => {
    if (!user) return;
    fetchStatData();
  }, [fetchStatData]);

  return (
    <Box className={classes.dRow}>
        <Grid xs={12} container alignItems="center" spacing={2}>
      <CssBaseline />
      <Grid item xs={12}>
        <div className={classes.paper}>
          <div className={classes.container}>
            {cards
              .filter((card) => card.section === 1)
              .map((card) => {
                return (
                  // <ButtonBase onClick={}>
                  <Card 
                    className={classes.card}
                    component={Link}
                    to={card.link}
                  >
                    <CardContent>
                      <Typography className={classes.title}>{card.name}</Typography>
                      <Typography variant="h5" component="h2">
                        {statData && statData[card.value]}
                      </Typography>
                    </CardContent>
                  </Card>
                  // </ButtonBase>
                );
              })}
          </div>
          <div className={classes.container2}>
            <Chart statData={statData} cards={cards}/>
          </div>
          <div className={classes.column}>
            {cards
              .filter((card) => card.section === 2)
              .map((card) => {
                return (
                  <Card className={classes.card2}>
                    <CardContent>
                      <Typography className={classes.title}>{card.name}</Typography>
                      <Typography variant="h5" component="h2">
                        {statData && statData[card.value]}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </Grid>
      {
        (
          user.role === "client" ||
          user.role === "clientAdmin" ||
          user.role === "curator"
        ) ? 
        <Redirect to="/"/> : null
      }
    </Grid>
    </Box>

    
  );
}
