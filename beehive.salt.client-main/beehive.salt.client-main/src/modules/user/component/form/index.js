import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#E0E0E0',
    overflow: 'hidden',
    position: 'relative',
  },
  marginBtn: {
    backgroundColor: '#2CBBA1',
    color: '#fff',
    right: theme.spacing(1.7),
    marginTop: '3ch',
    '&hover': {
      backgroundColor: '#2CBBA1',
    },
  },
  margin: {
    marginTop: '3ch',
  },
  textField: {
    width: '34ch',
  },
}));


