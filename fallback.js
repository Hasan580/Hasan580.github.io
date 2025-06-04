// Fallback script for GitHub Pages deployment
// This ensures the website works even when external CDN resources fail to load

(function() {
    'use strict';
    
    // Force black background immediately
    document.documentElement.style.backgroundColor = '#000000';
    document.body.style.backgroundColor = '#000000';
    
    // Wait for DOM to be ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    
    ready(function() {
        // Force background colors
        const backgroundElements = document.querySelectorAll('#vanta-about, #vanta-youtube, .vanta-background');
        backgroundElements.forEach(el => {
            if (el) {
                el.style.backgroundColor = '#000000';
                el.style.background = '#000000';
            }
        });
        
        // Hide loading screen after 2 seconds if it's still visible
        setTimeout(function() {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
                loadingScreen.classList.add('hidden');
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                }, 1000);
            }
        }, 2000);
          // Ensure navigation works
        setTimeout(function() {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (!link.hasAttribute('data-fallback-listener')) {
                    link.setAttribute('data-fallback-listener', 'true');
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const pageId = this.getAttribute('data-page');
                        
                        // Hide all pages
                        document.querySelectorAll('.page').forEach(page => {
                            page.classList.remove('active');
                            page.style.display = 'none';
                        });
                        
                        // Show target page
                        const targetPage = document.getElementById(pageId);
                        if (targetPage) {
                            targetPage.classList.add('active');
                            targetPage.style.display = 'block';
                        }
                        
                        // Update nav
                        document.querySelectorAll('.nav-link').forEach(navLink => {
                            navLink.classList.remove('active');
                        });
                        this.classList.add('active');
                        
                        // Close mobile menu if open
                        const navMenu = document.querySelector('.nav-menu');
                        const navToggle = document.querySelector('.nav-toggle');
                        if (navMenu && navToggle && navMenu.classList.contains('active')) {
                            navMenu.classList.remove('active');
                            navToggle.classList.remove('active');
                            document.body.style.overflow = '';
                        }
                    });
                }
            });
            
            // Mobile hamburger menu fallback
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            if (navToggle && navMenu && !navToggle.hasAttribute('data-fallback-listener')) {
                navToggle.setAttribute('data-fallback-listener', 'true');
                
                function toggleMobileMenu() {
                    const isActive = navMenu.classList.contains('active');
                    if (isActive) {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                        document.body.style.overflow = '';
                    } else {
                        navMenu.classList.add('active');
                        navToggle.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                }
                
                navToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMobileMenu();
                });
                
                navToggle.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMobileMenu();
                }, { passive: false });
                
                // Close menu when clicking outside
                document.addEventListener('click', function(e) {
                    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }
        }, 100);
        
        // Ensure chat button works
        setTimeout(function() {
            const chatButton = document.getElementById('chatButton');
            const chatModal = document.getElementById('chatModal');
            const chatClose = document.getElementById('chatClose');
            
            if (chatButton && chatModal && !chatButton.hasAttribute('data-fallback-listener')) {
                chatButton.setAttribute('data-fallback-listener', 'true');
                chatButton.addEventListener('click', function() {
                    chatModal.classList.add('active');
                    chatModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                });
            }
            
            if (chatClose && chatModal && !chatClose.hasAttribute('data-fallback-listener')) {
                chatClose.setAttribute('data-fallback-listener', 'true');
                chatClose.addEventListener('click', function() {
                    chatModal.classList.remove('active');
                    chatModal.style.display = 'none';
                    document.body.style.overflow = '';
                });
                
                chatModal.addEventListener('click', function(e) {
                    if (e.target === chatModal) {
                        chatModal.classList.remove('active');
                        chatModal.style.display = 'none';
                        document.body.style.overflow = '';
                    }
                });
            }
        }, 200);
    });
    
    // Periodic check to ensure backgrounds stay black
    setInterval(function() {
        const body = document.body;
        const html = document.documentElement;
        
        if (body.style.backgroundColor !== 'rgb(0, 0, 0)') {
            body.style.backgroundColor = '#000000';
        }
        if (html.style.backgroundColor !== 'rgb(0, 0, 0)') {
            html.style.backgroundColor = '#000000';
        }
        
        // Check vanta backgrounds
        const vantaElements = document.querySelectorAll('#vanta-about, #vanta-youtube');
        vantaElements.forEach(el => {
            if (el && el.style.backgroundColor !== 'rgb(0, 0, 0)') {
                el.style.backgroundColor = '#000000';
            }
        });
    }, 1000);
    
})();
