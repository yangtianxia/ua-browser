import { describe, it, expect } from 'vitest'
import { detectHeadless } from '../src/detectors/headless.js'
import { UA } from './fixtures/user-agents.js'

describe('detectHeadless', () => {
  it('HeadlessChrome UA → true', () => {
    const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/124.0.0.0 Safari/537.36'
    expect(detectHeadless(ua)).toBe(true)
  })

  it('PhantomJS UA → true', () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/534.34 (KHTML, like Gecko) PhantomJS/1.9.7 Safari/534.34'
    expect(detectHeadless(ua)).toBe(true)
  })

  it('Electron app UA → true', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) MyApp/1.0.0 Chrome/120.0.0.0 Electron/28.0.0 Safari/537.36'
    expect(detectHeadless(ua)).toBe(true)
  })

  it('Playwright UA → true', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Playwright/1.40.0 Chrome/120.0.0.0 Safari/537.36'
    expect(detectHeadless(ua)).toBe(true)
  })

  it('jsdom UA → true', () => {
    const ua = 'Mozilla/5.0 (linux) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/20.0.3'
    expect(detectHeadless(ua)).toBe(true)
  })

  it('Selenium WebDriver UA → true', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Selenium/4.0'
    expect(detectHeadless(ua)).toBe(true)
  })

  it('normal Chrome → false', () => {
    expect(detectHeadless(UA.chrome.windows)).toBe(false)
  })

  it('Safari → false', () => {
    expect(detectHeadless(UA.safari.desktop)).toBe(false)
  })

  it('empty UA → false', () => {
    expect(detectHeadless('')).toBe(false)
  })
})
