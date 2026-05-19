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
  webglMaxTextureSize?: number
  webglFragPrecision?: number
  webglCompressedFormats?: {
    s3tc: boolean   // DXT/BC — desktop GPU
    pvrtc: boolean  // PowerVR — iOS only
    etc2: boolean   // GLES 3.0+ — Android mainstream
    astc: boolean   // Adreno 4xx+ / Mali Txx+ — modern mobile
  }
  hardwareConcurrency?: number
  deviceMemory?: number
  devicePixelRatio?: number
  screenWidth?: number
  screenHeight?: number
  audioSampleRate?: number
  hasVibration?: boolean
  hasDeviceMotion?: boolean
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

function getWebGLInfo(): {
  renderer?: string
  vendor?: string
  maxTextureSize?: number
  fragPrecision?: number
  compressedFormats?: { s3tc: boolean; pvrtc: boolean; etc2: boolean; astc: boolean }
} {
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (!gl) return {}
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    const result: ReturnType<typeof getWebGLInfo> = {
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE) as number,
      fragPrecision:  gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.rangeMax,
      compressedFormats: {
        s3tc:  !!gl.getExtension('WEBGL_compressed_texture_s3tc'),
        pvrtc: !!gl.getExtension('WEBGL_compressed_texture_pvrtc'),
        etc2:  !!gl.getExtension('WEBGL_compressed_texture_etc'),
        astc:  !!gl.getExtension('WEBGL_compressed_texture_astc_ldr'),
      },
    }
    if (ext) {
      result.renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string
      result.vendor   = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) as string
    }
    return result
  } catch {
    return {}
  }
}

function getAudioSampleRate(): number | undefined {
  try {
    const AC = window.AudioContext ?? (window as any).webkitAudioContext
    if (!AC) return undefined
    const ac = new AC() as AudioContext
    const rate = ac.sampleRate
    void ac.close()
    return rate
  } catch {
    return undefined
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

  const ctx: EnvContext = {
    userAgent: base.userAgent,
    platform: base.platform,
    language: base.language,
    maxTouchPoints: base.maxTouchPoints,
  }
  if (base.browserLanguage !== undefined) ctx.browserLanguage = base.browserLanguage
  if (base.mimeTypes !== undefined) ctx.mimeTypes = base.mimeTypes
  if (base.connection !== undefined) ctx.connection = base.connection
  if (base.userAgentData !== undefined) ctx.userAgentData = base.userAgentData

  if (typeof navigator !== 'undefined') {
    ctx.hardwareConcurrency = navigator.hardwareConcurrency
    ctx.deviceMemory = navigator.deviceMemory
  }

  if (typeof window !== 'undefined') {
    ctx.devicePixelRatio = window.devicePixelRatio
    ctx.screenWidth  = window.screen?.width
    ctx.screenHeight = window.screen?.height
    ctx.pointerType     = getPointerType()
    ctx.hoverCapability = getHoverCapability()
    ctx.fontProbes      = probeFonts()
    ctx.audioSampleRate = getAudioSampleRate()
    ctx.hasVibration    = 'vibrate' in navigator
    ctx.hasDeviceMotion = 'DeviceMotionEvent' in window
    const { renderer, vendor, maxTextureSize, fragPrecision, compressedFormats } = getWebGLInfo()
    if (renderer !== undefined)          ctx.webglRenderer = renderer
    if (vendor !== undefined)            ctx.webglVendor = vendor
    if (maxTextureSize !== undefined)    ctx.webglMaxTextureSize = maxTextureSize
    if (fragPrecision !== undefined)     ctx.webglFragPrecision = fragPrecision
    if (compressedFormats !== undefined) ctx.webglCompressedFormats = compressedFormats
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
