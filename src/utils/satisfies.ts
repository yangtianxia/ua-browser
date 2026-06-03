import type { EnvOption } from '../types.js'

/**
 * Returns true if every key in `criteria` matches the corresponding value in `info`.
 *
 * @example
 * satisfies(info, { os: 'iOS', device: 'Mobile' })
 */
export function satisfies(info: EnvOption, criteria: Partial<EnvOption>): boolean {
  return (Object.keys(criteria) as (keyof EnvOption)[])
    .every(key => info[key] === criteria[key])
}
