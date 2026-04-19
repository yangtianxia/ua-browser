export interface DeviceDef {
  name: string
  detect: RegExp
}

export const DEVICE_DEFS: readonly DeviceDef[] = [
  { name: 'Mobile', detect: /(Mobi|iPh)/ },
  { name: 'Tablet', detect: /(Tablet|Pad)/ }
] as const
