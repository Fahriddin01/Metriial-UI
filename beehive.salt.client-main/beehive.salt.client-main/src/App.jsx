import React, { Suspense, createContext, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import HeaderTest from './modules/main/component/header/HeaderTest';
import { Grid } from '@material-ui/core';
import useCurrentUser from './modules/hooks/useCurrentUser';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import  './style.css';
// import Breadcrumbs from './modules/main/component/header/Breadcrumbs';
// import { ThemeProvider } from 'styled-components';

export const SnackbarStatus = {
  Error: 'error',
  Success: 'success',
};
const DashboardLoadable = React.lazy(() => 
import ('./modules/dashboard/Dashboard'));
const LogInFormLoadable = React.lazy(() =>
  import('./modules/user/component/form/LogInForm'),
);
const MainNavigationPanelLoadable = React.lazy(() =>
  import('./modules/main/component/panel/MainNavigationPanel'),
);
const ReportListPageLoadable = React.lazy(() =>
  import('./modules/report/component/page/ReportListPage'),
);
const ComplainAddEditPageLoadable = React.lazy(() =>
  import('./modules/complain/component/page/ComplainAddEditPage'),
);
const SettingsLoadable = React.lazy(() =>
  import('./modules/user/component/page/settings/Settings'),
);
const ReportAddEditFormLoadable = React.lazy(() =>
  import('./modules/report/component/form/ReportAddEditForm'),
);
const AddReportButtonsLoadable = React.lazy(() =>
  import('./modules/report/component/AddReportButtons/AddReportButtons'),
);
const AdminUserListPageLoadable = React.lazy(() =>
  import(
    './modules/user/component/page/admin-user-list-page/page/AdminUserListPage'
  ),
);
const AdminOrganizationListPageLoadable = React.lazy(() =>
  import(
    './modules/user/component/page/admin-organization-list-page/page/AdminOrganizationListPage'
  ),
);
const ComplainListPageLoadable = React.lazy(() =>
  import('./modules/complain/component/page/ComplainListPage'),
);
const ComplainViewPageLoadable = React.lazy(() =>
  import('./modules/complain/component/page/ComplainViewPage'),
);
const AdminOrgAddEditFormLoadable = React.lazy(() =>
  import(
    './modules/user/component/page/admin-organization-list-page/page/AdminOrgAddEditForm'
  ),
);
const AdminOrgViewPageLoadable = React.lazy(() =>
  import(
    './modules/user/component/page/admin-organization-list-page/page/AdminOrgViewPage'
  ),
);
const AdminUserAddEditFormLoadable = React.lazy(() =>
  import(
    './modules/user/component/page/admin-user-list-page/page/AdminUserAddEditForm'
  ),
);
const AdminUserViewPageLoadable = React.lazy(() =>
  import(
    './modules/user/component/page/admin-user-list-page/page/AdminUserViewPage'
  ),
);
const OrgProfilePageLoadable = React.lazy(() =>
  import('./modules/organization/component/OrgProfilePage'),
);
const ReportViewPageLoadable = React.lazy(() =>
  import('./modules/report/component/page/ReportViewPage'),
);

export const NotificationSnackBarContext = createContext();

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  snackBar: {
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  },
  row:{
    display:'flex',
    maxWidth:'1920px',
    padding:'0px',
    
  },
  leftBar:{
    maxWidth:1580,
    width:'100%',
    [theme.breakpoints.down('lg')]: {
    maxWidth:'xl',
    
    },
  }

}));

