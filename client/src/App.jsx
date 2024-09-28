import { Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/authentication/Auth'
import Chat from './pages/chat/Chat'
import Profile from './pages/profile/Profile'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useAppStore } from './store'
import { useEffect, useState } from 'react'
import { apiClient } from './lib/api-client'
import { USER_INFO_ROUTE } from './utils/constants'

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();

  const isAuthenticated = !!userInfo;

  return isAuthenticated ? <Navigate to='/chat' /> : children
  // if authenticatd then go to chat from auth route or go to auth(children here)
}

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();

  const isAuthenticated = !!userInfo;

  return isAuthenticated ? children : <Navigate to='/auth' />
  // if authen then go to child(/chat or /profile, here are two) or go to auth
}

const App = () => {

  const { userInfo, setUserInfo } = useAppStore();

  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    try {
      const response = await apiClient.get(USER_INFO_ROUTE, { withCredentials: true });

      if (response.status === 200) {
        setUserInfo(response.data.user)
      } else {
        setUserInfo(undefined);
      }
      
    } catch (error) {
      console.error(error.response.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo])

  if (loading) {
    return <div className='flex items-center justify-center h-[100vh]'>
      <p className='loading'></p>
    </div>
  }

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition: Bounce
      />
      <Routes>
        <Route path='/auth' element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path='/chat' element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path='*' element={<Navigate to='/auth' />} />
      </Routes>
    </div>
  )
}

export default App