<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const isEn = computed(() => lang.value === 'en-US')

const i18n = computed(() => isEn.value ? {
  tabBrowser: 'Current Browser',
  tabApi: 'API Testing',
  // Tab 1
  loading: 'Detecting…',
  noNavigator: 'Open this page in a browser to detect the current environment.',
  parseLabel: 'uaBrowser()',
  parseDesc: 'UA + navigator',
  detectLabel: 'detect()',
  detectDesc: 'UA + navigator + hardware signals',
  diffHint: 'Highlighted fields were corrected by hardware signals',
  noDiff: 'Both methods return identical results for this browser',
  rawJson: 'Raw JSON',
  yes: 'Yes',
  no: 'No',
  fields: {
    browser: 'Browser', version: 'Version', engine: 'Engine',
    os: 'OS', device: 'Device', arch: 'Arch',
    language: 'Language', platform: 'Platform',
    bot: 'Bot', headless: 'Headless', webview: 'Webview',
  },
  // Tab 2
  placeholder: 'Paste any User Agent string here…',
  useCurrentUA: 'Use current UA',
  runApi: 'Run',
  apiEmpty: 'Paste a UA string and click "Run" to test all APIs.',
  detectorDescs: {
    parseUA:        'Full parse — all fields',
    detectBrowser:  'Browser name + version',
    detectOS:       'OS name + version',
    detectEngine:   'Rendering engine',
    detectDevice:   'Device type',
    detectBot:      'Bot / crawler detection',
    detectArch:     'CPU architecture',
    detectHeadless: 'Headless browser check',
    isWebview:      'Android WebView / iOS WKWebView',
  },
  detectorFields: {
    browser: 'Browser', version: 'Version',
    os: 'OS', osVersion: 'OS Version',
    engine: 'Engine',
    device: 'Device',
    arch: 'Arch',
    isBot: 'Is Bot', botName: 'Bot Name',
    headless: 'Headless',
    webview: 'Webview',
  },
} : {
  tabBrowser: '当前浏览器',
  tabApi: 'API 测试',
  // Tab 1
  loading: '检测中…',
  noNavigator: '请在浏览器中打开此页面以检测当前环境。',
  parseLabel: 'uaBrowser()',
  parseDesc: 'UA + navigator',
  detectLabel: 'detect()',
  detectDesc: 'UA + navigator + 硬件信号',
  diffHint: '橙色字段：硬件信号修正了 UA 解析结果',
  noDiff: '两种方式对当前浏览器的检测结果完全一致',
  rawJson: '原始 JSON',
  yes: '是',
  no: '否',
  fields: {
    browser: '浏览器', version: '版本', engine: '内核',
    os: '操作系统', device: '设备', arch: '架构',
    language: '语言', platform: '平台',
    bot: '爬虫', headless: 'Headless', webview: 'Webview',
  },
  // Tab 2
  placeholder: '在此粘贴任意 User Agent 字符串…',
  useCurrentUA: '使用当前 UA',
  runApi: '运行',
  apiEmpty: '粘贴 UA 字符串后点击「运行」，即可测试所有 API。',
  detectorDescs: {
    parseUA:        '完整解析——所有字段',
    detectBrowser:  '浏览器名称 + 版本',
    detectOS:       '操作系统 + 版本',
    detectEngine:   '渲染引擎',
    detectDevice:   '设备类型',
    detectBot:      '爬虫 / 机器人检测',
    detectArch:     'CPU 架构',
    detectHeadless: '无头浏览器检测',
    isWebview:      'Android WebView / iOS WKWebView',
  },
  detectorFields: {
    browser: '浏览器', version: '版本',
    os: '操作系统', osVersion: '系统版本',
    engine: '引擎',
    device: '设备',
    arch: '架构',
    isBot: '是否爬虫', botName: '爬虫名称',
    headless: 'Headless',
    webview: 'Webview',
  },
})

