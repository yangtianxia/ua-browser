<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useData, useRoute } from 'vitepress'

const { page } = useData()
const route = useRoute()
const activeSlug = ref('')

let observer: IntersectionObserver | null = null

function setup() {
  observer?.disconnect()
  activeSlug.value = ''

  nextTick(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('.vp-doc h2[id], .vp-doc h3[id]')
    )
    if (!headings.length) return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSlug.value = (entry.target as HTMLElement).id
            break
          }
        }
      },
      { rootMargin: '-64px 0px -60% 0px', threshold: 0 }
    )

    headings.forEach((el) => observer!.observe(el))
  })
}

onMounted(setup)
onUnmounted(() => observer?.disconnect())
watch(() => route.path, () => setTimeout(setup, 200))
</script>

<template>
  <div v-if="page.headers?.length" class="sidebar-outline">
    <div class="outline-title">本页目录</div>
    <nav class="outline-nav">
      <a
        v-for="h in page.headers"
        :key="h.slug"
        :href="'#' + h.slug"
        :class="['outline-link', `level-${h.level}`, { active: activeSlug === h.slug }]"
      >{{ h.title }}</a>
    </nav>
  </div>
</template>

<style scoped>
.sidebar-outline {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--vp-c-divider);
}

.outline-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0 12px;
  margin-bottom: 8px;
}

.outline-nav {
  display: flex;
  flex-direction: column;
}

.outline-link {
  display: block;
  padding: 4px 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}

.outline-link.level-3 {
  padding-left: 24px;
  font-size: 12px;
}

.outline-link:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}

.outline-link.active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  font-weight: 500;
}
</style>
