// Tab-based navigation
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Function to show specific tab
    function showTab(tabId) {
        // Hide all tab contents
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tab links
        tabLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Show selected tab content
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Add active class to clicked tab link
        const activeLink = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Scroll to top of main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Add click event listeners to tab links
    tabLinks.forEach(link => {
        // Handle both click and touch events for better mobile support
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const tabId = this.getAttribute('data-tab');
            showTab(tabId);
            
            // Update URL hash without scrolling
            history.pushState(null, null, `#${tabId}`);
        });
        
        // Add touch event support for mobile
        link.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const tabId = this.getAttribute('data-tab');
            showTab(tabId);
            
            // Update URL hash without scrolling
            history.pushState(null, null, `#${tabId}`);
        });
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showTab(hash);
        } else {
            showTab('about'); // Default tab
        }
    });
    
    // Initialize based on URL hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash && document.getElementById(initialHash)) {
        showTab(initialHash);
    } else {
        showTab('about'); // Default to about tab
    }

    // Mobile hamburger menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle menu visibility
            navMenu.classList.toggle('mobile-open');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close menu when clicking on a tab link (mobile)
        tabLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('mobile-open');
                    mobileMenuToggle.classList.remove('active');
                }
            });
        });

        // Close menu when clicking outside (mobile)
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && !mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('mobile-open');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }



    // Add loading animation
    document.body.style.opacity = '0';
    window.addEventListener('load', function() {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    });

    // Add hover effects for interactive elements
    const addHoverEffects = () => {
        const hoverElements = document.querySelectorAll('.publication-item, .award-item, .education-item, .position-item, .admin-item');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    };

    addHoverEffects();

    // Add search functionality for publications 
    const addPublicationSearch = () => {
        const publicationsSection = document.getElementById('publications');
        const fullPublicationsSection = document.getElementById('full-publications');
        
        // Add search to main publications section
        if (publicationsSection) {
            addSearchToSection(publicationsSection, '.publication-item');
        }
        
        // Add search to full publications section
        if (fullPublicationsSection) {
            addSearchToSection(fullPublicationsSection, '.pub-item');
        }
    };
    
    function addSearchToSection(section, itemSelector) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'publication-search';
        searchContainer.innerHTML = `
            <input type="text" placeholder="Search publications..." class="search-input">
        `;
        searchContainer.style.cssText = `
            margin-bottom: 2rem;
            text-align: center;
        `;
        
        const searchInput = searchContainer.querySelector('.search-input');
        searchInput.style.cssText = `
            padding: 0.75rem 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 25px;
            width: 100%;
            max-width: 400px;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.3s ease;
        `;
        
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = '#1e3a8a';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.borderColor = '#e2e8f0';
        });
        
        // Insert search at the beginning of the section content
        const sectionContent = section.querySelector('.publication-categories, .full-publications-content');
        if (sectionContent) {
            section.insertBefore(searchContainer, sectionContent);
        }
        
        // Search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const publicationItems = section.querySelectorAll(itemSelector);
            
            publicationItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Initialize publication search
    addPublicationSearch();
});