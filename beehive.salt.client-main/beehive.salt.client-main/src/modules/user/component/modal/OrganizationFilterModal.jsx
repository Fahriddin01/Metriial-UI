import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
} from '@material-ui/core';
import { CloseIcon } from '@material-ui/data-grid';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  content: {
    // display: 'flex',
    margin: theme.spacing(1),
    paddingBottom: 2,
    // height: '200px',
    backgroundColor: '#F8F8F8',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      width: '100%',
    },
  },
  filterL: {
    // display: 'flex',
    margin: theme.spacing(1, 1, 0, -1),
    width: '100%',
    backgroundColor: '#F8F8F8',
    [theme.breakpoints.down('sm')]: {
      width: '110%',
      margin: theme.spacing(1, -3, 0, -2.5),
    },
  },
}));

export default function OrganizationFilterModal({ filter, toggleFilter }) {
  const [name, setName] = useState('');
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    if (!filter) return;
    if (filter.name) {
      setName(filter.name);
    }
  }, [filter]);

  const onFilterSubmit = () => {
    if (name) {
      history.replace(`/organizations?name=${name}`);
    }
  };

  const resetFilter = () => {
    history.replace('/organizations');
  };

  return (
    <Dialog open={true} onClose={() => toggleFilter()}>
      <DialogContent className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {' '}
            <TextField
              className={classes.filterL}
              variant="outlined"
              id="text"
              name="name"
              label="Название организации"
              type="text"
              inputProps={{ style: { fontSize: 26 } }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {/* <Grid item xs={12} sm={10} md={6}></Grid> */}
        </Grid>
      </DialogContent>
      <DialogActions className={classes.content}>
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
