import {
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '../../theme';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },

  root: {
    height: '20px',
    fontSize: '18px',
    justifyContent: 'center',
    width: '40%',
    marginLeft: '618px',
  },
}));

function ActivityType() {
  const classes = useStyles();
  const handleChange = (event) => {
    const { value } = event.target;
    history.push(value);

    setActivityType(event.target.value);
  };

  const [activityType, setActivityType] = React.useState('');
  const history = useHistory();
  return (
    <FormControl className={classes.root}>
      <InputLabel
        id="demo-simple-select-outlined-label"
        variant="outlined"
        style={{ color: 'black', borderColor: 'black' }}
        className={classes.root}
        startIcon={<AddIcon />}
      >
        Добавить
      </InputLabel>
      <Select
        variant="outlined"
        style={{ borderColor: 'black' }}
        className={classes.root}
        label="Вид деятельности"
        id="demo-simple-select-outlined"
        value={activityType}
        onChange={handleChange}
        placeholder="Добавить отчет"
        position="relative"
      >
        <MenuItem value={'production'}>Добыча</MenuItem>
        <MenuItem value={'processing'}>Переработка</MenuItem>
        <MenuItem value={'packaging'}>Упаковка</MenuItem>
        <MenuItem value={'sale'}>Продажа</MenuItem>
      </Select>
    </FormControl>
  );
}

export default ActivityType;
