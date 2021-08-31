import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  IconButton,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import useCurrentUser from '../../../hooks/useCurrentUser';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import useAxios from 'axios-hooks';

const useStyles = makeStyles((theme) => ({
  root: {  
    flexGrow: 1,
    backgroundColor: '#000000',
    maxWidth:'1920px',
  },
  backColor: {
    
    [theme.breakpoints.down('md')]: {
    
    },
  },
  btn: {
    color: '#000000',
    position: 'absolute',
    bottom: '10px',
    padding: theme.spacing(5, 1, 1, 2),
    //   [theme.breakpoints.down('md')]: {
    //     padding: theme.spacing(50, 8, 1, 8),
    //     bottom: '10px',
    //   },
  },
  drawerPaper: {
    backgroundColor: '#F8F8F8',
    width: 250,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color:'#000000'
  },
}));

export default function DrawerMenu({ open, toggleDrawer, menuItems }) {
  const classes = useStyles();
  const [auth] = React.useState(true);
  const menuId = 'primary-search-account-menu';

  const [{ data, loading, error }, doLogout] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/users/logout`,
    },
    {
      manual: true,
    },
  );
  const { data: currentUserData } = useCurrentUser();
  React.useEffect(() => {
    if (error || loading || !data) return;
    localStorage.removeItem('user');
    window.location.reload();
  }, [data, loading, error]);
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

  return (
    <ThemeProvider>
      <div className={classes.root}>
        <Drawer
          anchor="left"
          classes={{ paper: classes.drawerPaper }}
          open={open}
          onClose={toggleDrawer}
        >
          <List component="div" disablePadding>
            {auth && (
              <div>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  // onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar className={classes.backColor}>
                    {currentUserData?.firstName.charAt(0)}{' '}
                  </Avatar>

                  <Typography style={{color:'#000000'}}> {currentUserData?.name} </Typography>
                </IconButton>
              </div>
            )}

            <Divider />
            {menuItems.map((item) => {
              return (
                <div key={item.name}>
                  <ListItem
                    onClick={() => toggleDrawer()}
                    button
                    className={classes.nested}
                    style={{ color: '#000000' }}
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
            <Divider />
          </List>
          <Button className={classes.btn} onClick={onLogout}>
            <ExitToAppIcon style={{ color: '#000000', marginLeft: '0' }} /> Выход
          </Button>
        </Drawer>
      </div>
    </ThemeProvider>
  );
}
