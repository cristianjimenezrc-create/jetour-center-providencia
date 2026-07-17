import { useEffect, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { modelData } from './jetourData.js'
import './admin-quote.css'

const USERS_KEY = 'jetour_quote_users_v1'
const SESSION_KEY = 'jetour_quote_session_v1'
const DRAFT_KEY = 'jetour_quote_draft_v2'
const TYPES = ['Contado', 'Crédito inteligente', 'Crédito convencional']
const LEGAL = 'Valores, bonos, cuotas y condiciones son referenciales y están sujetos a evaluación y aprobación crediticia, disponibilidad de stock, vigencia de campañas y confirmación de la entidad financiera. No incluyen inscripción, seguros, accesorios ni otros gastos, salvo indicación expresa. Pueden modificarse sin previo aviso. Esta cotización no constituye una oferta vinculante ni una reserva de unidad.'
const ADVISORS = {
  default: { name: 'Cristián Jiménez', phone: '+56 9 4505 5463', email: 'cjimenez@guillermomorales.cl' },
  angel: { name: 'Ángel Magaña', phone: '+56 9 4464 2151', email: 'amagana@guillermomorales.cl' }
}
const FIXED_USERS = [{ name: 'amagana', pass: '123456789', advisorKey: 'angel' }]

const clean = value => String(value || '').replace(/\D/g, '')
const amount = value => typeof value === 'number' ? value : Number(clean(value)) || 0
const money = value => new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
}).format(amount(value))
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
  balance: '',
  futureValue: '',
  rate: '',
  firstPayment: '',
  reserve: '',
  insurance: type === 'Contado' ? '' : 'Sin seguro de cesantía',
  note: ''
})
const users = () => {
  const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  return [
    ...local,
    ...FIXED_USERS.filter(fixed => !local.some(user => user.name.toLowerCase() === fixed.name.toLowerCase()))
  ]
}
const draftKey = user => `${DRAFT_KEY}:${String(user || '').toLowerCase()}`
const readDraft = user => {
  if (!user) return {}
  try {
    return JSON.parse(localStorage.getItem(draftKey(user)) || '{}')
  } catch {
    return {}
  }
}
const normalizePayments = items => Array.isArray(items) && items.length
  ? items.map(item => ({ ...payment(item.type), ...item, id: item.id || `${Date.now()}-${Math.random()}` }))
  : [payment('Contado')]
const displayPhone = value => {
  const digits = clean(value)
  if (digits.length === 9) return `+56 ${digits.slice(0, 1)} ${digits.slice(1, 5)} ${digits.slice(5)}`
  if (digits.length === 11 && digits.startsWith('56')) return `+${digits.slice(0, 2)} ${digits.slice(2, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`
  return value
}

const blobToDataUrl = blob => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = () => reject(new Error('No fue posible procesar la imagen del vehículo.'))
  reader.readAsDataURL(blob)
})

