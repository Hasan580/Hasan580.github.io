// Downloads page specific functionality

document.addEventListener('DOMContentLoaded', function() {
    initDownloadStatistics();
    initDownloadAnimations();
    initAdvancedFiltering();
    initDownloadTracking();
});

// Initialize download statistics
function initDownloadStatistics() {
    // Simulate download counts (in a real app, this would come from a database)
    const downloadStats = {
        'windows-iso': { count: 1234, size: '4.5 GB', rating: 4.8 },
        'antivirus-pack': { count: 892, size: '156 MB', rating: 4.6 },
        'driver-pack': { count: 567, size: '2.1 GB', rating: 4.7 },
        'diagnostic-tools': { count: 723, size: '45 MB', rating: 4.9 },
        'cleanup-suite': { count: 445, size: '28 MB', rating: 4.5 },
        'hardware-guide': { count: 1156, size: '12 MB', rating: 4.8 },
        'thermal-guide': { count: 334, size: '8 MB', rating: 4.7 }
    };

    // Update download counts with animation
    updateDownloadCounts(downloadStats);
}

// Update download counts with animation
function updateDownloadCounts(stats) {
    const downloadCards = document.querySelectorAll('.download-card');
    
    downloadCards.forEach(card => {
        const downloadBtn = card.querySelector('.download-btn');
        if (downloadBtn) {
            const fileId = downloadBtn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            if (fileId && stats[fileId]) {
                const countElement = card.querySelector('.downloads-count');
                if (countElement) {
                    animateNumber(countElement, stats[fileId].count);
                }
                
                // Add rating stars
                addRatingStars(card, stats[fileId].rating);
            }
        }
    });
}

// Animate numbers counting up
function animateNumber(element, targetNumber) {
    const startNumber = 0;
    const duration = 2000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * easedProgress);
        
        element.textContent = `${currentNumber.toLocaleString()} downloads`;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Add rating stars to download cards
function addRatingStars(card, rating) {
    const metaSection = card.querySelector('.download-meta');
    if (!metaSection || metaSection.querySelector('.rating-stars')) return;
    
    const ratingElement = document.createElement('span');
    ratingElement.className = 'rating-stars';
    ratingElement.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.875rem;
        color: #fbbf24;
    `;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    let starsHTML = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    starsHTML += ` <span style="color: var(--text-secondary); margin-left: 0.25rem;">(${rating})</span>`;
    ratingElement.innerHTML = starsHTML;
    
    metaSection.appendChild(ratingElement);
}

// Initialize download animations
function initDownloadAnimations() {
    const downloadCards = document.querySelectorAll('.download-card');
    
    downloadCards.forEach((card, index) => {
        // Stagger animation
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Advanced filtering with search highlights
function initAdvancedFiltering() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    // Add search suggestions
    const searchSuggestions = [
        'Windows', 'Antivirus', 'Drivers', 'Tools', 'Diagnostic', 
        'Cleanup', 'Hardware', 'Thermal', 'Installation', 'Guide'
    ];
    
    // Create suggestions dropdown
    const suggestionsDropdown = document.createElement('div');
    suggestionsDropdown.className = 'search-suggestions';
    suggestionsDropdown.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid var(--border-color);
        border-top: none;
        border-radius: 0 0 8px 8px;
        box-shadow: var(--shadow-md);
        z-index: 100;
        display: none;
        max-height: 200px;
        overflow-y: auto;
    `;
    
    searchInput.parentElement.style.position = 'relative';
    searchInput.parentElement.appendChild(suggestionsDropdown);
    
    // Handle search input
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length > 0) {
            const matchingSuggestions = searchSuggestions.filter(suggestion => 
                suggestion.toLowerCase().includes(query)
            );
            
            if (matchingSuggestions.length > 0) {
                showSuggestions(matchingSuggestions, query);
            } else {
                hideSuggestions();
            }
            
            highlightSearchResults(query);
        } else {
            hideSuggestions();
            removeHighlights();
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.parentElement.contains(e.target)) {
            hideSuggestions();
        }
    });
    
    function showSuggestions(suggestions, query) {
        suggestionsDropdown.innerHTML = suggestions.map(suggestion => 
            `<div class="suggestion-item" style="padding: 0.75rem; cursor: pointer; border-bottom: 1px solid var(--border-color);">
                ${highlightText(suggestion, query)}
            </div>`
        ).join('');
        
        suggestionsDropdown.style.display = 'block';
        
        // Add click handlers
        suggestionsDropdown.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function() {
                searchInput.value = this.textContent;
                searchInput.dispatchEvent(new Event('input'));
                hideSuggestions();
            });
        });
    }
    
    function hideSuggestions() {
        suggestionsDropdown.style.display = 'none';
    }
    
    function highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong style="color: var(--primary-color);">$1</strong>');
    }
}

