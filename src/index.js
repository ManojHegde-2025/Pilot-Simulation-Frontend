import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { FlightLogsContextProvider } from './context/FlightLogsContext';
import { AuthContextProvider } from './context/AuthContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <FlightLogsContextProvider>
        <App />
      </FlightLogsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);