import { describe, it, expect } from 'vitest'
import { parseHeaders, ACCEPT_CH } from '../src/parse-headers.js'
import { UA } from './fixtures/user-agents.js'

describe('ACCEPT_CH', () => {
  it('contains all required Sec-CH-UA headers', () => {
    expect(ACCEPT_CH).toContain('Sec-CH-UA-Arch')
    expect(ACCEPT_CH).toContain('Sec-CH-UA-Bitness')
    expect(ACCEPT_CH).toContain('Sec-CH-UA-Platform-Version')
    expect(ACCEPT_CH).toContain('Sec-CH-UA-Model')
    expect(ACCEPT_CH).toContain('Sec-CH-UA-Full-Version-List')
  })
})

describe('parseHeaders', () => {
  it('parses user-agent header', () => {
    const r = parseHeaders({ 'user-agent': UA.chrome.windows })
    expect(r.browser).toBe('Chrome')
    expect(r.os).toBe('Windows')
    expect(r.engine).toBe('Blink')
  })

  it('header names are case-insensitive', () => {
    const r = parseHeaders({ 'User-Agent': UA.chrome.windows })
    expect(r.browser).toBe('Chrome')
  })

  it('arch from Sec-CH-UA-Arch + Sec-CH-UA-Bitness (arm/64 → arm64)', () => {
    const r = parseHeaders({
      'user-agent': UA.safari.ios,
      'sec-ch-ua-arch': '"arm"',
      'sec-ch-ua-bitness': '"64"',
    })
    expect(r.arch).toBe('arm64')
  })

  it('arch from Sec-CH-UA-Arch + Sec-CH-UA-Bitness (x86/64 → x86_64)', () => {
    const r = parseHeaders({
      'user-agent': UA.chrome.windows,
      'sec-ch-ua-arch': '"x86"',
      'sec-ch-ua-bitness': '"64"',
    })
    expect(r.arch).toBe('x86_64')
  })

  it('Windows 11 from Sec-CH-UA-Platform-Version >= 13', () => {
    const r = parseHeaders({
      'user-agent': UA.chrome.windows,
      'sec-ch-ua-platform': '"Windows"',
      'sec-ch-ua-platform-version': '"13.0.0"',
    })
    expect(r.os).toBe('Windows')
    expect(r.osVersion).toBe('11')
  })

  it('Windows 10 from Sec-CH-UA-Platform-Version < 13', () => {
    const r = parseHeaders({
      'user-agent': UA.chrome.windows,
      'sec-ch-ua-platform': '"Windows"',
      'sec-ch-ua-platform-version': '"10.0.0"',
    })
    expect(r.os).toBe('Windows')
    expect(r.osVersion).toBe('10')
  })

  it('mobile flag from sec-ch-ua-mobile: ?1', () => {
    const r = parseHeaders({
      'user-agent': UA.chrome.android,
      'sec-ch-ua-mobile': '?1',
    })
    expect(r.browser).toBe('Chrome')
    expect(r.os).toBe('Android')
  })

  it('Brave via Sec-CH-UA brand', () => {
    const r = parseHeaders({
      'user-agent': UA.chrome.windows,
      'sec-ch-ua': '"Chromium";v="124", "Brave";v="124", "Not-A.Brand";v="99"',
    })
    expect(r.browser).toBe('Brave')
  })

  it('Chrome UA with no Brave brand stays Chrome', () => {
    const r = parseHeaders({
      'user-agent': UA.chrome.windows,
      'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    })
    expect(r.browser).toBe('Chrome')
  })

  it('Chrome full version from Sec-CH-UA-Full-Version-List', () => {
    const r = parseHeaders({
      'user-agent': UA.chrome.windows,
      'sec-ch-ua-full-version-list': '"Chromium";v="149.0.7827.102", "Google Chrome";v="149.0.7827.102", "Not A(Brand";v="8.0.0.0"',
    })
    expect(r.browser).toBe('Chrome')
    expect(r.version).toBe('149.0.7827.102')
    expect(r.versionMajor).toBe(149)
  })

  it('Edge full version from Sec-CH-UA-Full-Version-List', () => {
    const r = parseHeaders({
      'user-agent': UA.edge.chromium,
      'sec-ch-ua-full-version-list': '"Chromium";v="124.0.6367.82", "Microsoft Edge";v="124.0.2478.51", "Not-A.Brand";v="99.0.0.0"',
    })
    expect(r.browser).toBe('Edge')
    expect(r.version).toBe('124.0.2478.51')
  })

  it('empty headers returns unknown results', () => {
    const r = parseHeaders({})
    expect(r.browser).toBe('unknown')
    expect(r.os).toBe('unknown')
  })

  it('strips surrounding quotes from header values', () => {
    const r = parseHeaders({
      'user-agent': UA.chrome.windows,
      'sec-ch-ua-arch': '"x86"',
      'sec-ch-ua-bitness': '"64"',
    })
    expect(r.arch).toBe('x86_64')
  })
})
