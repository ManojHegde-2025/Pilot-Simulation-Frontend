import React, { useState } from 'react';
import { useFlightLogsContext } from '../hooks/UseFlightLogsContext';
import { useAuthContext } from '../hooks/useAuthContext';

const FlightLogForm = () => {
    const { dispatch } = useFlightLogsContext();
    const { user } = useAuthContext();
    
    // --- Configuration Lists ---
    const namesList = ["Manoj", "Pratham"];

    // --- State Management ---
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [totalFlyingHours, setTotalFlyingHours] = useState('');
    const [description, setDescription] = useState('');
    
    const [error, setError] = useState('');
    const [emptyFields, setEmptyFields] = useState([]);

    const handleSubmit = async(e) =>{
        e.preventDefault();

        if(!user){
            setError('User must be logged in!')
            return
        }

        setIsLoading(true); 
        setError('');       
        
        // Date is handled on the backend, but we need it for WhatsApp
        const currentDate = new Date().toLocaleDateString('en-GB');

        const logData = {
            name,
            startTime,
            endTime,
            totalFlyingHours: Number(totalFlyingHours),
            description
        };

        try{
            const response = await fetch('https://pilot-simulation-backend.onrender.com/api/flight-logs', {
                // const response = await fetch('/api/flight-logs', {
                method: 'POST',
                body: JSON.stringify(logData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (!response.ok) {
                setError(json.error);
                setEmptyFields(json.emptyFields || []);
                setIsLoading(false); 
            }
            else {
                // --- WHATSAPP MESSAGE FORMAT ---
                const waMessage = `\u2708\uFE0F *New Simulation Log Report*\n\n` +
                    `*Date:* ${currentDate}\n` +
                    `*Name:* ${name}\n` +
                    `*Start Time:* ${startTime}\n` +
                    `*End Time:* ${endTime}\n` +
                    `*Total Flying Hours:* ${totalFlyingHours}\n` +
                    `*Description:* ${description || 'No additional notes'}`;

                const encodedMessage = encodeURIComponent(waMessage);
                window.location.href = `https://api.whatsapp.com/send?text=${encodedMessage}`;

                // --- RESET FORM ---
                setError(null);
                setName('');
                setStartTime('');
                setEndTime('');
                setTotalFlyingHours('');
                setDescription('');
                setEmptyFields([]);
                setIsLoading(false); 
                dispatch({type: 'CREATE_FLIGHTLOG', payload: json});
            }
        }catch (err) {
            setError("Could not connect to the server.");
            setIsLoading(false); 
        }
    }

  return (
    <form className='create' onSubmit={handleSubmit}>
        <h3>Add a New Simulation Record</h3>

        <div className="form-group">
            <label>Name :</label>
            <select 
                className={emptyFields.includes('name') ? 'error form-select' : 'form-select'} 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
            >
                <option value="" disabled>Select Name</option>
                {namesList.map((n) => (<option key={n} value={n}>{n}</option>))}
            </select>
        </div>

        <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Start Time :</label>
                <input 
                    className={emptyFields.includes('startTime') ? 'error form-input' : 'form-input'} 
                    type="time" 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)} 
                    required 
                />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
                <label>End Time :</label>
                <input 
                    className={emptyFields.includes('endTime') ? 'error form-input' : 'form-input'} 
                    type="time" 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)} 
                    required 
                />
            </div>
        </div>

        <div className="form-group">
            <label>Total Flying Hours :</label>
            <input 
                className={emptyFields.includes('totalFlyingHours') ? 'error form-input' : 'form-input'} 
                type="number" 
                step="0.01"
                value={totalFlyingHours} 
                onChange={(e) => setTotalFlyingHours(e.target.value)} 
                placeholder="Ex: 1.5" 
                required 
            />
        </div>

        <div className="form-group">
            <label>Description :</label>
            <textarea 
                className={emptyFields.includes('description') ? 'error form-textarea' : 'form-textarea'} 
                rows="3" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder='Enter description...' 
                required
            />
        </div>

        <button className="btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Submit Log'}
        </button>
        {error && <div className='error'>{error}</div>}
    </form>
  );
}

export default FlightLogForm;