const embedRemoteImage = async (url, signal) => {
  const response = await fetch(url, { mode: 'cors', cache: 'force-cache', signal })
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
  const smart = item.type === 'Crédito inteligente'

  return <div className="payment-editor">
    <div className="payment-head">
      <select value={item.type} onChange={event => {
        const type = event.target.value
        change({
          ...item,
          type,
          months: type === 'Contado' ? '' : item.months || '36',
          insurance: type === 'Contado' ? '' : item.insurance || 'Sin seguro de cesantía'
        })
      }}>{TYPES.map(type => <option key={type}>{type}</option>)}</select>
      <button type="button" onClick={remove}>Eliminar</button>
    </div>
    <div className="form-grid">
      <label>Precio oferta<input inputMode="numeric" value={item.price} onChange={event => change({ ...item, price: clean(event.target.value) })} placeholder="Ej: 12490000" /></label>
      {!cash && <>
        <label>Pie<input inputMode="numeric" value={item.down} onChange={event => change({ ...item, down: clean(event.target.value) })} placeholder="Ej: 3400000" /></label>
        <label>Plazo en meses<input inputMode="numeric" value={item.months} onChange={event => change({ ...item, months: clean(event.target.value) })} placeholder="36" /></label>
        <label>Valor cuota<input inputMode="numeric" value={item.installment} onChange={event => change({ ...item, installment: clean(event.target.value) })} placeholder="Ej: 288898" /></label>
        <label>Saldo por documentar<input inputMode="numeric" value={item.balance} onChange={event => change({ ...item, balance: clean(event.target.value) })} placeholder="Opcional" /></label>
        <label>Tasa aprobada<input value={item.rate} onChange={event => change({ ...item, rate: event.target.value })} placeholder="Ej: 1,94%" /></label>
        <label>Primer vencimiento<input value={item.firstPayment} onChange={event => change({ ...item, firstPayment: event.target.value })} placeholder="Ej: 5 septiembre 2026" /></label>
        {smart && <label>Valor futuro<input inputMode="numeric" value={item.futureValue} onChange={event => change({ ...item, futureValue: clean(event.target.value) })} placeholder="Ej: 3747000" /></label>}
        <label>Seguro de cesantía<select value={item.insurance} onChange={event => change({ ...item, insurance: event.target.value })}><option>Sin seguro de cesantía</option><option>Con seguro de cesantía</option><option>No informado</option></select></label>
      </>}
      <label>Monto de reserva<input inputMode="numeric" value={item.reserve} onChange={event => change({ ...item, reserve: clean(event.target.value) })} placeholder="Ej: 200000" /></label>
      <label className="wide">Detalle u observación<input value={item.note} onChange={event => change({ ...item, note: event.target.value })} placeholder="Ej: tasa preferencial sujeta a reserva y aprobación financiera" /></label>
    </div>
    {!clean(item.price) && <small className="editor-help">Esta alternativa no aparecerá hasta que ingreses un precio oferta.</small>}
  </div>
}

