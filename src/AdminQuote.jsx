import { useEffect, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { modelData } from './jetourData.js'
import './admin-quote.css'

const SESSION_KEY = 'jetour_quote_session_v1'
const DRAFT_KEY = 'jetour_quote_draft_v3'
const TYPES = ['Contado', 'Crédito inteligente', 'Crédito convencional']
const LEGAL = 'Valores, bonos, cuotas y condiciones son referenciales y están sujetos a evaluación y aprobación crediticia, disponibilidad de stock, vigencia de campañas y confirmación de la entidad financiera. No incluyen inscripción, seguros, accesorios ni otros gastos, salvo indicación expresa. Pueden modificarse sin previo aviso. Esta cotización no constituye una oferta vinculante ni una reserva de unidad.'
const ADVISORS = {
  default: { name: 'Cristián Jiménez', phone: '+56 9 4505 5463', email: 'cjimenez@guillermomorales.cl' },
  angel: { name: 'Ángel Magaña', phone: '+56 9 4464 2151', email: 'amagana@guillermomorales.cl' }
}
const FIXED_USERS = [
  { name: 'cjimenez', pass: '123456789', advisorKey: 'default' },
  { name: 'amagana', pass: '123456789', advisorKey: 'angel' }
]

const clean = value => String(value || '').replace(/\D/g, '')
const amount = value => typeof value === 'number' ? value : Number(clean(value)) || 0
const money = value => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount(value))
const today = () => new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date())
const newPayment = (type = 'Contado') => ({
  id: `${Date.now()}-${Math.random()}`,
  type,
  price: '',
  down: '',
  months: type === 'Contado' ? '' : '36',
  installment: '',
  balance: '',
  futureValue: '',
  rate: '',
  firstPayment: '',
  reserve: '',
  insurance: type === 'Contado' ? '' : 'Sin seguro de cesantía',
  note: ''
})
const getUsers = () => FIXED_USERS
const draftKey = user => `${DRAFT_KEY}:${String(user || '').toLowerCase()}`
const readDraft = user => {
  if (!user) return {}
  try { return JSON.parse(localStorage.getItem(draftKey(user)) || '{}') } catch { return {} }
}
const normalizePayments = items => Array.isArray(items) && items.length
  ? items.map(item => ({ ...newPayment(item.type), ...item, id: item.id || `${Date.now()}-${Math.random()}` }))
  : [newPayment('Contado')]
const phoneText = value => {
  const digits = clean(value)
  if (digits.length === 9) return `+56 ${digits[0]} ${digits.slice(1, 5)} ${digits.slice(5)}`
  if (digits.length === 11 && digits.startsWith('56')) return `+56 ${digits[2]} ${digits.slice(3, 7)} ${digits.slice(7)}`
  return value
}
const blobToDataUrl = blob => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = reject
  reader.readAsDataURL(blob)
})
const prepareImage = async (url, signal) => {
  const response = await fetch(url, { mode: 'cors', cache: 'force-cache', signal })
  if (!response.ok) throw new Error(`Imagen no disponible (${response.status})`)
  return blobToDataUrl(await response.blob())
}
const waitForImages = async element => {
  const images = [...element.querySelectorAll('img')]
  await Promise.all(images.map(async image => {
    if (!image.complete) await new Promise((resolve, reject) => {
      image.addEventListener('load', resolve, { once: true })
      image.addEventListener('error', reject, { once: true })
    })
    if (image.decode) try { await image.decode() } catch { /* natural size validates next */ }
    if (!image.naturalWidth) throw new Error('Una imagen no terminó de cargar.')
  }))
}

