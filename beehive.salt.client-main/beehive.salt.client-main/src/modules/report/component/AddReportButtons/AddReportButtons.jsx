import { Button, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import salt from './salt.png';
import mining from './mining.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    
    paddingLeft:'70px',
    paddingTop:'30px',
    [theme.breakpoints.down('lg')]: {
        paddingLeft:'20px',
    },
    [theme.breakpoints.up('lg')]: {
      flexGrow: 1,
      // position: 'fixed',
      top: '100px',
      // right: '-24px',
     
    },

    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(5, 1, 1, 1),
    },
  },
  paper: {
    alignItems:'start',
    height: '345px',
    width: '100%',
    // padding: theme.spacing(1),
   
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      height: '12vh',
  
      margin: theme.spacing(7, 1, -6, 0),
      fontSize: '16px',
    },
  },
  text: {
    color: 'white',
  
    bottom: '10px',
    left: '25px',
    // margin: theme.spacing(10, 1, 1, -60),
    [theme.breakpoints.down('md')]: {
 
      margin: theme.spacing(1, 1, 1, 1),
      fontSize: 'px',
    },
  },
}));

export default function AddReportButtons() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={2} style={{width:'100%'}}>
        <Grid item xs={12} sm={6}>
          <Button
            className={classes.paper}
            variant="contained"
            color="primary"
            component={Link}
            to="add/mining"
            style={{ backgroundImage: `url(${mining})` }}
          >
            <Typography className={classes.text}>Добыча</Typography>
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            className={classes.paper}
            variant="contained"
            color="primary"
            component={Link}
            to="add/sale"
            style={{ backgroundImage: `url(${salt})` }}
          >
            <Typography className={classes.text}>Продажа</Typography>
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            className={classes.paper}
            component={Link}
            to="add/processing"
            style={{ backgroundImage: `url(${mining})` }}
          >
            <Typography className={classes.text}>Переработка</Typography>
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            className={classes.paper}
            component={Link}
            to="add/production"
            style={{ backgroundImage: `url(${salt})` }}
          >
            <Typography className={classes.text}>Производство</Typography>
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            className={classes.paper}
            component={Link}
            to="add/packaging"
            style={{ backgroundImage: `url(${mining})` }}
          >
            <Typography className={classes.text}>Упаковка</Typography>
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
