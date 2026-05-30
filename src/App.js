import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

// import home and navbar
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Form from './components/FlightLogForm' 
import History from './pages/History';
import { useAuthContext } from './hooks/useAuthContext';


function App() {
  const {user} = useAuthContext();
   return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
        <div className='pages'>
          <Routes>    
            {/* If logged in, go to Form. Otherwise, go to Login */}
            <Route path="/" element={user ? <Form /> : <Navigate to="/login" />} />
            
            {/* Added missing Home route */}
            <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
            
            {/* Fixed Form route */}
            <Route path="/form" element={user ? <Form /> : <Navigate to="/login" />} />
            
            {/* Added missing History route */}
            <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
            
            {/* Auth routes */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/"/>} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/"/>} />
          </Routes>       
       </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
