/* =====================================================
   WHISPERS OF FORGOTTEN INDIA - CINEMATIC BACKGROUND
   Injects a looped video background with thematic overlays
   ===================================================== */

(function() {
    'use strict';

    function initVideoBackground() {
        // 1. Create the container
        const container = document.createElement('div');
        container.className = 'video-bg-container';
        
        // 2. Create the video element
        const video = document.createElement('video');
        video.className = 'video-bg-element';
        video.src = 'assets/video/background-loop.mp4'; // Ensure this path is correct
        video.autoplay = true;
        video.muted = true;      // Required for autoplay
        video.loop = true;
        video.playsInline = true; // For mobile support
        video.setAttribute('aria-hidden', 'true'); // Hide from screen readers
        
        // 3. Create the overlay (darkens the video for text readability)
        const overlay = document.createElement('div');
        overlay.className = 'video-bg-overlay';

        // 4. Assemble and inject
        container.appendChild(video);
        container.appendChild(overlay);
        
        // Insert as the very first item in the body
        document.body.prepend(container);

        // 5. Apply Styles via JS (keeps it contained in one file)
        const style = document.createElement('style');
        style.textContent = `
            .video-bg-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -10; /* Far behind everything */
                overflow: hidden;
                background-color: #0d0d0d; /* Fallback color */
            }

            .video-bg-element {
                position: absolute;
                top: 50%;
                left: 50%;
                min-width: 100%;
                min-height: 100%;
                width: auto;
                height: auto;
                transform: translate(-50%, -50%);
                object-fit: cover;
                
                /* THEMATIC FILTERS: 
                   This turns the bright paper video into a dark, 
                   mysterious gold/sepia texture */
                filter: sepia(100%) brightness(40%) contrast(120%) saturate(120%);
                opacity: 0; /* Start hidden for fade-in */
                transition: opacity 1.5s ease;
            }

            .video-bg-element.loaded {
                opacity: 0.6; /* Adjust visibility here (0.1 to 1.0) */
            }

            .video-bg-overlay {
                position: absolute;
                inset: 0;
                /* Radial gradient: clearer in center, darker at edges */
                background: radial-gradient(
                    circle at center, 
                    rgba(13, 13, 13, 0.7) 0%, 
                    rgba(13, 13, 13, 0.95) 100%
                );
                /* Mesh pattern to add texture over the video */
                background-image: 
                    radial-gradient(circle at center, 
                        rgba(13, 13, 13, 0.7) 0%, 
                        rgba(13, 13, 13, 0.95) 100%),
                    url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E");
            }
        `;
        document.head.appendChild(style);

        // Handle video load fade-in
        video.addEventListener('canplay', () => {
            video.classList.add('loaded');
        });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoBackground);
    } else {
        initVideoBackground();
    }

})();