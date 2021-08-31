import React, { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';
import {
  Grid,
  Button,
  Toolbar,
  CssBaseline,
  Hidden,
  Container,Box,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { DataGrid } from '@material-ui/data-grid';
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone';
import useCurrentUser from '../../../../../hooks/useCurrentUser';
const queryString = require('query-string');

const OrganizationFilterModalLoader = React.lazy(() =>
  import('../../../modal/OrganizationFilterModal'),
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
    field: 'name',
    headerName: 'Название организации',
    width: 230,
    headerClassName: 'super-app-theme--header',
    role: ['curator', 'hr', 'clientAdmin', 'mainAdmin', 'supervisorAdmin'],
  },
  {
    field: 'detail?.certificate?.expireDate',
    headerName: 'Срок истечения сертификата',
    width: 200,
    headerClassName: 'super-app-theme--header',
    role: ['curator'],
  },
  {
    field: 'type',
    headerName: 'Тип',
    width: 1000,
    headerClassName: 'super-app-theme--header',
    role: ['curator', 'hr', 'mainAdmin', 'supervisorAdmin'],
  },
];
const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 1, 1, 0),
    },
    '& .super-app-theme--header': {
      backgroundColor: '#ebeded',
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
  toolbar: {
    marginTop:'30px',
    marginBottom:'30px',
    [theme.breakpoints.down('md')]: {
      width: '100%',
     
    },
     [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: theme.spacing(0, 0, 3, 0),   
    },
    
  },
  btnSm: {
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 0.5, 1.5, 0.5),
      height: '50px',
      width: '100%',
    },
  },
  fltrSm: {
    [theme.breakpoints.down('sm')]: {
  
    },
  },
  btn: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
   
    },
    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(-3, 1, 1, 1),
      
      fontSize: '18px',
     
      width: '420px',
    },
  },
  fltr: {
    [theme.breakpoints.down('sm')]: {
      width: '10%',
      margin: theme.spacing(1, -1, -10, 4),
    },
  },
  paper: {
   
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(5, 0, 18, 2),
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
     
    },
  },
  tRow :{
    paddingLeft:'70px',
     [theme.breakpoints.down('md')]: {
      padding:'20px',
    },
  },
}));

export default function AdminOrganizationListPage() {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const [filterOpen, setFilterOpen] = useState(false);
  const [dataColumn, setDataColumn] = useState([]);
  const { data: currentUserData } = useCurrentUser();
  const user = JSON.parse(localStorage.getItem('user'));
  const [orgs, setOrgs] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [orgPerPage, setOrgPerPage] = useState(10)
  // const [page, setPage] = useState(2)
  // const [rowsPerPage, setRowsPerPage] = useState(10)
  const [orgFilter, setOrgFilter] = useState({
    name: '',
    limit: null,
    offset : '',
  });

  const [{ data: orgsData }] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/organizations/get-by-filter`,
      params: {
        filter: orgFilter,
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
      setOrgFilter({
        ...orgFilter,
        offset: 0,
        name: '',
      });
      setFilterOpen(false);
      return;
    }
    const parsedQueryParams = queryString.parse(location.search);
    const modifiedFilter = { ...orgFilter };
    if (parsedQueryParams.name) {
      modifiedFilter.name = parsedQueryParams.name;
    }
    setOrgFilter(modifiedFilter);
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
    if (!orgsData) return;
    setOrgs(
      orgsData.list.map((org) => {
        return {
          ...org,
        };
      }),
    );
  }, [orgsData]);

  const toggleFilter = () => setFilterOpen(!filterOpen);

  return (
    <Box className={classes.tRow}>
    <Box style={{height:'600px'}}>
    <Grid xs={12} container alignItems="center" spacing={2}>
      <CssBaseline />
      <Grid item xs={12}>
        <div className={classes.paper}>
          <Grid
            xs={12}
            sm={12}
            style={{
              height: '484px',
       
            }}
          >
            <Toolbar className={classes.toolbar}>
              <Hidden only={['md', 'lg', 'xl']}>
                <Grid container alignItems="center">
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
                      <OrganizationFilterModalLoader
                        filter={orgFilter}
                        toggleFilter={toggleFilter}
                      />
                    ) : null}
                  </Grid>
                  <Grid>
                  <div style={{maxWidth:'1290px',marginTop:'30px'}}>
                     {(user.role === 'mainAdmin' ||
                    user.role === 'supervisorAdmin') && (
                    <div>
                    <Button
                    className={classes.btnSm}
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleOutlineIcon fontSize="small" />}
                    component={Link}
                    to="/organizations/add"
                    >
                    Добавить
                  </Button>
                </div>
              )}
          </div>
      </Grid>
                 
                </Grid>
              </Hidden>
              <Hidden only={['sm', 'xs']} >
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
                    <OrganizationFilterModalLoader
                      filter={orgFilter}
                      toggleFilter={toggleFilter}
                    />
                  ) : null}

                </Grid>
                <Grid>
                <div style={{maxWidth:'1290px'}}>
                    {(user.role === 'mainAdmin' ||
                    user.role === 'supervisorAdmin') && (
                  <div>
                    <Button
                    className={classes.btnSm}
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleOutlineIcon fontSize="small" />}
                    component={Link}
                    to="/organizations/add"
                    >
                    Добавить
                  </Button>
                 </div>
                       )}
                  </div>
              </Grid>
              </Hidden>
            </Toolbar>

            <DataGrid
              pageSize={pageSize}
              className={classes.root}
              rows={orgs}
              columns={dataColumn.map((item) => {
                return item;
              })}
              onCellClick={(cell) => {
                if (cell.field === 'edit') {
                  history.push(`/organizations/edit/${cell.row.id}`);
                } else {
                  history.push(`/organizations/view/${cell.row.id}`);
                }
              }}
            />
          </Grid>
        </div>
      </Grid>
      {
        (
          user.role === "client" ||
          user.role === "clientAdmin"
          // user.role === "hr"
        ) ? 
        <Redirect to="/"/> : null
      }

    </Grid>
    
    </Box>
    
   <div>
      
   </div>
    </Box>
    
  );
}
