<template>
  <div class="version-footer">
    <div class="version-container">
      <span class="version-text">Version {{ versionInfo.version }}</span>
      <span v-if="versionInfo.isLocal && isDevEnvironment" class="version-text">
        <a :href="versionInfo.localUrl" target="_blank" class="version-link">{{ versionInfo.localUrl }}</a>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Function to format the build time in a readable format
function formatBuildTime(isoString) {
  if (!isoString) return ''
  try {
    const date = new Date(isoString)
    return date.toLocaleString()
  } catch (e) {
    return isoString
  }
}

const versionInfo = ref({
  version: 'loading...',
  isLocal: false,
  localUrl: ''
})

// Initialize with false, will be updated in onMounted if in browser
const isDevEnvironment = ref(false)

onMounted(async () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Set development environment check
    isDevEnvironment.value = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1'
    
    try {
      // Load from public directory
      const response = await fetch('/version.json')
      if (response.ok) {
        const data = await response.json()
        // For production builds, always set isLocal to false regardless of what the file says
        if (!isDevEnvironment.value) {
          data.isLocal = false
        }
        versionInfo.value = data
      } else {
        console.error('Failed to load version information')
      }
    } catch (error) {
      console.error('Error loading version information:', error)
      // Fallback version in case the file can't be loaded
      versionInfo.value = {
        version: new Date().toISOString().split('T')[0].replace(/-/g, '') + '-local',
        isLocal: isDevEnvironment.value,
        localUrl: window.location.origin
      }
    }
  }
})
</script>

<style>
.version-footer {
  padding: 0.5rem 1.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
  background-color: var(--vp-c-bg-soft);
}

.version-container {
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
  padding: 0.5rem 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.version-text {
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
}

.version-text + .version-text:before {
  content: '•';
  margin: 0 0.5rem;
  color: var(--vp-c-text-3);
}

.version-link {
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color 0.2s ease;
}

.version-link:hover {
  text-decoration: underline;
}
</style>
