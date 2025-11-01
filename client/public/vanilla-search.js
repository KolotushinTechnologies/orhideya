// This is a vanilla JavaScript solution for the search input
// It will be loaded as a script tag in the page

document.addEventListener('DOMContentLoaded', function() {
  // Find the search input container
  const searchContainer = document.getElementById('search-container');
  if (!searchContainer) return;
  
  // Create the search input HTML
  searchContainer.innerHTML = `
    <div class="relative">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
      <input 
        id="vanilla-search-input"
        type="text" 
        placeholder="Найти букет..." 
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  `;
  
  // Get the input element
  const searchInput = document.getElementById('vanilla-search-input');
  if (!searchInput) return;
  
  // Add event listener for input changes
  searchInput.addEventListener('input', function(e) {
    // Create a custom event to notify React about the search query change
    const event = new CustomEvent('vanilla-search', { 
      detail: { query: e.target.value } 
    });
    document.dispatchEvent(event);
  });
  
  // Function to update the search input value (called from React)
  window.updateVanillaSearch = function(value) {
    if (searchInput) {
      searchInput.value = value;
    }
  };
});
