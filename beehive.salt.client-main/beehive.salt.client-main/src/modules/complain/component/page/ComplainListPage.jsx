import React, { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';
import {
  Grid,
  Button,
  CssBaseline,
  TableFooter,
  Toolbar,
  Hidden,Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import useCurrentUser from '../../../hooks/useCurrentUser';
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone';
const queryString = require('query-string');

const ComplainFilterModalLoader = React.lazy(() =>
  import('../modal/ComplainFilterModal'),
);
const columns = [
  {
    field: 'edit',
    headerName: 'Изменить',
    headerClassName: 'super-app-theme--header',
    width: 150,
    role: ['client', 'clientAdmin'],
    renderCell: () => <EditIcon />,
  },
  {
    field: 'authorId',
    headerClassName: 'super-app-theme--header',
    headerName: 'Автор',
    width: 230,
    role: ['curator', 'hr', 'clientAdmin', 'supervisorAdmin', 'client'],
  },
  {
    field: 'description',
    headerClassName: 'super-app-theme--header',
    headerName: 'Описание',
    width: 230,
    role: ['curator', 'hr', 'clientAdmin', 'supervisorAdmin', 'client'],
  },
  {
    field: 'status',
    headerClassName: 'super-app-theme--header',
    headerName: 'Статус',
    width: 800,
    role: ['curator', 'hr', 'clientAdmin', 'supervisorAdmin', 'client'],
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      // width: '110%',
      margin: theme.spacing(1, 1, 1, 0),
    },
    '& .super-app-theme--header': {
      backgroundColor: '#ebeded',
    },
  },
  paper: {
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column',
    
     
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(5, 0.5, 1, 2.5),
    },
    // flexDirection: 'column',
    // alignItems: 'center',
    // margin: theme.spacing(18, 20, 1, -28),
  },
  btnSm: {
    [theme.breakpoints.down('sm')]: {
    
      height: '50px',
      width: '100%',
      // width: '160px',
    },
  },
  fltrSm: {
    [theme.breakpoints.down('sm')]: {
      width: '10%',
    
    },
    // margin: theme.spacing(2, 1, 1, 3),
  },
  btnColor: {
    height: '50px',
    width: '180px',
    [theme.breakpoints.down('sm')]: {
      height: '50px',
      width: '160px',
    },
  },
  btn: {
    [theme.breakpoints.down('sm')]: {
      width: '184px',
   
    },
    [theme.breakpoints.up('lg')]: {
    
    },
  },
  toolbar: {
    [theme.breakpoints.down('md')]: {
    
    },
  
  },

  fltr: {
    [theme.breakpoints.down('sm')]: {
    
    },
    // margin: theme.spacing(2, 1, 1, 3),
  },
  cRow:{
    paddingLeft:'70px',
    paddingTop:'30px',  
    [theme.breakpoints.down('md')]: {
    paddingLeft:'20px',
    },
  }
}));

export default function ComplainListPage() {
  // -- local states --
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [filterOpen, setFilterOpen] = useState(false);
  const [dataColumn, setDataColumn] = useState([]);
  const { data: currentUserData } = useCurrentUser();
  const user = JSON.parse(localStorage.getItem('user'));
  const [complains, setComplains] = useState([]);
  const [pageSize, setPageSize] = useState(50);
  const [complainFilter, setComplainFilter] = useState({
    startDate: '',
    endDate: '',
    limit: null,
    offset: 0,
  });
  const [{ data: complainsData }] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/complaints/get-by-filter`,
      params: {
        filter: complainFilter,
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

  // -- local effects --
  useEffect(() => {
    if (!location.search) {
      setComplainFilter({
        ...complainFilter,
        startDate: '',
        endDate: '',
        offset: 0,
      });
      setFilterOpen(false);
      return;
    }
    const parsedQueryParams = queryString.parse(location.search);
    const modifiedFilter = { ...complainFilter };
    if (parsedQueryParams.startDate) {
      const parsedStartDate = parsedQueryParams.startDate.split('-');
      const newStartDate = new Date();
      newStartDate.setFullYear(parseInt(parsedStartDate[2]));
      newStartDate.setMonth(parseInt(parsedStartDate[1]));
      newStartDate.setDate(parseInt(parsedStartDate[0]));
      modifiedFilter.startDate = newStartDate;
    }

    if (parsedQueryParams.endDate) {
      const parsedEndDate = parsedQueryParams.endDate.split('-');
      const newEndDate = new Date();
      newEndDate.setFullYear(parseInt(parsedEndDate[2]));
      newEndDate.setMonth(parseInt(parsedEndDate[1]));
      newEndDate.setDate(parseInt(parsedEndDate[0]));
      modifiedFilter.endDate = newEndDate;
    }

    setComplainFilter(modifiedFilter);
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
    if (!complainsData) return;
    setComplains(
      complainsData.list.map((complain) => {
        return {
          ...complain,
        };
      }),
    );
  }, [complainsData]);

  const toggleFilter = () => setFilterOpen(!filterOpen);

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  };

  // -- render --
  return (
    <Box className={classes.cRow}>
           <Grid xs={12} container alignItems="center" spacing={2}>
      <CssBaseline />
      <Grid item xs={12}>
        <div className={classes.paper}>
          <Grid
            xs={12}
            sm={12}
            style={{
              height: '468px',
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
                      <ComplainFilterModalLoader
                        filter={complainFilter}
                        toggleFilter={toggleFilter}
                      />
                    ) : null}
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      {(user.role === 'clientAdmin' || user.role === 'client') && (
                        <div>
                          <Button
                            className={classes.btnSm}
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircleOutlineIcon fontSize="large" />}
                            component={Link}
                            to="/complains/add"
                          >
                            Добавить
                          </Button>
                        </div>
                      )}
                    </div>
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
                    <ComplainFilterModalLoader
                      filter={complainFilter}
                      toggleFilter={toggleFilter}
                    />
                  ) : null}

                  <Grid container className={classes.btn} spacing={4}>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      {(user.role === 'clientAdmin' || user.role === 'client') && (
                        <div>
                          <Button
                            className={classes.btnColor}
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircleOutlineIcon fontSize="large" />}
                            component={Link}
                            to="/complains/add"
                          >
                            Добавить
                          </Button>
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Hidden>
              {/* <Grid container spacing={1}>
                <Hidden only={['sm', 'xs']}>
                  <Grid container className={classes.btn} spacing={4}>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      {(user.role === 'clientAdmin' || user.role === 'client') && (
                        <div>
                          <Button
                            className={classes.btnColor}
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircleOutlineIcon fontSize="large" />}
                            component={Link}
                            to="/complains/add"
                          >
                            Добавить
                          </Button>
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </Hidden>
              </Grid> */}
            </Toolbar>

            <DataGrid
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              className={classes.root}
              rows={complains}
              columns={dataColumn}
              productCategorySize={5}
              onCellClick={(cell) => {
                if (cell.field === 'edit') {
                  history.push(`/complains/edit/${cell.row.id}`);
                } else {
                  history.push(`/complains/view/${cell.row.id}`);
                }
              }}
            />
            <TableFooter></TableFooter>
          </Grid>
        </div>
      </Grid>
      {
        (user.role === "mainAdmin") ? <Redirect to="/"/> : null
      }
    </Grid>
    </Box>
   
  );
}
