const SOURCES = {
  x50: 'https://jetourchile.cl/documents/7190100/11940205/X50-Card.webp/97c09178-de06-3240-8213-f5cc446a8a80?t=1755889826966',
  dashing: 'https://jetourchile.cl/documents/7190100/11482279/JETOUR-DASHING%2B%281%29.webp/5aa70ec2-c36a-d479-b2f8-966ac95baa0a?t=1749740112196',
  x70: 'https://jetourangola.com/wp-content/uploads/2023/05/Layer-mb1-min-scaled.webp',
  'x70-plus': 'https://jetourchile.cl/documents/7190100/13275002/X70%2BPlus-Card.webp/c67533fd-ba78-f7d2-53f1-1ce64266c1ce?t=1771255199333',
  'x90-plus': 'https://jetourangola.com/wp-content/uploads/2023/04/Background4.png',
  t1: 'https://jetourchile.cl/documents/7190100/11948154/T1-Card.webp/75f3de9f-ea3e-fd4f-4a42-05e7ae5075d2?t=1756147956003',
  t2: 'https://jetourchile.cl/documents/7190100/11482279/JETOUR-T2%2B%281%29.webp/4f82898e-08d3-459b-8f48-52afb68a6486?t=1749740111919',
  't1-phev': 'https://jetourchile.cl/documents/7190100/13122985/T1PHEV-Card%2B%281%29.webp/691c15b4-cf4f-fdd5-38ca-85048c36538b?t=1769088223015',
  't2-phev': 'https://jetourchile.cl/documents/7190100/13122985/T2PHEV-Card.webp/af488f79-bfbf-f96e-d023-77055858304f?t=1769088336862'
}

const proxyUrl = source =>
  `https://images.weserv.nl/?url=${encodeURIComponent(source.replace(/^https?:\/\//, ''))}&output=webp&w=1400`

async function requestImage(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 JetourQuote/1.0',
      Accept: 'image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8'
    },
    redirect: 'follow'
  })

  if (!response.ok) {
    throw new Error(`Upstream ${response.status}`)
  }

  const contentType = response.headers.get('content-type') || 'image/webp'
  if (!contentType.startsWith('image/')) {
    throw new Error('La respuesta no es una imagen')
  }

  return {
    body: Buffer.from(await response.arrayBuffer()),
    contentType
  }
}

export default async function handler(req, res) {
  const rawSlug = Array.isArray(req.query?.slug) ? req.query.slug[0] : req.query?.slug
  const slug = String(rawSlug || '').toLowerCase()
  const source = SOURCES[slug]

  if (!source) {
    res.status(404).json({ error: 'Modelo no encontrado' })
    return
  }

  try {
    let image
    try {
      image = await requestImage(source)
    } catch {
      image = await requestImage(proxyUrl(source))
    }

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
