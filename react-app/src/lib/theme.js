export const APP_BACKGROUND = '#0f172a'

export const APP_BACKGROUND_GRADIENT =
  'radial-gradient(1200px 800px at 80% -10%, #1f2937 0%, #0f172a 50%)'

export function applyMobileTheme() {
  let meta = document.querySelector('meta[name="theme-color"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.appendChild(meta)
  }
  meta.content = APP_BACKGROUND
}
