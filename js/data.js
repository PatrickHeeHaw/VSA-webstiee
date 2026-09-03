/* =========================================================
   VSA SITE DATA & STORAGE MANAGEMENT MODULE
   ========================================================= */

const STORAGE_KEY = 'OU_VSA_SITE_DATA_V1';

const defaultVSAData = {
    general: {
        officerPassword: 'OUVSA2026', // Default password for officer portal
        googleFormUrl: 'https://forms.google.com/your-vsa-merch-order-form',
        contactEmail: 'patrick.v.ha-1@ou.edu',
        contactPhone: '(405) 456-7890',
        contactAddress: '900 Asp Ave, Norman, OK 73019',
        welcomeTitle: 'Welcome To The Vietnamese Students Association!',
        welcomeDesc: 'We are a student-run organization at the University of Oklahoma.'
    },
    events: [
        { id: 'ev-1', date: 'Mar 25', title: 'Bake Sale' },
        { id: 'ev-2', date: 'Apr 1', title: 'General Meeting' },
        { id: 'ev-3', date: 'Apr 2', title: 'All You Can Eat Banh Mi' },
        { id: 'ev-4', date: 'Apr 11', title: 'Elections' }
    ],
    officers: [
        { id: 'off-1', name: 'Patrick Ha', title: 'President', major: 'Senior, Computer Science', image: 'assets/Patrick.JPEG' },
        { id: 'off-2', name: 'Angelina Nguyen', title: 'Vice President External', major: 'Junior, Health and Exercise Science Pre-PA', image: 'assets/Ang.JPG' },
        { id: 'off-3', name: 'Khiem Cao', title: 'Vice President Internal', major: 'Senior, Health and Exercise Science', image: 'assets/Khiem.JPEG' },
        { id: 'off-4', name: 'Sydeny Le', title: 'Treasurer', major: 'Sophomore, Finance', image: 'assets/Sydeny.JPEG' },
        { id: 'off-5', name: 'Tran Nguyen', title: 'Secretary/Cultural Chair', major: 'Sophomore, Management Information Systems', image: 'assets/Tran.JPEG' },
        { id: 'off-6', name: 'Caysey Nguyen', title: 'Marketing', major: 'Junior, Management Information Systems', image: 'assets/Caysey.JPG' },
        { id: 'off-7', name: 'Logan Ngo', title: 'Marketing', major: 'Junior, Management Information Systems', image: 'assets/Logan.JPEG' },
        { id: 'off-8', name: 'Henry Phan', title: 'Historian', major: 'Sophomore, Management Information Systems', image: 'assets/Henry.JPEG' },
        { id: 'off-9', name: 'Sam Lam', title: 'Fundraising Chair', major: 'Junior, Management Information Systems', image: 'assets/Sam.jpeg' },
        { id: 'off-10', name: 'Cathy Tran', title: 'Philanthropy Chair', major: 'Junior, Management Information Systems', image: 'assets/cathy.png' },
        { id: 'off-11', name: 'Brenda Nguyen', title: 'Family Leader', major: 'Senior, Biology', image: 'assets/Brenda.jpg' }
    ],
    merch: [
        { 
            id: 'm-1', 
            title: 'VSA Heritage Embroidered Hoodie', 
            desc: 'Heavyweight fleece pullover hoodie featuring gold & red emblem embroidery.', 
            price: '$45.00', 
            image: 'assets/merch_hoodie.png',
            badge: 'Best Seller',
            badgeClass: ''
        },
        { 
            id: 'm-2', 
            title: 'OU VSA Cultural Graphic Tee', 
            desc: 'Soft cotton crimson t-shirt with modern Vietnamese typographic artwork.', 
            price: '$25.00', 
            image: 'assets/merch_tshirt.png',
            badge: 'New Release',
            badgeClass: 'new'
        },
        { 
            id: 'm-3', 
            title: 'VSA Aesthetic Canvas Tote Bag', 
            desc: 'Durable natural canvas tote perfect for books, laptops, and daily campus life.', 
            price: '$18.00', 
            image: 'assets/merch_tote.png',
            badge: 'Popular',
            badgeClass: ''
        }
    ]
};

// Retrieve data from localStorage or default
function getVSAData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Ensure default structure compatibility
            return {
                general: { ...defaultVSAData.general, ...(parsed.general || {}) },
                events: parsed.events || defaultVSAData.events,
                officers: parsed.officers || defaultVSAData.officers,
                merch: parsed.merch || defaultVSAData.merch
            };
        }
    } catch (err) {
        console.warn('Could not read from localStorage, using defaults.', err);
    }
    return JSON.parse(JSON.stringify(defaultVSAData));
}

// Save data to localStorage
function saveVSAData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (err) {
        console.error('Failed to save to localStorage', err);
        return false;
    }
}

// Reset data to defaults
function resetVSAData() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (err) {}
    return JSON.parse(JSON.stringify(defaultVSAData));
}
