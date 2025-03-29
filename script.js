document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Hide on Scroll ---
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar.offsetHeight;

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > navbarHeight * 2) {
            // Scrolling Down
            navbar.classList.add('nav-hidden');
        } else if (scrollTop < lastScrollTop || scrollTop <= navbarHeight) {
            // Scrolling Up or near top
            navbar.classList.remove('nav-hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    }, { passive: true });


    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    applyTheme(currentTheme); // Apply initial theme


    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null, // Viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Special handling for skill bars
                if (entry.target.classList.contains('skills-container')) {
                     const skillBars = entry.target.querySelectorAll('.skill-bar span');
                     skillBars.forEach(bar => {
                         bar.style.width = bar.parentElement.dataset.level || bar.style.width; // Use data-level or original style width
                     });
                }
                // Special handling for hero elements - immediate visibility is ok
                 if (!entry.target.classList.contains('hero-content') && !entry.target.classList.contains('scroll-down-hint')) {
                    observer.unobserve(entry.target); // Stop observing once visible (except maybe hero)
                 }
            }
             // Optional: remove 'is-visible' when element scrolls out of view
            // else {
            //     entry.target.classList.remove('is-visible');
            // }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    // Observe skill container separately for bar animation timing
    const skillContainer = document.querySelector('.skills-container');

    elementsToAnimate.forEach(el => observer.observe(el));
    if(skillContainer) {
        observer.observe(skillContainer);
        // Set skill levels (Ideally from data or better place, here for example)
        const skillBars = skillContainer.querySelectorAll('.skill-bar span');
         // Assuming the order in HTML matches this array
        const levels = ['95%', '90%', '80%', '75%', '85%', '98%'];
        skillBars.forEach((bar, index) => {
            if (levels[index]) {
                // Set the target width using the dataset attribute if needed by CSS later
                 bar.parentElement.dataset.level = levels[index];
                 // OR set style directly (needed for JS animation logic above)
                 bar.style.setProperty('--skill-level', levels[index]); // If using CSS var
            }
        });

    }


     // --- Mobile Menu Logic ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = mobileNav.querySelectorAll('a');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : ''; // Prevent scroll when menu open
        });

         // Close menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                 menuToggle.classList.remove('active');
                 mobileNav.classList.remove('active');
                 document.body.style.overflow = '';
            });
        });
    }


     // --- Form Label Interaction (Enhancement) ---
     // This might already be handled by placeholder-shown CSS, but ensures JS fallback/control
     const formGroups = document.querySelectorAll('.form-group');
     formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        if (input && label) {
            input.addEventListener('focus', () => group.classList.add('is-focused'));
            input.addEventListener('blur', () => {
                if (!input.value) {
                     group.classList.remove('is-focused');
                }
            });
            // Initial check in case of pre-filled values
            if (input.value) {
                 group.classList.add('is-focused');
            }
        }
     });


}); // End DOMContentLoaded
