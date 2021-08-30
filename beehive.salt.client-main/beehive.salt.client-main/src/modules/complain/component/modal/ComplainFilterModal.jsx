import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { CloseIcon } from '@material-ui/data-grid';
import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
  content: {
    // display: 'flex',
    margin: theme.spacing(1),
    paddingBottom: 2,
    height: '30vh',
    width: '100%',
    backgroundColor: '#F8F8F8',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
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
}));

export default function ComplainFilterModal({ filter, toggleFilter }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

    history.replace(`/complains?${queryParams.join('&')}`);
  };

  const resetFilter = () => {
    history.replace('/complains');
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
              label="Start Date"
              type="date"
              inputProps={{ style: { fontSize: 26 } }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={classes.filterL}
              variant="outlined"
              id="date"
              name="endDate"
              label="End Date"
              type="date"
              inputProps={{ style: { fontSize: 26 } }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
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
