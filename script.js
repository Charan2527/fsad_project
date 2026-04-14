const events = [
    { name: "Neon Music Fest", location: "city", date: "Oct 24, 2026", time: "20:00" },
    { name: "Future Tech Summit", location: "campus", date: "Nov 12, 2026", time: "09:00" },
    { name: "Abstract Art Gala", location: "hall", date: "Dec 05, 2026", time: "18:30" },
    { name: "Cloud DevCon", location: "city", date: "Oct 30, 2026", time: "10:00" },
    { name: "Symphony Orchestra", location: "hall", date: "Nov 20, 2026", time: "19:00" }
];

let selectedEvent = null;
let selectedSeats = [];

const locationIcons = {
    city: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    campus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
    hall: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3"></path></svg>'
};

// Load events
function loadEvents(filter = "all") {
    const list = document.getElementById("eventList");
    list.innerHTML = "";

    const filteredEvents = events.filter(e => filter === "all" || e.location === filter);

    if(filteredEvents.length === 0) {
        list.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align:center;">No events found for this location.</p>`;
        return;
    }

    filteredEvents.forEach((e, index) => {
        // Subtle stagger animation delay
        const delay = index * 0.1;
        
        list.innerHTML += `
            <div class="card" style="animation: slideUp 0.5s ease ${delay}s forwards; opacity: 0;">
                <div class="card-header">
                    <h4>${e.name}</h4>
                    <div class="location-tag">
                        ${locationIcons[e.location]}
                        ${e.location.charAt(0).toUpperCase() + e.location.slice(1)}
                    </div>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-muted); display:flex; justify-content:space-between; margin-bottom: 1rem;">
                    <span>📅 ${e.date}</span>
                    <span>⏰ ${e.time}</span>
                </div>
                <button class="btn btn-outline" onclick="chooseEvent('${e.name}')">Select Event</button>
            </div>
        `;
    });
}

// Initial load
document.addEventListener("DOMContentLoaded", () => {
    loadEvents();
});

// Filter
document.getElementById("locationFilter").addEventListener("change", function () {
    loadEvents(this.value);
});

// Choose event
function chooseEvent(name) {
    selectedEvent = events.find(e => e.name === name);
    document.getElementById("selectedEventLabel").innerText = selectedEvent.name;
    
    const seatSection = document.getElementById("seatSection");
    seatSection.classList.remove("hidden");
    
    // Smooth scroll
    seatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    createSeats();
    
    // Hide trailing sections if selection changes
    document.getElementById("formSection").classList.add("hidden");
    document.getElementById("ticketSection").classList.add("hidden");
    selectedSeats = [];
}

// Create seats
function createSeats() {
    const seatsDiv = document.getElementById("seats");
    seatsDiv.innerHTML = "";

    // Let's make 20 seats
    for (let i = 1; i <= 20; i++) {
        const seat = document.createElement("div");
        seat.className = "seat";
        
        // Randomly disable some seats to make it realistic
        const isOccupied = Math.random() > 0.8;
        
        if(isOccupied) {
            seat.innerText = "✕";
            seat.style.opacity = "0.3";
            seat.style.cursor = "not-allowed";
        } else {
            // Convert to row/seat format e.g., A1
            const row = String.fromCharCode(65 + Math.floor((i-1)/5));
            const num = ((i-1)%5) + 1;
            const seatLabel = `${row}${num}`;
            
            seat.innerText = seatLabel;
            
            seat.onclick = () => {
                if (seat.classList.contains("selected")) {
                    seat.classList.remove("selected");
                    selectedSeats = selectedSeats.filter(s => s !== seatLabel);
                } else {
                    seat.classList.add("selected");
                    selectedSeats.push(seatLabel);
                }
            };
        }

        // Entrance animation
        seat.style.animation = `slideUp 0.3s ease ${i * 0.02}s forwards`;
        seat.style.opacity = '0';

        seatsDiv.appendChild(seat);
    }
}

// Next step
function nextStep() {
    if (selectedSeats.length === 0) {
        alert("Please select at least one seat to continue.");
        return;
    }
    const formSection = document.getElementById("formSection");
    formSection.classList.remove("hidden");
    formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Focus first input gently
    setTimeout(() => {
        document.getElementById("name").focus();
    }, 500);
}

// Generate pass
function generatePass() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !email) {
        alert("Please fill out both your Name and Email.");
        return;
    }
    
    // Simple email validation regex trick
    if(!email.includes('@')) {
        alert("Please enter a valid email.");
        return;
    }

    const ticketSection = document.getElementById("ticketSection");
    ticketSection.classList.remove("hidden");
    
    // Create random order ID
    const orderId = 'NX-' + Math.floor(100000 + Math.random() * 900000);

    ticketSection.innerHTML = `
        <div class="ticket-pass" id="printArea">
            <div class="ticket-visual">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M15 5V3M2 12A10 10 0 1 0 12 2v2"></path>
                    <path d="m11 11 2 2 4-4"></path>
                    <path d="M22 12a10 10 0 0 0-4-8"></path>
                </svg>
                <div style="font-weight:700; letter-spacing:2px;">VIP ACCESS</div>
            </div>
            
            <div class="ticket-details">
                <div class="ticket-header">
                    <div>
                        <h2>${selectedEvent.name}</h2>
                        <div class="status-confirmed">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Booking Confirmed
                        </div>
                    </div>
                </div>
                
                <div class="ticket-grid">
                    <div class="info-item">
                        <label>ATTENDEE</label>
                        <p>${name}</p>
                    </div>
                    <div class="info-item">
                        <label>DATE & TIME</label>
                        <p>${selectedEvent.date} · ${selectedEvent.time}</p>
                    </div>
                    <div class="info-item">
                        <label>LOCATION</label>
                        <p style="text-transform: capitalize;">${selectedEvent.location} Area</p>
                    </div>
                    <div class="info-item">
                        <label>SEAT ASSIGNMENT</label>
                        <p style="color: var(--primary); font-size: 1.5rem;">${selectedSeats.join(', ')}</p>
                    </div>
                </div>
                
                <div class="ticket-footer">
                    <div class="barcode"></div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); margin-top:5px; text-align:center;">ORDER ID: ${orderId}</div>
                </div>
            </div>
        </div>
        <div style="text-align: center; margin-top: 1.5rem;">
            <button id="downloadBtn" class="btn btn-outline" style="width: auto;" onclick="downloadColorfulPass()">Download Custom Pass</button>
        </div>
    `;

    ticketSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function downloadColorfulPass() {
    const ticket = document.getElementById("printArea");
    const downloadBtn = document.getElementById("downloadBtn");
    
    // Provide user feedback
    const originalText = downloadBtn.innerText;
    downloadBtn.innerText = "Generating...";
    downloadBtn.disabled = true;

    // Use html2canvas to take a snapshot with the dark background styling
    html2canvas(ticket, {
        backgroundColor: "#0f111a",
        scale: 2 // High resolution
    }).then(canvas => {
        // Create an image link and trigger download
        const link = document.createElement('a');
        link.download = 'VIP_Pass_' + selectedEvent.name.replace(/\s+/g, '_') + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Restore button state
        downloadBtn.innerText = originalText;
        downloadBtn.disabled = false;
    }).catch(err => {
        console.error("Could not generate pass", err);
        alert("Oops, something went wrong generating your pass!");
        downloadBtn.innerText = originalText;
        downloadBtn.disabled = false;
    });
}