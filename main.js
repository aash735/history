/* =====================================================
   WHISPERS OF FORGOTTEN INDIA - MAIN JAVASCRIPT
   Core functionality and navigation
   ===================================================== */

(function() {
    'use strict';
    
    // =====================================================
    // STATE & CONFIGURATION
    // =====================================================
    
    const state = {
        scrollPosition: 0,
        isNavOpen: false,
        currentFilter: 'all',
        currentView: 'grid'
    };
    
    const config = {
        scrollThreshold: 100,
        debounceDelay: 150
    };
    
    // =====================================================
    // UTILITY FUNCTIONS
    // =====================================================
    
    /**
     * Debounce function to limit rate of execution
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Throttle function for scroll events
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    /**
     * Check if element is in viewport
     */
    function isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.bottom >= offset
        );
    }
    
    // =====================================================
    // NAVIGATION
    // =====================================================
    
    function initNavigation() {
        const nav = document.getElementById('mainNav');
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        const navLinkElements = document.querySelectorAll('.nav-link');
        
        if (!nav) return;
        
        // Scroll behavior for navbar
        const handleScroll = throttle(() => {
            state.scrollPosition = window.pageYOffset;
            
            if (state.scrollPosition > config.scrollThreshold) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }, 100);
        
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        
        // Mobile navigation toggle
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                state.isNavOpen = !state.isNavOpen;
                
                navToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
                
                // Prevent body scroll when nav is open
                if (state.isNavOpen) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
            
            // Close nav when clicking outside
            document.addEventListener('click', (e) => {
                if (state.isNavOpen && !nav.contains(e.target)) {
                    navToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    state.isNavOpen = false;
                    document.body.style.overflow = '';
                }
            });
            
            // Close nav when clicking on link
            navLinkElements.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        navToggle.classList.remove('active');
                        navLinks.classList.remove('active');
                        state.isNavOpen = false;
                        document.body.style.overflow = '';
                    }
                });
            });
        }
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip empty or single hash
                if (href === '#' || href === '#!') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const navHeight = nav.offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // =====================================================
    // SCROLL ANIMATIONS (AOS Alternative)
    // =====================================================
    
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        if (animatedElements.length === 0) return;
        
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // =====================================================
    // REGION SELECTOR INTERACTIONS
    // =====================================================
    
    function initRegionSelector() {
        const regionItems = document.querySelectorAll('.region-item');
        
        regionItems.forEach(item => {
            item.addEventListener('click', function() {
                const region = this.dataset.region;
                
                // Remove active class from all
                regionItems.forEach(r => r.classList.remove('active'));
                
                // Add active class to clicked
                this.classList.add('active');
                
                // In a real app, this would filter monuments or navigate
                console.log('Selected region:', region);
                
                // Redirect to stories page with filter
                setTimeout(() => {
                    window.location.href = `stories.html?region=${region}`;
                }, 300);
            });
            
            // Keyboard accessibility
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    // =====================================================
    // STORIES PAGE - FILTER & VIEW
    // =====================================================
    
    function initStoriesFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const viewBtns = document.querySelectorAll('.view-btn');
        const storyCards = document.querySelectorAll('.story-card');
        const storiesGrid = document.getElementById('storiesGrid');
        
        if (filterBtns.length === 0) return;
        
        // Filter functionality
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter cards
                storyCards.forEach(card => {
                    const category = card.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = '';
                        setTimeout(() => {
                            card.classList.add('aos-animate');
                        }, 50);
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('aos-animate');
                    }
                });
                
                state.currentFilter = filter;
            });
        });
        
        // View toggle functionality
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const view = this.dataset.view;
                
                // Update active state
                viewBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update grid layout
                if (storiesGrid) {
                    if (view === 'list') {
                        storiesGrid.style.gridTemplateColumns = '1fr';
                    } else {
                        storiesGrid.style.gridTemplateColumns = '';
                    }
                }
                
                state.currentView = view;
            });
        });
    }
    
    // =====================================================
    // LOAD MORE FUNCTIONALITY
    // =====================================================
    
    function initLoadMore() {
        const loadMoreBtn = document.getElementById('loadMore');
        
        if (!loadMoreBtn) return;
        
        loadMoreBtn.addEventListener('click', function() {
            // Disable button and show loading state
            this.disabled = true;
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            
            // Simulate loading delay
            setTimeout(() => {
                // In a real app, this would fetch more data
                console.log('Loading more stories...');
                
                // Re-enable button
                this.disabled = false;
                this.textContent = originalText;
                
                // Show message
                alert('More stories loaded! (Demo)');
            }, 1000);
        });
    }
    
    // =====================================================
    // NEWSLETTER FORM
    // =====================================================
    
    function initNewsletterForm() {
        const form = document.getElementById('newsletterForm');
        
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            
            if (!emailInput || !emailInput.value) return;
            
            // Show loading state
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';
            
            // Simulate API call
            setTimeout(() => {
                alert(`Thank you for subscribing with: ${emailInput.value}`);
                emailInput.value = '';
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }, 1000);
        });
    }
    
    // =====================================================
    // ARCHIVE PAGE - SEARCH & FILTER
    // =====================================================
    
    function initArchiveSearch() {
        const searchInput = document.getElementById('archiveSearch');
        const eraFilter = document.getElementById('eraFilter');
        const regionFilter = document.getElementById('regionFilter');
        const tableRows = document.querySelectorAll('.table-row');
        
        if (!searchInput) return;
        
        function filterTable() {
            const searchTerm = searchInput.value.toLowerCase();
            const eraValue = eraFilter.value;
            const regionValue = regionFilter.value;
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                const era = row.dataset.era || '';
                const region = row.dataset.region || '';
                
                const matchesSearch = text.includes(searchTerm);
                const matchesEra = eraValue === 'all' || era === eraValue;
                const matchesRegion = regionValue === 'all' || region === regionValue;
                
                if (matchesSearch && matchesEra && matchesRegion) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
        
        searchInput.addEventListener('input', debounce(filterTable, 300));
        
        if (eraFilter) {
            eraFilter.addEventListener('change', filterTable);
        }
        
        if (regionFilter) {
            regionFilter.addEventListener('change', filterTable);
        }
    }
    
    // =====================================================
    // MAP VIEW BUTTON
    // =====================================================
    
    function initMapView() {
        const mapBtn = document.getElementById('viewMapBtn');
        
        if (!mapBtn) return;
        
        mapBtn.addEventListener('click', function() {
            alert('Interactive map feature coming soon!\n\nThis would display all monuments on an interactive map of India.');
        });
    }
    
    // =====================================================
    // PAGE-SPECIFIC INITIALIZATIONS
    // =====================================================
    
    function initPageSpecific() {
        const currentPage = document.body.className;
        
        if (currentPage.includes('stories-page')) {
            initStoriesFilter();
            initLoadMore();
            initNewsletterForm();
        }
        
        if (currentPage.includes('archive-page')) {
            initArchiveSearch();
            initMapView();
        }
    }
    
    // =====================================================
    // PERFORMANCE OPTIMIZATIONS
    // =====================================================
    
    function initPerformance() {
        // Lazy load images if needed
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        } else {
            // Fallback for browsers that don't support lazy loading
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
            document.body.appendChild(script);
        }
    }
    
    // =====================================================
    // ACCESSIBILITY ENHANCEMENTS
    // =====================================================
    
    function initAccessibility() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--color-primary);
            color: var(--color-bg-dark);
            padding: 8px 16px;
            text-decoration: none;
            z-index: 9999;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '0';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add ARIA labels where needed
        const navToggle = document.getElementById('navToggle');
        if (navToggle && !navToggle.getAttribute('aria-label')) {
            navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        }
    }
    
    // =====================================================
    // INITIALIZATION
    // =====================================================
    
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initApp);
        } else {
            initApp();
        }
    }
    
    function initApp() {
        console.log('Whispers of Forgotten India: Initializing...');
        
        try {
            initNavigation();
            initScrollAnimations();
            initRegionSelector();
            initPageSpecific();
            initPerformance();
            initAccessibility();
            
            console.log('Whispers of Forgotten India: Initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }
    
    // Start the application
    init();
    
})();