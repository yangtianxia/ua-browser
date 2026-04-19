<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useData, useRoute, onContentUpdated } from 'vitepress'

const { page } = useData()
const route = useRoute()
const targetEl = ref<HTMLElement | null>(null)
const activeSlug = ref('')
let observer: IntersectionObserver | null = null

function findTarget() {
  const items = Array.from(
    document.querySelectorAll<HTMLElement>('.VPSidebarItem.is-active')
  )
  // 取最深层的活跃项（叶子节点，不包含其他活跃子项的那个）
  targetEl.value =
    items.filter((el) => !el.querySelector('.VPSidebarItem.is-active')).pop() ?? null
}

function setupObserver() {
  observer?.disconnect()
  activeSlug.value = ''

  const headings = Array.from(
    document.querySelectorAll<HTMLElement>('.vp-doc h2[id], .vp-doc h3[id]')
  )
  if (!headings.length) return

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting)
      if (visible.length) {
        activeSlug.value = (visible[0].target as HTMLElement).id
      }
    },
    { rootMargin: '-64px 0px -60% 0px', threshold: 0 }
  )
  headings.forEach((el) => observer!.observe(el))
}

function refresh() {
  nextTick(() => {
    findTarget()
    setupObserver()
  })
}

onMounted(refresh)
onUnmounted(() => observer?.disconnect())
onContentUpdated(refresh)
watch(() => route.path, () => setTimeout(refresh, 150))
</script>

<template>
  <Teleport v-if="targetEl && page.headers?.length" :to="targetEl">
    <nav class="spo-nav">
      <a
        v-for="h in page.headers"
        :key="h.slug"
        :href="'#' + h.slug"
        :class="['spo-link', `level-${h.level}`, { active: activeSlug === h.slug }]"
      >{{ h.title }}</a>
    </nav>
  </Teleport>
</template>

<style scoped>
.spo-nav {
  display: flex;
  flex-direction: column;
  padding: 4px 0 8px;
}

.spo-link {
  display: block;
  padding: 3px 16px 3px 28px;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  text-decoration: none;
  border-radius: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s, background 0.2s;
}

.spo-link.level-3 {
  padding-left: 40px;
}

.spo-link:hover {
  color: var(--vp-c-text-1);
}

.spo-link.active {
  color: var(--vp-c-brand-1);
  font-weight: 500;
}
</style>
