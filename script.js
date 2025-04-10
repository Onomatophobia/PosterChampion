document.addEventListener('DOMContentLoaded', () => {
    const posterGrid = document.getElementById('posterGrid');
    const categoryList = document.querySelector('.category-list');
    const searchBar = document.getElementById('searchBar');
    const sidebar = document.getElementById('sidebar'); // Get sidebar element
    const sidebarToggle = document.getElementById('sidebarToggle'); // Get toggle button
    const body = document.body; // Get body element for class toggle

    let allPostersData = [];
    let currentlyDisplayedPosters = 0;
    const postersPerLoad = 15;

    const postersData = [
         { id: 1, imageUrl: 'images/blackwidow1.png', affiliateUrl: 'https://amzn.to/4jlDFJf', category: 'Movies', keywords: ['Avengers', 'Marvel', 'Thanos', 'Captain America'] },
         { id: 2, imageUrl: 'images/poster2.jpg', affiliateUrl: 'https://example.com/affiliate-link-2', category: 'music', keywords: ['rock', 'band', 'concert', 'album art', 'vintage'] },
         { id: 3, imageUrl: 'images/poster3.jpg', affiliateUrl: 'https://example.com/affiliate-link-3', category: 'art', keywords: ['abstract', 'modern art', 'gallery', 'colorful'] },
         { id: 4, imageUrl: 'images/poster4.jpg', affiliateUrl: 'https://example.com/affiliate-link-4', category: 'movies', keywords: ['horror', 'thriller', 'cult classic', 'film'] },
         { id: 5, imageUrl: 'images/poster5.jpg', affiliateUrl: 'https://example.com/affiliate-link-5', category: 'travel', keywords: ['paris', 'eiffel tower', 'europe', 'cityscape', 'vintage travel'] },
         { id: 6, imageUrl: 'images/poster6.jpg', affiliateUrl: 'https://example.com/affiliate-link-6', category: 'music', keywords: ['jazz', 'saxophone', 'live music', 'club'] },
         { id: 7, imageUrl: 'images/poster_placeholder.png', affiliateUrl: '#', category: 'gaming', keywords: ['cyberpunk', 'city', 'neon', 'future'] },
         { id: 8, imageUrl: 'images/poster_placeholder.png', affiliateUrl: '#', category: 'anime', keywords: ['manga', 'japan', 'animation'] }, 
         { id: 9, imageUrl: 'images/poster_placeholder.png', affiliateUrl: '#', category: 'nature', keywords: ['mountains', 'landscape', 'serene'] }, 
         { id: 10, imageUrl: 'images/poster_placeholder.png', affiliateUrl: '#', category: 'abstract', keywords: ['shapes', 'texture', 'non representational'] }, 
         { id: 11, imageUrl: 'images/poster_placeholder.png', affiliateUrl: '#', category: 'minimalist', keywords: ['simple', 'clean', 'design'] }, 
    ];
    allPostersData = postersData;

    function createPosterElement(poster) {
        const link = document.createElement('a');
        link.href = poster.affiliateUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.classList.add('poster-item');
        link.dataset.id = poster.id;
        link.dataset.category = poster.category;
        link.dataset.keywords = poster.keywords.join(' ').toLowerCase();

        const img = document.createElement('img');
        img.src = poster.imageUrl;
        img.alt = `Poster - ${poster.category}`;
        img.loading = 'lazy';

        link.appendChild(img);
        return link;
    }

    function displayPosters(postersToDisplay) {
        postersToDisplay.forEach(poster => {
            const posterElement = createPosterElement(poster);
            posterGrid.appendChild(posterElement);
        });
    }

    // --- Function to Load More Posters --- (No changes needed)
    function loadMorePosters() {
        const nextPosters = allPostersData.slice(currentlyDisplayedPosters, currentlyDisplayedPosters + postersPerLoad);
        if (nextPosters.length > 0) { 
             displayPosters(nextPosters);
             currentlyDisplayedPosters += nextPosters.length;
        }
         console.log(`Loaded posters. Total displayed: ${currentlyDisplayedPosters}`);
    }

    // --- Initial Load ---
    loadMorePosters();

    sidebarToggle.addEventListener('click', () => {
        body.classList.toggle('sidebar-collapsed');

        // Update aria-expanded attribute for accessibility
        const isExpanded = !body.classList.contains('sidebar-collapsed');
        sidebarToggle.setAttribute('aria-expanded', isExpanded);


    });

    categoryList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const selectedCategory = e.target.dataset.category;

            document.querySelectorAll('.category-list li').forEach(li => li.classList.remove('active'));
            e.target.classList.add('active');

            document.querySelectorAll('.poster-item').forEach(item => {
                const itemCategory = item.dataset.category;
                if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
            searchBar.value = '';
        }
    });

    // --- Search Filtering --- (No changes needed in logic)
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        // Use the active category li for filtering, default to 'all' if none somehow active
        const selectedCategory = document.querySelector('.category-list li.active')?.dataset.category || 'all';

        document.querySelectorAll('.poster-item').forEach(item => {
            const itemKeywords = item.dataset.keywords;
            const itemCategory = item.dataset.category;

            const categoryMatch = (selectedCategory === 'all' || itemCategory === selectedCategory);
            const keywordMatch = itemKeywords.includes(searchTerm);

            if (categoryMatch && (keywordMatch || searchTerm === '')) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });

     // --- Endless Scrolling --- (Slight adjustment to condition)
     let isThrottled = false;
     window.addEventListener('scroll', () => {
         if (isThrottled) return;

         isThrottled = true;
         setTimeout(() => { isThrottled = false; }, 200);

         const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

         // Load when near bottom AND if not all posters are already loaded
         if (scrollTop + clientHeight >= scrollHeight - clientHeight * 1.5 && currentlyDisplayedPosters < allPostersData.length) {
             const currentCategory = document.querySelector('.category-list li.active')?.dataset.category || 'all';
             if (searchBar.value === '' && currentCategory === 'all') {
                 console.log("Loading more posters...");
                 loadMorePosters();
             }
         }
     });

     // Ensure initial active category is set (redundant but safe)
     document.querySelector('.category-list li[data-category="all"]').classList.add('active');

});