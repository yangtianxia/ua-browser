import { describe, it, expect } from 'vitest'
import { detectEngine } from '../src/detectors/engine.js'
import { UA } from './fixtures/user-agents.js'

describe('detectEngine', () => {
  it('Chrome 124 → Blink', () => {
    const r = detectEngine(UA.chrome.windows, 'Chrome', '124.0.0.0')
    expect(r.engine).toBe('Blink')
    expect(r.engineVersion).toBe('537.36')
  })

  it('Chrome 26 (old) → WebKit', () => {
    const r = detectEngine(UA.chrome.old26, 'Chrome', '26.0.1410.64')
    expect(r.engine).toBe('WebKit')
    expect(r.engineVersion).toMatch(/^\d+\.\d+/)
  })

  it('Edge Chromium → Blink', () => {
    expect(detectEngine(UA.edge.chromium, 'Edge', '124.0.0.0').engine).toBe('Blink')
  })

  it('Edge legacy (v13) → EdgeHTML', () => {
    expect(detectEngine(UA.edge.legacy, 'Edge', '13.10586').engine).toBe('EdgeHTML')
  })

  it('Firefox desktop → Gecko', () => {
    const r = detectEngine(UA.firefox.desktop, 'Firefox', '125.0')
    expect(r.engine).toBe('Gecko')
    expect(r.engineVersion).toBe('20100101')
  })

  it('IE11 → Trident', () => {
    const r = detectEngine(UA.ie.ie11, 'IE', '11.0')
    expect(r.engine).toBe('Trident')
    expect(r.engineVersion).toBe('7.0')
  })

  it('Safari desktop → WebKit', () => {
    const r = detectEngine(UA.safari.desktop, 'Safari', '17.3')
    expect(r.engine).toBe('WebKit')
    expect(r.engineVersion).toBe('605.1.15')
  })

  it('Opera modern (OPR) → Blink', () => {
    expect(detectEngine(UA.opera.modern, 'Opera', '110.0.0.0').engine).toBe('Blink')
  })

  it('Opera legacy (Presto) → Blink (version > 12)', () => {
    // Legacy Opera 12 uses Presto but > 12 rule upgrades it
    // Opera/9.80 ... Version/12.17 — version is 12.17 which is NOT > 12 integer
    // So it should stay Presto
    const r = detectEngine(UA.opera.legacy, 'Opera', '12.17')
    expect(r.engine).toBe('Presto')
    expect(r.engineVersion).toMatch(/^\d+\.\d+/)
  })

  it('Yandex → Blink', () => {
    const yandexUA = 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 YaBrowser/24.1.0 Safari/537.36'
    expect(detectEngine(yandexUA, 'Yandex', '24.1.0').engine).toBe('Blink')
  })

  it('HarmonyOS ArkWeb UA → ArkWeb (not WebKit)', () => {
    expect(detectEngine(UA.harmonyOs.arkWeb, 'Chrome', '124.0.0.0').engine).toBe('ArkWeb')
  })

  it('HarmonyOS Next without ArkWeb token → Blink', () => {
    expect(detectEngine(UA.harmonyOs.next, 'Chrome', '124.0.0.0').engine).toBe('Blink')
  })
})