// Highlight search results in cards
function highlightSearchResults(query) {
    const downloadCards = document.querySelectorAll('.download-card');
    
    downloadCards.forEach(card => {
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        
        if (title && description) {
            // Remove existing highlights
            title.innerHTML = title.textContent;
            description.innerHTML = description.textContent;
            
            // Add new highlights
            if (query) {
                const regex = new RegExp(`(${query})`, 'gi');
                title.innerHTML = title.textContent.replace(regex, '<mark style="background: rgba(0, 102, 255, 0.2); padding: 0.1em;">$1</mark>');
                description.innerHTML = description.textContent.replace(regex, '<mark style="background: rgba(0, 102, 255, 0.2); padding: 0.1em;">$1</mark>');
            }
        }
    });
}

// Remove search highlights
function removeHighlights() {
    const downloadCards = document.querySelectorAll('.download-card');
    
    downloadCards.forEach(card => {
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        
        if (title) title.innerHTML = title.textContent;
        if (description) description.innerHTML = description.textContent;
    });
}

// Initialize download tracking
function initDownloadTracking() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.download-card');
            const title = card.querySelector('h3').textContent;
            const category = card.dataset.category;
            
            // Track download attempt
            trackDownloadEvent(title, category);
            
            // Add visual feedback
            addDownloadFeedback(this);
        });
    });
}

// Track download events
function trackDownloadEvent(filename, category) {
    // In a real application, this would send data to analytics
    console.log('Download tracked:', {
        filename: filename,
        category: category,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    });
    
    // Update local download count
    updateLocalDownloadCount(filename);
}

// Update local download count
function updateLocalDownloadCount(filename) {
    const key = `download_count_${filename.replace(/\s+/g, '_').toLowerCase()}`;
    const currentCount = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, (currentCount + 1).toString());
}

// Add visual feedback for download button
function addDownloadFeedback(button) {
    const originalHTML = button.innerHTML;
    
    // Change button state
    button.innerHTML = '<i class="fas fa-check"></i> Preparing...';
    button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    button.style.pointerEvents = 'none';
    
    // Reset after delay
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
        button.style.pointerEvents = 'auto';
    }, 2000);
}

// Initialize sort functionality
function initSortFunctionality() {
    const sortOptions = document.createElement('select');
    sortOptions.className = 'sort-select';
    sortOptions.style.cssText = `
        padding: 0.75rem;
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius);
        background: white;
        font-weight: 500;
        cursor: pointer;
    `;
    
    sortOptions.innerHTML = `
        <option value="default">Sort by Default</option>
        <option value="name">Sort by Name</option>
        <option value="downloads">Sort by Downloads</option>
        <option value="size">Sort by Size</option>
        <option value="category">Sort by Category</option>
    `;
    
    const controls = document.querySelector('.downloads-controls');
    if (controls) {
        controls.appendChild(sortOptions);
        
        sortOptions.addEventListener('change', function() {
            sortDownloads(this.value);
        });
    }
}

// Sort downloads
function sortDownloads(sortBy) {
    const grid = document.getElementById('downloadsGrid');
    const cards = Array.from(grid.querySelectorAll('.download-card'));
    
    cards.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
            case 'downloads':
                const aDownloads = parseInt(a.querySelector('.downloads-count').textContent.replace(/\D/g, ''));
                const bDownloads = parseInt(b.querySelector('.downloads-count').textContent.replace(/\D/g, ''));
                return bDownloads - aDownloads;
            case 'size':
                const aSize = parseFloat(a.querySelector('.file-size').textContent);
                const bSize = parseFloat(b.querySelector('.file-size').textContent);
                return bSize - aSize;
            case 'category':
                return a.dataset.category.localeCompare(b.dataset.category);
            default:
                return 0;
        }
    });
    
    // Re-append sorted cards
    cards.forEach(card => grid.appendChild(card));
    
    // Add animation
    cards.forEach((card, index) => {
        card.style.animation = `slideInUp 0.3s ease ${index * 0.05}s both`;
    });
}

// Add slideInUp animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    initSortFunctionality();
});

// Add download progress simulation
function simulateDownloadProgress(button, filename) {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: var(--primary-color);
        width: 0%;
        transition: width 0.3s ease;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(progressBar);
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                progressBar.remove();
                window.FirasTech.showNotification(`${filename} download completed!`, 'success');
            }, 500);
        }
        progressBar.style.width = `${progress}%`;
    }, 200);
}

// Export functions
window.DownloadsPage = {
    simulateDownloadProgress,
    trackDownloadEvent,
    sortDownloads,
    highlightSearchResults
};
