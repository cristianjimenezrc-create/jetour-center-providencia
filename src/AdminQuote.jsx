import { useEffect, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { modelData } from './jetourData.js'
import './admin-quote.css'

const USERS_KEY = 'jetour_quote_users_v1'
const SESSION_KEY = 'jetour_quote_session_v1'
const TYPES = ['Contado', 'Crédito inteligente', 'Crédito convencional']
const LEGAL = 'Valores, bonos, cuotas y condiciones son referenciales y están sujetos a evaluación y aprobación crediticia, disponibilidad de stock, vigencia de campañas y confirmación de la entidad financiera. No incluyen inscripción, seguros, accesorios ni otros gastos, salvo indicación expresa. Pueden modificarse sin previo aviso. Esta cotización no constituye una oferta vinculante ni una reserva de unidad.'
const ADVISORS = {
  default: { name: 'Cristián Jiménez', phone: '+56 9 4505 5463', email: 'cjimenez@guillermomorales.cl' },
  angel: { name: 'Ángel Magaña', phone: '+56 9 4464 2151', email: 'amagana@guillermomorales.cl' }
}
const FIXED_USERS = [{ name: 'amagana', pass: '123456789', advisorKey: 'angel' }]

const clean = value => String(value || '').replace(/\D/g, '')
const money = value => new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
}).format(Number(clean(value)) || 0)
const date = () => new Intl.DateTimeFormat('es-CL', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
}).format(new Date())
const payment = (type = 'Contado') => ({
  id: `${Date.now()}-${Math.random()}`,
  type,
  price: '',
  down: '',
  months: type === 'Contado' ? '' : '36',
  installment: '',
  note: type === 'Contado' ? '' : 'Valores sin seguro de cesantía'
})
const users = () => {
  const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  return [
    ...local,
    ...FIXED_USERS.filter(fixed => !local.some(user => user.name.toLowerCase() === fixed.name.toLowerCase()))
  ]
}

const blobToDataUrl = blob => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = () => reject(new Error('No fue posible procesar la imagen del vehículo.'))
  reader.readAsDataURL(blob)
})

const embedRemoteImage = async (url, signal) => {
  const response = await fetch(url, {
    mode: 'cors',
    cache: 'force-cache',
    signal
  })
  if (!response.ok) throw new Error(`No fue posible cargar la imagen (${response.status}).`)
  return blobToDataUrl(await response.blob())
}

const waitForRemoteImage = url => new Promise((resolve, reject) => {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.referrerPolicy = 'no-referrer'
  image.onload = () => resolve(url)
  image.onerror = () => reject(new Error('La imagen del modelo no está disponible.'))
  image.src = url
})

const waitForRenderedImages = async element => {
  const images = [...element.querySelectorAll('img')]
  await Promise.all(images.map(async image => {
    if (!image.complete) {
      await new Promise((resolve, reject) => {
        image.addEventListener('load', resolve, { once: true })
        image.addEventListener('error', reject, { once: true })
      })
    }
    if (typeof image.decode === 'function') {
      try { await image.decode() } catch { /* naturalWidth validates below */ }
    }
    if (!image.naturalWidth || !image.naturalHeight) {
      throw new Error('Una imagen de la cotización no terminó de cargar.')
    }
  }))
}

function Login({ done }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  const submit = event => {
    event.preventDefault()
    setError('')
    if (!name.trim() || pass.length < 6) {
      setError('Ingresa tu usuario y una contraseña de al menos 6 caracteres.')
      return
    }
    if (mode === 'setup') {
      if (users().some(user => user.name.toLowerCase() === name.trim().toLowerCase())) {
        setError('Ese usuario ya existe.')
        return
      }
      const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
      localStorage.setItem(USERS_KEY, JSON.stringify([...local, { name: name.trim(), pass, admin: true }]))
      localStorage.setItem(SESSION_KEY, name.trim())
      done(name.trim())
      return
    }
    const found = users().find(user =>
      user.name.toLowerCase() === name.trim().toLowerCase() && user.pass === pass
    )
    if (!found) {
      setError('Usuario o contraseña incorrectos.')
      return
    }
    localStorage.setItem(SESSION_KEY, found.name)
    done(found.name)
  }

  return <main className="admin-shell login-shell">
    <form className="login-card" onSubmit={submit}>
      <div className="login-brand"><strong>JETOUR</strong><span>Drive Your Future</span></div>
      <div className="login-kicker">Área privada de cotizaciones</div>
      <h1>{mode === 'setup' ? 'Crear acceso' : 'Ingreso usuario'}</h1>
      <p>Crea cotizaciones claras, comerciales y listas para enviar por WhatsApp.</p>
      <label>Usuario<input value={name} onChange={event => setName(event.target.value)} placeholder="Ej: amagana" autoComplete="username" /></label>
      <label>Contraseña<input type="password" value={pass} onChange={event => setPass(event.target.value)} placeholder="Ingresa tu contraseña" autoComplete="current-password" /></label>
      {error && <div className="form-error">{error}</div>}
      <button className="admin-primary">{mode === 'setup' ? 'Crear y continuar' : 'Ingresar al cotizador'}</button>
      <button type="button" className="text-btn" onClick={() => {
        setMode(mode === 'login' ? 'setup' : 'login')
        setError('')
      }}>{mode === 'login' ? 'Crear acceso local adicional' : 'Volver al ingreso'}</button>
    </form>
  </main>
}

