import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2CBBA1',
    },
    secondary: {
      main: '#f00',
    },
  },

  typography: {
    fontFamily: 'Proxima Nova',

    body2: {
      fontFamily: 'Times New Roman',
      fontSize: '1.4rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  overrides: {
    MuiFilledInput: {
      root: {
        backgroundColor: 'white',
        height: '68px',
        borderWidth: '12px',
      },
    },
    // MuiListItem: {
    //   root: {
    //     '&$selected': {
    //       backgroundColor: 'red',
    //       '&:hover': {
    //         backgroundColor: 'orange',
    //       },
    //     },
    //   },
    // },
    MuiSelected: {
      root: {
        color: '#2CBBA1',
        backgroundColor: '#2CBBA1',
      },
    },
    MuiAppBar: {
      root: {
        color: '#2CBBA1',
        backgroundColor: '#2CBBA1',
      },
    },
    MuiTypography: {
      // root: {
      //   color: '#2CBBA1',
      // },
    },
    // MuiFilledInput: {
    //   root: {
    //     backgroundColor: '#2CBBA1',
    //     '&:hover': {
    //       backgroundColor: '#2CBBA1',
    //     },
    //     '&.Mui-focused': {
    //       backgroundColor: '#2CBBA1',
    //     },
    //   },
    // },
    MuiTextField: {
      label: {
        fontFamily: 'Proxima Nova',
        height: '68px',
      },
    },
    MuiInputLabel: {
      root: {},
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        padding: '15px',
        width: '250px',
        height: '68px',
      },
      fullWidth: {
        maxWidth: '350px',
      },
    },
  },
  props: {
    MuiButton: {
      disableRipple: true,
      variant: 'contained',
      color: 'primary',
    },

    MuiTextField: {
      variant: 'outlined',
      color: 'primary',
      fontFamily: 'Proxima Nova',
      disableRipple: false,
    },
    MuiNativeSelect: {
      variant: 'outlined',
      InputLabelProps: { shrink: true },
      height: '68px',
    },
    MuiInputBase: { fontFamily: 'Proxima Nova' },
    MuiSelect: {
      variant: 'outlined',
      height: '68px',
      lebelWidth: '100%',
    },
    MuiFormControl: {
      root: { height: '68px' },
      variant: 'outlined',
      color: 'primary',
      lebelWidth: '100%',
      fontFamily: 'Proxima Nova',
    },
  },
});
