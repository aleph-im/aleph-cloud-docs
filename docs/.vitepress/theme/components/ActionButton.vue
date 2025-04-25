<template>
  <a
    class="action-button"
    :class="[`theme-${theme}`]"
    :href="link"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    :style="style"
  >
    {{ text }}
  </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  theme: {
    type: String,
    default: 'brand',
    validator: (value) => ['brand', 'alt', 'sponsor'].includes(value)
  },
  text: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  style: {
    type: [String, Object],
    default: ''
  }
})

const isExternal = computed(() => {
  return /^https?:\/\//.test(props.link)
})
</script>

<style>
.action-button {
  display: inline-flex;
  align-items: center;
  border: 1px solid transparent;
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
  transition: color 0.25s, border-color 0.25s, background-color 0.25s;
  border-radius: 20px;
  padding: 0 20px;
  line-height: 38px;
  font-size: 14px;
  text-decoration: none !important;
  margin-right: 1rem;
}

.action-button.theme-brand {
  border-color: var(--vp-button-brand-border);
  color: var(--vp-button-brand-text);
  background-color: var(--vp-button-brand-bg);
}

.action-button.theme-brand:hover {
  border-color: var(--vp-button-brand-hover-border);
  color: var(--vp-button-brand-hover-text);
  background-color: var(--vp-button-brand-hover-bg);
  text-decoration: none !important;
}

.action-button.theme-alt {
  border-color: var(--vp-button-alt-border);
  color: var(--vp-button-alt-text);
  background-color: var(--vp-button-alt-bg);
}

.action-button.theme-alt:hover {
  border-color: var(--vp-button-alt-hover-border);
  color: var(--vp-button-alt-hover-text);
  background-color: var(--vp-button-alt-hover-bg);
  text-decoration: none !important;
}

.action-button.theme-sponsor {
  border-color: var(--vp-button-sponsor-border);
  color: var(--vp-button-sponsor-text);
  background-color: var(--vp-button-sponsor-bg);
}

.action-button.theme-sponsor:hover {
  border-color: var(--vp-button-sponsor-hover-border);
  color: var(--vp-button-sponsor-hover-text);
  background-color: var(--vp-button-sponsor-hover-bg);
  text-decoration: none !important;
}

/* External icon removed */
</style>
