// Main site functionality
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links with debounce
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    let scrollTimeout;

    scrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    document.querySelector('.nav-menu').classList.remove('active');
                    document.querySelector('.menu-toggle i').classList.add('bi-list');
                    document.querySelector('.menu-toggle i').classList.remove('bi-x');
                }, 100);
            }
        });
    });

    // Mobile menu toggle with optimized animation
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = this.querySelector('i');
        icon.classList.toggle('bi-list');
        icon.classList.toggle('bi-x');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Header scroll effect with throttling
    const header = document.getElementById('header');
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll <= 0) {
                    header.classList.remove('scroll-up');
                    return;
                }
                
                if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
                    // Scrolling down
                    header.classList.remove('scroll-up');
                    header.classList.add('scroll-down');
                } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
                    // Scrolling up
                    header.classList.remove('scroll-down');
                    header.classList.add('scroll-up');
                }
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });

    // Optimized reveal animations
    const revealElements = document.querySelectorAll('.fade-in');
    
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Only unobserve if not on mobile to improve performance
                if (window.innerWidth > 768) {
                    revealOnScroll.unobserve(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

    // Optimized accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            e.preventDefault();
            const accordionItem = this.parentElement;
            const content = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            const isActive = accordionItem.classList.contains('active');
            
            // Close all accordion items
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.accordion-content').style.maxHeight = '0';
                item.querySelector('i').classList.replace('bi-dash', 'bi-plus');
            });

            // Toggle current item if it wasn't active
            if (!isActive) {
                accordionItem.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.classList.replace('bi-plus', 'bi-dash');
            }
        });
    });

    // Optimized form handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'שולח...';
            submitButton.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitButton.textContent = 'נשלח בהצלחה!';
                submitButton.classList.add('success');
                
                // Reset form after delay
                setTimeout(() => {
                    this.reset();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.classList.remove('success');
                }, 2000);
            }, 1500);
        });
    }

    // Optimized image loading
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });

    galleryImages.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').classList.add('bi-list');
            menuToggle.querySelector('i').classList.remove('bi-x');
            document.body.style.overflow = '';
        }
    });
    
    // Smooth image loading for gallery with improved mobile performance
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Lazy loading for gallery images with improved mobile performance
    const lazyLoadImages = () => {
        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    };

    // Touch-friendly hover effect
    galleryItems.forEach(item => {
        // Use touchstart/touchend for mobile
        item.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease-in-out';
        });

        item.addEventListener('touchend', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Keep mouse events for desktop
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.transition = 'transform 0.3s ease-in-out';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Intersection Observer for fade-in effect with mobile optimization
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Only unobserve if not on mobile to improve performance
                if (window.innerWidth > 768) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1
    });

    galleryItems.forEach(item => {
        observer.observe(item);
    });

    // Initialize lazy loading
    lazyLoadImages();
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        // Reset mobile menu state on orientation change
        navMenu.classList.remove('active');
        menuToggle.querySelector('i').classList.add('bi-list');
        menuToggle.querySelector('i').classList.remove('bi-x');
        document.body.style.overflow = '';
        
        // Recalculate heights for accordion items
        document.querySelectorAll('.accordion-item.active .accordion-content').forEach(content => {
            content.style.maxHeight = content.scrollHeight + 'px';
        });
    });

    // Optimize slideshow performance
    const slideshowImages = document.querySelectorAll('.slideshow img');
    if (slideshowImages.length > 0) {
        // Preload all slideshow images
        slideshowImages.forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
                const preloadImage = new Image();
                preloadImage.src = src;
            }
        });
    }
}); 