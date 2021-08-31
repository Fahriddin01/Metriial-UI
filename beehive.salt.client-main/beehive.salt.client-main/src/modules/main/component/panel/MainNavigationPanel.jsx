import React, { createContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  Hidden,
  CssBaseline,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  Avatar,
  IconButton,
  Typography,
} from '@material-ui/core';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import { useEffect } from 'react';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import useCurrentUser from '../../../hooks/useCurrentUser';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import ReportIcon from '@material-ui/icons/Report';
import ApartmentIcon from '@material-ui/icons/Apartment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Suspense } from 'react';
const DrawerMenuLoadable = React.lazy(() => import('./../header/DrawerMenu'));

export const NavBarContext = createContext(null);

const drawerWidth = '340px';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',   
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    },
  },
  iconBtn: {
    margin: theme.spacing(0, 4, 5, 4),
    justifyContent: 'left',
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(0, 1),
    },
  },
  backColor: {
    margin: theme.spacing(0, 3, 0, 1),
    // fontSize: '88px',
    [theme.breakpoints.down('md')]: {
   
    },
  },
  usrName: {
    margin: theme.spacing(0, 3, 0, 1),
    fontSize: '20px',
    color: '#000000',
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(0, 3, 0, 1),
    },
  },

  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    minHeight:750,
    position:'fixed',
    backgroundColor: '#F8F8F8',
    width: drawerWidth,
    
  },
  list: {
    padding: theme.spacing(3, 3, 3, 7),
  },
  divideTop: {
    padding: theme.spacing(5, 0, 5, 0),
    
  },
 
  divideBtm: {
    padding: theme.spacing(0, 0, 0, 0),
  },

  btn: {
    color: '#000000', 
    padding: theme.spacing(5, 8, 5, 7),
    
    justifyContent:'left',
    
  },
}));

const menuItems = [
  {
    icon: <AssignmentIcon />,
    name: 'Отчёт',
    link: '/reports',
    role: ['client', /*'hr',*/ 'curator', 'clientAdmin'],
  },
  {
    icon: <SettingsIcon />,
    name: 'Настройки',
    link: '/settings',
    role: ['supervisorAdmin', 'curator', 'hr', 'clientAdmin', 'client', 'mainAdmin'],
  },
  {
    icon: <LocationCityIcon />,
    name: 'Организации',
    link: '/organizations',
    role: ['mainAdmin', 'supervisorAdmin', 'curator'],
  },
  {
    icon: <PeopleIcon />,
    name: 'Пользователи',
    link: '/users',
    role: ['mainAdmin', 'supervisorAdmin'],
  },
  {
    icon: <ReportIcon />,
    name: 'Жалобы',
    link: '/complains',
    role: ['supervisorAdmin', 'client', 'hr', 'curator', 'clientAdmin'],
  },
  {
    icon: <ApartmentIcon />,
    name: 'Mоя организация',
    link: '/organization-profile',
    role: ['clientAdmin'],
  },
  {
    icon: <ApartmentIcon />,
    name: 'Статистика',
    link: '/dashboard',
    role: ['mainAdmin','supervisorAdmin', 'hr'],
  },
];

export default function MainNavigationPanel({ drawerOpen, toggleDrawer }) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuItems, setUserMenuItems] = useState([]);
  const [auth] = useState(true);
  const menuId = 'primary-search-account-menu';
  const matchmd = useMediaQuery(theme.breakpoints.up('lg'));

  const [{ data, loading, error }, doLogout] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/users/logout`,
    },
    {
      manual: true,
    },
  );

  const { data: currentUserData } = useCurrentUser();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (error || loading || !data) return;
    localStorage.removeItem('user');
    window.location.reload();
  }, [data, loading, error]);

  useEffect(() => {
    if (!currentUserData) return;
    setUserMenuItems(
      menuItems.filter((item) => {
        return !!item.role.find((itemRole) => {
          return currentUserData.role.includes(itemRole);
        });
      }),
    );
  }, [currentUserData]);

  const onLogout = () => {
    const userFromStorage = localStorage.getItem('user');
    const user = userFromStorage ? JSON.parse(userFromStorage) : null;
    doLogout({
      method: 'post',
      headers: {
        Authorization: user ? `Bearer ${user.authToken}` : null,
      },
    });
  };
  if (!matchmd)
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <DrawerMenuLoadable
          open={drawerOpen}
          toggleDrawer={toggleDrawer}
          menuItems={userMenuItems}
        />
      </Suspense>
    );

  const drawer = (
    <div className={classes.root}>
      <nav>
        <div>
          <div className={classes.toolbar} />
          {auth && (
            <div>
              <IconButton
                className={classes.iconBtn}
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                color="inherit"
              >
                <Avatar className={classes.backColor}>
                  {currentUserData?.firstName.charAt(0)}{' '}
                </Avatar>

                <Typography className={classes.usrName}>
                  {' '}
                  {currentUserData?.name}{' '}
                </Typography>
              </IconButton>
            </div>
          )}

          <Divider />
          <List component="div" disablePadding className={classes.divideTop}
          style={{ borderBottom : '1px solid #000000',borderTop : '1px solid #000000'}} >
            {userMenuItems.map((item) => {
              return (
                <div key={item.name}>
                  <ListItem
                    className={classes.list}
                    button
                    style={{
                      color: '#000000',
                      backgroundColor: '',
                    }}
                    component={Link}
                    to={item.link}
                  >
                    <ListItemIcon style={{ color: '#000000' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItem>
                </div>
              );
            })}
          </List>
          <div className={classes.divideBtm}>
            {' '}
            <Divider />
          </div>

          {/* <Button className={classes.btn} onClick={onLogout}>
            <ExitToAppIcon style={{ color: 'black', marginLeft: '0' }} /> Выход
          </Button> */}
        </div>
      </nav>
    </div>
  );
  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open={true}
          >
            {drawer}
            <Button className={classes.btn} onClick={onLogout}>
              <ExitToAppIcon style={{ color: '#000000', marginRight:'26px' }} /> Выход
            </Button>
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}
