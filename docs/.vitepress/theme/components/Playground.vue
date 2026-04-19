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
const selectedKey = ref<string | null>(null)
const loaded = ref(false)

let _uaBrowser: ((ua?: string) => ParseResult) | null = null
let _parseUA: ((ua: string) => ParseResult) | null = null

onMounted(async () => {
  const mod = await import('ua-browser')
  _uaBrowser = mod.default
  _parseUA = mod.parseUA
  loaded.value = true
  useCurrentUA()
})

function parse() {
  if (!_parseUA || !uaInput.value.trim()) return
  // 手动输入时清除预设选中
  selectedKey.value = null
  result.value = _parseUA(uaInput.value.trim())
}

function usePreset(ua: string) {
  if (!_parseUA) return
  uaInput.value = ua
  selectedKey.value = ua
  // 预设 UA 不注入 nav，language/platform 返回 unknown
  result.value = _parseUA(ua)
}

function useCurrentUA() {
  if (!_uaBrowser || typeof navigator === 'undefined') return
  uaInput.value = navigator.userAgent
  selectedKey.value = 'current'
  // 当前浏览器使用默认导出，注入真实 nav 上下文
  result.value = _uaBrowser()
}

const tags = computed(() => {
  if (!result.value) return []
  const r = result.value
  const list: { label: string; value: string; type: string }[] = []
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
    <div class="playground-left">
      <div class="playground-presets">
        <span class="presets-label">预设：</span>
        <button
          v-for="item in PRESET_UAS"
          :key="item.label"
          :class="['preset-btn', { 'preset-btn--active': selectedKey === item.ua }]"
          @click="usePreset(item.ua)"
        >
          {{ item.label }}
        </button>
        <button
          :class="['preset-btn', 'preset-btn--current', { 'preset-btn--active': selectedKey === 'current' }]"
          @click="useCurrentUA"
        >
          当前浏览器
        </button>
      </div>

      <div class="playground-input">
        <textarea
          v-model="uaInput"
          class="ua-textarea"
          placeholder="输入 User Agent 字符串..."
          rows="6"
          spellcheck="false"
          @keydown.enter.ctrl="parse"
          @keydown.enter.meta="parse"
        />
        <button class="parse-btn" :disabled="!loaded" @click="parse">
          {{ loaded ? '解析' : '加载中...' }}
        </button>
      </div>
    </div>

    <div class="playground-right">
      <template v-if="result">
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
      </template>
      <div v-else class="result-empty">解析结果将显示在此处</div>
    </div>
  </div>
</template>

<style scoped>
.playground {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  background: var(--vp-c-bg-soft);
}

.playground-left {
  flex: 0 0 38%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.playground-right {
  flex: 1;
  min-width: 0;
}

.playground-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
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

.preset-btn--active,
.preset-btn--active:hover {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}

.playground-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ua-textarea {
  width: 100%;
  box-sizing: border-box;
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
  align-self: flex-start;
  padding: 8px 24px;
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

.result-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  color: var(--vp-c-text-3);
  font-size: 13px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
}

.result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
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
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
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
  padding: 10px 12px;
  background: var(--vp-c-bg);
}

.result-label {
  font-size: 11px;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.result-value {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  word-break: break-all;
}

.result-raw {
  margin-top: 14px;
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

@media (max-width: 768px) {
  .playground {
    flex-direction: column;
  }

  .playground-left {
    flex: none;
    width: 100%;
  }
}
</style>
