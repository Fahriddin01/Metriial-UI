import React, { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';
import {
  Grid,
  Button,
  CssBaseline,
  Toolbar,
  Hidden,Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { DataGrid } from '@material-ui/data-grid';
import { Link, useHistory, useLocation, Redirect } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import useCurrentUser from '../../../../../hooks/useCurrentUser';
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone';
const queryString = require('query-string');

const UserFilterModalLoader = React.lazy(() =>
  import('../../../modal/UserFilterModal'),
);

const columns = [
  {
    field: 'edit',
    headerName: 'Изменить',
    width: 150,
    headerClassName: 'super-app-theme--header',
    role: ['mainAdmin', 'supervisorAdmin'],
    renderCell: () => <EditIcon />,
  },
  {
    field: 'firstName',
    headerName: 'Имя',
    width: 230,
    headerClassName: 'super-app-theme--header',
    role: ['curator', 'hr', 'clientAdmin', 'mainAdmin', 'supervisorAdmin'],
  },
  {
    field: 'lastName',
    headerName: 'Фамилия',
    width: 260,
    headerClassName: 'super-app-theme--header',
    role: ['curator', 'hr', 'clientAdmin', 'mainAdmin', 'supervisorAdmin'],
  },
  {
    field: 'phoneNumber',
    headerName: 'Номер Телефона',
    width: 260,
    headerClassName: 'super-app-theme--header',
    role: ['curator', 'hr', 'clientAdmin', 'mainAdmin', 'supervisorAdmin'],
  },
  {
    field: 'role',
    headerName: 'Роль',
    headerClassName: 'super-app-theme--header',
    width: 260,
    role: ['curator', 'hr', 'clientAdmin', 'mainAdmin', 'supervisorAdmin'],
  },
  {
    field: 'lastSeen',
    headerName: 'Последнее посещение',
    headerClassName: 'super-app-theme--header',
    width: 260,
    role: ['curator', 'hr', 'clientAdmin', 'mainAdmin', 'supervisorAdmin'],
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
     
    },
    '& .super-app-theme--header': {
      backgroundColor: '#ebeded',
    },
  },
  toolbar: {
    marginBottom:'20px',
    [theme.breakpoints.down('md')]: {
  
    },
   
  },
  btnSm: {
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 0.5, 0.5, 0.5),
      height: '50px',
      width: '100%',
    },
  },
  fltrSm: {
    [theme.breakpoints.down('sm')]: {
      width: '10%',
      
    },
  },
  btn: {

    justifyContent:'flex-end',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent:'end',
    },
    [theme.breakpoints.down('xs')]: {
     
      justifyContent:'flex-start',
    },
    [theme.breakpoints.up('lg')]: {
  
      fontSize: '18px',
      width: '420px',
    },
  },
  btnColor: {
    height: '50px',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      height: '50px',
      width: '160px',
    },
  },
  fltr: {
    [theme.breakpoints.down('sm')]: {
      width: '10%',

    },
  },
  paper: {
    [theme.breakpoints.down('sm')]: {
 
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
      
    },
  },
  uRow:{
    paddingTop:'20px',
    paddingLeft:'70px',
    [theme.breakpoints.down('lg')]: {
      paddingLeft:'20px',
    },
  },
}));