interface ParseResult {
  browser: string; version: string; engine: string
  os: string; osVersion: string; device: string; arch: string
  isWebview: boolean; isHeadless: boolean; isBot: boolean
  botName: string; language: string; platform: string
}

interface CompareResult { ua: ParseResult; detect: ParseResult }

interface ApiResults {
  parseUA:        ParseResult
  detectBrowser:  { browser: string; version: string }
  detectOS:       { os: string; osVersion: string }
  detectEngine:   string
  detectDevice:   string
  detectBot:      { isBot: boolean; botName: string }
  detectArch:     string
  detectHeadless: boolean
  isWebview:      boolean
}

// ── Tab state ────────────────────────────────────────────
const activeTab = ref<'browser' | 'api'>('browser')

// ── Tab 1: Current Browser ───────────────────────────────
const compareResult    = ref<CompareResult | null>(null)
const browserDetecting = ref(false)

// ── Tab 2: API Testing ───────────────────────────────────
const apiUaInput = ref('')
const apiResults = ref<ApiResults | null>(null)

// ── Module handles ───────────────────────────────────────
const loaded = ref(false)
let _detect:         (() => Promise<ParseResult>) | null = null
let _parseUA:        ((ua: string) => ParseResult) | null = null
let _uaBrowser:      (() => ParseResult) | null = null
let _detectBrowser:  ((ua: string) => { browser: string; version: string }) | null = null
let _detectOS:       ((ua: string) => { os: string; osVersion: string }) | null = null
let _detectBot:      ((ua: string) => { isBot: boolean; botName: string }) | null = null
let _detectEngine:   ((ua: string) => string) | null = null
let _detectDevice:   ((ua: string) => string) | null = null
let _detectArch:     ((ua: string) => string) | null = null
let _detectHeadless: ((ua: string) => boolean) | null = null
let _isWebview:      ((ua: string) => boolean) | null = null

onMounted(async () => {
  const mod = await import('ua-browser')
  _detect         = mod.default.detect
  _parseUA        = mod.parseUA
  _uaBrowser      = mod.default
  _detectBrowser  = mod.detectBrowser
  _detectOS       = mod.detectOS
  _detectEngine   = mod.detectEngine
  _detectDevice   = mod.detectDevice
  _detectBot      = mod.detectBot
  _detectArch     = mod.detectArch
  _detectHeadless = mod.detectHeadless
  _isWebview      = mod.isWebview
  loaded.value = true
  runDetectBrowser()
})

// ── Tab 1 functions ──────────────────────────────────────
async function runDetectBrowser() {
  if (!_detect || !_uaBrowser || typeof navigator === 'undefined') return
  browserDetecting.value = true
  const [ua, detect] = await Promise.all([
    Promise.resolve(_uaBrowser()),
    _detect(),
  ])
  compareResult.value = { ua, detect }
  browserDetecting.value = false
}

// ── Tab 2 functions ──────────────────────────────────────
function runApi() {
  const ua = apiUaInput.value.trim()
  if (!ua || !_parseUA) return
  apiResults.value = {
    parseUA:        _parseUA(ua),
    detectBrowser:  _detectBrowser!(ua),
    detectOS:       _detectOS!(ua),
    detectEngine:   _detectEngine!(ua),
    detectDevice:   _detectDevice!(ua),
    detectBot:      _detectBot!(ua),
    detectArch:     _detectArch!(ua),
    detectHeadless: _detectHeadless!(ua),
    isWebview:      _isWebview!(ua),
  }
}

function useCurrentUA() {
  if (typeof navigator !== 'undefined') {
    apiUaInput.value = navigator.userAgent
    runApi()
  }
}

function onApiInput() {
  apiResults.value = null
}

