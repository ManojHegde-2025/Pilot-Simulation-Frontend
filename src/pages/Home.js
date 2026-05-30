import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const Home = () => {
  const { user } = useAuthContext();
  const [flightLogs, setFlightLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await fetch('https://pilot-simulation-backend.onrender.com/api/flight-logs', {
        // const response = await fetch('/api/flight-logs', {
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setFlightLogs(json);
      }
    };

    if (user) {
      fetchLogs();
    }
  }, [user]);

  // --- CALCULATE STATISTICS ---
  const stats = {
    total: flightLogs.length,
    totalHours: flightLogs.reduce((sum, log) => sum + (log.totalFlyingHours || 0), 0).toFixed(2)
  };

  return (
    <div className="home pages">
      {user && (
        <div className="welcome-message" style={{ textAlign: 'center', marginBottom: '0px' }}>
          <h2 className='pp' > Welcome to Pilot Simulation </h2>
          <h2 className='un' > {user.name} </h2>
          <h2 className='db' > Dashboard </h2>
        </div>
      )}

      {/* --- DASHBOARD GRID --- */}
      <div className="dashboard-grid">
        <div className="stat-card total-card">
          <h3>Total Simulations</h3>
          <p className="stat-number">{stats.total}</p>
        </div>

        <div className="stat-card safe-card">
          <h3>Total Flying Hours</h3>
          <p className="stat-number">{stats.totalHours}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
