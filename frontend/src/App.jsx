import React from 'react'
import { BrowserRouter, Route, Routes, useNavigate,Navigate } from 'react-router-dom'
import './App.css'
import { LoginProvider } from "./LoginContext"; 
import NavBar from './components/Navbar'
import Homepage from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import EmailVerify from './pages/EmailVerify'
import Logout from './pages/logout'
import TripDetails from './pages/TripDetail'
import ProfilePage from './pages/ProfilePage'; 
import MyTripsPage from './pages/Mytrips';
import CreateTripPage from './pages/CreateTrip';
import TripEditPage from './pages/TripEdit';
import './styles/global.css'; 

function RegisterAndLogout(){
  localStorage.clear()
  return <Register/>
}
function App() {
  return (
    <LoginProvider>
    <BrowserRouter>
    
    <NavBar/>
    <Routes>
      <Route path="/" 
      element={
        <Homepage/>
       } />
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterAndLogout/>} />
      <Route path= "/email-verify" element={<EmailVerify/>} />
      <Route path="/logout" element={
        <ProtectedRoute>
        <Logout/>
        </ProtectedRoute>} 
        />
      <Route path="My-trips" element={<ProtectedRoute>
        <MyTripsPage/>
       
        </ProtectedRoute> }/>
      <Route path="/trip/:tripId" element={<TripDetails />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/profile" element={<ProtectedRoute> <ProfilePage/>
      
      </ProtectedRoute>}/>
      <Route path= "create-trip" element={
        <ProtectedRoute> <CreateTripPage/> </ProtectedRoute> }/>
      <Route path = "/edit/:id" element={
        <ProtectedRoute> <TripEditPage /> </ProtectedRoute>
      }/>
      
    </Routes> 
      
    </BrowserRouter>
    </LoginProvider>
    
  )
}

export default App
