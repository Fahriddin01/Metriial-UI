// import classes from '*.module.css';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CloseIcon } from '@material-ui/data-grid';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Controls from '../../../../Submission/Controls/Controls';
import * as Services from '../../../../Submission/Services/Services';

const useStyles = makeStyles((theme) => ({
  content: {
    // display: 'flex',
    margin: theme.spacing(1),
    paddingBottom: 2,
    height: '80vh',
    width: '100%',
    backgroundColor: '#F8F8F8',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
    },
  },
  filterL: {
    // display: 'flex',
    margin: theme.spacing(1, 1, 0, -1),
    width: '100%',
    backgroundColor: '#F8F8F8',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      margin: theme.spacing(1, 1, 0, -1),
    },
  },
  filterOrg: {
    // display: 'flex',
    margin: theme.spacing(1, 1, 0, -1),
    width: '100%',
    backgroundColor: '#F8F8F8',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      margin: theme.spacing(1, 1, 0, -1),
    },
  },
  textF: {
    justify: 'center',
    alignContent: 'center',
    margin: theme.spacing(1, 1, 0, -1),
    width: '100%',
    backgroundColor: '#F8F8F8',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
    },
  },
}));

export default function ReportFilterModal({ filter, toggleFilter }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // const [organizationId, setOrganizationId] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [measure, setMeasure] = useState('');
  const [iodineСoncentration, setIodineСoncentration] = useState('');
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    if (!filter) return;
    if (filter.startDate) {
      setStartDate(getFormattedDate(filter.startDate));
    }
    if (filter.endDate) {
      setEndDate(getFormattedDate(filter.endDate));
    }
    // if (filter.organizationId) {
    //   setOrganizationId(filter.organizationId);
    // }
    if (filter.productCategory) {
      setProductCategory(filter.productCategory);
    }
    if (filter.measure) {
      setMeasure(filter.measure);
    }
    if (filter.iodineСoncentration) {
      setIodineСoncentration(filter.iodineСoncentration);
    }
  }, [filter]);

  function getFormattedDate(date) {
    const month =
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return `${date.getFullYear()}-${month}-${day}`;
  }

  const onFilterSubmit = () => {
    const queryParams = [];
    if (startDate) {
      const newStartDate = new Date(startDate);
      queryParams.push(
        `startDate=${newStartDate.getDate()}-${newStartDate.getMonth()}-${newStartDate.getFullYear()}`,
      );
    }

    if (endDate) {
      const newEndDate = new Date(endDate);
      queryParams.push(
        `endDate=${newEndDate.getDate()}-${newEndDate.getMonth()}-${newEndDate.getFullYear()}`,
      );
    }
    // if (organizationId) {
    //   queryParams.push(`organizationId`);
    // }
    if (productCategory) {
      queryParams.push(`productCategory=${productCategory}`);
    }
    if (measure) {
      queryParams.push(`measure=${measure}`);
    }
    if (iodineСoncentration) {
      queryParams.push(`iodineСoncentration=${iodineСoncentration}`);
      // history.replace(`/reports?yod=${iodineСoncentration}`);
    }

    history.replace(`/reports?${queryParams.join('&')}`);
  };

  const resetFilter = () => {
    history.replace('/reports');
  };

  return (
    <Dialog open={true} onClose={() => toggleFilter()}>
      <DialogContent className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography className={classes.textF}>Фильтровать по дате</Typography>
            <TextField
              className={classes.filterL}
              variant="outlined"
              id="date"
              name="startDate"
              label="С"
              type="date"
              inputProps={{ style: { fontSize: 26 } }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />{' '}
            <br />
          </Grid>
          <Grid item xs={12} lg={12}>
            {/* <Typography className={classes.textF}>
              Фильтровать по дате: По
            </Typography> */}
            <TextField
              className={classes.filterL}
              variant="outlined"
              id="date"
              name="endDate"
              label="По"
              type="date"
              inputProps={{ style: { fontSize: 26 } }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} lg={12} className={classes.filterL}>
            <Typography>Категория продукта</Typography>
            <Controls.Select
              name="productCategory"
              label="&nbsp;&nbsp;Категории соли"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              options={Services.getProductCategory()}
            />
          </Grid>
          <Grid item xs={12} lg={12} className={classes.filterL}>
            <Typography>Йод</Typography>
            <Controls.Select
              name="iodineСoncentration"
              label="&nbsp;&nbsp;Концентрация Йода"
              value={iodineСoncentration}
              onChange={(e) => setIodineСoncentration(e.target.value)}
              options={Services.getIodineConcentration()}
            />{' '}
          </Grid>
          <Grid item xs={12} lg={12} className={classes.filterL}>
            <Typography>Eдиница веса</Typography>
            <Controls.Select
              name="measure"
              label="&nbsp;&nbsp;Тонн"
              value={measure}
              onChange={(e) => setMeasure(e.target.value)}
              options={Services.getWeightUnit()}
            />
          </Grid>
          {/* <Grid item xs={12} lg={12} className={classes.filterOrg}>
            <Typography>Организация ID</Typography>
            <Controls.Input name="organizationId" label="Организация" />
          </Grid> */}
        </Grid>

        <br />
      </DialogContent>
      <DialogActions className={classes.content1}>
        <Button onClick={onFilterSubmit} variant="contained" color="primary">
          Применить
        </Button>
        <Button onClick={resetFilter} variant="contained" color="secondary">
          Очистить
        </Button>
        <CloseIcon onClick={() => toggleFilter()} />
      </DialogActions>
    </Dialog>
  );
}
