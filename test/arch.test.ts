import { describe, it, expect } from 'vitest'
import { detectArch } from '../src/detectors/arch.js'
import { UA } from './fixtures/user-agents.js'

describe('detectArch', () => {
  it('Win64 → x86_64', () => {
    expect(detectArch(UA.chrome.windows)).toBe('x86_64')   // contains Win64
  })

  it('WOW64 → x86_64', () => {
    const ua = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 Chrome/124.0.0.0'
    expect(detectArch(ua)).toBe('x86_64')
  })

  it('x86_64 (Linux) → x86_64', () => {
    const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0.0.0'
    expect(detectArch(ua)).toBe('x86_64')
  })

  it('aarch64 → arm64', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 12; SM-G991B aarch64) AppleWebKit/537.36'
    expect(detectArch(ua)).toBe('arm64')
  })

  it('arm64 → arm64', () => {
    const ua = 'Mozilla/5.0 (Macintosh; arm64) AppleWebKit/537.36'
    expect(detectArch(ua)).toBe('arm64')
  })

  it('ARM (generic) → arm', () => {
    const ua = 'Mozilla/5.0 (Linux; U; Android 2.2; en-gb; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'
    // Standard Android UA without explicit arch — returns unknown
    expect(detectArch(ua)).toBe('unknown')
  })

  it('iOS mobile → unknown (no arch in UA)', () => {
    expect(detectArch(UA.safari.ios)).toBe('unknown')
  })

  it('empty UA → unknown', () => {
    expect(detectArch('')).toBe('unknown')
  })

  it('Layer 1: Client Hints arm/64 → arm64', () => {
    const ctx = { userAgent: UA.safari.ios, platform: '', language: '', maxTouchPoints: 5,
      highEntropyData: { architecture: 'arm', bitness: '64' } }
    expect(detectArch(UA.safari.ios, ctx)).toBe('arm64')
  })

  it('Layer 1: Client Hints arm/32 → arm', () => {
    const ctx = { userAgent: '', platform: '', language: '', maxTouchPoints: 0,
      highEntropyData: { architecture: 'arm', bitness: '32' } }
    expect(detectArch('', ctx)).toBe('arm')
  })

  it('Layer 1: Client Hints x86/64 → x86_64', () => {
    const ctx = { userAgent: '', platform: '', language: '', maxTouchPoints: 0,
      highEntropyData: { architecture: 'x86', bitness: '64' } }
    expect(detectArch('', ctx)).toBe('x86_64')
  })

  it('Layer 2: WebGL Apple M2 renderer → arm64', () => {
    const ctx = { userAgent: '', platform: '', language: '', maxTouchPoints: 0,
      webglRenderer: 'Apple M2' }
    expect(detectArch('', ctx)).toBe('arm64')
  })

  it('Layer 2: WebGL Intel GPU renderer → x86_64', () => {
    const ctx = { userAgent: '', platform: '', language: '', maxTouchPoints: 0,
      webglRenderer: 'Intel Iris Pro OpenGL Engine' }
    expect(detectArch('', ctx)).toBe('x86_64')
  })

  it('Layer 3: iPhone platform → arm64', () => {
    const ctx = { userAgent: UA.safari.ios, platform: 'iPhone', language: '', maxTouchPoints: 5 }
    expect(detectArch(UA.safari.ios, ctx)).toBe('arm64')
  })

  it('Layer 3: Win32 platform → x86', () => {
    const ctx = { userAgent: '', platform: 'Win32', language: '', maxTouchPoints: 0 }
    expect(detectArch('', ctx)).toBe('x86')
  })

  it('Layer 4 (UA fallback) used when ctx has no useful signals', () => {
    const ctx = { userAgent: UA.chrome.windows, platform: '', language: '', maxTouchPoints: 0 }
    expect(detectArch(UA.chrome.windows, ctx)).toBe('x86_64')  // Win64 in UA
  })
})
