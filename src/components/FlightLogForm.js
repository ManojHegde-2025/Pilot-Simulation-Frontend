import React, { useState } from 'react';
import { useFlightLogsContext } from '../hooks/UseFlightLogsContext';
import { useAuthContext } from '../hooks/useAuthContext';

const FlightLogForm = () => {
    const { dispatch } = useFlightLogsContext();
    const { user } = useAuthContext();
    
    // --- Configuration Lists ---
    const namesList = ["Ashlaeesh","Abhineesh","Adarsh","Adyanth","Akhileesh","Manoj", "Pratham", "Pratish", "Shashank", "Shree Raghavendra", "Suchetha"];

    // --- State Management ---
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    
    // Split Time States
    const [startHour, setStartHour] = useState('');
    const [startMin, setStartMin] = useState('');
    const [endHour, setEndHour] = useState('');
    const [endMin, setEndMin] = useState('');
    
    const [totalFlyingHours, setTotalFlyingHours] = useState('');
    
    // New Wind State
    const [wind, setWind] = useState('');
    
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
        
        const currentDate = new Date().toLocaleDateString('en-GB');

        // Combine the Hours and Minutes into a strict HH:mm format before sending
        const formattedStartTime = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
        const formattedEndTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

        // Notice: 'wind' is NOT included here so it won't be sent to MongoDB or Google Sheets
        const logData = {
            name,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            totalFlyingHours: Number(totalFlyingHours),
            description
        };

        try{
            const response = await fetch('https://pilot-simulation-backend.onrender.com/api/flight-logs/', {
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
                // --- WHATSAPP MESSAGE FORMAT (Includes Wind) ---
                const waMessage =
                    `*Date:* ${currentDate}\n` +
                    `*Name:* ${name}\n` +
                    `*Start Time:* ${formattedStartTime}\n` +
                    `*End Time:* ${formattedEndTime}\n` +
                    `*Description:* ${description || 'No additional notes'}\n`+
                    `*Wind:* ${wind} mph\n`;

                const encodedMessage = encodeURIComponent(waMessage);
                window.location.href = `https://api.whatsapp.com/send?text=${encodedMessage}`;

                // --- RESET FORM ---
                setError(null);
                setName('');
                setStartHour('');
                setStartMin('');
                setEndHour('');
                setEndMin('');
                setTotalFlyingHours('');
                setWind('');
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

        <div className="form-group">
            <label>Start Time (24 Hr) :</label>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                    className={emptyFields.includes('startTime') ? 'error form-input' : 'form-input'} 
                    type="number" min="0" max="23" 
                    value={startHour} 
                    onChange={(e) => setStartHour(e.target.value)} 
                    placeholder='HH (0-23)' 
                    required 
                />
                <input 
                    className={emptyFields.includes('startTime') ? 'error form-input' : 'form-input'} 
                    type="number" min="0" max="59" 
                    value={startMin} 
                    onChange={(e) => setStartMin(e.target.value)} 
                    placeholder='MM (0-59)' 
                    required 
                />
            </div>
        </div>

        <div className="form-group">
            <label>End Time (24 Hr) :</label>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                    className={emptyFields.includes('endTime') ? 'error form-input' : 'form-input'} 
                    type="number" min="0" max="23" 
                    value={endHour} 
                    onChange={(e) => setEndHour(e.target.value)} 
                    placeholder='HH (0-23)' 
                    required 
                />
                <input 
                    className={emptyFields.includes('endTime') ? 'error form-input' : 'form-input'} 
                    type="number" min="0" max="59" 
                    value={endMin} 
                    onChange={(e) => setEndMin(e.target.value)} 
                    placeholder='MM (0-59)' 
                    required 
                />
            </div>
        </div>

        <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1 }}>
                <label>Duration :</label>
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

            <div className="form-group" style={{ flex: 1 }}>
                <label>Wind Speed (mph) :</label>
                <input 
                    className="form-input" 
                    type="number" 
                    value={wind} 
                    onChange={(e) => setWind(e.target.value)} 
                    placeholder="Ex: 5" 
                    required 
                />
            </div>
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
