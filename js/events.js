// Your Google Calendar API key
const API_KEY = 'YOUR_API_KEY';
// Your calendar ID (this is usually your Google account email)
const CALENDAR_ID = 'your_calendar_id@group.calendar.google.com';

// Load the Google API client library
function handleClientLoad() {
    gapi.load('client', initClient);
}

// Initialize the API client
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    }).then(() => {
        // After client is initialized, get the events
        getEvents();
    }).catch(error => {
        console.error('Error initializing Google Calendar API client:', error);
        document.getElementById('events-list').innerHTML = 
            '<p class="error">Could not load events. Please try again later.</p>';
    });
}

// Get calendar events
function getEvents() {
    // Current time in ISO format
    const now = new Date().toISOString();
    
    // Get events for the next 30 days
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setDate(oneMonthFromNow.getDate() + 30);
    
    gapi.client.calendar.events.list({
        'calendarId': CALENDAR_ID,
        'timeMin': now,
        'timeMax': oneMonthFromNow.toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'orderBy': 'startTime'
    }).then(response => {
        const events = response.result.items;
        displayEvents(events);
        
        // Optional: If you want to embed a full calendar view
        displayFullCalendar();
    }).catch(error => {
        console.error('Error getting events:', error);
        document.getElementById('events-list').innerHTML = 
            '<p class="error">Could not load events. Please try again later.</p>';
    });
}

// Display events in a list format
function displayEvents(events) {
    const eventsContainer = document.getElementById('events-list');
    
    if (!events || events.length === 0) {
        eventsContainer.innerHTML = '<p>No upcoming events found.</p>';
        return;
    }
    
    let eventsHTML = '<ul class="events">';
    
    events.forEach(event => {
        // Format the date and time
        const startDateTime = new Date(event.start.dateTime || event.start.date);
        const endDateTime = new Date(event.end.dateTime || event.end.date);
        
        const formattedDate = startDateTime.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        
        // Format time only if it's not an all-day event
        let formattedTime = '';
        if (event.start.dateTime) {
            formattedTime = `${startDateTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })} - ${endDateTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })}`;
        }
        
        eventsHTML += `
            <li class="event-item">
                <div class="event-date">${formattedDate}</div>
                ${formattedTime ? `<div class="event-time">${formattedTime}</div>` : ''}
                <h3 class="event-title">${event.summary}</h3>
                ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
                ${event.location ? `<div class="event-location"><strong>Location:</strong> ${event.location}</div>` : ''}
            </li>
        `;
    });
    
    eventsHTML += '</ul>';
    eventsContainer.innerHTML = eventsHTML;
}

// Optional: Display a full embedded calendar
function displayFullCalendar() {
    const calendarContainer = document.getElementById('full-calendar');
    
    // You can use Google Calendar's embed code
    calendarContainer.innerHTML = `
        <iframe src="https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CALENDAR_ID)}&ctz=America%2FChicago" 
            style="border: 0" width="100%" height="600" frameborder="0" scrolling="no"></iframe>
    `;
}

// Call the function to load the client when the page loads
document.addEventListener('DOMContentLoaded', handleClientLoad);