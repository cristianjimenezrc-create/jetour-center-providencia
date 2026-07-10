import { toBlob } from 'html-to-image'

const modelSlug = title => {
  const normalized = String(title || '')
    .toLowerCase()
    .replace('jetour', '')
    .trim()

  const map = {
    'x50': 'x50',
    'dashing': 'dashing',
    'x70': 'x70',
    'x70 plus': 'x70-plus',
    'x90 plus': 'x90-plus',
    't1': 't1',
    't2': 't2',
    't1 phev': 't1-phev',
    't2 phev': 't2-phev'
  }

  return map[normalized] || normalized.replace(/\s+/g, '-')
}

const blobToDataUrl = blob => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = reject
  reader.readAsDataURL(blob)
})

const waitForImage = image => new Promise(resolve => {
  if (image.complete && image.naturalWidth > 0) {
    resolve()
    return
  }

  const finish = () => resolve()
  image.addEventListener('load', finish, { once: true })
  image.addEventListener('error', finish, { once: true })
  setTimeout(finish, 8000)
})

const downloadQuote = async button => {
  const card = document.querySelector('.quote-card')
  if (!card) return

  const client = card.querySelector('.quote-product-copy h2')?.textContent?.trim() || ''
  if (!client || client === 'Nombre del cliente') {
    window.alert('Ingresa el nombre del cliente antes de descargar.')
    return
  }

  const offers = card.querySelectorAll('.offer-grid article')
  if (!offers.length) {
    window.alert('Ingresa al menos un precio oferta antes de descargar.')
    return
  }

  const originalText = button.textContent
  const originalDisabled = button.disabled
  button.disabled = true
  button.textContent = 'Generando imagen…'

  const vehicleImages = [...card.querySelectorAll('.quote-product-image img')]
  const originalSources = vehicleImages.map(image => image.src)

  try {
    const modelTitle = card.querySelector('.quote-product-copy h1')?.textContent || ''
    const slug = modelSlug(modelTitle)
    const imageResponse = await fetch(`/api/jetour-image?slug=${encodeURIComponent(slug)}`, {
      cache: 'no-store'
    })

    if (!imageResponse.ok) {
      throw new Error(`No fue posible cargar la imagen del vehículo (${imageResponse.status}).`)
    }

    const imageDataUrl = await blobToDataUrl(await imageResponse.blob())
    vehicleImages.forEach(image => {
      image.removeAttribute('crossorigin')
      image.src = imageDataUrl
    })
    await Promise.all(vehicleImages.map(waitForImage))

    const blob = await toBlob(card, {
      backgroundColor: '#ffffff',
      cacheBust: true,
      includeQueryParams: true,
      pixelRatio: 2,
      skipFonts: true
    })

    if (!blob) throw new Error('El navegador no pudo crear el archivo PNG.')

    const safeClient = client
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = `cotizacion-${safeClient}-${slug}.png`
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(objectUrl), 30000)
  } catch (error) {
    console.error('Error al descargar la cotización:', error)
    window.alert('No fue posible descargar la imagen. Actualiza con Ctrl + F5 e intenta nuevamente.')
  } finally {
    vehicleImages.forEach((image, index) => {
      if (originalSources[index]) image.src = originalSources[index]
    })
    button.disabled = originalDisabled
    button.textContent = originalText
  }
}

const enableDownloadButton = () => {
  const button = document.querySelector('.admin-primary.export')
  if (!button) return

  if (!button.textContent?.includes('Generando')) {
    button.disabled = false
    if (button.textContent?.includes('Preparando imagen')) {
      button.textContent = 'Descargar cotización en imagen PNG'
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('click', event => {
    const button = event.target.closest?.('.admin-primary.export')
    if (!button) return

    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
    downloadQuote(button)
  }, true)

  const observer = new MutationObserver(enableDownloadButton)
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['disabled']
  })

  window.addEventListener('DOMContentLoaded', enableDownloadButton)
  setInterval(enableDownloadButton, 1200)
}
