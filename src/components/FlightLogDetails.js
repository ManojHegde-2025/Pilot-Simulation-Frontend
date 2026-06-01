import React, { useState } from 'react'
import { useFlightLogsContext } from '../hooks/UseFlightLogsContext'
import { format, formatDistanceToNow } from 'date-fns';
import { useAuthContext } from '../hooks/useAuthContext';

const FlightLogDetails = ({ flightlogs }) => {
    const { dispatch } = useFlightLogsContext();
    const { user } = useAuthContext();

    const [isEditing, setIsEditing] = useState(false);

    const [editForm, setEditForm] = useState({
        name: flightlogs.name,
        startTime: flightlogs.startTime,
        endTime: flightlogs.endTime,
        totalFlyingHours: flightlogs.totalFlyingHours,
        description: flightlogs.description
    });

    const handleUpdate = async () => {
        if (!user) return;

        const response = await fetch('https://pilot-simulation-backend.onrender.com/api/flight-logs' + flightlogs._id, {
        // const response = await fetch('/api/flight-logs', {
            method: 'PATCH', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(editForm)
        });

        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'UPDATE_FLIGHTLOG', payload: json });
            setIsEditing(false); 
        }
    };

    const handleChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    if (isEditing) {
        return (
            <form className='create' onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                <h3>Edit Record</h3>
                
                <label>Name:
                    <input type="text" name="name" value={editForm.name} onChange={handleChange} />
                </label>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <label style={{ flex: 1 }}>Start Time:
                        <input type="time" name="startTime" value={editForm.startTime} onChange={handleChange} />
                    </label>
                    <label style={{ flex: 1 }}>End Time:
                        <input type="time" name="endTime" value={editForm.endTime} onChange={handleChange} />
                    </label>
                </div>

                <label>Total Flying Hours:
                    <input type="number" step="0.01" name="totalFlyingHours" value={editForm.totalFlyingHours} onChange={handleChange} />
                </label>

                <label>Description:
                    <textarea name="description" value={editForm.description} onChange={handleChange} />
                </label>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button className="btn" type="submit">Save Changes</button>
                    <button type="button" className="btn" onClick={() => setIsEditing(false)} style={{ backgroundColor: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>Cancel</button>
                </div>
            </form>
        );
    }

    return (
        <div className='flight-log-details'>
            <h4>Name: {flightlogs.name}</h4>
            <p><strong>Date: </strong>{flightlogs.date}</p>
            <p><strong>Start Time: </strong>{flightlogs.startTime}</p>
            <p><strong>End Time: </strong>{flightlogs.endTime}</p>
            <p><strong>Total Flying Hours: </strong>{flightlogs.totalFlyingHours}</p>
            <p><strong>Description: </strong>{flightlogs.description}</p>

            <div style={{ marginTop: '15px', fontSize: '0.9em', color: '#aaa' }}>
                <p>
                    <strong>Created: </strong> 
                    {format(new Date(flightlogs.createdAt), 'dd/MM/yyyy HH:mm')} 
                    ({formatDistanceToNow(new Date(flightlogs.createdAt), { addSuffix: true })})
                </p>
                
                {flightlogs.createdAt !== flightlogs.updatedAt && (
                    <p>
                        <strong>Modified: </strong> 
                        {format(new Date(flightlogs.updatedAt), 'dd/MM/yyyy HH:mm')}
                        ({formatDistanceToNow(new Date(flightlogs.updatedAt), { addSuffix: true })})
                    </p>
                )}
            </div>
            
            <span className="material-symbols-outlined" onClick={() => setIsEditing(true)}>edit</span>        
        </div>
    )
}

export default FlightLogDetails