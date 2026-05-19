<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const isEn = computed(() => lang.value === 'en-US')

const i18n = computed(() => isEn.value
  ? {
      presetsLabel: 'Presets:',
      currentBrowser: 'Current Browser',
      placeholder: 'Enter a User Agent string...',
      parse: 'Parse',
      loading: 'Loading...',
      yes: 'Yes',
      no: 'No',
      rawJson: 'Raw JSON',
      empty: 'Parse result will appear here',
      uaMode: 'UA Mode',
      detectMode: 'Detect Mode',
      noDiff: 'All fields match between modes',
      strategyLabel: 'Strategy:',
      strategies: {
        auto: 'auto',
        'ua-first': 'ua-first',
        'hardware-first': 'hardware-first',
        strict: 'strict',
      },
      fields: {
        browser: 'Browser',
        version: 'Version',
        engine: 'Engine',
        os: 'OS',
        device: 'Device',
        arch: 'Arch',
        language: 'Language',
        platform: 'Platform',
        bot: 'Bot',
        headless: 'Headless',
        webview: 'Webview',
        confidence: 'Confidence',
      },
    }
  : {
      presetsLabel: '预设：',
      currentBrowser: '当前浏览器',
      placeholder: '输入 User Agent 字符串...',
      parse: '解析',
      loading: '加载中...',
      yes: '是',
      no: '否',
      rawJson: '原始 JSON',
      empty: '解析结果将显示在此处',
      uaMode: 'UA 模式',
      detectMode: '检测模式',
      noDiff: '两种模式结果完全一致',
      strategyLabel: '策略：',
      strategies: {
        auto: 'auto',
        'ua-first': 'ua-first',
        'hardware-first': 'hardware-first',
        strict: 'strict',
      },
      fields: {
        browser: '浏览器',
        version: '版本',
        engine: '内核',
        os: '操作系统',
        device: '设备',
        arch: '架构',
        language: '语言',
        platform: '平台',
        bot: '爬虫',
        headless: 'Headless',
        webview: 'Webview',
        confidence: '可信度',
      },
    }
)

type DetectStrategy = 'auto' | 'ua-first' | 'hardware-first' | 'strict'

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
  confidence: 'high' | 'medium' | 'low' | 'conflict'
}

