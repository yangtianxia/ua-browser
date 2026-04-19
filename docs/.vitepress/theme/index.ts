import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Playground from './components/Playground.vue'
import SidebarOutline from './components/SidebarOutline.vue'
import './style.css'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'sidebar-nav-after': () => h(SidebarOutline),
    })
  },
  enhanceApp({ app }) {
    app.component('Playground', Playground)
  },
} satisfies Theme