export default function AdminUserListPage() {
  const history = useHistory();
  const classes = useStyles();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const [dataColumn, setDataColumn] = useState([]);
  const { data: currentUserData } = useCurrentUser();
  const [users, setUsers] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [userFilter, setUserFilter] = useState({
    // name: '',
    role: '',
    limit: null,
    offset: 0,
  });
  const [filterOpen, setFilterOpen] = useState(false);

  const [{ data: usersData }] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/users/get-by-filter`,
      params: {
        filter: userFilter,
      },
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
        method: 'get',
      },
    },
    {
      useCache: false,
    },
  );

  useEffect(() => {
    if (!location.search) {
      setUserFilter({
        ...userFilter,
        name: '',
        role:'',
        offset: 0,
      });
      setFilterOpen(false);
      return;
    }
    const parsedQueryParams = queryString.parse(location.search);
    const modifiedFilter = { ...userFilter };
    if (parsedQueryParams.name) {
      modifiedFilter.name = parsedQueryParams.name;
    }
    if (parsedQueryParams.role) {
      modifiedFilter.role = parsedQueryParams.role;
    }
    setUserFilter(modifiedFilter);
    setFilterOpen(false);
  }, [location.search]);

  useEffect(() => {
    if (!currentUserData) return;
    setDataColumn(
      columns.filter((item) => {
        return !!item.role.find((itemRole) => {
          return currentUserData.role.includes(itemRole);
        });
      }),
    );
  }, [currentUserData]);
  useEffect(() => {
    if (!usersData) return;
    setUsers(
      usersData.list.map((user) => {
        return {
          ...user,
        };
      }),
    );
  }, [usersData]);

  const toggleFilter = () => setFilterOpen(!filterOpen);

  return (
    <Box className={classes.uRow}>
      <Box>
      <Grid xs={12} container alignItems="center" spacing={2}>
      <CssBaseline />
      <Grid item xs={12}>
        <div className={classes.paper}>
          <Grid
            xs={12}
            sm={12}
            style={{
              height: '484px',
              width: '100%',
            }}
          >
            <Toolbar className={classes.toolbar}>
              <Hidden only={['md', 'lg', 'xl']}>
                <Grid container>
                  <Grid item xs={6}>
                    <Button
                      className={classes.fltrSm}
                      onClick={toggleFilter}
                      startIcon={
                        <FilterListTwoToneIcon
                          fontSize="large"
                          style={{ fontSize: 30 }}
                        />
                      }
                    >
                      Фильтр
                    </Button>
                    {filterOpen ? (
                      <UserFilterModalLoader
                        filter={userFilter}
                        toggleFilter={toggleFilter}
                      />
                    ) : null}
                  </Grid>
                  
                </Grid>
              </Hidden>
              <Hidden only={['sm', 'xs']}>
                <Grid container spacing={1} xs={12}>
                  <Button
                    className={classes.fltrSm}
                    onClick={toggleFilter}
                    startIcon={
                      <FilterListTwoToneIcon
                        fontSize="large"
                        style={{ fontSize: 30 }}
                      />
                    }
                  >
                    Фильтр
                  </Button>
                  {filterOpen ? (
                    <UserFilterModalLoader
                      filter={userFilter}
                      toggleFilter={toggleFilter}
                    />
                  ) : null}

                  
                </Grid>
              </Hidden>
             <Grid container className={classes.btn} spacing={4}>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      {user
                        ? (user.role === 'supervisorAdmin' ||
                            user.role === 'mainAdmin') && (
                            <div>
                              <Button
                                className={classes.btnColor}
                                variant="contained"
                                color="primary"
                                startIcon={<AddCircleOutlineIcon fontSize="small" />}
                                component={Link}
                                to="/users/add"
                              >
                                Добавить
                              </Button>
                            </div>
                          )
                        : null}
                    </Grid>
                  </Grid>
            </Toolbar>

            <DataGrid
              pageSize={pageSize}
              className={classes.root}
              rows={users}
              columns={dataColumn.map((item) => {
                return item;
              })}
              productCategorySize={5}
              onCellClick={(cell) => {
                if (cell.field === 'edit') {
                  history.push(`/users/edit/${cell.row.id}`);
                } else {
                  history.push(`/users/view/${cell.row.id}`);
                }
              }}
            />
          </Grid>
        </div>
      </Grid>
      {
        (
          user.role === "curator" ||
          // user.role === "hr" ||
          user.role === "client" ||
          user.role === "clientAdmin"
        ) ?
        <Redirect to="/"/> : null
      }
    </Grid>
      </Box>  
    <div style={{marginTop:'90px'}}>
    
    </div>      
    </Box>
    
   
  );
}
