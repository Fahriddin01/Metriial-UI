import React, { useState, useEffect } from 'react';
import { Grid, Toolbar, CssBaseline, TableFooter, Hidden,Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import useAxios from 'axios-hooks';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { ReportUtils } from '../../utils/ReportUtils';
import { useHistory } from 'react-router-dom';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import GetAppIcon from '@material-ui/icons/GetApp';
import useCurrentUser from '../../../hooks/useCurrentUser';
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone';
const queryString = require('query-string');

const columns = [
  {
    field: 'edit',
    headerClassName: 'super-app-theme--header',
    headerName: 'Изменить',
    width: 150,
    role: ['client', 'clientAdmin'],
    renderCell: () => <EditIcon />,
  },
  {
    field: 'updatedDate',
    headerName: 'Дата',
    headerClassName: 'super-app-theme--header',
    width: 200,
    role: ['curator', 'supervisorAdmin', 'mainAdmin', 'clientAdmin', 'hr', 'client'],
  },
  {
    field: 'status',
    headerClassName: 'super-app-theme--header',
    headerName: 'Статус',
    width: 200,
    role: ['curator', 'supervisorAdmin', 'clientAdmin', 'hr', 'mainAdmin', 'client'],
  },
  {
    field: 'orgamizationId',
    headerClassName: 'super-app-theme--header',
    headerName: 'Организация',
    width: 230,
    role: ['curator', 'hr', 'clientAdmin', 'mainAdmin', 'supervisorAdmin'],
  },
  {
    field: 'activity',
    headerClassName: 'super-app-theme--header',
    headerName: 'Вид деятельности',
    width: 230,
    role: ['curator', 'supervisorAdmin', 'mainAdmin', 'clientAdmin', 'hr', 'client'],
  },
  {
    field: 'totalVolumeOut',
    headerClassName: 'super-app-theme--header',
    headerName: 'Общий продажи',
    width: 230,
    role: ['curator', 'supervisorAdmin', 'mainAdmin', 'clientAdmin', 'hr', 'client'],
  },
  {
    field: 'measureOut',
    headerClassName: 'super-app-theme--header',
    headerName: 'Единица веса',
    width: 220,
    role: ['curator', 'supervisorAdmin', 'mainAdmin', 'clientAdmin', 'hr', 'client'],
  },
  // {
  //   field: 'client',
  //   headerClassName: 'super-app-theme--header',
  //   headerName: 'Клиент',
  //   width: 200,
  //   role: ['curator', 'hr', 'clientAdmin', 'mainAdmin', 'supervisorAdmin', 'client'],
  // },

  // {
  //   field: 'saltCategoryOut',
  //   headerClassName: 'super-app-theme--header',
  //   headerName: 'Категория продукта',
  //   type: 'number',
  //   width: 260,
  //   role: ['curator', 'supervisorAdmin', 'mainAdmin', 'clientAdmin', 'hr', 'client'],
  // },
  // {
  //   field: 'iodineСoncentration',
  //   headerClassName: 'super-app-theme--header',
  //   headerName: 'Концентрация Йода',
  //   width: 200,
  //   role: ['curator', 'supervisorAdmin', 'clientAdmin', 'hr', 'mainAdmin', 'client'],
  // },
  
];

const useStyles = makeStyles((theme) => ({
  btnColor: {
    height: '50px',
    
    [theme.breakpoints.down('sm')]: {
      height: '50px',
     
    },
  },
  btnSm: {
    [theme.breakpoints.down('sm')]: {
      marginLeft: '4px',
      height: '50px',

    },
  },
  fltrSm: {
    [theme.breakpoints.down('sm')]: {
      width: '10%',
     
    },
  },
  btnExp: {
    height: '50px',
    width: '180px',
    [theme.breakpoints.down('sm')]: {
      height: '50px',
   
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
    [theme.breakpoints.down('sm')]: {
     
      
    },
 
  
  },
  fltr: {
    [theme.breakpoints.down('sm')]: {
      width: '10%',
   
    },
  },

  root: {
    height: '10%',
    [theme.breakpoints.down('sm')]: {
  
      height: '10vh',
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
      height: '50vh',
    },
  },
  repRow: {
    paddingTop:'20px',
    paddingLeft:'70px',
  [theme.breakpoints.down('md')]: {
    paddingTop:'20px',
    paddingLeft:'20px',
     
    },
  },
  exBtRow: {
    marginTop:'80px',
    [theme.breakpoints.down('sm')]: {
      marginTop:'180px',
     
    },
  }
}));

const ReportFilterModalLoader = React.lazy(() =>
  import('../modal/ReportFilterModal'),
);

export default function ResponsiveDrawer(props) {
  const classes = useStyles();
  const [reports, setReports] = useState([]);
  // const [statistics, setStatistics] = useState([]);
  const [dataColumn, setDataColumn] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  // const [pageSize, setPageSize] = useState(5);
  const [reportFilter, setReportFilter] = useState({
    startDate: '',
    endDate: '',
    organizationId: '',
    productCategory: '',
    measure: '',
    iodineСoncentration: '',
    limit: null,
    offset: 0,
  });
  console.log('reports', reports);
  const { data: currentUserData } = useCurrentUser();
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  const fileExtension = '.xlsx';

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);

    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const history = useHistory();

  const user = JSON.parse(localStorage.getItem('user'));

  const [{ data: reportsData }] = useAxios(
    {
      url: `${process.env.REACT_APP_API_URL}/reports/get-by-filter`,
      params: {
        filter: reportFilter,
      },
      headers: {
        Authorization: `Bearer ${user ? user.authToken : null}`,
        method: 'get',
      },
    },
    {
      useCache: false,
    },
  ); // filter.

  const translateCategory = (value) => {
    switch (value) {
      case 'EXTRA':
        return 'Экстра';
      case 'FIRSTGRADESALT':
        return 'Намаки оши- навьи якум';
      case 'SECONDGRADESALT':
        return 'Намаки оши - навьи дуюм';
      case 'DRINKINGSALT':
        return 'Намаки ошомидани';
      case 'TECHSALT':
        return 'Намаки техники';
      case 'ROCKSALT':
        return 'Намаки санги';

      default:
        return null;
    }
  };

  const translateMeasure = (value) => {
    switch (value) {
      case 'ton':
        return 'Тонна';
      case 'kg':
        return 'Кг';
      default:
        return null;
    }
  };

  const translateStatus = (value) => {
    switch (value) {
      case 'inProgress':
        return 'В процессе';
      case 'considered':
        return 'Рассмотрено';
      case 'approved':
        return 'Принято';
      case 'rejected':
        return 'Отклонено';
      default:
        return null;
    }
  };
  const translateAction = (value) => {
    switch (value) {
      case 'store':
        return 'Продажа';
      case 'sale':
        return 'Складировать';
      default:
        return null;
    }
  };
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
    if (!reportsData) return;
    setReports(
      reportsData.list.map((report) => {
        return {
          ...report,
          saltCategoryOut: translateCategory(report.saltCategoryOut),
          saltCategoryIn: translateCategory(report.saltCategoryIn),
          activity: ReportUtils.getNameByValue(report.activity),
          measureOut: translateMeasure(report.measureOut),
          measureIn: translateMeasure(report.measureIn),
          potassiumIodateMeasure: translateMeasure(report.potassiumIodateMeasure),
          action: translateAction(report.action),
          orgamizationId: report.organization.name,
          status: translateStatus(report.status),
        };
      }),
    );
  }, [reportsData]);

  const location = useLocation();

  useEffect(() => {
    if (!location.search) {
      setReportFilter({
        ...reportFilter,
        offset: 0,
        startDate: '',
        endDate: '',
        // organizationId: currentUserData.organization.id,
        organizationId:
          currentUserData.role === 'curator' ? '' : currentUserData.organization.id,

        // organizationId:(currentUserData.role === "client" || currentUserData.role === "clientAdmin") ? currentUserData.organization.id :  "",
        // currentUserData.role === "curator" ||
        productCategory: '',
        measure: '',
        iodineСoncentration: '',
      });
      setFilterOpen(false);
      return;
    }
    const parsedQueryParams = queryString.parse(location.search);
    const modifiedFilter = { ...reportFilter };
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

    if (parsedQueryParams.productCategory) {
      modifiedFilter.productCategory = parsedQueryParams.productCategory;
    }
    if (parsedQueryParams.measure) {
      modifiedFilter.measure = parsedQueryParams.measure;
    }
    if (parsedQueryParams.iodineСoncentration) {
      modifiedFilter.iodineСoncentration = parsedQueryParams.iodineСoncentration;
    }

    setReportFilter(modifiedFilter);
    setFilterOpen(false);
  }, [location.search]);

  const toggleFilter = () => setFilterOpen(!filterOpen);

  const ExportedFile = 'FileExported'; // export file to excell file

  return (
    <Box className={classes.repRow}>
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
                      startIcon={
                        <FilterListTwoToneIcon
                          fontSize="large"
                          style={{ fontSize: 30 }}
                        />
                      }
                      onClick={toggleFilter}
                    >
                      Фильтр
                    </Button>

                    {filterOpen ? (
                      <ReportFilterModalLoader
                        filter={reportFilter}
                        toggleFilter={toggleFilter}
                      />
                    ) : null}
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      {(user.role === 'client' || user.role === 'clientAdmin') && (
                        <Button
                          className={classes.btnSm}
                          variant="contained"
                          color="primary"
                          startIcon={<AddCircleOutlineIcon fontSize="inherit" />}
                          component={Link}
                          to="/reports/add"
                        >
                          Добавить
                        </Button>
                      )}
                    </div>
                  </Grid>
                </Grid>
              </Hidden>
              <Hidden only={['sm', 'xs']}>
                <Grid container spacing={1} >
                  <Button
                    className={classes.fltr}
                    startIcon={
                      <FilterListTwoToneIcon
                        fontSize="large"
                        style={{ fontSize: 30 }}
                      />
                    }
                    onClick={toggleFilter}
                  >
                    Фильтр
                  </Button>

                  {filterOpen ? (
                    <ReportFilterModalLoader
                      filter={reportFilter}
                      toggleFilter={toggleFilter}
                    />
                  ) : null}

                  <Grid container className={classes.btn} spacing={4}>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                      {(user.role === 'client' || user.role === 'clientAdmin') && (
                        <Button
                          className={classes.btnColor}
                          variant="contained"
                          color="primary"
                          startIcon={<AddCircleOutlineIcon fontSize="inherit" />}
                          component={Link}
                          to="/reports/add"
                        >
                          Добавить
                        </Button>
                      )}
                    </Grid>
                    
                  </Grid>
                </Grid>
              </Hidden>
            </Toolbar>
            <DataGrid
              // pageSize={pageSize}
              className={classes.root}
              rows={reports}
              columns={dataColumn.map((item) => {
                return item;
              })}
              productCategorySize={4}
              onCellClick={(cell) => {
                if (cell.row.status === 'considered') return;
                if (cell.field === 'edit') {
                  history.push(`/reports/edit/${cell.row.id}`);
                } else {
                  history.push(`/reports/view/${cell.row.id}`);
                }
              }}
            />
            
          </Grid>
        </div>
      </Grid>
      {user.role === 'mainAdmin' || user.role === 'supervisorAdmin' ? (
        <Redirect to="/" />
      ) : null}
    </Grid>
    <div className={classes.exBtRow} >
           <Grid item xs={3} sm={3} md={3} lg={3}>
                      {/* <Hidden only={['sm', 'xs']}> */}
                      <Button
                        className={classes.btnColor}
                        variant="contained"
                        color="primary"
                        startIcon={<GetAppIcon fontSize="inherit" />}
                        onClick={(e) => exportToCSV(reports, ExportedFile)}
                      >
                        Экспорт
                      </Button>
                      {/* </Hidden> */}
                    </Grid>
    </div>
   
    </Box>
   
  );
}
