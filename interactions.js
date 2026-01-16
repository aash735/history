/* =====================================================
   INTERACTIONS & ENHANCEMENTS
   Advanced interactions and visual effects
   ===================================================== */

(function() {
    'use strict';
    
    // =====================================================
    // PARALLAX EFFECTS
    // =====================================================
    
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.hero-background, .monument-hero-bg');
        
        if (parallaxElements.length === 0 || window.innerWidth < 768) return;
        
        function handleParallax() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }
        
        window.addEventListener('scroll', () => {
            requestAnimationFrame(handleParallax);
        });
    }
    
    // =====================================================
    // CARD HOVER EFFECTS
    // =====================================================
    
    function initCardEffects() {
        const cards = document.querySelectorAll('.featured-card, .story-card, .related-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function(e) {
                // Add subtle tilt effect
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                const rotateX = deltaY * 5;
                const rotateY = -deltaX * 5;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
            
            // Track mouse movement for more dynamic effect
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                const rotateX = deltaY * 3;
                const rotateY = -deltaX * 3;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
        });
    }
    
    // =====================================================
    // SMOOTH PAGE TRANSITIONS
    // =====================================================
    
    function initPageTransitions() {
        // Add fade-in effect on page load
        document.body.style.opacity = '0';
        
        window.addEventListener('load', () => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        });
        
        // Add fade-out effect on page navigation
        const internalLinks = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"])');
        
        internalLinks.forEach(link => {
            // Skip if it's an external link or has specific classes to ignore
            if (link.hostname !== window.location.hostname || link.classList.contains('no-transition')) {
                return;
            }
            
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if it's a hash link or external
                if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                    return;
                }
                
                e.preventDefault();
                
                document.body.style.opacity = '0';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        });
    }
    
    // =====================================================
    // READING PROGRESS INDICATOR
    // =====================================================
    
    function initReadingProgress() {
        // Only show on article/monument pages
        if (!document.querySelector('.monument-story')) return;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        function updateProgress() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.pageYOffset;
            const progress = (scrolled / documentHeight) * 100;
            
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
        
        window.addEventListener('scroll', updateProgress);
        updateProgress();
    }
    
    // =====================================================
    // SCROLL-TO-TOP BUTTON
    // =====================================================
    
    function initScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '↑';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 48px;
            height: 48px;
            background: var(--color-primary);
            color: var(--color-bg-dark);
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(scrollBtn);
        
        function toggleScrollBtn() {
            if (window.pageYOffset > 500) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        }
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        scrollBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) translateY(-4px)';
        });
        
        scrollBtn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        window.addEventListener('scroll', toggleScrollBtn);
        toggleScrollBtn();
    }
    
    // =====================================================
    // IMAGE LIGHTBOX
    // =====================================================
    
    function initImageLightbox() {
        const images = document.querySelectorAll('.story-visual img, .visual-placeholder');
        
        if (images.length === 0) return;
        
        images.forEach(img => {
            img.style.cursor = 'pointer';
            
            img.addEventListener('click', function() {
                // Create lightbox overlay
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.style.cssText = `
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.95);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    cursor: zoom-out;
                    animation: fadeIn 0.3s ease;
                `;
                
                const imgClone = this.cloneNode(true);
                imgClone.style.cssText = `
                    max-width: 90%;
                    max-height: 90%;
                    object-fit: contain;
                    animation: zoomIn 0.3s ease;
                `;
                
                lightbox.appendChild(imgClone);
                document.body.appendChild(lightbox);
                
                // Prevent body scroll
                document.body.style.overflow = 'hidden';
                
                // Close on click
                lightbox.addEventListener('click', function() {
                    this.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        document.body.removeChild(this);
                        document.body.style.overflow = '';
                    }, 300);
                });
                
                // Close on escape key
                const handleEscape = (e) => {
                    if (e.key === 'Escape') {
                        lightbox.click();
                        document.removeEventListener('keydown', handleEscape);
                    }
                };
                
                document.addEventListener('keydown', handleEscape);
            });
        });
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes zoomIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // =====================================================
    // TOOLTIP ENHANCEMENTS
    // =====================================================
    
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.style.position = 'relative';
            element.style.cursor = 'help';
            
            element.addEventListener('mouseenter', function() {
                const tooltipText = this.getAttribute('data-tooltip');
                
                const tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.textContent = tooltipText;
                tooltip.style.cssText = `
                    position: absolute;
                    bottom: calc(100% + 10px);
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--color-bg-medium);
                    color: var(--color-text-primary);
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    font-size: 0.875rem;
                    white-space: nowrap;
                    z-index: 1000;
                    border: 1px solid var(--color-border);
                    box-shadow: var(--shadow-md);
                    pointer-events: none;
                    animation: tooltipFadeIn 0.2s ease;
                `;
                
                this.appendChild(tooltip);
            });
            
            element.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.custom-tooltip');
                if (tooltip) {
                    tooltip.style.animation = 'tooltipFadeOut 0.2s ease';
                    setTimeout(() => {
                        if (tooltip.parentNode === this) {
                            this.removeChild(tooltip);
                        }
                    }, 200);
                }
            });
        });
        
        // Add tooltip animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes tooltipFadeIn {
                from { opacity: 0; transform: translateX(-50%) translateY(5px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            @keyframes tooltipFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // =====================================================
    // SEARCH HIGHLIGHT
    // =====================================================
    
    function initSearchHighlight() {
        const searchInput = document.getElementById('archiveSearch');
        
        if (!searchInput) return;
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.table-row');
            
            rows.forEach(row => {
                // Remove existing highlights
                row.innerHTML = row.innerHTML.replace(/<mark class="highlight">(.*?)<\/mark>/g, '$1');
                
                if (searchTerm.length > 2) {
                    const monumentName = row.querySelector('.monument-name');
                    if (monumentName) {
                        const text = monumentName.textContent;
                        const regex = new RegExp(`(${searchTerm})`, 'gi');
                        monumentName.innerHTML = text.replace(regex, '<mark class="highlight">$1</mark>');
                    }
                }
            });
        });
        
        // Add highlight styles
        const style = document.createElement('style');
        style.textContent = `
            .highlight {
                background: var(--color-primary);
                color: var(--color-bg-dark);
                padding: 2px 4px;
                border-radius: 2px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // =====================================================
    // FORM VALIDATION ENHANCEMENTS
    // =====================================================
    
    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    if (!this.value.trim()) {
                        this.style.borderColor = 'var(--color-accent)';
                    } else {
                        this.style.borderColor = '';
                    }
                });
                
                input.addEventListener('input', function() {
                    this.style.borderColor = '';
                });
            });
        });
    }
    
    // =====================================================
    // INITIALIZATION
    // =====================================================
    
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initEnhancements);
        } else {
            initEnhancements();
        }
    }
    
    function initEnhancements() {
        console.log('Initializing enhanced interactions...');
        
        try {
            initParallax();
            initCardEffects();
            initPageTransitions();
            initReadingProgress();
            initScrollToTop();
            initImageLightbox();
            initTooltips();
            initSearchHighlight();
            initFormValidation();
            
            console.log('Enhanced interactions initialized');
        } catch (error) {
            console.error('Enhancement initialization error:', error);
        }
    }
    
    // Start enhancements
    init();
    
})();