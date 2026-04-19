export interface DeviceDef {
  name: string
  detect: RegExp
}

export const DEVICE_DEFS: readonly DeviceDef[] = [
  { name: 'Mobile', detect: /(Mobi|iPh|480)/ },
  { name: 'Tablet', detect: /(Tablet|Pad|Nexus 7)/ }
] as const
