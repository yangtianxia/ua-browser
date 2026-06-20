import type { OsName } from '../types.js'

export interface OsDef {
  name: OsName
  /** Higher priority wins when multiple entries match the same UA. */
  priority: number
  detect: RegExp
  /** Capture-group regex(es) for OS version extraction. Tried in order; null = no version. */
  versionPattern: RegExp | RegExp[] | null
  /** Lookup table: raw version token → display version. */
  versionLookup?: Record<string, string>
  /** Human-readable version names: display version → name (e.g. '14' → 'Sonoma'). */
  versionNames?: Record<string, string>
}

// Priority 10: broad patterns that act as catch-alls (Linux, Windows).
// Priority 20: standard OS entries with specific-enough patterns.
// Priority 30: entries that must override a lower-priority match on the same UA
//              (Chrome OS over Linux; visionOS/tvOS over iOS; HarmonyOS/OpenHarmony over Android;
//               Windows Phone over Windows).
export const OS_DEFS: readonly OsDef[] = [
  { name: 'WebOS',          priority: 20, detect: /hpwOS/,                          versionPattern: /hpwOS\/([\d.]+)/ },
  { name: 'Symbian',        priority: 20, detect: /Symbian/,                        versionPattern: null },
  { name: 'MeeGo',          priority: 20, detect: /MeeGo/,                          versionPattern: null },
  { name: 'BlackBerry',     priority: 20, detect: /(BlackBerry|RIM)/,               versionPattern: null },
  { name: 'FreeBSD',        priority: 20, detect: /FreeBSD/,                        versionPattern: null },
  { name: 'Debian',         priority: 20, detect: /Debian/,                         versionPattern: /Debian\/([\d.]+)/ },
  { name: 'Ubuntu',         priority: 20, detect: /Ubuntu/,                         versionPattern: null },
  { name: 'Linux',          priority: 10, detect: /(Linux|X11)/,                    versionPattern: null },
  { name: 'Chrome OS',      priority: 30, detect: /CrOS/,                           versionPattern: null },
  { name: 'Tizen',          priority: 20, detect: /Tizen/,                          versionPattern: /Tizen ([\d.]+)/ },
  { name: 'iOS',            priority: 20, detect: /like Mac OS X/,                  versionPattern: /OS ([\d_]+) like/ },
  { name: 'MacOS',          priority: 20, detect: /Macintosh/,                      versionPattern: /Mac OS X -?([\d_.]+)/,
    versionNames: {
      '10.9': 'Mavericks', '10.10': 'Yosemite', '10.11': 'El Capitan',
      '10.12': 'Sierra', '10.13': 'High Sierra', '10.14': 'Mojave',
      '10.15': 'Catalina', '11': 'Big Sur', '12': 'Monterey',
      '13': 'Ventura', '14': 'Sonoma', '15': 'Sequoia',
    } },
  { name: 'visionOS',       priority: 30, detect: /visionOS/,                       versionPattern: /visionOS ([\d_]+)/ },
  { name: 'tvOS',           priority: 30, detect: /Apple TV/,                       versionPattern: /OS ([\d_]+) like/ },
  { name: 'Android',        priority: 20, detect: /(Android|Adr)/,                  versionPattern: /(?:Android|Adr) ([\d.]+)/ },
  { name: 'HarmonyOS',      priority: 30, detect: /HarmonyOS/,
    versionPattern: [/HarmonyOS[\s/]([\d.]+)/, /Android ([\d.]+)[;)]/],
    versionLookup: { '10': '2', '11': '2', '12': '4', '13': '4', '14': '4', '15': '4', '16': '4' } },
  { name: 'OpenHarmony',    priority: 30, detect: /OpenHarmony/,                    versionPattern: /OpenHarmony[\s/]([\d.]+)/ },
  { name: 'KaiOS',          priority: 30, detect: /KAIOS/,                          versionPattern: /KAIOS\/([\d.]+)/ },
  { name: 'Windows',        priority: 10, detect: /Windows/,                        versionPattern: /Windows NT ([\d.]+)/,
    versionLookup: {
      '10': '10', '6.4': '10', '6.3': '8.1', '6.2': '8',
      '6.1': '7', '6.0': 'Vista', '5.2': 'XP', '5.1': 'XP', '5.0': '2000'
    },
    versionNames: {
      '7': 'Windows 7', '8': 'Windows 8', '8.1': 'Windows 8.1',
      '10': 'Windows 10', '11': 'Windows 11',
    } },
  { name: 'Windows Phone',  priority: 30, detect: /(IEMobile|Windows Phone)/,       versionPattern: /Windows Phone(?: OS)? ([\d.]+)/ },
] as const
