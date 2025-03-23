// Additional JavaScript for interactive elements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize accordions
    initAccordions();
    
    // Initialize tabs
    initTabs();
    
    // Initialize dark mode toggle
    initDarkMode();
    
    // Initialize code copy buttons
    initCodeCopy();
    
    // Initialize math equations rendering if MathJax is available
    if (typeof MathJax !== 'undefined') {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }
});

// Accordion functionality
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            accordionItem.classList.toggle('active');
        });
    });
}

// Tabs functionality
function initTabs() {
    const tabNavItems = document.querySelectorAll('.tab-nav-item');
    
    tabNavItems.forEach(tab => {
        tab.addEventListener('click', function() {
            // Get the tab group
            const tabGroup = this.closest('.tabs');
            
            // Remove active class from all tabs in this group
            tabGroup.querySelectorAll('.tab-nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get the tab content id
            const tabContentId = this.getAttribute('data-tab');
            
            // Hide all tab contents in this group
            tabGroup.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the selected tab content
            document.getElementById(tabContentId).classList.add('active');
        });
    });
    
    // Activate the first tab in each tab group by default
    document.querySelectorAll('.tabs').forEach(tabGroup => {
        const firstTab = tabGroup.querySelector('.tab-nav-item');
        if (firstTab) {
            firstTab.click();
        }
    });
}

// Dark mode toggle
function initDarkMode() {
    // Create dark mode toggle button
    const darkModeToggle = document.createElement('button');
    darkModeToggle.id = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.title = 'Toggle Dark Mode';
    darkModeToggle.style.position = 'fixed';
    darkModeToggle.style.bottom = '20px';
    darkModeToggle.style.right = '20px';
    darkModeToggle.style.zIndex = '999';
    darkModeToggle.style.background = '#4472c4';
    darkModeToggle.style.color = 'white';
    darkModeToggle.style.border = 'none';
    darkModeToggle.style.borderRadius = '50%';
    darkModeToggle.style.width = '50px';
    darkModeToggle.style.height = '50px';
    darkModeToggle.style.fontSize = '1.5rem';
    darkModeToggle.style.cursor = 'pointer';
    darkModeToggle.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    
    document.body.appendChild(darkModeToggle);
    
    // Check for saved user preference
    const darkMode = localStorage.getItem('darkMode');
    
    // Set initial state
    if (darkMode === 'enabled') {
        enableDarkMode();
    }
    
    // Toggle dark mode on button click
    darkModeToggle.addEventListener('click', () => {
        const darkMode = localStorage.getItem('darkMode');
        
        if (darkMode !== 'enabled') {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });
    
    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
        darkModeToggle.innerHTML = '☀️';
    }
    
    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', null);
        darkModeToggle.innerHTML = '🌙';
    }
}

// Add copy buttons to code blocks
function initCodeCopy() {
    document.querySelectorAll('pre').forEach(pre => {
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.textContent = 'Copy';
        copyButton.style.position = 'absolute';
        copyButton.style.top = '0.5rem';
        copyButton.style.right = '0.5rem';
        copyButton.style.background = '#4472c4';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '4px';
        copyButton.style.padding = '0.2rem 0.5rem';
        copyButton.style.fontSize = '0.8rem';
        copyButton.style.cursor = 'pointer';
        
        // Add click event
        copyButton.addEventListener('click', () => {
            const code = pre.querySelector('code').innerText;
            
            // Copy to clipboard
            navigator.clipboard.writeText(code).then(() => {
                // Success feedback
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                copyButton.textContent = 'Failed';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            });
        });
        
        // Add button to pre element
        pre.appendChild(copyButton);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Add skip to content link for accessibility
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.className = 'skip-to-content';
skipLink.textContent = 'Skip to content';
document.body.insertBefore(skipLink, document.body.firstChild);

// Add id to main content
document.querySelector('main').id = 'main-content';

// Add aria labels to navigation
document.querySelector('nav').setAttribute('aria-label', 'Main Navigation');
document.querySelector('.breadcrumb').setAttribute('aria-label', 'Breadcrumb');

// Add lazy loading to images
document.querySelectorAll('img').forEach(img => {
    img.setAttribute('loading', 'lazy');
});
