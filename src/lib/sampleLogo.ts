const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="202" fill="#fff8ee"/>
  <circle cx="256" cy="256" r="190" fill="none" stroke="#3b241a" stroke-width="9"/>
  <circle cx="256" cy="256" r="172" fill="none" stroke="#3b241a" stroke-width="2" opacity="0.42"/>
  <path d="M256 112l27 82h86l-70 50 27 82-70-50-70 50 27-82-70-50h86z" fill="#3b241a"/>
  <text x="256" y="414" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="42" font-weight="600" letter-spacing="7" fill="#3b241a">DULCE</text>
</svg>`

export const DEFAULT_LOGO = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sampleSvg)}`
