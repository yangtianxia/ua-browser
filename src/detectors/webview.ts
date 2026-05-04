/**
 * Detect whether the UA is running inside a native app webview.
 *
 * - Android WebView: always includes "; wv" in the UA string.
 * - iOS WKWebView: iOS UA (contains "like Mac OS X") without Version/ and without Safari/
 *   CriOS, FxiOS, and DuckDuckGo all include "Safari/" so they are not affected.
 */
export function isWebview(ua: string): boolean {
  if (/; wv/.test(ua)) return true
  if (/like Mac OS X/.test(ua) && !/Version\//.test(ua) && !/Safari\//.test(ua)) return true
  return false
}
