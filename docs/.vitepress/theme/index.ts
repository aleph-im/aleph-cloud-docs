// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import './custom.css'
import './hero-gradient.css'
import './typography.css'

// Import custom components
import HomeSearch from './components/HomeSearch.vue'
import VersionFooter from './components/VersionFooter.vue'
import ActionButtons from './components/ActionButtons.vue'
import ActionButton from './components/ActionButton.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'layout-bottom': () => h(VersionFooter)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // Register custom components
    app.component('HomeSearch', HomeSearch)
    app.component('VersionFooter', VersionFooter)
    app.component('ActionButtons', ActionButtons)
    app.component('ActionButton', ActionButton)
  }
} satisfies Theme
