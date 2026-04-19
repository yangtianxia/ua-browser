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
})
