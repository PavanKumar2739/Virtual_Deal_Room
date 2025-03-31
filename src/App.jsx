import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { useSelector } from 'react-redux';
import SignUp from './pages/Sign';
import Home from './pages/Home';

function App() {
  const open = useSelector(store => store.app.snackbaropen);

  return (
    <BrowserRouter>
      {open && <CustomSnackbar />}
      <Routes>
        <Route path='/' element={<Navigate to='/home' />} replace={true} />
        <Route path='/login' element={<LoginRoute><SignUp isSignUp={false} /></LoginRoute>} />
        <Route path='/register' element={<LoginRoute><SignUp isSignUp={true} /></LoginRoute>} />
        <Route path='/home' element={<ProterctedRoute><Home /></ProterctedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

const ProterctedRoute = (event) => {

  if (sessionStorage.getItem('TodoUserlogin')) {
    return event.children;
  } else {
    return <Navigate to='/login' />
  }
}

const LoginRoute = (event) => {
  if (sessionStorage.getItem('TodoUserlogin')) {
    return <Navigate to='/' />
  } else {
    return event.children;
  }

}
export default App
