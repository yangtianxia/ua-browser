export interface EngineDef {
  name: string
  detect: RegExp
}

export const ENGINE_DEFS: readonly EngineDef[] = [
  { name: 'KHTML',   detect: /KHTML\// },
  { name: 'Trident', detect: /(Trident|NET CLR)/ },
  { name: 'Presto',  detect: /Presto/ },
  { name: 'Gecko',   detect: /Gecko\// },
  { name: 'WebKit',  detect: /AppleWebKit/ },
  // ArkWeb is HarmonyOS Next's rendering engine; only present in UAs that explicitly contain the
  // token. It must come last so it overrides the WebKit entry that also matches those UAs.
  { name: 'ArkWeb',  detect: /ArkWeb/ },
] as const
