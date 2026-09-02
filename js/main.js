document.addEventListener('DOMContentLoaded', function() {
    /* =========================================================
       1. SLIDESHOW INITIALIZATION & LOGIC
       ========================================================= */
    const images = [
        'assets/Interns2023.JPEG',
        'assets/img_7193.jpg'
    ];
    
    const slideshowContainer = document.querySelector('.slideshow-container');
    
    if (slideshowContainer) {
        // Create slides dynamically
        images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            if (index === 0) slide.classList.add('active');
            slide.style.backgroundImage = `url('${image}')`;
            slideshowContainer.appendChild(slide);
        });
        
        // Slide rotation
        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;
        
        if (slides.length > 0) {
            function changeSlide() {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }
            // Rotate slide every 5 seconds
            setInterval(changeSlide, 5000);
        }
    }

    /* =========================================================
       2. STICKY NAVBAR LOGIC
       ========================================================= */
    const nav = document.querySelector('.index-nav');
    
    function checkScroll() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    
    // Initial check on load
    checkScroll();
    // Check on scroll
    window.addEventListener('scroll', checkScroll);

    /* =========================================================
       3. SCROLLSPY LOGIC
       ========================================================= */
    const sections = document.querySelectorAll('header[id], section[id], div[id]');
    const navLinks = document.querySelectorAll('.index-nav a.nav-link');

    function scrollSpy() {
        let currentSectionId = '';
        
        // Find which section is currently centered/visible in viewport
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust threshold offset depending on scroll position
            if (window.scrollY >= sectionTop - 120) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // If at the very bottom of page, default to last section
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
            currentSectionId = sections[sections.length - 1].getAttribute('id');
        }

        // Highlight active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);
    // Initial check to highlight correct link on page load
    scrollSpy();

    /* =========================================================
       4. INTERACTIVE MEMBERSHIP FORM
       ========================================================= */
    const membershipForm = document.getElementById('membershipForm');
    if (membershipForm) {
        membershipForm.addEventListener('submit', function(event) {
            event.preventDefault();
            alert('Thank you for your application! The OU VSA officers will contact you soon.');
            this.reset();
        });
    }
});
