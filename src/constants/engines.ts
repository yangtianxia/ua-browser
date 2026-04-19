export interface EngineDef {
  name: string
  detect: RegExp
}

export const ENGINE_DEFS: readonly EngineDef[] = [
  { name: 'KHTML',   detect: /KHTML\// },
  { name: 'Trident', detect: /(Trident|NET CLR)/ },
  { name: 'Presto',  detect: /Presto/ },
  { name: 'Gecko',   detect: /Gecko\// },
  { name: 'WebKit',  detect: /AppleWebKit/ }
] as const
