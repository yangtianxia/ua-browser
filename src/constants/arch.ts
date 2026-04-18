export type ArchName = 'x86' | 'x86_64' | 'arm' | 'arm64' | 'unknown'

export interface ArchDef {
  name: ArchName
  detect: RegExp
}

/**
 * Ordered from most specific to least specific.
 * First match wins (unlike browser/OS detection which keeps highest priority).
 */
export const ARCH_DEFS: readonly ArchDef[] = [
  { name: 'arm64', detect: /(aarch64|arm64|ARM64)/ },
  { name: 'arm',   detect: /\bARM\b/ },
  { name: 'x86_64', detect: /(x86_64|Win64|WOW64|x64;|amd64)/i },
  { name: 'x86',   detect: /(i[36]86|i686|x86;)/ }
] as const
