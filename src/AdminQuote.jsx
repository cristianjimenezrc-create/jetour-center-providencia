import { useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { modelData } from './jetourData.js'
import './admin-quote.css'

const money = value =>
  '$' + String(value || '0').replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')

const clean = value => String(value || '').replace(/\D/g, '')
const USERS_KEY = 'jetour_quote_users_v1'
const SESSION_KEY = 'jetour_quote_session_v1'

const FIXED_USERS = [
  { name: 'amagana', pass: '123456789', admin: false, advisorKey: 'angel' }
]

const ADVISORS = {
  default: {
    name: 'Cristián Jiménez',
    branch: 'Guillermo Morales Bilbao · Providencia',
    phone: '+56 9 4505 5463',
    email: 'cjimenez@guillermomorales.cl'
  },
  angel: {
    name: 'Ángel Magaña',
    branch: 'Guillermo Morales Bilbao · Providencia',
    phone: 'Datos pendientes',
    email: 'Datos pendientes'
  }
}

const today = () =>
  new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date())

const readUsers = () => {
  const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  return [
    ...local,
    ...FIXED_USERS.filter(
      fixed => !local.some(user => user.name.toLowerCase() === fixed.name.toLowerCase())
    )
  ]
}

function Login({ onLogin }) {
  const [users, setUsers] = useState(readUsers)
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  const submit = event => {
    event.preventDefault()
    setError('')

    if (!name.trim() || pass.length < 6) {
      setError('Usa un nombre y una clave de al menos 6 caracteres.')
      return
    }

    if (mode === 'setup') {
      const stored = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
      const next = [...stored, { name: name.trim(), pass, admin: true }]
      localStorage.setItem(USERS_KEY, JSON.stringify(next))
      setUsers(readUsers())
      localStorage.setItem(SESSION_KEY, name.trim())
      onLogin(name.trim())
      return
    }

    const found = users.find(
      user =>
        user.name.toLowerCase() === name.trim().toLowerCase() && user.pass === pass
    )

    if (!found) {
      setError('Usuario o clave incorrectos.')
      return
    }

    localStorage.setItem(SESSION_KEY, found.name)
    onLogin(found.name)
  }

  return (
    <main className="admin-shell login-shell">
      <form className="login-card" onSubmit={submit}>
        <span>JETOUR · Área privada</span>
        <h1>{mode === 'setup' ? 'Crear acceso local' : 'Ingreso ejecutivo'}</h1>
        <p>
          {mode === 'setup'
            ? 'Configura un acceso adicional para este dispositivo.'
            : 'Ingresa para crear y descargar cotizaciones comerciales.'}
        </p>

        <label>
          Usuario
          <input
            value={name}
            onChange={event => setName(event.target.value)}
            autoComplete="username"
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={pass}
            onChange={event => setPass(event.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <button className="admin-primary">
          {mode === 'setup' ? 'Crear acceso' : 'Ingresar'}
        </button>

        <button
          type="button"
          className="text-btn"
          onClick={() => setMode(mode === 'login' ? 'setup' : 'login')}
        >
          {mode === 'login' ? 'Crear otro usuario local' : 'Volver al ingreso'}
        </button>
      </form>
    </main>
  )
}

function PaymentEditor({ item, onChange, onRemove }) {
  return (
    <div className="payment-editor">
      <div className="payment-head">
        <select
          value={item.type}
          onChange={event => onChange({ ...item, type: event.target.value })}
        >
          <option>Crédito inteligente</option>
          <option>Crédito convencional</option>
          <option>Contado</option>
        </select>
        <button onClick={onRemove} type="button">
          Eliminar
        </button>
      </div>

      <div className="form-grid">
        <label>
          Precio oferta
          <input
            inputMode="numeric"
            value={item.price}
            onChange={event => onChange({ ...item, price: clean(event.target.value) })}
          />
        </label>

        {item.type !== 'Contado' && (
          <>
            <label>
              Pie
              <input
                inputMode="numeric"
                value={item.down}
                onChange={event => onChange({ ...item, down: clean(event.target.value) })}
              />
            </label>
            <label>
              Plazo
              <input
                inputMode="numeric"
                value={item.months}
                onChange={event => onChange({ ...item, months: clean(event.target.value) })}
              />
            </label>
            <label>
              Valor cuota
              <input
                inputMode="numeric"
                value={item.installment}
                onChange={event =>
                  onChange({ ...item, installment: clean(event.target.value) })
                }
              />
            </label>
          </>
        )}

        <label className="wide">
          Detalle
          <input
            value={item.note}
            onChange={event => onChange({ ...item, note: event.target.value })}
            placeholder="Ej: valores sin seguro de cesantía"
          />
        </label>
      </div>
    </div>
  )
}

export default function AdminQuote() {
  const [user, setUser] = useState(() => localStorage.getItem(SESSION_KEY) || '')
  const [client, setClient] = useState('Cliente Premium')
  const [slug, setSlug] = useState(modelData[0].slug)
  const [version, setVersion] = useState(modelData[0].versions?.[0]?.name || '')
  const [validity, setValidity] = useState(
    'Valores, cuotas, bonos y condiciones referenciales, sujetos a evaluación crediticia, disponibilidad de stock y posibles modificaciones sin previo aviso. Esta cotización no constituye una oferta vinculante.'
  )
  const [benefit, setBenefit] = useState(
    'Atención personalizada · Entrega coordinada · Acompañamiento durante todo el proceso'
  )
  const [payments, setPayments] = useState([
    {
      id: 1,
      type: 'Crédito inteligente',
      price: '12490000',
      down: '2600000',
      months: '36',
      installment: '358521',
      note: 'Valores sin seguro de cesantía'
    }
  ])
  const [busy, setBusy] = useState(false)
  const quoteRef = useRef(null)

  const model = useMemo(
    () => modelData.find(item => item.slug === slug) || modelData[0],
    [slug]
  )

  const currentUser = readUsers().find(
    item => item.name.toLowerCase() === user.toLowerCase()
  )
  const advisor = ADVISORS[currentUser?.advisorKey] || ADVISORS.default

  const addPayment = () =>
    setPayments(current => [
      ...current,
      {
        id: Date.now(),
        type: 'Crédito convencional',
        price: '',
        down: '',
        months: '36',
        installment: '',
        note: 'Valores sin seguro de cesantía'
      }
    ])

  const exportPng = async () => {
    if (!quoteRef.current) return

    setBusy(true)
    try {
      const data = await toPng(quoteRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#08111f'
      })
      const anchor = document.createElement('a')
      anchor.download = `cotizacion-${client || 'cliente'}-${model.slug}.png`
      anchor.href = data
      anchor.click()
    } finally {
      setBusy(false)
    }
  }

  if (!user) return <Login onLogin={setUser} />

  const quoteImage = model.quoteImg || model.img
  const quoteStyle = {
    '--quote-image': `url("${quoteImage}")`,
    '--quote-accent': model.accent || '#c9a45f'
  }

  return (
    <main className="admin-shell">
      <section className="admin-top">
        <div>
          <span>Panel privado · {advisor.name}</span>
          <h1>Generador de cotizaciones</h1>
          <p>
            Completa los datos, revisa la vista previa y descarga una pieza lista para WhatsApp.
          </p>
        </div>
        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem(SESSION_KEY)
            setUser('')
          }}
        >
          Cerrar sesión
        </button>
      </section>

      <section className="admin-layout">
        <div className="quote-form">
          <div className="panel">
            <h2>Cliente y vehículo</h2>
            <div className="form-grid">
              <label>
                Nombre del cliente
                <input value={client} onChange={event => setClient(event.target.value)} />
              </label>

              <label>
                Modelo
                <select
                  value={slug}
                  onChange={event => {
                    setSlug(event.target.value)
                    const selected = modelData.find(item => item.slug === event.target.value)
                    setVersion(selected?.versions?.[0]?.name || '')
                  }}
                >
                  {modelData.map(item => (
                    <option value={item.slug} key={item.slug}>
                      Jetour {item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="wide">
                Versión
                <input value={version} onChange={event => setVersion(event.target.value)} />
              </label>
            </div>
          </div>

          <div className="panel">
            <div className="section-row">
              <h2>Formas de pago</h2>
              <button type="button" className="mini-btn" onClick={addPayment}>
                + Agregar
              </button>
            </div>

            {payments.map((payment, index) => (
              <PaymentEditor
                key={payment.id}
                item={payment}
                onChange={next =>
                  setPayments(current =>
                    current.map((item, itemIndex) => (itemIndex === index ? next : item))
                  )
                }
                onRemove={() =>
                  setPayments(current => current.filter((_, itemIndex) => itemIndex !== index))
                }
              />
            ))}
          </div>

          <div className="panel">
            <h2>Mensaje comercial</h2>
            <label>
              Beneficios
              <textarea
                value={benefit}
                onChange={event => setBenefit(event.target.value)}
                rows="2"
              />
            </label>
            <label>
              Condiciones
              <textarea
                value={validity}
                onChange={event => setValidity(event.target.value)}
                rows="4"
              />
            </label>
          </div>

          <button className="admin-primary export" onClick={exportPng} disabled={busy}>
            {busy ? 'Generando imagen…' : 'Descargar cotización PNG'}
          </button>
        </div>

        <div className="preview-wrap">
          <div className={`quote-card quote-${model.slug}`} ref={quoteRef}>
            <div className="quote-hero" style={quoteStyle}>
              <div className="quote-scene" />
              <div className="quote-brand">
                <strong>JETOUR</strong>
                <span>Drive Your Future</span>
              </div>
              <div className="premium-pill">PROPUESTA EXCLUSIVA</div>
              <img
                className="quote-vehicle"
                src={quoteImage}
                alt={`Jetour ${model.name}`}
                crossOrigin="anonymous"
              />
              <div className="hero-fade" />
              <div className="quote-date">{today()}</div>
              <div className="quote-title">
                <small>Preparada especialmente para</small>
                <h2>{client || 'Cliente'}</h2>
                <h1>JETOUR {model.name}</h1>
                <p>{version}</p>
              </div>
            </div>

            <div className="quote-body">
              <div className="commercial-intro">
                <span>Tu próximo Jetour</span>
                <strong>Elige la alternativa que mejor se adapta a ti</strong>
                <p>Una propuesta clara, transparente y preparada para facilitar tu decisión.</p>
              </div>

              <div className="offer-grid">
                {payments.map((payment, index) => (
                  <article
                    key={payment.id}
                    className={index === 0 ? 'featured-offer' : ''}
                  >
                    <div className="offer-top">
                      <span>{payment.type}</span>
                      {index === 0 && <b>RECOMENDADA</b>}
                    </div>
                    <strong>{money(payment.price)}</strong>
                    <em>Precio oferta</em>

                    {payment.type !== 'Contado' && (
                      <div className="offer-data">
                        <p>
                          <b>Pie</b>
                          {money(payment.down)}
                        </p>
                        <p>
                          <b>{payment.months || '—'} meses</b>
                          {money(payment.installment)} / mes
                        </p>
                      </div>
                    )}

                    {payment.note && <small>{payment.note}</small>}
                  </article>
                ))}
              </div>

              <div className="benefit-strip-quote">{benefit}</div>

              <div className="quote-note">
                <b>Información importante</b>
                <span>{validity}</span>
              </div>

              <div className="advisor">
                <div>
                  <span>ASESOR COMERCIAL</span>
                  <strong>{advisor.name}</strong>
                  <small>{advisor.branch}</small>
                </div>
                <div>
                  <b>{advisor.phone}</b>
                  <small>{advisor.email}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
