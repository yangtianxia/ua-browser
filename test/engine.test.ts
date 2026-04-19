import { describe, it, expect } from 'vitest'
import { detectEngine } from '../src/detectors/engine.js'
import { UA } from './fixtures/user-agents.js'

describe('detectEngine', () => {
  it('Chrome 124 → Blink', () => {
    expect(detectEngine(UA.chrome.windows, 'Chrome', '124.0.0.0')).toBe('Blink')
  })

  it('Chrome 26 (old) → WebKit', () => {
    expect(detectEngine(UA.chrome.old26, 'Chrome', '26.0.1410.64')).toBe('WebKit')
  })

  it('Edge Chromium → Blink', () => {
    expect(detectEngine(UA.edge.chromium, 'Edge', '124.0.0.0')).toBe('Blink')
  })

  it('Edge legacy (v13) → EdgeHTML', () => {
    expect(detectEngine(UA.edge.legacy, 'Edge', '13.10586')).toBe('EdgeHTML')
  })

  it('Firefox desktop → Gecko', () => {
    expect(detectEngine(UA.firefox.desktop, 'Firefox', '125.0')).toBe('Gecko')
  })

  it('IE11 → Trident', () => {
    expect(detectEngine(UA.ie.ie11, 'IE', '11.0')).toBe('Trident')
  })

  it('Safari desktop → WebKit', () => {
    expect(detectEngine(UA.safari.desktop, 'Safari', '17.3')).toBe('WebKit')
  })

  it('Opera modern (OPR) → Blink', () => {
    expect(detectEngine(UA.opera.modern, 'Opera', '110.0.0.0')).toBe('Blink')
  })

  it('Opera legacy (Presto) → Blink (version > 12)', () => {
    // Legacy Opera 12 uses Presto but > 12 rule upgrades it
    // Opera/9.80 ... Version/12.17 — version is 12.17 which is NOT > 12 integer
    // So it should stay Presto
    expect(detectEngine(UA.opera.legacy, 'Opera', '12.17')).toBe('Presto')
  })

  it('Yandex → Blink', () => {
    const yandexUA = 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 YaBrowser/24.1.0 Safari/537.36'
    expect(detectEngine(yandexUA, 'Yandex', '24.1.0')).toBe('Blink')
  })
})
