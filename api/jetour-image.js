const SOURCE_IDS = {
  x50: '1P34SmwIj4kbWaj2aZjf2y9n8Exo18Joo',
  dashing: '1kv6bA1q47vbOdwrCXNi9SxrrAxMjrAc8',
  x70: '19aqhpOCj21KFMl5WbrrnZxzSP-Ghvgyl',
  'x70-plus': '1AwYV7iniot1GiwbLJmdcmMq2yULRUsxm',
  'x90-plus': '1v8ryRJTBQyVbtkPSxwEFrU4IkmxmsvYj',
  t1: '19Ktl-595Fk5_6cKtbRE1mgQsaRvYaRhz',
  t2: '1Bv0eF5pewVIGcSZTY7L2RDGngxsKUuM7',
  't1-phev': '19Ktl-595Fk5_6cKtbRE1mgQsaRvYaRhz',
  't2-phev': '1Bv0eF5pewVIGcSZTY7L2RDGngxsKUuM7'
}

const urlsFor = id => [
  `https://drive.usercontent.google.com/download?id=${encodeURIComponent(id)}&export=download&confirm=t`,
  `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`
]

async function requestImage(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 JetourQuote/1.0',
      Accept: 'image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8'
    },
    redirect: 'follow'
  })

  if (!response.ok) throw new Error(`Upstream ${response.status}`)

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.startsWith('image/')) {
    throw new Error(`Respuesta no válida: ${contentType || 'sin content-type'}`)
  }

  return {
    body: Buffer.from(await response.arrayBuffer()),
    contentType
  }
}

export default async function handler(req, res) {
  const rawSlug = Array.isArray(req.query?.slug) ? req.query.slug[0] : req.query?.slug
  const slug = String(rawSlug || '').toLowerCase()
  const id = SOURCE_IDS[slug]

  if (!id) {
    res.status(404).json({ error: 'Modelo no encontrado' })
    return
  }

  try {
    let image = null
    let lastError = null

    for (const url of urlsFor(id)) {
      try {
        image = await requestImage(url)
        break
      } catch (error) {
        lastError = error
      }
    }

    if (!image) throw lastError || new Error('Imagen no disponible')

    res.setHeader('Content-Type', image.contentType)
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.status(200).send(image.body)
  } catch (error) {
    console.error('No fue posible entregar la imagen Jetour:', slug, error)
    res.status(502).json({ error: 'No fue posible cargar la imagen del vehículo' })
  }
}