function Login({ done }) {
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const submit = event => {
    event.preventDefault()
    setError('')
    const normalized = name.trim()
    if (!normalized || pass.length < 6) return setError('Ingresa usuario y contraseña de al menos 6 caracteres.')
    const found = getUsers().find(user => user.name.toLowerCase() === normalized.toLowerCase() && user.pass === pass)
    if (!found) return setError('Usuario o contraseña incorrectos.')
    localStorage.setItem(SESSION_KEY, found.name)
    done(found.name)
  }
  return <main className="admin-shell login-shell"><form className="login-card" onSubmit={submit}>
    <div className="login-brand"><strong>JETOUR</strong><span>Drive Your Future</span></div>
    <div className="login-kicker">Área privada de cotizaciones</div>
    <h1>Ingreso usuario</h1>
    <p>Cotizaciones verificadas por modelo y versión, listas para enviar por WhatsApp.</p>
    <label>Usuario<input value={name} onChange={e => setName(e.target.value)} autoComplete="username" /></label>
    <label>Contraseña<input type="password" value={pass} onChange={e => setPass(e.target.value)} autoComplete="current-password" /></label>
    {error && <div className="form-error">{error}</div>}
    <button className="admin-primary">Ingresar al cotizador</button>
  </form></main>
}

function PaymentEditor({ item, change, remove }) {
  const cash = item.type === 'Contado'
  const smart = item.type === 'Crédito inteligente'
  return <div className="payment-editor">
    <div className="payment-head">
      <select value={item.type} onChange={e => {
        const type = e.target.value
        change({ ...item, type, months: type === 'Contado' ? '' : item.months || '36', insurance: type === 'Contado' ? '' : item.insurance || 'Sin seguro de cesantía' })
      }}>{TYPES.map(type => <option key={type}>{type}</option>)}</select>
      <button type="button" onClick={remove}>Eliminar</button>
    </div>
    <div className="form-grid">
      <label>Precio oferta<input inputMode="numeric" value={item.price} onChange={e => change({ ...item, price: clean(e.target.value) })} /></label>
      {!cash && <>
        <label>Pie<input inputMode="numeric" value={item.down} onChange={e => change({ ...item, down: clean(e.target.value) })} /></label>
        <label>Plazo en meses<input inputMode="numeric" value={item.months} onChange={e => change({ ...item, months: clean(e.target.value) })} /></label>
        <label>Valor cuota<input inputMode="numeric" value={item.installment} onChange={e => change({ ...item, installment: clean(e.target.value) })} /></label>
        <label>Saldo por documentar<input inputMode="numeric" value={item.balance} onChange={e => change({ ...item, balance: clean(e.target.value) })} /></label>
        <label>Tasa aprobada<input value={item.rate} onChange={e => change({ ...item, rate: e.target.value })} placeholder="Ej: 1,94%" /></label>
        <label>Primer vencimiento<input value={item.firstPayment} onChange={e => change({ ...item, firstPayment: e.target.value })} /></label>
        {smart && <label>Valor futuro<input inputMode="numeric" value={item.futureValue} onChange={e => change({ ...item, futureValue: clean(e.target.value) })} /></label>}
        <label>Seguro<select value={item.insurance} onChange={e => change({ ...item, insurance: e.target.value })}><option>Sin seguro de cesantía</option><option>Con seguro de cesantía</option><option>No informado</option></select></label>
      </>}
      <label>Reserva<input inputMode="numeric" value={item.reserve} onChange={e => change({ ...item, reserve: clean(e.target.value) })} /></label>
      <label className="wide">Observación<input value={item.note} onChange={e => change({ ...item, note: e.target.value })} /></label>
    </div>
    {!amount(item.price) && <small className="editor-help">La alternativa aparecerá cuando ingreses el precio oferta.</small>}
  </div>
}

