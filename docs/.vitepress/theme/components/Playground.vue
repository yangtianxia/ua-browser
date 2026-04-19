<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface ParseResult {
  browser: string
  version: string
  engine: string
  os: string
  osVersion: string
  device: string
  arch: string
  isWebview: boolean
  isHeadless: boolean
  isBot: boolean
  botName: string
  language: string
  platform: string
}

const PRESET_UAS = [
  {
    label: 'Chrome / Windows',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  },
  {
    label: 'Safari / iPhone',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1',
  },
  {
    label: 'Edge / Windows',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
  },
  {
    label: 'Firefox / macOS',
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0',
  },
  {
    label: 'Chrome / Android',
    ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
  },
  {
    label: 'Safari / iPad',
    ua: 'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  },
  {
    label: 'WeChat / Android',
    ua: 'Mozilla/5.0 (Linux; Android 12; SM-G991B Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/98.0.4758.87 Mobile Safari/537.36 MicroMessenger/8.0.30',
  },
  {
    label: 'Googlebot',
    ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  },
  {
    label: 'HeadlessChrome',
    ua: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/124.0.0.0 Safari/537.36',
  },
  {
    label: 'Android Webview',
    ua: 'Mozilla/5.0 (Linux; Android 10; K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
  },
]

const uaInput = ref('')
const result = ref<ParseResult | null>(null)
const parseUA = ref<((ua: string) => ParseResult) | null>(null)
const loaded = ref(false)

onMounted(async () => {
  const mod = await import('ua-browser')
  parseUA.value = mod.parseUA
  loaded.value = true
  useCurrentUA()
})

function parse() {
  if (!parseUA.value || !uaInput.value.trim()) return
  result.value = parseUA.value(uaInput.value.trim())
}

function usePreset(ua: string) {
  uaInput.value = ua
  parse()
}

function useCurrentUA() {
  if (typeof navigator === 'undefined') return
  uaInput.value = navigator.userAgent
  parse()
}

const tags = computed(() => {
  if (!result.value) return []
  const r = result.value
  const list = []
  if (r.isBot) list.push({ label: 'Bot', value: r.botName, type: 'danger' })
  if (r.isHeadless) list.push({ label: 'Headless', value: '是', type: 'warning' })
  if (r.isWebview) list.push({ label: 'Webview', value: '是', type: 'warning' })
  return list
})

const fields = computed(() => {
  if (!result.value) return []
  const r = result.value
  return [
    { label: '浏览器', value: r.browser },
    { label: '版本', value: r.version },
    { label: '内核', value: r.engine },
    { label: '操作系统', value: `${r.os} ${r.osVersion}`.trim() },
    { label: '设备', value: r.device },
    { label: '架构', value: r.arch },
    { label: '语言', value: r.language },
    { label: '平台', value: r.platform },
    { label: '爬虫', value: r.isBot ? r.botName : '否' },
    { label: 'Headless', value: r.isHeadless ? '是' : '否' },
    { label: 'Webview', value: r.isWebview ? '是' : '否' },
  ]
})
</script>

<template>
  <div class="playground">
    <div class="playground-presets">
      <span class="presets-label">预设：</span>
      <button
        v-for="item in PRESET_UAS"
        :key="item.label"
        class="preset-btn"
        @click="usePreset(item.ua)"
      >
        {{ item.label }}
      </button>
      <button class="preset-btn preset-btn--current" @click="useCurrentUA">
        当前浏览器
      </button>
    </div>

    <div class="playground-input">
      <textarea
        v-model="uaInput"
        class="ua-textarea"
        placeholder="输入 User Agent 字符串..."
        rows="3"
        spellcheck="false"
        @keydown.enter.ctrl="parse"
        @keydown.enter.meta="parse"
      />
      <button class="parse-btn" :disabled="!loaded" @click="parse">
        {{ loaded ? '解析' : '加载中...' }}
      </button>
    </div>

    <div v-if="result" class="playground-result">
      <div v-if="tags.length" class="result-tags">
        <span
          v-for="tag in tags"
          :key="tag.label"
          :class="['result-tag', `result-tag--${tag.type}`]"
        >
          {{ tag.label }}: {{ tag.value }}
        </span>
      </div>

      <div class="result-grid">
        <div v-for="field in fields" :key="field.label" class="result-item">
          <span class="result-label">{{ field.label }}</span>
          <span class="result-value">{{ field.value || '—' }}</span>
        </div>
      </div>

      <details class="result-raw">
        <summary>原始 JSON</summary>
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<style scoped>
.playground {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
  background: var(--vp-c-bg-soft);
}

.playground-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
}

.presets-label {
  font-size: 13px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.preset-btn {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.preset-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.preset-btn--current {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.playground-input {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.ua-textarea {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.2s;
}

.ua-textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.parse-btn {
  padding: 8px 20px;
  border-radius: 8px;
  border: none;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s;
}

.parse-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.parse-btn:hover:not(:disabled) {
  opacity: 0.85;
}

.playground-result {
  margin-top: 20px;
}

.result-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.result-tag {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 500;
}

.result-tag--danger {
  background: #fee2e2;
  color: #dc2626;
}

.result-tag--warning {
  background: #fef3c7;
  color: #d97706;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-divider);
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 14px;
  background: var(--vp-c-bg);
}

.result-label {
  font-size: 11px;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.result-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
}

.result-raw {
  margin-top: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.result-raw summary {
  padding: 10px 14px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  background: var(--vp-c-bg-soft);
}

.result-raw pre {
  margin: 0;
  padding: 16px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
}
</style>
