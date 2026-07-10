import { useMemo, useRef, useState } from 'react'
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
const money = value => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(clean(value)) || 0)
const date = () => new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date())
const payment = (type = 'Contado') => ({ id: `${Date.now()}-${Math.random()}`, type, price: '', down: '', months: type === 'Contado' ? '' : '36', installment: '', note: type === 'Contado' ? '' : 'Valores sin seguro de cesantía' })
const users = () => {
  const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  return [...local, ...FIXED_USERS.filter(f => !local.some(u => u.name.toLowerCase() === f.name.toLowerCase()))]
}

function Login({ done }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const submit = event => {
    event.preventDefault(); setError('')
    if (!name.trim() || pass.length < 6) return setError('Ingresa tu usuario y una contraseña de al menos 6 caracteres.')
    if (mode === 'setup') {
      if (users().some(u => u.name.toLowerCase() === name.trim().toLowerCase())) return setError('Ese usuario ya existe.')
      const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
      localStorage.setItem(USERS_KEY, JSON.stringify([...local, { name: name.trim(), pass, admin: true }]))
      localStorage.setItem(SESSION_KEY, name.trim()); done(name.trim()); return
    }
    const found = users().find(u => u.name.toLowerCase() === name.trim().toLowerCase() && u.pass === pass)
    if (!found) return setError('Usuario o contraseña incorrectos.')
    localStorage.setItem(SESSION_KEY, found.name); done(found.name)
  }
  return <main className="admin-shell login-shell"><form className="login-card" onSubmit={submit}>
    <div className="login-brand"><strong>JETOUR</strong><span>Drive Your Future</span></div>
    <div className="login-kicker">Área privada de cotizaciones</div>
    <h1>{mode === 'setup' ? 'Crear acceso' : 'Ingreso usuario'}</h1>
    <p>Crea cotizaciones claras, comerciales y listas para enviar por WhatsApp.</p>
    <label>Usuario<input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: amagana" autoComplete="username" /></label>
    <label>Contraseña<input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Ingresa tu contraseña" autoComplete="current-password" /></label>
    {error && <div className="form-error">{error}</div>}
    <button className="admin-primary">{mode === 'setup' ? 'Crear y continuar' : 'Ingresar al cotizador'}</button>
    <button type="button" className="text-btn" onClick={() => { setMode(mode === 'login' ? 'setup' : 'login'); setError('') }}>{mode === 'login' ? 'Crear acceso local adicional' : 'Volver al ingreso'}</button>
  </form></main>
}

