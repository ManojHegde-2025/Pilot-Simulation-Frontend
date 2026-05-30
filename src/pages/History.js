import React, { useEffect, useState } from "react";
import { format } from 'date-fns'; 

// import components
import FlightLogDetails from "../components/FlightLogDetails";
import { useFlightLogsContext } from "../hooks/UseFlightLogsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const History = () => {
  const { flightLogs, dispatch } = useFlightLogsContext();
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFlightLogs = async () => {
      const response = await fetch('https://pilot-portal-backend.onrender.com/api/flight-logs', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_FLIGHTLOGS', payload: json });
      } else {
        console.error("Failed to fetch data:", json);
      }
    };
    
    if (user) {
      fetchFlightLogs();
    }
  }, [dispatch, user]);

  // 1. Updated filter logic for the Simulation schema
  const filteredLogs = flightLogs ? flightLogs.filter((log) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (log.name && log.name.toLowerCase().includes(searchLower)) ||
      (log.description && log.description.toLowerCase().includes(searchLower))
    );
  }) : [];

  // 2. Group the filtered logs by their formatted date string
  const groupedLogs = filteredLogs.reduce((acc, log) => {
    const dateStr = format(new Date(log.createdAt), 'dd/MM/yyyy');
    
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    
    acc[dateStr].push(log);
    return acc;
  }, {});

  return (
    <div className="home">
      
      {/* Updated Search Input Bar */}
      <div className="search-container" style={{ marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Search by Name or Description..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1.5px solid var(--primary)', 
            backgroundColor: '#fff',
            color: '#333',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div className="flight-logs">
        {Object.keys(groupedLogs).map((date) => (
          <div key={date} className="date-group" style={{ marginBottom: '40px' }}>
            
            <h3 >
              {date}
            </h3>
            
            {groupedLogs[date].map((flightlog) => (
              <FlightLogDetails key={flightlog._id} flightlogs={flightlog} />
            ))}
            
          </div>
        ))}

        {Object.keys(groupedLogs).length === 0 && flightLogs && flightLogs.length > 0 && (
          <p style={{ textAlign: 'center', color: '#aaa', marginTop: '20px' }}>
            No records found matching "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  )
}

export default History;