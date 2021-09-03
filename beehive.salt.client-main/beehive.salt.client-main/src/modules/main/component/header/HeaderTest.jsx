import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Badge, Divider } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useCurrentUser from '../../../hooks/useCurrentUser';
import NotificationsIcon from '@material-ui/icons/Notifications';

import clsx from 'clsx';
import Breadcrumbs from './Breadcrumbs';
const drawerWidth = 340;
const ntfWidth = 160;
const ntfSmWidth = -20;
const breadcrumbWidth = 390;
const breadcrumbWidthM = 300;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    margin: theme.spacing(1),
    height: 64,
    backgroundColor: '#F8F8F8',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      height: '75px',
    },
  },
  breadcrumb: {
    marginLeft: `36px`,

    [theme.breakpoints.down('md')]: {
      marginLeft: `10px`,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: 'black',
  },
  title: {
    flexGrow: 1,
   
  },
  appBar: {
    
    backgroundColor: 'inherit',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // [theme.breakpoints.down('sm')]: {
    //   // position: 'fixed',
    //   height: '100px',
    // },
  },
  appBarShift: {
  
    marginLeft: drawerWidth,

    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  sectionDesktop: {
   
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
   
    },
  },
}));

export default function HeaderTest({ toggleDrawer }) {
  const classes = useStyles();
  const theme = useTheme();
  const [, setAnchorEl] = React.useState(null);
  const matchSm = useMediaQuery(theme.breakpoints.up('lg'));
  const [open] = React.useState(false);
  const menuId = 'primary-search-account-menu';
  const { data: currentUserData } = useCurrentUser();
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className={classes.root}>
      <AppBar position='static'
        elevation={0}
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          {!matchSm ? (
            <>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
            </>
          ) : null}
          <div className={classes.breadcrumb}>
            {' '}
            <Breadcrumbs />
          </div>

          <Typography variant="h6" className={classes.title}>
            {' '}
          </Typography>

          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show 3 new notifications" color="black">
              <Badge badgeContent={0} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <hr />
            {matchSm && (
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Typography style={{ color: 'black' }}>
                  {' '}
                  {currentUserData?.name}
                </Typography>
              </IconButton>
            )}
          </div>
        </Toolbar>
        <Divider />
      </AppBar>
    </div>
  );
}
