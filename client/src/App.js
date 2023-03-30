import { Route,Routes } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import AccountPage from './pages/AccountPage';
import PlacesPage from './pages/PlacesPages';
import PlacePage from './pages/PlacePage';
import PlacesFormPage from './pages/PlacesFormPage';
import BookingsPage from './pages/BookingsPage';
import BookingPage from './pages/BookingPage';

axios.defaults.baseURL='http://192.168.0.227:4000'
axios.defaults.withCredentials=true;

function App() {
  return (
    <UserContextProvider>
    <Routes>
        <Route path="/" element={<Layout/>}>
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/account" element={<AccountPage/>} />
        <Route path="/account/places" element={<PlacesPage  />} />
        <Route path="/account/places/new" element={<PlacesFormPage  />} />
        <Route path="/account/places/:id" element={<PlacesFormPage  />} />
        <Route path='/place/:id' element={<PlacePage/> } />
        <Route path='/account/bookings' element={<BookingsPage/>}/>
        <Route path='/account/bookings/:id' element={<BookingPage/>}/> 
      </Route>
    </Routes>
    </UserContextProvider>    
  );
}

export default App;
