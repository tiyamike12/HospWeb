import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const localizer = momentLocalizer(moment);
const BASE_URL = process.env.REACT_APP_API_URL;

const CalendarView = () => {
    const [events, setEvents] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');

    useEffect(() => {
        // Set default date range for the current month
        const currentDate = moment();
        const firstDayOfMonth = currentDate.startOf('month').format('YYYY-MM-DD');
        const lastDayOfMonth = currentDate.endOf('month').format('YYYY-MM-DD');

        setStartDate(firstDayOfMonth);
        setEndDate(lastDayOfMonth);
    }, []);

    useEffect(() => {
        // Fetch appointments when start_date or end_date changes
        fetchAppointments(start_date, end_date);
    }, [start_date, end_date]);

    const fetchAppointments = (start_date, end_date) => {
        axios
            .get(`${BASE_URL}/appointment/date-range`, {
                params: { start_date, end_date },
            })
            .then((response) => {
                console.log(response)
                const formattedEvents = response.data.map((appointment) => ({
                    id: appointment.id,
                    title: appointment.purpose,
                    start: new Date(`${appointment.appointment_date} ${appointment.appointment_time}`),
                    end: new Date(`${appointment.appointment_date} ${appointment.appointment_time}`),
                }));
                setEvents(formattedEvents);
                setIsLoaded(true);
            })
            .catch((error) => console.log(error));

    };

    console.log(events)

    const handleSearch = () => {
        // Fetch appointments when the user clicks the search button
        fetchAppointments(start_date, end_date);
    };

    return (
        <div style={{ height: 500 }}>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                <label htmlFor="start_date">Start Date: </label>
                <input
                    type="date"
                    id="start_date"
                    style={{ padding: '5px' }}
                    value={start_date}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label htmlFor="end_date">End Date: </label>
                <input
                    type="date"
                    id="end_date"
                    style={{ padding: '5px' }}
                    value={end_date}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button onClick={handleSearch} style={{ marginLeft: '20px', padding: '5px 10px',
                    backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px' }}>Search</button>
            </div>
            {isLoaded ? (
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ margin: '20px' }}
                />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default CalendarView;
