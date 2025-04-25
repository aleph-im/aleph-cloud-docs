<template>
  <div class="home-search-container">
    <div class="home-search-wrapper">
      <div class="home-search-bg"></div>
      <div class="home-search">
        <h2>Find what you're looking for</h2>
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search documentation..." 
            @focus="navigateToSearch"
            ref="searchInput"
          />
          <button @click="navigateToSearch">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        <p>Looking for API docs, guides, or examples? Start your search here.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const searchInput = ref(null)

function navigateToSearch() {
  // This triggers the VitePress search modal
  document.querySelector('.VPNavBarSearch .DocSearch-Button')?.click()
}

onMounted(() => {
  // Add keyboard shortcut to focus the search input
  document.addEventListener('keydown', (e) => {
    // Focus search input when pressing / key
    if (e.key === '/' && document.activeElement !== searchInput.value) {
      e.preventDefault()
      searchInput.value?.focus()
    }
  })
})
</script>

<style scoped>
.home-search-container {
  position: relative;
  width: 100%;
  padding: 2rem 0;
  margin: 5rem auto;
  max-width: 100%;
}

.home-search-wrapper {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
}

.home-search-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #7B3FE4 0%, #08080f 100%);
  opacity: 0.9;
  z-index: 0;
}

.home-search {
  position: relative;
  z-index: 1;
  padding: 3rem 2rem;
  text-align: center;
}

.home-search h2 {
  color: white;
  margin-bottom: 1.5rem;
  margin-top: 1rem;
  font-family: 'Rigid Square', 'Inter', sans-serif;
  font-size: 2rem;
  padding-top: 0;
  border-top: 0px;
}

.home-search p {
  color: rgba(255, 255, 255, 0.8);
  margin-top: 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.search-box {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  box-shadow: 0 0 0 3px rgba(212, 255, 0, 0.3);
  border-color: #D4FF00;
}

.search-box input {
  flex: 1;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 1rem;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-box button {
  background: #D4FF00;
  border: none;
  padding: 0 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #08080f;
  transition: background-color 0.3s ease;
}

.search-box button:hover {
  background: #c2eb00;
}

/* Dark mode adjustments */
.dark .home-search-bg {
  background: linear-gradient(135deg, #7B3FE4 0%, #0f0f1c 100%);
}

@media (max-width: 768px) {
  .home-search {
    padding: 2rem 1rem;
  }
  
  .home-search h2 {
    font-size: 1.5rem;
  }
}
</style>