function Payment({ item, change, remove }) {
  const cash = item.type === 'Contado'
  return <div className="payment-editor">
    <div className="payment-head">
      <select value={item.type} onChange={event => {
        const type = event.target.value
        change({
          ...item,
          type,
          months: type === 'Contado' ? '' : item.months || '36',
          note: type === 'Contado' ? item.note : item.note || 'Valores sin seguro de cesantía'
        })
      }}>{TYPES.map(type => <option key={type}>{type}</option>)}</select>
      <button type="button" onClick={remove}>Eliminar</button>
    </div>
    <div className="form-grid">
      <label>Precio oferta<input inputMode="numeric" value={item.price} onChange={event => change({ ...item, price: clean(event.target.value) })} placeholder="Ej: 11490000" /></label>
      {!cash && <>
        <label>Pie<input inputMode="numeric" value={item.down} onChange={event => change({ ...item, down: clean(event.target.value) })} placeholder="Ej: 2600000" /></label>
        <label>Plazo<input inputMode="numeric" value={item.months} onChange={event => change({ ...item, months: clean(event.target.value) })} placeholder="36" /></label>
        <label>Valor cuota<input inputMode="numeric" value={item.installment} onChange={event => change({ ...item, installment: clean(event.target.value) })} placeholder="Ej: 358521" /></label>
      </>}
      <label className="wide">Detalle u observación<input value={item.note} onChange={event => change({ ...item, note: event.target.value })} placeholder="Ej: valores sin seguro de cesantía" /></label>
    </div>
    {!clean(item.price) && <small className="editor-help">Esta alternativa no aparecerá hasta que ingreses un precio oferta.</small>}
  </div>
}

