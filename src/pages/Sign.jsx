import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import { ServiceRequest } from '../app/apis/serviceReq';
import { useDispatch } from 'react-redux';
import { setSnackbarOpen } from '../appSlice';
//import { setUserDetails } from '../userSplice';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@mui/material';
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: { width: '450px', },
  ...theme.applyStyles('dark', { boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px', }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
  [theme.breakpoints.up('sm')]: { height: '100dvh', },
  ...theme.applyStyles('dark', { backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))', }),
  overflow: 'auto',
  // Allow scrolling if content overflows 
}));

export default function SignUp({ isSignUp }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [userData, setUserData] = React.useState({ fullName: '', email: '', password: '' });
  const fullName = React.useRef(''); const email = React.useRef('');
  const password = React.useRef('');
  const [userType, setUserType] = React.useState("Buyer");
  // This code only runs on the client side, to determine the system color preference 
  React.useEffect(() => {

  }, []);
  const addStorage = (data2) => {
    navigate('/');
    sessionStorage.setItem('TodoUserlogin', true);
    sessionStorage.setItem('username', data2.userName);
    sessionStorage.setItem('email', email.current.value);
    sessionStorage.setItem('usertype', data2.type)
    sessionStorage.setItem('appToken',data2.token)
  }

  const handleToggle = (event) => {
    if(event.target.checked){
      setUserType("Buyer");
    }else{
      setUserType("Seller");
    }
  };

  const validateInputs = () => {
    const email1 = email.current;
    const password1 = password.current; const name = fullName.current;
    let isValid = true;
    if (!email1.value || !/\S+@\S+\.\S+/.test(email1.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false); setEmailErrorMessage('');
    }
    if (!password1.value || password1.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else { setPasswordError(false); setPasswordErrorMessage(''); } 
    if (!name.value || name.value.length < 1) { 
      setNameError(true);
       setNameErrorMessage('Name is required.');
        isValid = false; 
      } else {
         setNameError(false); 
         setNameErrorMessage(''); 
        } 
        return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const url = window.location.href; 
    const endUrl = url.substring(url.lastIndexOf('/')); 
    const data = { fullName: fullName.current.value, email: email.current.value, password: password.current.value, type : userType }; 
    setUserData(data); 
    try {
      const data2 = await ServiceRequest.callPostApi(`${ endUrl }`, data);
      // dispatch(setSnackbarOpen({ open: true, type: 'success', message: message.info })); 
      addStorage(data2); 
     // dispatch(setUserDetails({ userEmail: data2[0].email }));
    } catch (e) {
      console.log(e);
      // dispatch(setSnackbarOpen({
      //   open: true, type: 'error', message: e.response ? e.response.data.info : 'Internal server error occured'
      // }));
    }
  };

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
    <Stack
      sx={{
        justifyContent: "center",
        maxHeight: "100vh",
        p: 1,
        overflow: "auto", // Allow scrolling if content overflows
      }}
    >
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          {isSignUp ? "Sign up" : "Sign in"}
        </Typography>
  
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          {isSignUp && (
            <FormControl>
              <FormLabel htmlFor="name">User Name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                inputRef={fullName}
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? "error" : "primary"}
              />
            </FormControl>
          )}
  
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              required
              fullWidth
              id="email"
              inputRef={email}
              placeholder="your@email.com"
              name="email"
              autoComplete="email"
              variant="outlined"
              error={emailError}
              helperText={emailErrorMessage}
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>
  
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              required
              fullWidth
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              inputRef={password}
              autoComplete="new-password"
              variant="outlined"
              error={passwordError}
              helperText={passwordErrorMessage}
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>
          {isSignUp &&<FormControlLabel control={<Switch defaultChecked onClick={handleToggle}/>} label={userType} />}

          <FormControlLabel
            disabled
            control={<Checkbox value="allowExtraEmails" color="primary" />}
            label={isSignUp ? "I want to receive updates via email." : "Remember me.."}
          />
  
          <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
            {isSignUp ? "Sign up" : "Sign in"}
          </Button>
  
          <Typography sx={{ textAlign: "center" }}>
            {isSignUp ? "Already have an account? " : "Don't have an account "}
            <span>
              <Link
                href={!isSignUp ? "/register" : "/login"}
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </Link>
            </span>
          </Typography>
        </Box>
  
        <Divider>
          <Typography sx={{ color: "text.secondary" }}>or</Typography>
        </Divider>
  
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            disabled
            onClick={() => alert("Sign up with Google")}
            startIcon={<GoogleIcon />}
          >
            Sign up with Google
          </Button>
  
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            disabled
            onClick={() => alert("Sign up with Facebook")}
            startIcon={<FacebookIcon />}
          >
            Sign up with Facebook
          </Button>
        </Box>
      </Card>
    </Stack>
  </SignUpContainer>

  )}