export default function AdminQuote() {
  const initialUser = localStorage.getItem(SESSION_KEY) || ''
  const draft = readDraft(initialUser)
  const firstModel = modelData.find(item => item.slug === draft.slug) || modelData[0]
  const [user, setUser] = useState(initialUser)
  const [client, setClient] = useState(draft.client || '')
  const [clientPhone, setClientPhone] = useState(draft.clientPhone || '')
  const [creditHolder, setCreditHolder] = useState(draft.creditHolder || '')
  const [premium, setPremium] = useState(draft.premium ?? true)
  const [slug, setSlug] = useState(firstModel.slug)
  const [versionCode, setVersionCode] = useState(draft.versionCode || firstModel.versions[0].code)
  const [benefit, setBenefit] = useState(draft.benefit || 'Atención personalizada · Entrega coordinada · Acompañamiento durante todo el proceso')
  const [validity, setValidity] = useState(draft.validity || 'Oferta especial sujeta a stock y aprobación financiera.')
  const [conditions, setConditions] = useState(draft.conditions || '')
  const [tradeDescription, setTradeDescription] = useState(draft.tradeDescription || '')
  const [tradeValue, setTradeValue] = useState(draft.tradeValue || '')
  const [tradeDebt, setTradeDebt] = useState(draft.tradeDebt || '')
  const [extraDown, setExtraDown] = useState(draft.extraDown || '')
  const [payments, setPayments] = useState(normalizePayments(draft.payments))
  const [renderImages, setRenderImages] = useState([])
  const [imageReady, setImageReady] = useState(false)
  const [imageIssue, setImageIssue] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const quoteRef = useRef(null)

  const model = useMemo(() => modelData.find(item => item.slug === slug) || modelData[0], [slug])
  const version = useMemo(() => model.versions.find(item => item.code === versionCode) || model.versions[0], [model, versionCode])
  const advisorUser = getUsers().find(item => item.name.toLowerCase() === user.toLowerCase())
  const advisor = ADVISORS[advisorUser?.advisorKey] || ADVISORS.default
  const offers = payments.filter(item => amount(item.price) > 0)
  const incomplete = offers.filter(item => item.type !== 'Contado' && (!amount(item.down) || !amount(item.months) || !amount(item.installment)))
  const versionFeatures = version.features?.length ? version.features : model.features
  const sourceImages = [...new Set([...(version.quoteImages || []), ...(model.quoteImages || []), model.img])].slice(0, 2)
  const displayImages = renderImages.length ? renderImages : sourceImages
  const listPrice = version.price
  const tradeNet = amount(tradeValue) - amount(tradeDebt)
  const totalDown = Math.max(tradeNet, 0) + amount(extraDown)
  const hasTrade = Boolean(tradeDescription.trim() || amount(tradeValue) || amount(tradeDebt) || amount(extraDown))

  useEffect(() => {
    if (!user) return
    localStorage.setItem(draftKey(user), JSON.stringify({ client, clientPhone, creditHolder, premium, slug, versionCode, benefit, validity, conditions, tradeDescription, tradeValue, tradeDebt, extraDown, payments }))
  }, [user, client, clientPhone, creditHolder, premium, slug, versionCode, benefit, validity, conditions, tradeDescription, tradeValue, tradeDebt, extraDown, payments])

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    setRenderImages(sourceImages)
    setImageReady(false)
    setImageIssue('')
    Promise.allSettled(sourceImages.map(url => prepareImage(url, controller.signal))).then(results => {
      if (!active) return
      const prepared = results.filter(result => result.status === 'fulfilled').map(result => result.value)
      setRenderImages(prepared)
      if (prepared.length >= 2) setImageReady(true)
      else setImageIssue(`Se necesitan dos imágenes válidas del Jetour ${model.name} ${version.name} para descargar la cotización.`)
    })
    return () => { active = false; controller.abort() }
  }, [model.name, version.code])

  const changeModel = nextSlug => {
    const next = modelData.find(item => item.slug === nextSlug) || modelData[0]
    setSlug(next.slug)
    setVersionCode(next.versions[0].code)
  }
  const validate = () => {
    if (!client.trim()) { alert('Ingresa el nombre del cliente.'); return false }
    if (!offers.length) { alert('Ingresa al menos una alternativa con precio oferta.'); return false }
    if (incomplete.length) { alert('Completa pie, plazo y cuota en cada alternativa de crédito.'); return false }
    return true
  }
  const download = async () => {
    if (!validate()) return
    if (!imageReady || !quoteRef.current) return alert(imageIssue || 'Las imágenes todavía se están preparando.')
    setBusy(true)
    setStatus('')
    try {
      await waitForImages(quoteRef.current)
      const data = await toPng(quoteRef.current, { cacheBust: true, includeQueryParams: true, pixelRatio: 2, backgroundColor: '#ffffff' })
      const safe = client.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const link = document.createElement('a')
      link.download = `cotizacion-${safe}-${model.slug}-${version.code}.png`
      link.href = data
      link.click()
      setStatus('Cotización descargada correctamente.')
    } catch (error) {
      console.error(error)
      alert('No fue posible descargar la cotización completa.')
    } finally { setBusy(false) }
  }
  const whatsappText = () => {
    const lines = [`Hola ${client.trim()}, te comparto la cotización del Jetour ${model.name} ${version.name}.`, '', `Precio lista: ${money(listPrice)}`]
    offers.forEach(item => {
      lines.push('', `${item.type}: ${money(item.price)}`)
      if (item.type !== 'Contado') {
        lines.push(`Pie: ${money(item.down)}`, `Plazo: ${item.months} meses`, `Cuota: ${money(item.installment)}`)
        if (amount(item.futureValue)) lines.push(`Valor futuro: ${money(item.futureValue)}`)
        if (item.rate) lines.push(`Tasa: ${item.rate}`)
        if (item.firstPayment) lines.push(`Primer vencimiento: ${item.firstPayment}`)
      }
      if (amount(item.reserve)) lines.push(`Reserva: ${money(item.reserve)}`)
      if (item.note) lines.push(item.note)
    })
    if (hasTrade) {
      lines.push('', 'Retoma considerada:')
      if (tradeDescription) lines.push(tradeDescription)
      if (amount(tradeValue)) lines.push(`Valor toma: ${money(tradeValue)}`)
      if (amount(tradeDebt)) lines.push(`Deuda prepago: ${money(tradeDebt)}`)
      if (tradeNet > 0) lines.push(`Saldo a favor: ${money(tradeNet)}`)
      if (amount(extraDown)) lines.push(`Aporte adicional: ${money(extraDown)}`)
    }
    if (validity) lines.push('', validity)
    lines.push('', advisor.name, advisor.phone)
    return lines.join('\n')
  }
  const copySummary = async () => {
    if (!validate()) return
    try { await navigator.clipboard.writeText(whatsappText()); setStatus('Resumen copiado para WhatsApp.') } catch { alert('No se pudo copiar el resumen.') }
  }
  const openWhatsapp = () => {
    if (!validate()) return
    const digits = clean(clientPhone)
    if (digits.length < 9) return alert('Ingresa el WhatsApp del cliente.')
    window.open(`https://wa.me/${digits.startsWith('56') ? digits : `56${digits}`}?text=${encodeURIComponent(whatsappText())}`, '_blank', 'noopener,noreferrer')
  }
  const openAdvisorWhatsapp = () => {
    const digits = clean(advisor.phone)
    const message = `Hola ${advisor.name}, quiero revisar una cotización Jetour.`
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }
  const reset = () => {
    if (!window.confirm('¿Deseas iniciar una cotización nueva?')) return
    const first = modelData[0]
    setClient(''); setClientPhone(''); setCreditHolder(''); setPremium(true)
    setSlug(first.slug); setVersionCode(first.versions[0].code)
    setBenefit('Atención personalizada · Entrega coordinada · Acompañamiento durante todo el proceso')
    setValidity('Oferta especial sujeta a stock y aprobación financiera.'); setConditions('')
    setTradeDescription(''); setTradeValue(''); setTradeDebt(''); setExtraDown('')
    setPayments([newPayment('Contado')]); localStorage.removeItem(draftKey(user)); setStatus('Nueva cotización lista.')
  }

  if (!user) return <Login done={next => { setUser(next); if (Object.keys(readDraft(next)).length) window.location.reload() }} />

  const primaryImage = displayImages[0]
  const secondaryImage = displayImages[1]
  return <main className="admin-shell">
    <section className="admin-top"><div><span>Panel privado · {advisor.name}</span><h1>Cotizador comercial Jetour</h1><p>El equipamiento y los datos técnicos cambian automáticamente según la versión seleccionada.</p></div><div className="top-actions"><button className="logout" onClick={reset}>Nueva cotización</button><button className="logout" onClick={() => { localStorage.removeItem(SESSION_KEY); setUser('') }}>Cerrar sesión</button></div></section>
    <section className="admin-layout">
      <div className="quote-form">
        <div className="panel">
          <div className="panel-heading"><div><span>01</span><h2>Cliente y vehículo</h2></div><label className="premium-toggle"><input type="checkbox" checked={premium} onChange={e => setPremium(e.target.checked)} /> Cliente premium</label></div>
          <div className="form-grid">
            <label>Nombre del cliente<input value={client} onChange={e => setClient(e.target.value)} /></label>
            <label>WhatsApp<input inputMode="tel" value={clientPhone} onChange={e => setClientPhone(clean(e.target.value))} /></label>
            <label className="wide">Titular del crédito, si es distinto<input value={creditHolder} onChange={e => setCreditHolder(e.target.value)} /></label>
            <label>Modelo<select value={slug} onChange={e => changeModel(e.target.value)}>{modelData.map(item => <option key={item.slug} value={item.slug}>Jetour {item.name}</option>)}</select></label>
            <label>Versión<select value={version.code} onChange={e => setVersionCode(e.target.value)}>{model.versions.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
          </div>
          <div className="model-summary"><img src={primaryImage} alt={`Jetour ${model.name} ${version.name}`} /><div><span>Precio lista julio 2026</span><strong>{money(listPrice)}</strong><small>{version.motor} · {version.hp} HP · {version.transmission} · {version.traction}</small><small>Ficha, equipamiento e imagen verificados para esta versión.</small><a className="official-source" href={version.source} target="_blank" rel="noreferrer">Revisar fuente oficial Jetour ↗</a></div></div>
        </div>
        <div className="panel"><div className="panel-heading compact"><div><span>02</span><h2>Alternativas</h2></div></div><p className="panel-intro">Solo se muestran alternativas con precio oferta.</p><div className="quick-actions">{TYPES.map(type => <button key={type} type="button" onClick={() => setPayments(all => [...all, newPayment(type)])}>Agregar {type}</button>)}</div>{payments.map((item, index) => <PaymentEditor key={item.id} item={item} change={next => setPayments(all => all.map((row, i) => i === index ? next : row))} remove={() => setPayments(all => all.filter((_, i) => i !== index))} />)}</div>
        <div className="panel"><div className="panel-heading compact"><div><span>03</span><h2>Retoma y pie</h2></div></div><div className="form-grid"><label className="wide">Vehículo en parte de pago<input value={tradeDescription} onChange={e => setTradeDescription(e.target.value)} /></label><label>Valor toma<input inputMode="numeric" value={tradeValue} onChange={e => setTradeValue(clean(e.target.value))} /></label><label>Deuda prepago<input inputMode="numeric" value={tradeDebt} onChange={e => setTradeDebt(clean(e.target.value))} /></label><label>Aporte adicional<input inputMode="numeric" value={extraDown} onChange={e => setExtraDown(clean(e.target.value))} /></label><div className="calculated-field"><span>{tradeNet >= 0 ? 'Saldo a favor' : 'Diferencia'}</span><strong>{money(Math.abs(tradeNet))}</strong></div><div className="calculated-field wide"><span>Pie disponible</span><strong>{money(totalDown)}</strong></div></div></div>
        <div className="panel"><div className="panel-heading compact"><div><span>04</span><h2>Mensaje y condiciones</h2></div></div><label>Beneficios<textarea rows="2" value={benefit} onChange={e => setBenefit(e.target.value)} /></label><label>Condición comercial<textarea rows="2" value={validity} onChange={e => setValidity(e.target.value)} /></label><label>Condiciones adicionales<textarea rows="3" value={conditions} onChange={e => setConditions(e.target.value)} /></label><div className="legal-lock"><strong>Protección comercial incluida</strong><span>El texto legal se incorpora automáticamente.</span></div></div>
        <div className="export-actions"><button className="admin-primary export" onClick={download} disabled={busy || !imageReady}>{busy ? 'Generando imagen…' : !imageReady ? 'Preparando imágenes…' : 'Descargar cotización PNG'}</button><button className="admin-secondary" onClick={copySummary}>Copiar resumen para WhatsApp</button><button className="admin-secondary whatsapp-action" onClick={openWhatsapp}>Abrir WhatsApp del cliente</button><button className="admin-secondary" onClick={openAdvisorWhatsapp}>Mi WhatsApp · {advisor.name}</button>{status && <div className="action-status">{status}</div>}</div>
      </div>
      <div className="preview-wrap">
        <div className="preview-label"><span>Vista previa</span><b>{offers.length} alternativa(s)</b></div>
        <div className={`quote-card image-mode-${model.imageMode || 'cutout'}`} ref={quoteRef}>
          <header className="quote-header"><div className="gm-brand"><strong>GM</strong><div><b>GUILLERMO MORALES</b><small>AUTOMOTRIZ</small></div></div><div className="quote-heading"><strong>COTIZACIÓN</strong><span>PERSONALIZADA</span></div></header>
          <section className="quote-product" style={{ '--quote-accent': model.accent || '#b98a3a' }}>
            <div className="quote-product-copy">{premium && <div className="premium-pill">CLIENTE PREMIUM</div>}<small>Propuesta preparada para</small><h2>{client || 'Nombre del cliente'}</h2>{creditHolder && <div className="credit-holder">Crédito a nombre de <b>{creditHolder}</b></div>}<h1>JETOUR {model.name}</h1><p>{version.name}</p><div className="vehicle-meta"><span>Motor {version.motor}</span><span>{version.hp} HP</span><span>{version.transmission}</span><span>Tracción {version.traction}</span><span>{model.specs.Combustible}</span><span>{model.specs.Pasajeros} pasajeros</span></div></div>
            <div className="quote-product-image">
              <img src={primaryImage} alt={`${model.name} vista principal`} crossOrigin="anonymous" referrerPolicy="no-referrer" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: model.imageMode === 'photo' ? 'cover' : 'contain', transform: model.imageMode === 'photo' ? 'none' : 'scale(1.02)', filter: 'drop-shadow(0 18px 20px rgba(0,0,0,.2))' }} />
              {secondaryImage && <img src={secondaryImage} alt={`${model.name} segunda vista`} crossOrigin="anonymous" referrerPolicy="no-referrer" style={{ position: 'absolute', inset: 'auto 17px 17px auto', width: '43%', height: '35%', objectFit: 'cover', transform: 'none', filter: 'none', border: '4px solid white', borderRadius: '14px', boxShadow: '0 10px 24px rgba(0,0,0,.22)', zIndex: 4 }} />}
            </div>
          </section>
          <section className="quote-content">
            <div className="quote-date-line"><span>Cotización · {today()}</span><span>Lista vigente desde julio de 2026</span></div>
            <div className="list-price-card"><div><small>PRECIO LISTA</small><strong>{money(listPrice)}</strong></div><p>Precio de referencia correspondiente exactamente a la versión seleccionada.</p></div>
            <div className={`offer-grid offer-count-${Math.min(offers.length, 3)}`}>{offers.map((item, index) => {
              const offer = amount(item.price)
              const details = [
                item.type !== 'Contado' && amount(item.balance) ? ['Saldo por documentar', money(item.balance)] : null,
                item.type === 'Crédito inteligente' && amount(item.futureValue) ? ['Valor futuro', money(item.futureValue)] : null,
                item.type !== 'Contado' && item.rate ? ['Tasa', item.rate] : null,
                item.type !== 'Contado' && item.firstPayment ? ['Primer vencimiento', item.firstPayment] : null,
                item.type !== 'Contado' && item.insurance !== 'No informado' ? ['Seguro', item.insurance] : null,
                amount(item.reserve) ? ['Reserva', money(item.reserve)] : null
              ].filter(Boolean)
              return <article key={item.id} className={index === 0 ? 'featured-offer' : ''}><div className="offer-top"><span>{item.type}</span>{index === 0 && <b>ALTERNATIVA DESTACADA</b>}</div><small className="offer-label">Precio oferta</small><strong>{money(offer)}</strong>{listPrice > offer && <div className="saving-line">Ahorro frente a precio lista: <b>{money(listPrice - offer)}</b></div>}{item.type !== 'Contado' && <div className="offer-data"><p><b>Pie</b><span>{money(item.down)}</span></p><p><b>Plazo</b><span>{item.months} meses</span></p><p className="wide-data"><b>Valor cuota mensual</b><span>{money(item.installment)}</span></p></div>}{details.length > 0 && <div className="offer-details">{details.map(([label, value]) => <p key={label}><b>{label}</b><span>{value}</span></p>)}</div>}{item.note && <small className="offer-note">{item.note}</small>}</article>
            })}</div>
            {!offers.length && <div className="empty-preview">Ingresa un precio oferta para visualizar la alternativa.</div>}
            {hasTrade && <div className="trade-block"><div className="section-title">Retoma y composición del pie</div><div className="trade-grid">{tradeDescription && <p className="wide-trade"><b>Vehículo</b><span>{tradeDescription}</span></p>}{amount(tradeValue) > 0 && <p><b>Valor toma</b><span>{money(tradeValue)}</span></p>}{amount(tradeDebt) > 0 && <p><b>Deuda prepago</b><span>{money(tradeDebt)}</span></p>}<p><b>{tradeNet >= 0 ? 'Saldo a favor' : 'Diferencia'}</b><span>{money(Math.abs(tradeNet))}</span></p>{amount(extraDown) > 0 && <p><b>Aporte adicional</b><span>{money(extraDown)}</span></p>}{totalDown > 0 && <p className="wide-trade total-trade"><b>Pie disponible</b><span>{money(totalDown)}</span></p>}</div></div>}
            <div className="equipment-block"><div className="section-title">Equipamiento verificado para {version.name}</div><div className="equipment-grid">{versionFeatures.slice(0, 6).map(feature => <span key={feature}>{feature}</span>)}</div><small style={{ display: 'block', marginTop: 10, color: '#6a645b', fontSize: '.62rem' }}>Información técnica contrastada con la ficha oficial Jetour Chile de esta versión.</small></div>
            {benefit && <div className="benefit-strip-quote">{benefit}</div>}{validity && <div className="validity-strip"><b>CONDICIÓN COMERCIAL</b><span>{validity}</span></div>}{conditions && <div className="extra-conditions"><b>Condiciones adicionales</b><span>{conditions}</span></div>}
            <div className="advisor"><div><span>EJECUTIVO DE VENTAS</span><strong>{advisor.name}</strong><small>Sucursal Bilbao · Providencia</small><small>Av. Francisco Bilbao 1127, Providencia</small></div><div className="advisor-contact"><b>{advisor.phone}</b><small>{advisor.email}</small>{clientPhone && <small>Cliente: {phoneText(clientPhone)}</small>}</div></div>
            <div className="legal-footer"><b>INFORMACIÓN IMPORTANTE</b><span>{LEGAL}</span></div>
          </section>
        </div>
      </div>
    </section>
  </main>
}