export default function AdminQuote() {
  const [user, setUser] = useState(() => localStorage.getItem(SESSION_KEY) || '')
  const [client, setClient] = useState('')
  const [slug, setSlug] = useState(modelData[0].slug)
  const [versionCode, setVersionCode] = useState(modelData[0].versions[0].code)
  const [benefit, setBenefit] = useState('Atención personalizada · Entrega coordinada · Acompañamiento durante todo el proceso')
  const [conditions, setConditions] = useState('')
  const [payments, setPayments] = useState([payment('Contado')])
  const [busy, setBusy] = useState(false)
  const [renderImage, setRenderImage] = useState('')
  const [imageReady, setImageReady] = useState(false)
  const [imageIssue, setImageIssue] = useState('')
  const ref = useRef(null)

  const model = useMemo(() => modelData.find(item => item.slug === slug) || modelData[0], [slug])
  const version = useMemo(() => model.versions.find(item => item.code === versionCode) || model.versions[0], [model, versionCode])
  const current = users().find(item => item.name.toLowerCase() === user.toLowerCase())
  const advisor = ADVISORS[current?.advisorKey] || ADVISORS.default
  const offers = payments.filter(item => Number(clean(item.price)) > 0)
  const listPrice = version.price
  const sourceImage = model.quoteImg || model.img
  const vehicleImage = renderImage || sourceImage

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    setRenderImage(sourceImage)
    setImageReady(false)
    setImageIssue('')

    const prepareImage = async () => {
      try {
        const embedded = await embedRemoteImage(sourceImage, controller.signal)
        if (!active) return
        setRenderImage(embedded)
        setImageReady(true)
      } catch (error) {
        if (controller.signal.aborted || !active) return
        try {
          await waitForRemoteImage(sourceImage)
          if (!active) return
          setRenderImage(sourceImage)
          setImageReady(true)
        } catch {
          if (!active) return
          setImageIssue(`No fue posible preparar la imagen del Jetour ${model.name}.`)
          setImageReady(false)
        }
      }
    }

    prepareImage()
    return () => {
      active = false
      controller.abort()
    }
  }, [sourceImage, model.name])

  const changeModel = value => {
    const next = modelData.find(item => item.slug === value) || modelData[0]
    setSlug(value)
    setVersionCode(next.versions[0].code)
  }

  const download = async () => {
    if (!client.trim()) {
      alert('Ingresa el nombre del cliente antes de descargar.')
      return
    }
    if (!offers.length) {
      alert('Ingresa al menos un precio oferta. Las alternativas vacías no se mostrarán.')
      return
    }
    if (!imageReady) {
      alert(imageIssue || 'La imagen del vehículo todavía se está preparando. Espera unos segundos e intenta nuevamente.')
      return
    }
    if (!ref.current) return

    setBusy(true)
    try {
      await waitForRenderedImages(ref.current)
      const data = await toPng(ref.current, {
        cacheBust: true,
        includeQueryParams: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      })
      const anchor = document.createElement('a')
      const file = client.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      anchor.download = `cotizacion-${file}-${model.slug}-${version.code}.png`
      anchor.href = data
      anchor.click()
    } catch (error) {
      console.error(error)
      alert('No fue posible descargar la imagen completa. Revisa tu conexión e intenta nuevamente.')
    } finally {
      setBusy(false)
    }
  }

  if (!user) return <Login done={setUser} />

  return <main className="admin-shell">
    <section className="admin-top">
      <div>
        <span>Panel privado · {advisor.name}</span>
        <h1>Cotizador comercial Jetour</h1>
        <p>Selecciona modelo y versión, completa únicamente las alternativas que quieras ofrecer y descarga una imagen lista para enviar.</p>
      </div>
      <button className="logout" onClick={() => {
        localStorage.removeItem(SESSION_KEY)
        setUser('')
      }}>Cerrar sesión</button>
    </section>

    <section className="admin-layout">
      <div className="quote-form">
        <div className="panel">
          <div className="panel-heading">
            <div><span>01</span><h2>Cliente y vehículo</h2></div>
            <b>CLIENTE PREMIUM</b>
          </div>
          <div className="form-grid">
            <label>Nombre del cliente<input value={client} onChange={event => setClient(event.target.value)} placeholder="Escribe el nombre del cliente" /></label>
            <label>Modelo<select value={slug} onChange={event => changeModel(event.target.value)}>{modelData.map(item => <option value={item.slug} key={item.slug}>Jetour {item.name}</option>)}</select></label>
            <label className="wide">Versión<select value={version.code} onChange={event => setVersionCode(event.target.value)}>{model.versions.map(item => <option value={item.code} key={item.code}>{item.name}</option>)}</select></label>
          </div>
          <div className="model-summary">
            <img key={model.slug} src={vehicleImage} alt={`Jetour ${model.name}`} crossOrigin="anonymous" referrerPolicy="no-referrer" />
            <div>
              <span>Precio lista julio 2026</span>
              <strong>{money(listPrice)}</strong>
              <small>{version.motor} · {version.hp} HP · {version.transmission} · {version.traction}</small>
              <small>{imageReady ? `Imagen del Jetour ${model.name} incluida en el PNG final.` : imageIssue || 'Preparando imagen del vehículo para la descarga…'}</small>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading compact"><div><span>02</span><h2>Alternativas de cotización</h2></div></div>
          <p className="panel-intro">Solo aparecerán en la imagen final las alternativas que tengan precio oferta.</p>
          <div className="quick-actions">{TYPES.map(type => <button type="button" key={type} onClick={() => setPayments(currentPayments => [...currentPayments, payment(type)])}>+ {type}</button>)}</div>
          {payments.map((item, index) => <Payment
            key={item.id}
            item={item}
            change={next => setPayments(all => all.map((paymentItem, paymentIndex) => paymentIndex === index ? next : paymentItem))}
            remove={() => setPayments(all => all.filter((_, paymentIndex) => paymentIndex !== index))}
          />)}
          {!payments.length && <div className="empty-editor">Agrega una alternativa para comenzar.</div>}
        </div>

        <div className="panel">
          <div className="panel-heading compact"><div><span>03</span><h2>Mensaje y condiciones</h2></div></div>
          <label>Beneficios comerciales<textarea rows="2" value={benefit} onChange={event => setBenefit(event.target.value)} /></label>
          <label>Condiciones adicionales opcionales<textarea rows="3" value={conditions} onChange={event => setConditions(event.target.value)} placeholder="Ej: oferta válida por 48 horas o hasta agotar stock." /></label>
          <div className="legal-lock"><strong>Protección comercial incluida</strong><span>La frase legal se incorpora automáticamente y no puede omitirse.</span></div>
        </div>

        <button className="admin-primary export" onClick={download} disabled={busy || !imageReady}>
          {busy ? 'Generando imagen…' : !imageReady ? 'Preparando imagen del vehículo…' : 'Descargar cotización en imagen PNG'}
        </button>
      </div>

      <div className="preview-wrap">
        <div className="preview-label"><span>Vista previa</span><b>{offers.length} alternativa(s) visible(s)</b></div>
        <div className={`quote-card image-mode-${model.imageMode || 'cutout'}`} ref={ref}>
          <header className="quote-header">
            <div className="gm-brand"><strong>GM</strong><div><b>GUILLERMO MORALES</b><small>AUTOMOTRIZ</small></div></div>
            <div className="quote-heading"><strong>COTIZACIÓN</strong><span>PERSONALIZADA</span></div>
          </header>

          <section className="quote-product" style={{ '--quote-accent': model.accent || '#b98a3a' }}>
            <div className="quote-product-copy">
              <div className="premium-pill">CLIENTE PREMIUM</div>
              <small>Propuesta preparada para</small>
              <h2>{client || 'Nombre del cliente'}</h2>
              <h1>JETOUR {model.name}</h1>
              <p>{version.name}</p>
              <div className="vehicle-meta"><span>{version.motor}</span><span>{version.hp} HP</span><span>{version.transmission}</span><span>{version.traction}</span></div>
            </div>
            <div className="quote-product-image">
              <img key={`quote-${model.slug}`} src={vehicleImage} alt={`Jetour ${model.name}`} crossOrigin="anonymous" referrerPolicy="no-referrer" />
            </div>
          </section>

          <section className="quote-content">
            <div className="quote-date-line"><span>Cotización · {date()}</span><span>Lista vigente desde julio de 2026</span></div>
            <div className="list-price-card">
              <div><small>PRECIO LISTA</small><strong>{money(listPrice)}</strong></div>
              <p>Precio oficial de referencia para la versión seleccionada. Las ofertas se completan según la forma de compra.</p>
            </div>

            <div className={`offer-grid offer-count-${Math.min(offers.length, 3)}`}>
              {offers.map((item, index) => {
                const offer = Number(clean(item.price))
                const saving = Math.max(listPrice - offer, 0)
                return <article key={item.id} className={index === 0 ? 'featured-offer' : ''}>
                  <div className="offer-top"><span>{item.type}</span>{index === 0 && <b>ALTERNATIVA DESTACADA</b>}</div>
                  <small className="offer-label">Precio oferta</small>
                  <strong>{money(offer)}</strong>
                  {saving > 0 && <div className="saving-line">Ahorro frente a precio lista: <b>{money(saving)}</b></div>}
                  {item.type !== 'Contado' && <div className="offer-data">
                    <p><b>Pie</b><span>{money(item.down)}</span></p>
                    <p><b>Plazo</b><span>{item.months || '—'} meses</span></p>
                    <p className="wide-data"><b>Valor cuota mensual</b><span>{money(item.installment)}</span></p>
                  </div>}
                  {item.note && <small className="offer-note">{item.note}</small>}
                </article>
              })}
            </div>

            {!offers.length && <div className="empty-preview">Ingresa un precio oferta para visualizar la alternativa.</div>}
            <div className="equipment-block"><div className="section-title">Equipamiento y atributos destacados</div><div className="equipment-grid">{model.features.slice(0, 6).map(feature => <span key={feature}>✓ {feature}</span>)}</div></div>
            {benefit && <div className="benefit-strip-quote">{benefit}</div>}
            {conditions && <div className="extra-conditions"><b>Condiciones adicionales</b><span>{conditions}</span></div>}
            <div className="advisor">
              <div><span>EJECUTIVO DE VENTAS</span><strong>{advisor.name}</strong><small>Sucursal Bilbao · Providencia</small><small>Av. Francisco Bilbao 1147, Providencia</small></div>
              <div className="advisor-contact"><b>{advisor.phone}</b><small>{advisor.email}</small></div>
            </div>
            <div className="legal-footer"><b>INFORMACIÓN IMPORTANTE</b><span>{LEGAL}</span></div>
          </section>
        </div>
      </div>
    </section>
  </main>
}
