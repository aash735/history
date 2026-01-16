/* =====================================================
   WHISPERS OF FORGOTTEN INDIA - FINAL VIDEO SCRIPT
   Handles the Quill video (Home) and Book video (Stories)
   ===================================================== */

(function() {
    'use strict';

    function initVideoBackground() {
        console.log("Initializing Video Background...");

        // 1. Create container with FIXED positioning (Solving the footer issue)
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.zIndex = '-9999'; // Force it behind everything
        container.style.overflow = 'hidden';
        container.style.backgroundColor = '#0d0d0d'; // Fallback color

        // 2. Create the video element
        const video = document.createElement('video');
        
        // Logic to pick the correct video
        const customSource = document.body.getAttribute('data-video-src');
        if (customSource) {
            video.src = customSource; // Plays 'stories-loop.mp4' on Stories page
        } else {
            video.src = 'assets/video/background-loop.mp4'; // Plays 'background-loop.mp4' on Home
        }

        // Force styling to ensure it covers the screen
        video.style.position = 'absolute';
        video.style.top = '50%';
        video.style.left = '50%';
        video.style.minWidth = '100%';
        video.style.minHeight = '100%';
        video.style.width = 'auto';
        video.style.height = 'auto';
        video.style.transform = 'translate(-50%, -50%)';
        video.style.objectFit = 'cover';
        
        // Filter: Darkens the video so text is readable
        video.style.filter = 'sepia(100%) brightness(40%) contrast(120%)';
        video.style.opacity = '0.6';

        // Browser requirements for autoplay
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;

        // 3. Create Audio Button (Bottom Right)
        const audioBtn = document.createElement('button');
        audioBtn.innerHTML = '🔇 Unmute Sound';
        
        // Button Styling
        Object.assign(audioBtn.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: '10000',
            background: 'rgba(13, 13, 13, 0.6)',
            border: '1px solid #c9a961',
            color: '#c9a961',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'serif',
            textTransform: 'uppercase',
            fontSize: '12px',
            letterSpacing: '1px'
        });

        // Audio Toggle Logic
        audioBtn.addEventListener('click', function() {
            if (video.muted) {
                video.muted = false;
                audioBtn.innerHTML = '🔊 Mute Sound';
                audioBtn.style.background = '#c9a961';
                audioBtn.style.color = '#000';
            } else {
                video.muted = true;
                audioBtn.innerHTML = '🔇 Unmute Sound';
                audioBtn.style.background = 'rgba(13, 13, 13, 0.6)';
                audioBtn.style.color = '#c9a961';
            }
        });

        // 4. Assemble and Insert
        container.appendChild(video);
        document.body.prepend(container);
        document.body.appendChild(audioBtn);
        
        // Play
        video.play().catch(e => console.log("Autoplay blocked:", e));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoBackground);
    } else {
        initVideoBackground();
    }
})();