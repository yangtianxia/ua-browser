import type { OsName } from '../types.js'

export interface OsDef {
  name: OsName
  detect: RegExp
  /** Capture-group regex for OS version extraction. null = no version. */
  versionPattern: RegExp | null
  /** Lookup table: raw version token → display version. */
  versionLookup?: Record<string, string>
}

export const OS_DEFS: readonly OsDef[] = [
  { name: 'WebOS',          detect: /hpwOS/,                          versionPattern: /hpwOS\/([\d.]+)/ },
  { name: 'Symbian',        detect: /Symbian/,                        versionPattern: null },
  { name: 'MeeGo',          detect: /MeeGo/,                          versionPattern: null },
  { name: 'BlackBerry',     detect: /(BlackBerry|RIM)/,               versionPattern: null },
  { name: 'Windows Phone',  detect: /(IEMobile|Windows Phone)/,       versionPattern: /Windows Phone(?: OS)? ([\d.]+)/ },
  { name: 'FreeBSD',        detect: /FreeBSD/,                        versionPattern: null },
  { name: 'Debian',         detect: /Debian/,                         versionPattern: /Debian\/([\d.]+)/ },
  { name: 'Ubuntu',         detect: /Ubuntu/,                         versionPattern: null },
  { name: 'Chrome OS',      detect: /CrOS/,                           versionPattern: null },
  { name: 'Linux',          detect: /(Linux|X11)/,                    versionPattern: null },
  { name: 'Tizen',          detect: /Tizen/,                          versionPattern: /Tizen ([\d.]+)/ },
  { name: 'iOS',            detect: /like Mac OS X/,                  versionPattern: /OS ([\d_]+) like/ },
  { name: 'MacOS',          detect: /Macintosh/,                      versionPattern: /Mac OS X -?([\d_.]+)/ },
  { name: 'HarmonyOS',      detect: /HarmonyOS/,                      versionPattern: /Android ([\d.]+)[;)]/,
    versionLookup: { '10': '2' } },
  { name: 'Android',        detect: /(Android|Adr)/,                  versionPattern: /(?:Android|Adr) ([\d.]+)/ },
  { name: 'KaiOS',          detect: /KAIOS/,                          versionPattern: /KAIOS\/([\d.]+)/ },
  { name: 'Windows',        detect: /Windows/,                        versionPattern: /Windows NT ([\d.]+)/,
    versionLookup: {
      '10': '10', '6.4': '10', '6.3': '8.1', '6.2': '8',
      '6.1': '7', '6.0': 'Vista', '5.2': 'XP', '5.1': 'XP', '5.0': '2000'
    } }
] as const