export default function AdminQuote() {
  const initialUser = localStorage.getItem(SESSION_KEY) || ''
  const initialDraft = readDraft(initialUser)
  const [user, setUser] = useState(initialUser)
  const [client, setClient] = useState(initialDraft.client || '')
  const [clientPhone, setClientPhone] = useState(initialDraft.clientPhone || '')
  const [creditHolder, setCreditHolder] = useState(initialDraft.creditHolder || '')
  const [premium, setPremium] = useState(initialDraft.premium ?? true)
  const [slug, setSlug] = useState(initialDraft.slug || modelData[0].slug)
  const initialModel = modelData.find(item => item.slug === (initialDraft.slug || modelData[0].slug)) || modelData[0]
  const [versionCode, setVersionCode] = useState(initialDraft.versionCode || initialModel.versions[0].code)
  const [benefit, setBenefit] = useState(initialDraft.benefit || 'Atención personalizada · Entrega coordinada · Acompañamiento durante todo el proceso')
  const [conditions, setConditions] = useState(initialDraft.conditions || '')
  const [validity, setValidity] = useState(initialDraft.validity || 'Oferta especial sujeta a stock y aprobación financiera.')
  const [tradeDescription, setTradeDescription] = useState(initialDraft.tradeDescription || '')
  const [tradeValue, setTradeValue] = useState(initialDraft.tradeValue || '')
  const [tradeDebt, setTradeDebt] = useState(initialDraft.tradeDebt || '')
  const [extraDown, setExtraDown] = useState(initialDraft.extraDown || '')
  const [payments, setPayments] = useState(normalizePayments(initialDraft.payments))
  const [busy, setBusy] = useState(false)
  const [renderImage, setRenderImage] = useState('')
  const [imageReady, setImageReady] = useState(false)
  const [imageIssue, setImageIssue] = useState('')
  const [status, setStatus] = useState('')
  const ref = useRef(null)

  const model = useMemo(() => modelData.find(item => item.slug === slug) || modelData[0], [slug])
  const version = useMemo(() => model.versions.find(item => item.code === versionCode) || model.versions[0], [model, versionCode])
  const current = users().find(item => item.name.toLowerCase() === user.toLowerCase())
  const advisor = ADVISORS[current?.advisorKey] || ADVISORS.default
  const offers = payments.filter(item => amount(item.price) > 0)
  const incompleteOffers = offers.filter(item => item.type !== 'Contado' && (!amount(item.down) || !amount(item.months) || !amount(item.installment)))
  const listPrice = version.price
  const sourceImage = model.quoteImg || model.img
  const vehicleImage = renderImage || sourceImage
  const tradeNet = amount(tradeValue) - amount(tradeDebt)
  const totalAvailableDown = Math.max(tradeNet, 0) + amount(extraDown)
  const hasTrade = Boolean(tradeDescription.trim() || amount(tradeValue) || amount(tradeDebt) || amount(extraDown))

  useEffect(() => {
    if (!user) return
    localStorage.setItem(draftKey(user), JSON.stringify({
      client,
      clientPhone,
      creditHolder,
      premium,
      slug,
      versionCode,
      benefit,
      conditions,
      validity,
      tradeDescription,
      tradeValue,
      tradeDebt,
      extraDown,
      payments
    }))
  }, [user, client, clientPhone, creditHolder, premium, slug, versionCode, benefit, conditions, validity, tradeDescription, tradeValue, tradeDebt, extraDown, payments])

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

  const validate = () => {
    if (!client.trim()) {
      alert('Ingresa el nombre del cliente antes de continuar.')
      return false
    }
    if (!offers.length) {
      alert('Ingresa al menos un precio oferta. Las alternativas vacías no se mostrarán.')
      return false
    }
    if (incompleteOffers.length) {
      alert('Completa pie, plazo y valor cuota en todas las alternativas de crédito antes de continuar.')
      return false
    }
    return true
  }

  const download = async () => {
    if (!validate()) return
    if (!imageReady) {
      alert(imageIssue || 'La imagen del vehículo todavía se está preparando. Espera unos segundos e intenta nuevamente.')
      return
    }
    if (!ref.current) return

    setBusy(true)
    setStatus('')
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
      setStatus('Cotización descargada. Ya puedes adjuntarla en WhatsApp.')
    } catch (error) {
      console.error(error)
      alert('No fue posible descargar la imagen completa. Revisa tu conexión e intenta nuevamente.')
    } finally {
      setBusy(false)
    }
  }

  const whatsappSummary = () => {
    const lines = [
      `Hola ${client.trim()}, te comparto la cotización del Jetour ${model.name} ${version.name}.`,
      '',
      `Precio lista: ${money(listPrice)}`
    ]
    offers.forEach(item => {
      lines.push('', `${item.type}: ${money(item.price)}`)
      if (item.type !== 'Contado') {
        lines.push(`Pie: ${money(item.down)}`)
        lines.push(`Plazo: ${item.months} meses`)
        lines.push(`Cuota: ${money(item.installment)}`)
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
    lines.push('', 'Quedo atento para acompañarte durante todo el proceso.', advisor.name, advisor.phone)
    return lines.join('\n')
  }

  const copySummary = async () => {
    if (!validate()) return
    try {
      await navigator.clipboard.writeText(whatsappSummary())
      setStatus('Resumen copiado. Pégalo en la conversación del cliente.')
    } catch {
      alert('No fue posible copiar el resumen en este dispositivo.')
    }
  }

  const openWhatsapp = () => {
    if (!validate()) return
    const phone = clean(clientPhone)
    if (phone.length < 9) {
      alert('Ingresa el WhatsApp del cliente para abrir la conversación.')
      return
    }
    const normalized = phone.startsWith('56') ? phone : `56${phone}`
    window.open(`https://wa.me/${normalized}?text=${encodeURIComponent(whatsappSummary())}`, '_blank', 'noopener,noreferrer')
  }

  const resetQuote = () => {
    if (!window.confirm('¿Deseas limpiar la cotización actual?')) return
    const first = modelData[0]
    setClient('')
    setClientPhone('')
    setCreditHolder('')
    setPremium(true)
    setSlug(first.slug)
    setVersionCode(first.versions[0].code)
    setBenefit('Atención personalizada · Entrega coordinada · Acompañamiento durante todo el proceso')
    setConditions('')
    setValidity('Oferta especial sujeta a stock y aprobación financiera.')
    setTradeDescription('')
    setTradeValue('')
    setTradeDebt('')
    setExtraDown('')
    setPayments([payment('Contado')])
    setStatus('Cotización nueva lista para completar.')
    localStorage.removeItem(draftKey(user))
  }

  if (!user) return <Login done={nextUser => {
    setUser(nextUser)
    const saved = readDraft(nextUser)
    if (Object.keys(saved).length) window.location.reload()
  }} />

  return <main className="admin-shell">
    <section className="admin-top">
      <div>
        <span>Panel privado · {advisor.name}</span>
        <h1>Cotizador comercial Jetour</h1>
        <p>Completa solo los datos que quieras mostrar. El borrador se guarda automáticamente en este dispositivo.</p>
      </div>
      <div className="top-actions">
        <button className="logout" type="button" onClick={resetQuote}>Nueva cotización</button>
        <button className="logout" type="button" onClick={() => {
          localStorage.removeItem(SESSION_KEY)
          setUser('')
        }}>Cerrar sesión</button>
      </div>
    </section>

    <section className="admin-layout">
      <div className="quote-form">
        <div className="panel">
          <div className="panel-heading">
            <div><span>01</span><h2>Cliente y vehículo</h2></div>
            <label className="premium-toggle"><input type="checkbox" checked={premium} onChange={event => setPremium(event.target.checked)} /> Cliente premium</label>
          </div>
          <div className="form-grid">
            <label>Nombre del cliente<input value={client} onChange={event => setClient(event.target.value)} placeholder="Escribe el nombre del cliente" /></label>
            <label>WhatsApp del cliente<input inputMode="tel" value={clientPhone} onChange={event => setClientPhone(clean(event.target.value))} placeholder="Ej: 987654321" /></label>
            <label className="wide">Titular del crédito, si es distinto<input value={creditHolder} onChange={event => setCreditHolder(event.target.value)} placeholder="Ej: crédito a nombre de su cónyuge" /></label>
            <label>Modelo<select value={slug} onChange={event => changeModel(event.target.value)}>{modelData.map(item => <option value={item.slug} key={item.slug}>Jetour {item.name}</option>)}</select></label>
            <label>Versión<select value={version.code} onChange={event => setVersionCode(event.target.value)}>{model.versions.map(item => <option value={item.code} key={item.code}>{item.name}</option>)}</select></label>
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
          <div className="quick-actions">{TYPES.map(type => <button type="button" key={type} onClick={() => setPayments(currentPayments => [...currentPayments, payment(type)])}>Agregar {type}</button>)}</div>
          {payments.map((item, index) => <Payment
            key={item.id}
            item={item}
            change={next => setPayments(all => all.map((paymentItem, paymentIndex) => paymentIndex === index ? next : paymentItem))}
            remove={() => setPayments(all => all.filter((_, paymentIndex) => paymentIndex !== index))}
          />)}
          {!payments.length && <div className="empty-editor">Agrega una alternativa para comenzar.</div>}
        </div>

        <div className="panel">
          <div className="panel-heading compact"><div><span>03</span><h2>Retoma y composición del pie</h2></div></div>
          <p className="panel-intro">Sección opcional. El saldo a favor se calcula automáticamente.</p>
          <div className="form-grid">
            <label className="wide">Vehículo en parte de pago<input value={tradeDescription} onChange={event => setTradeDescription(event.target.value)} placeholder="Ej: SsangYong Stavic 2017" /></label>
            <label>Valor de toma<input inputMode="numeric" value={tradeValue} onChange={event => setTradeValue(clean(event.target.value))} placeholder="Ej: 8000000" /></label>
            <label>Deuda prepago<input inputMode="numeric" value={tradeDebt} onChange={event => setTradeDebt(clean(event.target.value))} placeholder="Ej: 6060000" /></label>
            <label>Aporte adicional cliente<input inputMode="numeric" value={extraDown} onChange={event => setExtraDown(clean(event.target.value))} placeholder="Ej: 660000" /></label>
            <div className="calculated-field"><span>{tradeNet >= 0 ? 'Saldo a favor' : 'Diferencia pendiente'}</span><strong>{money(Math.abs(tradeNet))}</strong></div>
            <div className="calculated-field wide"><span>Pie disponible estimado</span><strong>{money(totalAvailableDown)}</strong></div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading compact"><div><span>04</span><h2>Mensaje y condiciones</h2></div></div>
          <label>Beneficios comerciales<textarea rows="2" value={benefit} onChange={event => setBenefit(event.target.value)} /></label>
          <label>Vigencia o condición principal<textarea rows="2" value={validity} onChange={event => setValidity(event.target.value)} /></label>
          <label>Condiciones adicionales opcionales<textarea rows="3" value={conditions} onChange={event => setConditions(event.target.value)} placeholder="Ej: autorización de tasa sujeta a reserva del modelo." /></label>
          <div className="legal-lock"><strong>Protección comercial incluida</strong><span>La frase legal se incorpora automáticamente y no puede omitirse.</span></div>
        </div>

        <div className="export-actions">
          <button className="admin-primary export" onClick={download} disabled={busy || !imageReady}>
            {busy ? 'Generando imagen…' : !imageReady ? 'Preparando imagen del vehículo…' : 'Descargar cotización PNG'}
          </button>
          <button className="admin-secondary" type="button" onClick={copySummary}>Copiar resumen para WhatsApp</button>
          <button className="admin-secondary whatsapp-action" type="button" onClick={openWhatsapp}>Abrir WhatsApp del cliente</button>
          {status && <div className="action-status">{status}</div>}
        </div>
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
              {premium && <div className="premium-pill">CLIENTE PREMIUM</div>}
              <small>Propuesta preparada para</small>
              <h2>{client || 'Nombre del cliente'}</h2>
              {creditHolder && <div className="credit-holder">Crédito a nombre de <b>{creditHolder}</b></div>}
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
                const offer = amount(item.price)
                const saving = Math.max(listPrice - offer, 0)
                const details = [
                  item.type !== 'Contado' && amount(item.balance) ? ['Saldo por documentar', money(item.balance)] : null,
                  item.type === 'Crédito inteligente' && amount(item.futureValue) ? ['Valor futuro', money(item.futureValue)] : null,
                  item.type !== 'Contado' && item.rate ? ['Tasa', item.rate] : null,
                  item.type !== 'Contado' && item.firstPayment ? ['Primer vencimiento', item.firstPayment] : null,
                  item.type !== 'Contado' && item.insurance && item.insurance !== 'No informado' ? ['Seguro', item.insurance] : null,
                  amount(item.reserve) ? ['Reserva', money(item.reserve)] : null
                ].filter(Boolean)

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
                  {details.length > 0 && <div className="offer-details">{details.map(([label, value]) => <p key={label}><b>{label}</b><span>{value}</span></p>)}</div>}
                  {item.note && <small className="offer-note">{item.note}</small>}
                </article>
              })}
            </div>

            {!offers.length && <div className="empty-preview">Ingresa un precio oferta para visualizar la alternativa.</div>}

            {hasTrade && <div className="trade-block">
              <div className="section-title">Retoma y composición del pie</div>
              <div className="trade-grid">
                {tradeDescription && <p className="wide-trade"><b>Vehículo</b><span>{tradeDescription}</span></p>}
                {amount(tradeValue) > 0 && <p><b>Valor toma</b><span>{money(tradeValue)}</span></p>}
                {amount(tradeDebt) > 0 && <p><b>Deuda prepago</b><span>{money(tradeDebt)}</span></p>}
                {(amount(tradeValue) > 0 || amount(tradeDebt) > 0) && <p><b>{tradeNet >= 0 ? 'Saldo a favor' : 'Diferencia pendiente'}</b><span>{money(Math.abs(tradeNet))}</span></p>}
                {amount(extraDown) > 0 && <p><b>Aporte adicional</b><span>{money(extraDown)}</span></p>}
                {totalAvailableDown > 0 && <p className="wide-trade total-trade"><b>Pie disponible estimado</b><span>{money(totalAvailableDown)}</span></p>}
              </div>
            </div>}

            <div className="equipment-block"><div className="section-title">Equipamiento y atributos destacados</div><div className="equipment-grid">{model.features.slice(0, 6).map(feature => <span key={feature}>{feature}</span>)}</div></div>
            {benefit && <div className="benefit-strip-quote">{benefit}</div>}
            {validity && <div className="validity-strip"><b>CONDICIÓN COMERCIAL</b><span>{validity}</span></div>}
            {conditions && <div className="extra-conditions"><b>Condiciones adicionales</b><span>{conditions}</span></div>}
            <div className="advisor">
              <div><span>EJECUTIVO DE VENTAS</span><strong>{advisor.name}</strong><small>Sucursal Bilbao · Providencia</small><small>Av. Francisco Bilbao 1147, Providencia</small></div>
              <div className="advisor-contact"><b>{advisor.phone}</b><small>{advisor.email}</small>{clientPhone && <small>Cliente: {displayPhone(clientPhone)}</small>}</div>
            </div>
            <div className="legal-footer"><b>INFORMACIÓN IMPORTANTE</b><span>{LEGAL}</span></div>
          </section>
        </div>
      </div>
    </section>
  </main>
}