interface ComparisonResult {
  ua: ParseResult
  detect: ParseResult
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
    label: 'Bilibili / Android',
    ua: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 BiliBili/6.24.0 os/android model/SM-G991B mobi_app/android',
  },
  {
    label: 'Douyin / Android',
    ua: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 aweme/20.6.0 app_version/20.6.0',
  },
  {
    label: 'Feishu / Android',
    ua: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 Lark/6.8.9 RangersAppID/1305903',
  },
  {
    label: 'HarmonyOS Next',
    ua: 'Mozilla/5.0 (Linux; HarmonyOS 5.0.0; HUAWEI GT5 Pro Build/HUAWEIAGT5Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
  },
  {
    label: 'Samsung Internet',
    ua: 'Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/24.0 Chrome/117.0.0.0 Mobile Safari/537.36',
  },
  {
    label: 'Samsung TV',
    ua: 'Mozilla/5.0 (SMART-TV; Linux; Tizen 6.5) AppleWebKit/538.1 (KHTML, like Gecko) Version/6.5 TV Safari/538.1',
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
const comparisonResult = ref<ComparisonResult | null>(null)
const selectedKey = ref<string | null>(null)
const loaded = ref(false)
const strategy = ref<DetectStrategy>('auto')

let _uaBrowser: ((options?: { strategy?: DetectStrategy }) => Promise<ParseResult>) | null = null
let _parseUA: ((ua: string) => ParseResult) | null = null

onMounted(async () => {
  const mod = await import('ua-browser')
  _uaBrowser = mod.default.detect
  _parseUA = mod.parseUA
  loaded.value = true
  useCurrentUA()
})

const isCompareMode = computed(() => selectedKey.value === 'current' && comparisonResult.value !== null)

function buildTags(r: ParseResult) {
  const t = i18n.value
  const list: { label: string; value: string; type: string }[] = []
  if (r.isBot) list.push({ label: 'Bot', value: r.botName, type: 'danger' })
  if (r.isHeadless) list.push({ label: 'Headless', value: t.yes, type: 'warning' })
  if (r.isWebview) list.push({ label: 'Webview', value: t.yes, type: 'warning' })
  return list
}

function buildFields(r: ParseResult) {
  const f = i18n.value.fields
  const t = i18n.value
  return [
    { key: 'browser', label: f.browser, value: r.browser },
    { key: 'version', label: f.version, value: r.version },
    { key: 'engine', label: f.engine, value: r.engine },
    { key: 'os', label: f.os, value: `${r.os} ${r.osVersion}`.trim() },
    { key: 'device', label: f.device, value: r.device },
    { key: 'arch', label: f.arch, value: r.arch },
    { key: 'language', label: f.language, value: r.language },
    { key: 'platform', label: f.platform, value: r.platform },
    { key: 'bot', label: f.bot, value: r.isBot ? r.botName : t.no },
    { key: 'headless', label: f.headless, value: r.isHeadless ? t.yes : t.no },
    { key: 'webview', label: f.webview, value: r.isWebview ? t.yes : t.no },
    { key: 'confidence', label: f.confidence, value: r.confidence },
  ]
}

function parse() {
  if (!_parseUA || !uaInput.value.trim()) return
  selectedKey.value = null
  comparisonResult.value = null
  result.value = _parseUA(uaInput.value.trim())
}

function usePreset(ua: string) {
  if (!_parseUA) return
  uaInput.value = ua
  selectedKey.value = ua
  comparisonResult.value = null
  result.value = _parseUA(ua)
}

async function useCurrentUA() {
  if (!_uaBrowser || !_parseUA || typeof navigator === 'undefined') return
  uaInput.value = navigator.userAgent
  selectedKey.value = 'current'
  result.value = null
  comparisonResult.value = null
  const ua = navigator.userAgent
  const [uaResult, detectResult] = await Promise.all([
    Promise.resolve(_parseUA(ua)),
    _uaBrowser({ strategy: strategy.value }),
  ])
  comparisonResult.value = { ua: uaResult, detect: detectResult }
}

const tags = computed(() => result.value ? buildTags(result.value) : [])
const fields = computed(() => result.value ? buildFields(result.value) : [])

const uaTags = computed(() => comparisonResult.value ? buildTags(comparisonResult.value.ua) : [])
const detectTags = computed(() => comparisonResult.value ? buildTags(comparisonResult.value.detect) : [])
const uaFields = computed(() => comparisonResult.value ? buildFields(comparisonResult.value.ua) : [])
const detectFields = computed(() => comparisonResult.value ? buildFields(comparisonResult.value.detect) : [])

const diffKeys = computed(() => {
  const diffs = new Set<string>()
  uaFields.value.forEach((field, i) => {
    if (field.value !== detectFields.value[i]?.value) diffs.add(field.key)
  })
  return diffs
})

watch(strategy, () => {
  if (selectedKey.value === 'current') useCurrentUA()
})
</script>

<template>
  <div class="playground">
    <div class="playground-left">
      <div class="playground-presets">
        <span class="presets-label">{{ i18n.presetsLabel }}</span>
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
          {{ i18n.currentBrowser }}
        </button>
      </div>

      <div class="playground-input">
        <textarea
          v-model="uaInput"
          class="ua-textarea"
          :placeholder="i18n.placeholder"
          rows="6"
          spellcheck="false"
          @keydown.enter.ctrl="parse"
          @keydown.enter.meta="parse"
        />
        <button class="parse-btn" :disabled="!loaded" @click="parse">
          {{ loaded ? i18n.parse : i18n.loading }}
        </button>
      </div>
    </div>

    <div class="playground-right">
      <!-- Compare mode: Current Browser shows both UA Mode and Detect Mode side by side -->
      <template v-if="isCompareMode && comparisonResult">
        <div class="strategy-bar">
          <span class="strategy-label">{{ i18n.strategyLabel }}</span>
          <button
            v-for="s in (['auto', 'ua-first', 'hardware-first', 'strict'] as DetectStrategy[])"
            :key="s"
            :class="['strategy-btn', { 'strategy-btn--active': strategy === s }]"
            @click="strategy = s"
          >{{ i18n.strategies[s] }}</button>
        </div>

        <div class="compare-grid">
          <div class="compare-col">
            <div class="compare-col__head">
              <span class="mode-badge mode-badge--ua">{{ i18n.uaMode }}</span>
            </div>
            <div v-if="uaTags.length" class="result-tags">
              <span
                v-for="tag in uaTags"
                :key="tag.label"
                :class="['result-tag', `result-tag--${tag.type}`]"
              >{{ tag.label }}: {{ tag.value }}</span>
            </div>
            <div class="result-grid">
              <div
                v-for="field in uaFields"
                :key="field.key"
                :class="['result-item', { 'result-item--diff': diffKeys.has(field.key) }]"
              >
                <span class="result-label">{{ field.label }}</span>
                <span :class="['result-value', field.key === 'confidence' ? `confidence--${field.value}` : '']">
                  {{ field.value || '—' }}
                </span>
              </div>
            </div>
          </div>

          <div class="compare-col">
            <div class="compare-col__head">
              <span class="mode-badge mode-badge--detect">{{ i18n.detectMode }}</span>
            </div>
            <div v-if="detectTags.length" class="result-tags">
              <span
                v-for="tag in detectTags"
                :key="tag.label"
                :class="['result-tag', `result-tag--${tag.type}`]"
              >{{ tag.label }}: {{ tag.value }}</span>
            </div>
            <div class="result-grid">
              <div
                v-for="field in detectFields"
                :key="field.key"
                :class="['result-item', { 'result-item--diff': diffKeys.has(field.key) }]"
              >
                <span class="result-label">{{ field.label }}</span>
                <span :class="['result-value', field.key === 'confidence' ? `confidence--${field.value}` : '']">
                  {{ field.value || '—' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="diffKeys.size === 0" class="no-diff-notice">
          {{ i18n.noDiff }}
        </div>

        <details class="result-raw">
          <summary>{{ i18n.rawJson }}</summary>
          <pre>// {{ i18n.uaMode }}
{{ JSON.stringify(comparisonResult.ua, null, 2) }}

// {{ i18n.detectMode }}
{{ JSON.stringify(comparisonResult.detect, null, 2) }}</pre>
        </details>
      </template>

      <!-- Single mode: presets or manual UA input -->
      <template v-else-if="result">
        <div class="result-mode-bar">
          <span class="mode-badge mode-badge--ua">{{ i18n.uaMode }}</span>
        </div>
        <div v-if="tags.length" class="result-tags">
          <span
            v-for="tag in tags"
            :key="tag.label"
            :class="['result-tag', `result-tag--${tag.type}`]"
          >{{ tag.label }}: {{ tag.value }}</span>
        </div>
        <div class="result-grid">
          <div v-for="field in fields" :key="field.key" class="result-item">
            <span class="result-label">{{ field.label }}</span>
            <span :class="['result-value', field.key === 'confidence' ? `confidence--${field.value}` : '']">
              {{ field.value || '—' }}
            </span>
          </div>
        </div>
        <details class="result-raw">
          <summary>{{ i18n.rawJson }}</summary>
          <pre>{{ JSON.stringify(result, null, 2) }}</pre>
        </details>
      </template>

      <div v-else class="result-empty">{{ i18n.empty }}</div>
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

.preset-btn--current {
  border-style: dashed;
  font-weight: 500;
}

.preset-btn--current.preset-btn--active {
  border-style: solid;
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
  width: 100%;
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

/* Mode badges */
.mode-badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: 20px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.mode-badge--ua {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.mode-badge--detect {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-2);
}

/* Single mode result header */
.result-mode-bar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

/* Compare layout */
.compare-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.compare-col {
  min-width: 0;
}

.compare-col__head {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.no-diff-notice {
  font-size: 12px;
  color: var(--vp-c-text-3);
  text-align: center;
  padding: 8px;
  margin-bottom: 12px;
}

/* Result components */
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
  margin-bottom: 10px;
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
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
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
  transition: background 0.15s;
}

/* Highlighted when value differs between UA and Detect mode */
.result-item--diff {
  background: rgba(245, 158, 11, 0.1) !important;
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

/* Strategy selector */
.strategy-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
}

.strategy-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.strategy-btn {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-family: var(--vp-font-family-mono);
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}

.strategy-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.strategy-btn--active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

/* Confidence level colors */
.confidence--high {
  color: #16a34a;
}

.confidence--medium {
  color: #d97706;
}

.confidence--conflict {
  color: #dc2626;
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

@media (max-width: 900px) {
  .compare-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .playground {
    flex-direction: column;
    padding: 12px;
    gap: 16px;
  }

  .playground-left,
  .playground-right {
    flex: none;
    width: 100%;
  }
}
</style>
