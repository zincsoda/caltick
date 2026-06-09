import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { APP_BACKGROUND, APP_BACKGROUND_GRADIENT, applyMobileTheme } from './theme.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('theme', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
  })

  it('exports app background matching CSS --bg', () => {
    expect(APP_BACKGROUND).toBe('#0f172a')
  })

  it('exports gradient ending in app background', () => {
    expect(APP_BACKGROUND_GRADIENT).toContain(APP_BACKGROUND)
  })

  it('creates theme-color meta tag when missing', () => {
    applyMobileTheme()

    const meta = document.querySelector('meta[name="theme-color"]')
    expect(meta).not.toBeNull()
    expect(meta?.content).toBe(APP_BACKGROUND)
  })

  it('updates existing theme-color meta tag', () => {
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    meta.content = '#ffffff'
    document.head.appendChild(meta)

    applyMobileTheme()

    expect(meta.content).toBe(APP_BACKGROUND)
  })
})

describe('index.html mobile theme', () => {
  const html = readFileSync(resolve(__dirname, '../../index.html'), 'utf8')

  it('includes theme-color meta for mobile browser chrome', () => {
    expect(html).toMatch(/name="theme-color"/)
    expect(html).toContain(APP_BACKGROUND)
  })

  it('uses viewport-fit=cover for safe-area insets', () => {
    expect(html).toContain('viewport-fit=cover')
  })

  it('sets dark color scheme for mobile UI chrome', () => {
    expect(html).toMatch(/name="color-scheme"\s+content="dark"/)
  })
})

describe('App.css mobile header and footer', () => {
  const css = readFileSync(resolve(__dirname, '../App.css'), 'utf8')

  it('gives header and footer the app background on mobile', () => {
    expect(css).toMatch(/@media \(max-width: 768px\)[\s\S]*header,[\s\S]*\.footer[\s\S]*background-color: var\(--bg\)/)
  })

  it('uses app background as html fallback color', () => {
    expect(css).toMatch(/html \{[\s\S]*background-color: var\(--bg\)/)
  })
})