function Payment({ item, change, remove }) {
  const cash = item.type === 'Contado'
  return <div className="payment-editor">
    <div className="payment-head"><select value={item.type} onChange={e => { const type = e.target.value; change({ ...item, type, months: type === 'Contado' ? '' : item.months || '36', note: type === 'Contado' ? item.note : item.note || 'Valores sin seguro de cesantía' }) }}>{TYPES.map(type => <option key={type}>{type}</option>)}</select><button type="button" onClick={remove}>Eliminar</button></div>
    <div className="form-grid">
      <label>Precio oferta<input inputMode="numeric" value={item.price} onChange={e => change({ ...item, price: clean(e.target.value) })} placeholder="Ej: 11490000" /></label>
      {!cash && <><label>Pie<input inputMode="numeric" value={item.down} onChange={e => change({ ...item, down: clean(e.target.value) })} placeholder="Ej: 2600000" /></label><label>Plazo<input inputMode="numeric" value={item.months} onChange={e => change({ ...item, months: clean(e.target.value) })} placeholder="36" /></label><label>Valor cuota<input inputMode="numeric" value={item.installment} onChange={e => change({ ...item, installment: clean(e.target.value) })} placeholder="Ej: 358521" /></label></>}
      <label className="wide">Detalle u observación<input value={item.note} onChange={e => change({ ...item, note: e.target.value })} placeholder="Ej: valores sin seguro de cesantía" /></label>
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
  const ref = useRef(null)
  const model = useMemo(() => modelData.find(m => m.slug === slug) || modelData[0], [slug])
  const version = useMemo(() => model.versions.find(v => v.code === versionCode) || model.versions[0], [model, versionCode])
  const current = users().find(u => u.name.toLowerCase() === user.toLowerCase())
  const advisor = ADVISORS[current?.advisorKey] || ADVISORS.default
  const offers = payments.filter(p => Number(clean(p.price)) > 0)
  const listPrice = version.price
  const image = model.quoteImg || model.img
  const changeModel = value => { const next = modelData.find(m => m.slug === value) || modelData[0]; setSlug(value); setVersionCode(next.versions[0].code) }
  const download = async () => {
    if (!client.trim()) return alert('Ingresa el nombre del cliente antes de descargar.')
    if (!offers.length) return alert('Ingresa al menos un precio oferta. Las alternativas vacías no se mostrarán.')
    setBusy(true)
    try {
      await Promise.all([...ref.current.querySelectorAll('img')].map(img => img.complete ? Promise.resolve() : new Promise(resolve => { img.onload = resolve; img.onerror = resolve })))
      const data = await toPng(ref.current, { cacheBust: true, pixelRatio: 2, backgroundColor: '#fff' })
      const a = document.createElement('a')
      const file = client.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      a.download = `cotizacion-${file}-${model.slug}-${version.code}.png`; a.href = data; a.click()
    } catch (error) { console.error(error); alert('No fue posible descargar la imagen. Revisa tu conexión e intenta nuevamente.') } finally { setBusy(false) }
  }
  if (!user) return <Login done={setUser} />
  return <main className="admin-shell">
    <section className="admin-top"><div><span>Panel privado · {advisor.name}</span><h1>Cotizador comercial Jetour</h1><p>Selecciona modelo y versión, completa únicamente las alternativas que quieras ofrecer y descarga una imagen lista para enviar.</p></div><button className="logout" onClick={() => { localStorage.removeItem(SESSION_KEY); setUser('') }}>Cerrar sesión</button></section>
    <section className="admin-layout">
      <div className="quote-form">
        <div className="panel"><div className="panel-heading"><div><span>01</span><h2>Cliente y vehículo</h2></div><b>CLIENTE PREMIUM</b></div><div className="form-grid">
          <label>Nombre del cliente<input value={client} onChange={e => setClient(e.target.value)} placeholder="Escribe el nombre del cliente" /></label>
          <label>Modelo<select value={slug} onChange={e => changeModel(e.target.value)}>{modelData.map(m => <option value={m.slug} key={m.slug}>Jetour {m.name}</option>)}</select></label>
          <label className="wide">Versión<select value={version.code} onChange={e => setVersionCode(e.target.value)}>{model.versions.map(v => <option value={v.code} key={v.code}>{v.name}</option>)}</select></label>
        </div><div className="model-summary"><img src={image} alt={`Jetour ${model.name}`} crossOrigin="anonymous" /><div><span>Precio lista julio 2026</span><strong>{money(listPrice)}</strong><small>{version.motor} · {version.hp} HP · {version.transmission} · {version.traction}</small></div></div></div>
        <div className="panel"><div className="panel-heading compact"><div><span>02</span><h2>Alternativas de cotización</h2></div></div><p className="panel-intro">Solo aparecerán en la imagen final las alternativas que tengan precio oferta.</p><div className="quick-actions">{TYPES.map(type => <button type="button" key={type} onClick={() => setPayments(p => [...p, payment(type)])}>+ {type}</button>)}</div>
          {payments.map((item, index) => <Payment key={item.id} item={item} change={next => setPayments(all => all.map((p, i) => i === index ? next : p))} remove={() => setPayments(all => all.filter((_, i) => i !== index))} />)}
          {!payments.length && <div className="empty-editor">Agrega una alternativa para comenzar.</div>}
        </div>
        <div className="panel"><div className="panel-heading compact"><div><span>03</span><h2>Mensaje y condiciones</h2></div></div><label>Beneficios comerciales<textarea rows="2" value={benefit} onChange={e => setBenefit(e.target.value)} /></label><label>Condiciones adicionales opcionales<textarea rows="3" value={conditions} onChange={e => setConditions(e.target.value)} placeholder="Ej: oferta válida por 48 horas o hasta agotar stock." /></label><div className="legal-lock"><strong>Protección comercial incluida</strong><span>La frase legal se incorpora automáticamente y no puede omitirse.</span></div></div>
        <button className="admin-primary export" onClick={download} disabled={busy}>{busy ? 'Generando imagen…' : 'Descargar cotización en imagen PNG'}</button>
      </div>
      <div className="preview-wrap"><div className="preview-label"><span>Vista previa</span><b>{offers.length} alternativa(s) visible(s)</b></div>
        <div className={`quote-card image-mode-${model.imageMode || 'cutout'}`} ref={ref}>
          <header className="quote-header"><div className="gm-brand"><strong>GM</strong><div><b>GUILLERMO MORALES</b><small>AUTOMOTRIZ</small></div></div><div className="quote-heading"><strong>COTIZACIÓN</strong><span>PERSONALIZADA</span></div></header>
          <section className="quote-product" style={{ '--quote-accent': model.accent || '#b98a3a' }}><div className="quote-product-copy"><div className="premium-pill">CLIENTE PREMIUM</div><small>Propuesta preparada para</small><h2>{client || 'Nombre del cliente'}</h2><h1>JETOUR {model.name}</h1><p>{version.name}</p><div className="vehicle-meta"><span>{version.motor}</span><span>{version.hp} HP</span><span>{version.transmission}</span><span>{version.traction}</span></div></div><div className="quote-product-image"><img src={image} alt={`Jetour ${model.name}`} crossOrigin="anonymous" /></div></section>
          <section className="quote-content"><div className="quote-date-line"><span>Cotización · {date()}</span><span>Lista vigente desde julio de 2026</span></div><div className="list-price-card"><div><small>PRECIO LISTA</small><strong>{money(listPrice)}</strong></div><p>Precio oficial de referencia para la versión seleccionada. Las ofertas se completan según la forma de compra.</p></div>
            <div className={`offer-grid offer-count-${Math.min(offers.length, 3)}`}>{offers.map((item, index) => { const offer = Number(clean(item.price)); const saving = Math.max(listPrice - offer, 0); return <article key={item.id} className={index === 0 ? 'featured-offer' : ''}><div className="offer-top"><span>{item.type}</span>{index === 0 && <b>ALTERNATIVA DESTACADA</b>}</div><small className="offer-label">Precio oferta</small><strong>{money(offer)}</strong>{saving > 0 && <div className="saving-line">Ahorro frente a precio lista: <b>{money(saving)}</b></div>}{item.type !== 'Contado' && <div className="offer-data"><p><b>Pie</b><span>{money(item.down)}</span></p><p><b>Plazo</b><span>{item.months || '—'} meses</span></p><p className="wide-data"><b>Valor cuota mensual</b><span>{money(item.installment)}</span></p></div>}{item.note && <small className="offer-note">{item.note}</small>}</article> })}</div>
            {!offers.length && <div className="empty-preview">Ingresa un precio oferta para visualizar la alternativa.</div>}
            <div className="equipment-block"><div className="section-title">Equipamiento y atributos destacados</div><div className="equipment-grid">{model.features.slice(0, 6).map(feature => <span key={feature}>✓ {feature}</span>)}</div></div>
            {benefit && <div className="benefit-strip-quote">{benefit}</div>}{conditions && <div className="extra-conditions"><b>Condiciones adicionales</b><span>{conditions}</span></div>}
            <div className="advisor"><div><span>EJECUTIVO DE VENTAS</span><strong>{advisor.name}</strong><small>Sucursal Bilbao · Providencia</small><small>Av. Francisco Bilbao 1147, Providencia</small></div><div className="advisor-contact"><b>{advisor.phone}</b><small>{advisor.email}</small></div></div>
            <div className="legal-footer"><b>INFORMACIÓN IMPORTANTE</b><span>{LEGAL}</span></div>
          </section>
        </div>
      </div>
    </section>
  </main>
}
