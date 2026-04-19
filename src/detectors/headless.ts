/**
 * Patterns that indicate a headless, automated, or embedded browser environment.
 *
 * | Pattern          | Source                                              |
 * |------------------|-----------------------------------------------------|
 * | HeadlessChrome   | Chrome launched with --headless flag                |
 * | Headless         | Generic headless marker in some frameworks          |
 * | PhantomJS        | PhantomJS (deprecated but still used)               |
 * | Electron         | Electron apps (not strictly headless, but automated)|
 * | Playwright       | Playwright automation framework                     |
 * | jsdom            | Node.js DOM simulation (vitest, jest-environment)   |
 * | Selenium         | Some WebDriver/Selenium setups inject this token    |
 */
const HEADLESS_PATTERN = /(HeadlessChrome|Headless|PhantomJS|Electron\/|Playwright|jsdom\/|Selenium)/

/**
 * Detect whether the UA belongs to a headless or automation-driven browser.
 *
 * Note: modern Puppeteer/Playwright using stealth mode can hide these markers.
 * This catches the common/unmodified cases only.
 */
export function detectHeadless(ua: string): boolean {
  return HEADLESS_PATTERN.test(ua)
}
