
import React from 'react';
import {AppBar, Container,Toolbar,IconButton,Typography,Box,Button,
  Paper,Grid, CardContent, Card, CardMedia,CardActions, BottomNavigationAction, DialogContentText} from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
// import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FolderIcon from '@material-ui/icons/Folder';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';



import MenuIcon from '@material-ui/icons/Menu';
import LayersIcon from '@material-ui/icons/Layers';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import { makeStyles } from '@material-ui/core/styles';
const useStyle = makeStyles((theme) =>({
   root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(1)
  },
  title :{
    flexGrow:1
  },
  mainfeaturesPost : {
    positsion: "relative",
    color: theme.palette.common,
    marginBottom: theme.spacing(4),
    
    backgroundSize:"cover",
    backgroundRepeat:"no-repeat",
    backgroundPosition:"center",
   
    

  },
  mainfeaturesPostContent : {
    positsion: "relative",
    padding : theme.spacing(6),
    marginTop: theme.spacing(3)
  },
  overlay : {
    positsion: "absolute",
    top : 0,
    bottom : 0,
    right: 0,
    left: 0,
    backgrounOverlay: "rgba(0,0,0,.3)"   
  },
  CardMedia:{
    paddingTop:"50.25%",
  },
  cardContent :{
    flexGrow: 1
  },
  cardGrid : {
    marginTop: theme.spacing(4)
  }
} ));

const cards = [1,2,3,4,5,6,7,8,9];
function App() {
  const classes = useStyle();
  const [value, setValue] = React.useState("recents");
  const HandleCange = (event,newValue) => (
    setValue(newValue)
  );

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () =>{
    setOpen(true);
  };

   const handleClose = () =>{
    setOpen(false);
  };


  return (
    <>
   <AppBar positsion ="fixed">
     <Container fixed> 
       <Toolbar>
        <IconButton edge="start"  color="inherit" aria-label = "menu" className ={classes.menuButton}>
          <MenuIcon/>
        </IconButton>
        <Typography variant ="h6" className ={classes.title}>
          My first site-materil-ui
        </Typography>
        <Box mr = {3}>
          <Button color="inherit" variant="outlined" onClick ={handleClickOpen}>Log In</Button>
        </Box>
        <Button color="secondary" variant="contained">Sign Up</Button>
         <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
              Log In
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Log in to see videos
              </DialogContentText>
              <TextField
              autoFocus
              margin="danse"
              id="name"
              label="Email address"
              type="email"
              style = {{display: 'block' }}
              />
               <TextField
              autoFocus
              margin="danse"
              id="password"
              label="Password"
              type="password"
              style = {{display: 'block' }}
              />
            </DialogContent>
            <DialogActions>
              <Button onclick={handleClose} color="primary">Cancel</Button>
              <Button onclick={handleClose} color="primary">Log in</Button>
            </DialogActions>

          </Dialog>
       </Toolbar>
     </Container>
   </AppBar>
    <main>
      <Paper className= {classes.mainfeaturesPost}
      backgrounImage= "url(https://source.unsplash.com/random)">
        <Container fixed>
          <div  className ={classes.overlay} />
          <Grid container>
            <Grid item md={6}>
              <div  className= {classes.mainfeaturesPostContent}>
              <Typography
              component="h1"
              variant ="h3"
              color="inherit"
              gutterButtom
              >           
               ui-site-material blog
              </Typography>
               <Typography
              component="h5"
              color="inherit"
              paragraph
              >           
             Lorem ipsum — классический текст-«рыба». 
             Является искажённым отрывком из философского трактата 
             Марка Туллия Цицерона «О пределах добра и зла», 
             написанного в 45 году до н. э. на латинском языке, 
             обнаружение сходства приписывается Ричарду МакКлинтоку. 
              </Typography>
              <Button variant="contained" color="secondary">
                Learn more
              </Button>
              </div> 
            </Grid>
          </Grid>
        </Container>
      </Paper>
      <div className={classes.mainContetnt} >
        <Container maxWidth="md">
          <Typography variant="h2" align="center" color ="textPrymery" gutterBottom>
            ui-site-material blog
          </Typography>
           <Typography component="h5" paragraph align="center" color ="textSecondary" gutterBottom>
            Lorem ipsum — классический текст-«рыба». 
             Является искажённым отрывком из философского трактата 
             Марка Туллия Цицерона «О пределах добра и зла», 
             написанного в 45 году до н. э. на латинском языке, 
             обнаружение сходства приписывается Ричарду МакКлинтоку. 
          </Typography>
          <div className={classes.mainButtons}>
            <Grid container spacing={3} justify="center"> 
              <Grid item >
                <Button variant ="contained" color ="primary">Start Now</Button>
              
              </Grid>
              <Grid item>
                
                <Button variant ="outlined" color ="primary">Learn More</Button>
              </Grid>     
          </Grid>
          </div>
        </Container>      
      </div>
      <Container className={classes.cardGrid}  maxWidth="md" >
            <Grid container spacing={4}>
                {cards.map((card) => (
                  <Grid item key={card} xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
                      <CardMedia className={classes.card}
                      image="https://source.unsplash.com/random"
                      title="image title" 
                      style = {{height:200}}
                      />
                      <CardContent className={classes.cardContent}>
                          <Typography variand="h5" gutterBottom>
                            Blog post
                          </Typography>
                           <Typography >
                            Blog post Blog post Blog post Blog post Blog post
                          </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="primary">
                          View
                        </Button>
                         <Button size="small" color="primary">
                          Edit
                        </Button>
                        <LayersIcon/>
                        <PlayCircleFilledIcon/>
                      </CardActions>
                    </Card>

                  </Grid>
                ))}
            </Grid>
      </Container> 
    </main>
    <footer>
      <Typography variant="h6" align="center" gutterBottom>
        footer
      </Typography>
      <BottomNavigation
      value={value}
      onChange={HandleCange}
      className= {classes.root}
      >
        <BottomNavigationAction
          Label= "Recents"
          value = "recents"
          icon = {<RestoreIcon/>}
        />
        <BottomNavigationAction
          Label= "Favorites"
          value = "favorites"
          icon = {<FavoriteIcon/>}
        /> 
        <BottomNavigationAction
          Label= "Nearby"
          value = "nearby"
          icon = {<LocationOnIcon/>}
        />    
        <BottomNavigationAction
          Label= "Folder"
          value = "folder"
          icon = {<FolderIcon/>}
        />           
      </BottomNavigation>
      <Typography align= "center"
      color= "textSecondary"
      component="p"
      variant="subtitle1">
        Material ui React js site
      </Typography>
    </footer>
    </>
  );
}

export default App;
