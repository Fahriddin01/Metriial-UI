import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
} from '@material-ui/core';
import * as Services from '../../../../Submission/Services/Services';
import { CloseIcon } from '@material-ui/data-grid';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Controls from './../../../../Submission/Controls/Controls';

const useStyles = makeStyles((theme) => ({
  content: {
    // display: 'flex',
    margin: theme.spacing(1),
    paddingBottom: 2,
    // height: '200px',
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
    [theme.breakpoints.down('sm')]: {
      width: '110%',
      margin: theme.spacing(1, -3, 0, -2.5),
    },
  },
}));

export default function UserFilterModal({ filter, toggleFilter }) {
  // const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const classes = useStyles();
  // const [lastName, setLastName] = useState('');

  const history = useHistory();
  console.log("sad",role)
  useEffect(() => {
    if (!filter) return;
    // if (filter.name) {
    //   setName(filter.name);
    // }
    if (filter.role) {
      setRole(filter.role);
    }
  }, [filter]);

  const onFilterSubmit = () => {
    // if (name) {
    //   history.replace(`/users?name=${name}`);
    // }
    if (role) {
      history.replace(`/users?role=${role}`);
    }
  };

  // const onFilterSubmit = () => {
  //   const queryParams = [];

  //   if (userName) {
  //     queryParams.push(
  //       `userName=${userName}`,
  //     );
  //   }

  //   history.replace(`/users?${queryParams.join('&')}`);
  // };

  const resetFilter = () => {
    history.replace('/users');
  };

  return (
    <Dialog open={true} onClose={() => toggleFilter()}>
      <DialogContent className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={10} md={12}>
            {/* <TextField
              className={classes.filterL}
              variant="outlined"
              id="text"
              name="userName"
              label="Имя"
              type="text"
              inputProps={{ style: { fontSize: 26 } }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            /> */}
          </Grid>
          {/* <Grid item xs={12} sm={10} md={6}></Grid> */}
        </Grid>
              <Controls.Select 
                label="Роль пользователя"
                name="role"
                value= {role}
                onChange={(e) => setRole(e.target.value)}
                options={Services.userRole()}
              />
        {/* <TextField
          variant="outlined"
          id="text"
          name="lastName"
          label="Фамилия"
          type="text"
          inputProps={{ style: { fontSize: 26 } }}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        /> */}
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
