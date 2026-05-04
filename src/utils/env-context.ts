import type { NavContext } from './navigator.js'
import { getNavContext } from './navigator.js'

export interface UAHighEntropyValues {
  architecture?: string
  bitness?: string
  model?: string
  platformVersion?: string
  fullVersionList?: Array<{ brand: string; version: string }>
}

export interface EnvContext extends NavContext {
  webglRenderer?: string
  webglVendor?: string
  hardwareConcurrency?: number
  deviceMemory?: number
  devicePixelRatio?: number
  pointerType?: 'coarse' | 'fine' | 'none'
  hoverCapability?: boolean
  fontProbes?: Record<string, boolean>
  highEntropyData?: UAHighEntropyValues
  windowsVersion?: string | null
}

// OS-specific system fonts used to cross-confirm UA-based OS detection.
// Only ~5 fonts; each measureText() call is < 1ms total overhead < 5ms.
const OS_FONTS = [
  '.AppleSystemUIFont',
  'Segoe UI',
  'Noto Color Emoji',
  'Ubuntu',
  'HarmonyOS Sans',
]

function probeFonts(): Record<string, boolean> {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return {}
    const TEST = 'mmmmmmmmmmlli'
    ctx.font = '72px monospace'
    const baseline = ctx.measureText(TEST).width
    const result: Record<string, boolean> = {}
    for (const font of OS_FONTS) {
      ctx.font = `72px '${font}', monospace`
      result[font] = ctx.measureText(TEST).width !== baseline
    }
    return result
  } catch {
    return {}
  }
}

function getWebGLInfo(): { renderer?: string; vendor?: string } {
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (!gl) return {}
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    if (!ext) return {}
    return {
      renderer: gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string,
      vendor: gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) as string,
    }
  } catch {
    return {}
  }
}

function getPointerType(): 'coarse' | 'fine' | 'none' | undefined {
  try {
    if (window.matchMedia('(pointer: coarse)').matches) return 'coarse'
    if (window.matchMedia('(pointer: fine)').matches) return 'fine'
    if (window.matchMedia('(pointer: none)').matches) return 'none'
  } catch {
    // matchMedia unavailable
  }
  return undefined
}

function getHoverCapability(): boolean | undefined {
  try {
    return window.matchMedia('(hover: hover)').matches
  } catch {
    return undefined
  }
}

function deriveWindowsVersion(platformVersion: string | undefined): string | null {
  if (!platformVersion) return null
  const major = parseInt(platformVersion.split('.')[0] ?? '0', 10)
  return isNaN(major) ? null : major >= 13 ? '11' : '10'
}

/**
 * Collect all available browser signals into a single EnvContext.
 * Safe to call in Node.js/SSR — missing APIs degrade gracefully.
 * Await this once at app start, then pass the result to parseUA() as `options.ctx`.
 */
export async function getEnvContext(): Promise<EnvContext> {
  const base = getNavContext()

  const ctx: EnvContext = { ...base }

  if (typeof navigator !== 'undefined') {
    ctx.hardwareConcurrency = navigator.hardwareConcurrency
    ctx.deviceMemory = navigator.deviceMemory
  }

  if (typeof window !== 'undefined') {
    ctx.devicePixelRatio = window.devicePixelRatio
    ctx.pointerType = getPointerType()
    ctx.hoverCapability = getHoverCapability()
    ctx.fontProbes = probeFonts()
    const { renderer, vendor } = getWebGLInfo()
    if (renderer !== undefined) ctx.webglRenderer = renderer
    if (vendor !== undefined) ctx.webglVendor = vendor
  }

  if (base.userAgentData) {
    try {
      const data = await base.userAgentData.getHighEntropyValues([
        'architecture', 'bitness', 'model', 'platformVersion', 'fullVersionList',
      ])
      ctx.highEntropyData = {
        architecture: data['architecture'],
        bitness: data['bitness'],
        model: data['model'],
        platformVersion: data['platformVersion'],
        fullVersionList: data['fullVersionList'] as unknown as Array<{ brand: string; version: string }>,
      }
      if (base.userAgentData.platform === 'Windows') {
        ctx.windowsVersion = deriveWindowsVersion(data['platformVersion'])
      }
    } catch {
      // High entropy values unavailable (non-Chrome, permission denied, etc.)
    }
  }

  return ctx
}