export default function App() {
  const [snackbarData, setSnackbarData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const classes = useStyles();

  const {
    data: currentUser,
    loading: currentLoading,
    error: currentUserError,
  } = useCurrentUser();

  const onNotificationSet = (msg, type) => {
    setSnackbarData({
      msg,
      type,
    });
  };
  const onNotificationClose = () => setSnackbarData(null);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  if (currentLoading)
    return (
      <div>
        <CircularProgress color="#2CBBA1" />
        Loading...
      </div>
    );

  if ((!currentLoading && !currentUser) || currentUserError)
    return (
      <Suspense
        fallback={
          <div>
            <CircularProgress color="#2CBBA1" />
            Loading
          </div>
        }
      >
        <LogInFormLoadable />
      </Suspense>
    );

    
  return (      
    <Container className={classes.row}>
      <Grid item > 
          <Grid xs={false} sm={false} md={0} lg={2}>
          <Suspense 
            fallback={
              <div>
                <CircularProgress color="#2CBBA1" />
                Loading
              </div>
            }
          >
            <MainNavigationPanelLoadable
              drawerOpen={drawerOpen}
              toggleDrawer={toggleDrawer}
            />
          </Suspense>

      
        </Grid>
        </Grid>    
        <Grid item alignItems="center"  className={classes.leftBar} >
             <Suspense style={{position:'absolute'}}
              fallback={
                <div>
                  <CircularProgress color="#2CBBA1" />
                  Loading...
                </div>
              }
            >
               <HeaderTest toggleDrawer={toggleDrawer} />
            </Suspense>{' '}
          <NotificationSnackBarContext.Provider
            value={{ notify: onNotificationSet, close: onNotificationClose }}
          >
            <Suspense
              fallback={
                <div>
                  <CircularProgress color="#2CBBA1" />
                  Loading...
                </div>
              }
            >
              {/* <Breadcrumbs /> */}

              <Switch>
                 <Route
                  path="/complains"
                  render={(props) => <ComplainListPageLoadable {...props} />}
                  exact
                  />
                
                <Route
                  path="/complains/add"
                  render={(props) => <ComplainAddEditPageLoadable {...props} />}
                  exact
                />
                <Route
                  path="/complains/edit/:id"
                  render={() => <ComplainAddEditPageLoadable />}
                  exact
                />
                <Route
                  path="/complains/view/:id"
                  render={(props) => <ComplainViewPageLoadable {...props} />}
                  exact
                />
                <Route
                  path="/reports"
                  render={(props) => <ReportListPageLoadable {...props} />}
                  exact
                />
                <Route
                  path="/settings"
                  render={(props) => <SettingsLoadable {...props} />}
                  exact
                />
                <Route
                  path="/organization-profile"
                  render={(props) => <OrgProfilePageLoadable {...props} />}
                  exact
                />
                <Route
                  path="/reports/add"
                  render={(props) => <AddReportButtonsLoadable {...props} />}
                  exact
                />
                <Route
                  path="/reports/add/:activity"
                  render={(props) => <ReportAddEditFormLoadable {...props} />}
                  exact
                />
                <Route
                  path="/reports/view/:id"
                  render={(props) => <ReportViewPageLoadable {...props} />}
                  exact
                />
                <Route
                  path="/reports/edit/:id"
                  render={(props) => <ReportAddEditFormLoadable {...props} />}
                  exact
                />
                <Route
                  path="/users"
                  render={(props) => <AdminUserListPageLoadable {...props} />}
                  exact
                />
                <Route
                  path="/users/add"
                  render={(props) => <AdminUserAddEditFormLoadable {...props} />}
                  exact
                />
                <Route
                  path="/users/edit/:id"
                  render={(props) => <AdminUserAddEditFormLoadable {...props} />}
                  exact
                />
                <Route
                  path="/users/view/:id"
                  render={(props) => <AdminUserViewPageLoadable {...props} />}
                  exact
                />
                <Route
                  path="/organizations"
                  render={(props) => (
                    <AdminOrganizationListPageLoadable {...props} />
                  )}
                  exact
                />
                <Route
                  path="/organizations/add"
                  render={(props) => <AdminOrgAddEditFormLoadable {...props} />}
                  exact
                />
                <Route
                  path="/organizations/edit/:id"
                  render={(props) => <AdminOrgAddEditFormLoadable {...props} />}
                  exact
                />
                <Route
                  path="/organizations/view/:id"
                  render={(props) => <AdminOrgViewPageLoadable {...props} />}
                  exact
                />
                <Route
                  path="/dashboard"
                  render={(props) => <DashboardLoadable {...props}/>}
                >
                </Route>
              </Switch>
            </Suspense>
            {snackbarData ? (
              <div className={classes.snackBar.root}>
                <Snackbar
                  open={!!snackbarData}
                  autoHideDuration={4000}
                  onClose={onNotificationClose}
                >
                  <Alert onClose={onNotificationClose} severity={snackbarData.type}>
                    {snackbarData.msg}
                  </Alert>
                </Snackbar>
              </div>
            ) : null}
          </NotificationSnackBarContext.Provider>
        </Grid>      
      
    </Container>
  );
}