// ── Shared helpers ───────────────────────────────────────
function buildTags(r: ParseResult) {
  const t = i18n.value
  const list: { label: string; value: string; type: string }[] = []
  if (r.isBot)      list.push({ label: 'Bot',      value: r.botName, type: 'danger' })
  if (r.isHeadless) list.push({ label: 'Headless', value: t.yes,     type: 'warning' })
  if (r.isWebview)  list.push({ label: 'Webview',  value: t.yes,     type: 'warning' })
  return list
}

function buildFields(r: ParseResult) {
  const f = i18n.value.fields
  const t = i18n.value
  return [
    { key: 'browser',  label: f.browser,  value: r.browser },
    { key: 'version',  label: f.version,  value: r.version },
    { key: 'engine',   label: f.engine,   value: r.engine },
    { key: 'os',       label: f.os,       value: `${r.os} ${r.osVersion}`.trim() },
    { key: 'device',   label: f.device,   value: r.device },
    { key: 'arch',     label: f.arch,     value: r.arch },
    { key: 'language', label: f.language, value: r.language },
    { key: 'platform', label: f.platform, value: r.platform },
    { key: 'bot',      label: f.bot,      value: r.isBot ? r.botName : t.no },
    { key: 'headless', label: f.headless, value: r.isHeadless ? t.yes : t.no },
    { key: 'webview',  label: f.webview,  value: r.isWebview ? t.yes : t.no },
  ]
}

const uaFields     = computed(() => compareResult.value ? buildFields(compareResult.value.ua)     : [])
const detectFields = computed(() => compareResult.value ? buildFields(compareResult.value.detect) : [])
const uaTags       = computed(() => compareResult.value ? buildTags(compareResult.value.ua)       : [])
const detectTags   = computed(() => compareResult.value ? buildTags(compareResult.value.detect)   : [])

const parseUAFields = computed(() => apiResults.value ? buildFields(apiResults.value.parseUA) : [])
const parseUATags   = computed(() => apiResults.value ? buildTags(apiResults.value.parseUA)   : [])

const diffKeys = computed(() => {
  const diffs = new Set<string>()
  uaFields.value.forEach((field, i) => {
    if (field.value !== detectFields.value[i]?.value) diffs.add(field.key)
  })
  return diffs
})
</script>

