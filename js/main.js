document.addEventListener('DOMContentLoaded', function() {
    // Array of image paths
    const images = [
        'assets/Interns2023.JPEG',
        'assets/img_7193.jpg'  // Update with your actual image paths
    ];
    
    const slideshowContainer = document.querySelector('.slideshow-container');
    
    // Create slides
    images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        if (index === 0) slide.classList.add('active');
        slide.style.backgroundImage = `url('${image}')`;
        slideshowContainer.appendChild(slide);
    });
    
    // Get all slides
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    // Function to change slide
    function changeSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Update current slide index
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to new current slide
        slides[currentSlide].classList.add('active');
    }
    
    // Change slide every 5 seconds
    setInterval(changeSlide, 5000);
});
// Create slides
images.forEach((image, index) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    if (index === 0) slide.classList.add('active');
    
    const img = document.createElement('img');
    img.src = image;
    img.alt = "VSA slideshow image";
    
    slide.appendChild(img);
    slideshowContainer.appendChild(slide);
});





