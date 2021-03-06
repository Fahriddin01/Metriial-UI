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
  const [iodine–°oncentration, setIodine–°oncentration] = useState('');
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
    if (filter.iodine–°oncentration) {
      setIodine–°oncentration(filter.iodine–°oncentration);
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
    if (iodine–°oncentration) {
      queryParams.push(`iodine–°oncentration=${iodine–°oncentration}`);
      // history.replace(`/reports?yod=${iodine–°oncentration}`);
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
            <Typography className={classes.textF}>–§–ł–Ľ—Ć—ā—Ä–ĺ–≤–į—ā—Ć –Ņ–ĺ –ī–į—ā–Ķ</Typography>
            <TextField
              className={classes.filterL}
              variant="outlined"
              id="date"
              name="startDate"
              label="–°"
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
              –§–ł–Ľ—Ć—ā—Ä–ĺ–≤–į—ā—Ć –Ņ–ĺ –ī–į—ā–Ķ: –ü–ĺ
            </Typography> */}
            <TextField
              className={classes.filterL}
              variant="outlined"
              id="date"
              name="endDate"
              label="–ü–ĺ"
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
            <Typography>–ö–į—ā–Ķ–≥–ĺ—Ä–ł—Ź –Ņ—Ä–ĺ–ī—É–ļ—ā–į</Typography>
            <Controls.Select
              name="productCategory"
              label="&nbsp;&nbsp;–ö–į—ā–Ķ–≥–ĺ—Ä–ł–ł —Ā–ĺ–Ľ–ł"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              options={Services.getProductCategory()}
            />
          </Grid>
          <Grid item xs={12} lg={12} className={classes.filterL}>
            <Typography>–ô–ĺ–ī</Typography>
            <Controls.Select
              name="iodine–°oncentration"
              label="&nbsp;&nbsp;–ö–ĺ–Ĺ—Ü–Ķ–Ĺ—ā—Ä–į—Ü–ł—Ź –ô–ĺ–ī–į"
              value={iodine–°oncentration}
              onChange={(e) => setIodine–°oncentration(e.target.value)}
              options={Services.getIodineConcentration()}
            />{' '}
          </Grid>
          <Grid item xs={12} lg={12} className={classes.filterL}>
            <Typography>E–ī–ł–Ĺ–ł—Ü–į –≤–Ķ—Ā–į</Typography>
            <Controls.Select
              name="measure"
              label="&nbsp;&nbsp;–Ę–ĺ–Ĺ–Ĺ"
              value={measure}
              onChange={(e) => setMeasure(e.target.value)}
              options={Services.getWeightUnit()}
            />
          </Grid>
          {/* <Grid item xs={12} lg={12} className={classes.filterOrg}>
            <Typography>–ě—Ä–≥–į–Ĺ–ł–∑–į—Ü–ł—Ź ID</Typography>
            <Controls.Input name="organizationId" label="–ě—Ä–≥–į–Ĺ–ł–∑–į—Ü–ł—Ź" />
          </Grid> */}
        </Grid>

        <br />
      </DialogContent>
      <DialogActions className={classes.content1}>
        <Button onClick={onFilterSubmit} variant="contained" color="primary">
          –ü—Ä–ł–ľ–Ķ–Ĺ–ł—ā—Ć
        </Button>
        <Button onClick={resetFilter} variant="contained" color="secondary">
          –ě—á–ł—Ā—ā–ł—ā—Ć
        </Button>
        <CloseIcon onClick={() => toggleFilter()} />
      </DialogActions>
    </Dialog>
  );
}