<template>
  <div class="playground">

    <!-- ── Tab bar ──────────────────────────────────────── -->
    <div class="tab-bar">
      <button
        :class="['tab', activeTab === 'browser' && 'tab--active']"
        @click="activeTab = 'browser'"
      >{{ i18n.tabBrowser }}</button>
      <button
        :class="['tab', activeTab === 'api' && 'tab--active']"
        @click="activeTab = 'api'"
      >{{ i18n.tabApi }}</button>
    </div>

    <!-- ── Tab 1: Current Browser ───────────────────────── -->
    <template v-if="activeTab === 'browser'">

      <div v-if="compareResult" class="result-area">
        <div v-if="diffKeys.size > 0" class="diff-hint">
          <span class="diff-dot" />{{ i18n.diffHint }}
        </div>

        <div class="compare-grid">
          <!-- uaBrowser() column -->
          <div class="compare-col">
            <div class="col-header">
              <code class="col-method">{{ i18n.parseLabel }}</code>
              <span class="col-desc">{{ i18n.parseDesc }}</span>
            </div>
            <div class="col-body">
              <div v-if="uaTags.length" class="result-tags">
                <span v-for="tag in uaTags" :key="tag.label" :class="['result-tag', `result-tag--${tag.type}`]">
                  {{ tag.label }}: {{ tag.value }}
                </span>
              </div>
              <div class="result-list">
                <div
                  v-for="field in uaFields"
                  :key="field.key"
                  :class="['result-item', { 'result-item--diff': diffKeys.has(field.key) }]"
                >
                  <span class="result-label">{{ field.label }}</span>
                  <span class="result-value">{{ field.value || '—' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- detect() column -->
          <div class="compare-col compare-col--detect">
            <div class="col-header col-header--detect">
              <code class="col-method col-method--detect">{{ i18n.detectLabel }}</code>
              <span class="col-desc">{{ i18n.detectDesc }}</span>
            </div>
            <div class="col-body">
              <div v-if="detectTags.length" class="result-tags">
                <span v-for="tag in detectTags" :key="tag.label" :class="['result-tag', `result-tag--${tag.type}`]">
                  {{ tag.label }}: {{ tag.value }}
                </span>
              </div>
              <div class="result-list">
                <div
                  v-for="field in detectFields"
                  :key="field.key"
                  class="result-item"
                >
                  <span class="result-label">{{ field.label }}</span>
                  <span class="result-value">{{ field.value || '—' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="diffKeys.size === 0" class="no-diff-notice">{{ i18n.noDiff }}</div>

        <details class="result-raw">
          <summary>{{ i18n.rawJson }}</summary>
          <pre>// {{ i18n.parseLabel }}
{{ JSON.stringify(compareResult.ua, null, 2) }}

// {{ i18n.detectLabel }}
{{ JSON.stringify(compareResult.detect, null, 2) }}</pre>
        </details>
      </div>

      <div v-else-if="!loaded || browserDetecting" class="result-empty result-empty--loading">
        {{ i18n.loading }}
      </div>
      <div v-else class="result-empty">{{ i18n.noNavigator }}</div>

    </template>

    <!-- ── Tab 2: API Testing ────────────────────────────── -->
    <template v-else>

      <div class="input-area">
        <textarea
          v-model="apiUaInput"
          class="ua-textarea"
          :placeholder="i18n.placeholder"
          rows="3"
          spellcheck="false"
          @input="onApiInput"
          @keydown.enter.ctrl="runApi"
          @keydown.enter.meta="runApi"
        />
        <div class="action-row">
          <button
            class="btn btn--link"
            :disabled="!loaded"
            @click="useCurrentUA"
          >{{ i18n.useCurrentUA }}</button>
          <button
            class="btn btn--primary"
            :disabled="!loaded || !apiUaInput.trim()"
            @click="runApi"
          >{{ i18n.runApi }}</button>
        </div>
      </div>

      <div v-if="apiResults" class="api-area">
        <div class="api-grid">

          <!-- parseUA() — full width -->
          <div class="api-card api-card--full">
            <div class="api-header">
              <code class="api-fn">parseUA(ua)</code>
              <span class="api-desc">{{ i18n.detectorDescs.parseUA }}</span>
            </div>
            <div class="api-body">
              <div v-if="parseUATags.length" class="result-tags">
                <span v-for="tag in parseUATags" :key="tag.label" :class="['result-tag', `result-tag--${tag.type}`]">
                  {{ tag.label }}: {{ tag.value }}
                </span>
              </div>
              <div class="result-list result-list--wide">
                <div v-for="field in parseUAFields" :key="field.key" class="result-item">
                  <span class="result-label">{{ field.label }}</span>
                  <span class="result-value">{{ field.value || '—' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- detectBrowser() -->
          <div class="api-card">
            <div class="api-header">
              <code class="api-fn">detectBrowser(ua)</code>
              <span class="api-desc">{{ i18n.detectorDescs.detectBrowser }}</span>
            </div>
            <div class="api-body">
              <div class="result-list">
                <div class="result-item">
                  <span class="result-label">{{ i18n.detectorFields.browser }}</span>
                  <span class="result-value">{{ apiResults.detectBrowser.browser || '—' }}</span>
                </div>
                <div class="result-item">
                  <span class="result-label">{{ i18n.detectorFields.version }}</span>
                  <span class="result-value">{{ apiResults.detectBrowser.version || '—' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- detectOS() -->
          <div class="api-card">
            <div class="api-header">
              <code class="api-fn">detectOS(ua)</code>
              <span class="api-desc">{{ i18n.detectorDescs.detectOS }}</span>
            </div>
            <div class="api-body">
              <div class="result-list">
                <div class="result-item">
                  <span class="result-label">{{ i18n.detectorFields.os }}</span>
                  <span class="result-value">{{ apiResults.detectOS.os || '—' }}</span>
                </div>
                <div class="result-item">
                  <span class="result-label">{{ i18n.detectorFields.osVersion }}</span>
                  <span class="result-value">{{ apiResults.detectOS.osVersion || '—' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- detectEngine() -->
          <div class="api-card">
            <div class="api-header">
              <code class="api-fn">detectEngine(ua)</code>
              <span class="api-desc">{{ i18n.detectorDescs.detectEngine }}</span>
            </div>
            <div class="api-body">
              <div class="result-list">
                <div class="result-item">
                  <span class="result-label">{{ i18n.detectorFields.engine }}</span>
                  <span class="result-value">{{ apiResults.detectEngine || '—' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- detectDevice() -->
          <div class="api-card">
            <div class="api-header">
              <code class="api-fn">detectDevice(ua)</code>
              <span class="api-desc">{{ i18n.detectorDescs.detectDevice }}</span>
            </div>
            <div class="api-body">
              <div class="result-list">
                <div class="result-item">
                  <span class="result-label">{{ i18n.detectorFields.device }}</span>
                  <span class="result-value">{{ apiResults.detectDevice || '—' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- detectBot() -->
          <div class="api-card">
            <div class="api-header">
              <code class="api-fn">detectBot(ua)</code>
              <span class="api-desc">{{ i18n.detectorDescs.detectBot }}</span>
            </div>
            <div class="api-body">
              <div class="result-list">
                <div class="result-item">
                  <span class="result-label">{{ i18n.detectorFields.isBot }}</span>
                  <span class="result-value">
                    <span v-if="apiResults.detectBot.isBot" class="result-tag result-tag--danger">
                      {{ apiResults.detectBot.botName }}
                    </span>
                    <span v-else>{{ i18n.no }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- detectArch() -->
          <div class="api-card">
            <div class="api-header">
              <code class="api-fn">detectArch(ua)</code>
              <span class="api-desc">{{ i18n.detectorDescs.detectArch }}</span>
            </div>
            <div class="api-body">
              <div class="result-list">
                <div class="result-item">
                  <span class="result-label">{{ i18n.detectorFields.arch }}</span>
                  <span class="result-value">{{ apiResults.detectArch || '—' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- detectHeadless() -->
          <div class="api-card">
            <div class="api-header">
              <code class="api-fn">detectHeadless(ua)</code>
              <span class="api-desc">{{ i18n.detectorDescs.detectHeadless }}</span>
            </div>
            <div class="api-body">
              <div class="result-list">
                <div class="result-item">
                  <span class="result-label">{{ i18n.detectorFields.headless }}</span>
                  <span class="result-value">
                    <span v-if="apiResults.detectHeadless" class="result-tag result-tag--warning">{{ i18n.yes }}</span>
                    <span v-else>{{ i18n.no }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- isWebview() -->
          <div class="api-card">
            <div class="api-header">
              <code class="api-fn">isWebview(ua)</code>
              <span class="api-desc">{{ i18n.detectorDescs.isWebview }}</span>
            </div>
            <div class="api-body">
              <div class="result-list">
                <div class="result-item">
                  <span class="result-label">{{ i18n.detectorFields.webview }}</span>
                  <span class="result-value">
                    <span v-if="apiResults.isWebview" class="result-tag result-tag--warning">{{ i18n.yes }}</span>
                    <span v-else>{{ i18n.no }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div v-else class="result-empty">{{ i18n.apiEmpty }}</div>

    </template>

  </div>
</template>

<style scoped>
.playground {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

/* ── Tab bar ────────────────────────────────────────────── */

.tab-bar {
  display: flex;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.tab {
  flex: 1;
  padding: 11px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -1px;
}

.tab:hover {
  color: var(--vp-c-text-1);
}

.tab--active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

/* ── Input area (Tab 2) ─────────────────────────────────── */

.input-area {
  padding: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
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
  font-size: 12px;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.2s;
}

.ua-textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.action-row {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;
}

/* ── Buttons ────────────────────────────────────────────── */

.btn {
  padding: 7px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn--primary {
  border: none;
  background: var(--vp-c-brand-1);
  color: #fff;
}

.btn--primary:hover:not(:disabled) {
  opacity: 0.85;
}

.btn--link {
  border: none;
  background: none;
  padding: 7px 10px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
}

.btn--link:hover:not(:disabled) {
  text-decoration: underline;
}

/* ── Result area (Tab 1) ────────────────────────────────── */

.result-area {
  padding: 16px;
}

.result-empty {
  padding: 40px 24px;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 13px;
  line-height: 1.7;
}

.result-empty--loading {
  padding: 28px 24px;
}

/* ── Diff hint ──────────────────────────────────────────── */

.diff-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin-bottom: 10px;
}

.diff-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: rgba(245, 158, 11, 0.5);
  flex-shrink: 0;
}

/* ── Compare grid (Tab 1) ───────────────────────────────── */

.compare-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.compare-col {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.col-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 10px 14px;
  background: var(--vp-c-bg-mute);
  border-bottom: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}

.col-header--detect {
  background: var(--vp-c-brand-soft);
}

.col-method {
  font-size: 12px;
  font-weight: 600;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  background: none;
  padding: 0;
}

.col-method--detect {
  color: var(--vp-c-brand-1);
}

.col-desc {
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.col-body {
  padding: 12px;
  flex: 1;
}

/* ── Result list (shared) ───────────────────────────────── */

.result-list {
  display: flex;
  flex-direction: column;
}

.result-list--wide {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
}

.result-item {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 7px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.result-item:last-child {
  border-bottom: none;
}

.result-label {
  width: 72px;
  flex-shrink: 0;
  font-size: 11px;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.result-value {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  word-break: break-all;
  min-width: 0;
}

/* Diff indicator */
.result-item--diff .result-label { color: #d97706; }
.result-item--diff .result-value { color: #d97706; }

/* ── Tags ───────────────────────────────────────────────── */

.result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.result-tag {
  font-size: 11px;
  padding: 2px 9px;
  border-radius: 20px;
  font-weight: 500;
}

.result-tag--danger  { background: #fee2e2; color: #dc2626; }
.result-tag--warning { background: #fef3c7; color: #d97706; }

/* ── No diff notice ─────────────────────────────────────── */

.no-diff-notice {
  font-size: 12px;
  color: var(--vp-c-text-3);
  text-align: center;
  padding: 8px;
  margin-bottom: 12px;
}

/* ── Raw JSON ───────────────────────────────────────────── */

.result-raw {
  margin-top: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.result-raw summary {
  padding: 9px 14px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  user-select: none;
}

.result-raw pre {
  margin: 0;
  padding: 14px;
  font-size: 12px;
  line-height: 1.6;
  overflow-x: auto;
}

/* ── API grid (Tab 2) ───────────────────────────────────── */

.api-area {
  padding: 16px;
}

.api-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.api-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  min-width: 0;
}

.api-card--full {
  grid-column: 1 / -1;
}

.api-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 10px 14px;
  background: var(--vp-c-bg-mute);
  border-bottom: 1px solid var(--vp-c-divider);
}

.api-fn {
  font-size: 12px;
  font-weight: 600;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  background: none;
  padding: 0;
  white-space: nowrap;
}

.api-desc {
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.api-body {
  padding: 4px 14px;
}

/* ── Responsive ─────────────────────────────────────────── */

@media (max-width: 768px) {
  .compare-grid,
  .api-grid,
  .result-list--wide {
    grid-template-columns: 1fr;
  }

  .api-card--full {
    grid-column: 1;
  }
}
</style>
