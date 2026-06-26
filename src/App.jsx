import { useMemo, useState } from 'react'
import { Link, Route, Routes, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const WSP = '56945055463'
const IMG = {
  hero: 'https://jetourchile.cl/documents/7190100/11482279/JETOUR-T2%2B%281%29.webp/4f82898e-08d3-459b-8f48-52afb68a6486?t=1749740111919',
  x50: 'https://jetourchile.cl/documents/7190100/11940205/X50-Card.webp/97c09178-de06-3240-8213-f5cc446a8a80?t=1755889826966',
  x70: 'https://jetourchile.cl/documents/7190100/13275002/X70%2BPlus-Card.webp/c67533fd-ba78-f7d2-53f1-1ce64266c1ce?t=1771255199333',
  dashing: 'https://jetourchile.cl/documents/7190100/11482279/JETOUR-DASHING%2B%281%29.webp/5aa70ec2-c36a-d479-b2f8-966ac95baa0a?t=1749740112196',
  t1: 'https://jetourchile.cl/documents/7190100/11948154/T1-Card.webp/75f3de9f-ea3e-fd4f-4a42-05e7ae5075d2?t=1756147956003',
  t2: 'https://jetourchile.cl/documents/7190100/11482279/JETOUR-T2%2B%281%29.webp/4f82898e-08d3-459b-8f48-52afb68a6486?t=1749740111919'
}

const modelData = [
  {
    slug: 'x50', name: 'X50', type: 'SUV Urbano', tag: 'Ciudad', img: IMG.x50,
    price: 12490000, desc: 'SUV urbano moderno, eficiente y muy equipado para el uso diario en ciudad.',
    specs: { motor: '1.5L / 1.5T', potencia: '145 HP', transmision: 'MT / 6DCT según versión', traccion: '4x2', combustible: 'Bencina' },
    features: ['Pantalla multimedia', 'Conectividad smartphone', 'Cámara y sensores según versión', 'Diseño juvenil', 'Excelente relación precio/equipamiento'],
    versions: [
      { code: 'BX501', name: '1.5L MT LUX', price: 12490000, motor: '1.5L', hp: 145 },
      { code: 'BX503', name: '1.5L MT LUX BICOLOR', price: 12790000, motor: '1.5L', hp: 145 },
      { code: 'BX502', name: '1.5T 6DCT TURBO LUX', price: 15490000, motor: '1.5T', hp: 145 },
      { code: 'BX504', name: '1.5T 6DCT TURBO LUX BICOLOR', price: 15790000, motor: '1.5T', hp: 145 }
    ]
  },
  {
    slug: 'dashing', name: 'DASHING', type: 'SUV Deportivo', tag: 'Diseño', img: IMG.dashing,
    price: 16490000, desc: 'SUV de diseño futurista, líneas deportivas y alto impacto visual.',
    specs: { motor: '1.5T / 1.6T GDI', potencia: '145 a 188 HP', transmision: '6MT / 6DCT / 7DCT', traccion: '4x2', combustible: 'Bencina' },
    features: ['Diseño deportivo', 'Interior tecnológico', 'Versiones Turbo', 'ADAS según versión', 'Gran presencia visual'],
    versions: [
      { code: 'BD01', name: '6MT 1.5L Turbo Special Edition FL', price: 16490000, motor: '1.5T', hp: 145 },
      { code: 'BD02', name: '1.5L 6MT Turbo Lux FL', price: 17490000, motor: '1.5T', hp: 145 },
      { code: 'BD03', name: '6DCT 1.5L Turbo Special Edition FL', price: 18490000, motor: '1.5T', hp: 145 },
      { code: 'BD04', name: '6DCT 1.5L Turbo Lux', price: 19490000, motor: '1.5T', hp: 145 },
      { code: 'BD05', name: '7DCT 1.6L Turbo GDI Limited', price: 21990000, motor: '1.6T GDI', hp: 188 }
    ]
  },
  {
    slug: 'x70-plus', name: 'X70 PLUS', type: 'SUV Familiar', tag: 'Familia', img: IMG.x70,
    price: 20990000, desc: 'SUV familiar amplio, cómodo y pensado para viajar con más espacio y seguridad.',
    specs: { motor: '1.5T / 1.6T GDI', potencia: '145 a 188 HP', transmision: '6DCT / 7DCT', traccion: '4x2', combustible: 'Bencina' },
    features: ['Gran espacio interior', 'Confort familiar', 'Pantalla multimedia', 'Motor turbo', 'Versiones de mayor equipamiento'],
    versions: [
      { code: 'BX705', name: '1.5T 6DCT FL', price: 20990000, motor: '1.5T', hp: 145 },
      { code: 'BX706', name: '1.6T GDI 7DCT LUX FL', price: 22490000, motor: '1.6T GDI', hp: 188 }
    ]
  },
  {
    slug: 't1', name: 'T1', type: 'SUV Adventure', tag: 'Adventure', img: IMG.t1,
    price: 22990000, desc: 'SUV robusto, versátil y preparado para quienes buscan una imagen outdoor.',
    specs: { motor: '1.5T / 2.0T', potencia: '167 a 241 HP', transmision: '7DCT / 8AT', traccion: '4x2 / XWD según versión', combustible: 'Bencina' },
    features: ['Estilo adventure', 'Opciones 2.0T XWD', 'Diseño robusto', 'Interior tecnológico', 'Alta presencia en ruta'],
    versions: [
      { code: 'BT101', name: '1.5T 7DCT LUXURY', price: 22990000, motor: '1.5T', hp: 167 },
      { code: 'BT103', name: '1.5T 7DCT LUXURY MATE', price: 23490000, motor: '1.5T', hp: 167 },
      { code: 'BT102', name: '2.0T 8AT XWD LIMITED', price: 26990000, motor: '2.0T', hp: 241 },
      { code: 'BT104', name: '2.0T 8AT XWD LIMITED MATE', price: 27490000, motor: '2.0T', hp: 241 }
    ]
  },
  {
    slug: 't2', name: 'T2', type: 'SUV Off Road Premium', tag: 'Premium', img: IMG.t2,
    price: 29990000, desc: 'SUV de presencia todoterreno, motor potente y diseño premium para destacar.',
    specs: { motor: '2.0T GDI', potencia: '241 HP', transmision: '7DCT', traccion: 'AWD', combustible: 'Bencina' },
    features: ['Diseño off road premium', 'AWD', 'Motor 2.0T GDI', 'Interior tecnológico', 'Alta presencia y seguridad'],
    versions: [
      { code: 'BT201', name: '2.0T GDI AWD 7DCT LIMITED', price: 29990000, motor: '2.0T GDI', hp: 241 },
      { code: 'BT202', name: '2.0T GDI AWD 7DCT LIMITED MATE', price: 30490000, motor: '2.0T GDI', hp: 241 }
    ]
  }
]

const benefits = [
  { title: 'Diseño', text: 'Diseño internacional con líneas modernas.', icon: '☆' },
  { title: 'Tecnología', text: 'Pantallas panorámicas, Apple CarPlay, Android Auto, cámaras 360° y ADAS.', icon: '▣' },
  { title: 'Seguridad', text: 'Airbags, ESP, asistencias a la conducción y estructura reforzada.', icon: '◇' },
  { title: 'Garantía', text: 'Respaldo oficial y atención directa en Guillermo Morales Bilbao.', icon: '✺' }
]

function money(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Math.round(value || 0))
}

function wsp(message = 'Hola Cristián, quiero cotizar un Jetour y coordinar una visita a Bilbao.') {
  return `https://wa.me/${WSP}?text=${encodeURIComponent(message)}`
}

function getPayment({ price, downPct, months, mode, futurePct }) {
  const down = price * downPct / 100
  const amount = Math.max(price - down, 0)
  const monthlyRate = 0.0245
  const factor = monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
  if (mode === 'smart') {
    const futureValue = price * futurePct / 100
    const presentFuture = futureValue / Math.pow(1 + monthlyRate, months)
    return Math.max((amount - presentFuture) * factor * 1.1, 0)
  }
  return amount * factor * 1.08
}

function CreditSimulator({ model = modelData[0] }) {
  const [slug, setSlug] = useState(model.slug)
  const active = modelData.find(item => item.slug === slug) || model
  const [versionIndex, setVersionIndex] = useState(0)
  const version = active.versions[Math.min(versionIndex, active.versions.length - 1)] || active.versions[0]
  const [downPct, setDownPct] = useState(25)
  const [smartMonths, setSmartMonths] = useState(36)
  const [futurePct, setFuturePct] = useState(40)
  const price = version.price
  const conventional = [24, 36, 48].map(months => ({ months, payment: getPayment({ price, downPct, months, mode: 'normal', futurePct: 0 }) }))
  const allowedFuture = smartMonths === 24 ? [50] : [30, 40]
  const realFuturePct = allowedFuture.includes(Number(futurePct)) ? Number(futurePct) : allowedFuture[0]
  const smartPayment = getPayment({ price, downPct, months: smartMonths, mode: 'smart', futurePct: realFuturePct })
  return (
    <div className="simulator-card">
      <div className="sim-head"><p className="section-kicker left">Simulador referencial</p><h2>Calcula una cuota estimada</h2><p>Valores referenciales. No incluye condiciones finales, seguros, impuestos ni aprobación crediticia. Para una cotización real, confirma con tu asesor.</p></div>
      <div className="sim-controls">
        <label>Modelo<select value={slug} onChange={e => { setSlug(e.target.value); setVersionIndex(0) }}>{modelData.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
        <label>Versión<select value={versionIndex} onChange={e => setVersionIndex(Number(e.target.value))}>{active.versions.map((item, index) => <option key={item.code} value={index}>{item.name}</option>)}</select></label>
        <label>Pie: {downPct}%<input type="range" min="20" max="50" step="5" value={downPct} onChange={e => setDownPct(Number(e.target.value))} /></label>
      </div>
      <div className="sim-summary"><span>Precio contado</span><strong>{money(price)}</strong><span>Pie estimado</span><strong>{money(price * downPct / 100)}</strong></div>
      <div className="sim-results">
        <article><h3>Crédito convencional</h3>{conventional.map(row => <div className="quote-row" key={row.months}><span>{row.months} meses</span><strong>{money(row.payment)}</strong></div>)}</article>
        <article><h3>Compra inteligente</h3><div className="inline-selects"><select value={smartMonths} onChange={e => setSmartMonths(Number(e.target.value))}><option value="24">24 meses</option><option value="36">36 meses</option><option value="48">48 meses</option></select><select value={realFuturePct} onChange={e => setFuturePct(Number(e.target.value))}>{allowedFuture.map(value => <option key={value} value={value}>VF {value}%</option>)}</select></div><div className="quote-main"><span>Cuota referencial</span><strong>{money(smartPayment)}</strong></div><small>24 meses permite VF 50%. En 36 y 48 meses permite VF 30% o 40%.</small></article>
      </div>
      <a className="btn dark" href={wsp(`Hola Cristián, quiero validar una simulación para ${active.name} ${version.name}, con ${downPct}% de pie.`)} target="_blank" rel="noreferrer">Validar con asesor</a>
    </div>
  )
}

function Header() {
  return <header className="nav"><Link className="brand" to="/"><strong>JETOUR</strong><span>Drive Your Future</span></Link><nav><a href="/#modelos">Modelos</a><a href="/#comparador">Comparador</a><a href="/#financiamiento">Financiamiento</a><a href="/#test-drive">Test Drive</a><a href="/#contacto">Contacto</a></nav><div className="nav-actions"><a className="nav-cta" href={wsp()} target="_blank" rel="noreferrer">Cotizar ahora</a><a className="wsp-mini" href={wsp()} target="_blank" rel="noreferrer">☎</a><button className="menu" aria-label="Abrir menú">☰</button></div></header>
}

function ModelCard({ model, index }) {
  return <motion.article className="model-card" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}><Link to={`/modelos/${model.slug}`}><div className="model-photo"><img src={model.img} alt={`Jetour ${model.name}`} loading="lazy" /></div><div className="model-copy"><h3>{model.name}</h3><span>{model.type}</span><strong className="cash-price">Precio contado desde {money(model.price)}</strong><small>Pide a tu asesor precios especiales de financiamiento.</small><span className="model-link">Ver modelo →</span></div></Link></motion.article>
}

function Home() {
  return <main><section className="hero premium-hero" id="inicio"><div className="hero-bg"><img src={IMG.hero} alt="Jetour T2" /></div><div className="hero-mountains" /><div className="hero-overlay" /><motion.div className="hero-content" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}><h1>Descubre la nueva generación de SUV Premium</h1><p className="lead">Tecnología, diseño y seguridad para quienes buscan más que un automóvil.</p><div className="hero-actions"><a className="btn primary" href={wsp()} target="_blank" rel="noreferrer">Cotizar ahora</a><a className="btn light" href={wsp('Hola Cristián, quiero agendar un test drive Jetour.')} target="_blank" rel="noreferrer">▦ Agendar Test Drive</a></div></motion.div></section><section className="section white" id="modelos"><p className="section-kicker">Nuestra gama</p><div className="model-grid">{modelData.map((model, index) => <ModelCard key={model.name} model={model} index={index} />)}</div></section><section className="why"><h2>¿Por qué elegir Jetour?</h2><div className="why-grid">{benefits.map(({ title, text, icon }) => <article key={title}><div className="benefit-icon">{icon}</div><h3>{title}</h3><p>{text}</p></article>)}</div></section><section className="cinematic"><div><h2>Cada viaje merece un SUV diseñado para sorprender.</h2><button aria-label="Ver experiencia">▷</button></div></section><section className="compare-strip" id="comparador"><div className="compare-copy"><div className="big-symbol">⚖</div><h2>¿No sabes cuál Jetour elegir?</h2><p>Compara toda la gama y solicita precios especiales de financiamiento con tu asesor.</p><a className="btn dark" href={wsp('Hola Cristián, quiero comparar modelos Jetour y conocer precios especiales de financiamiento.')} target="_blank" rel="noreferrer">Comparar modelos</a></div><div className="lineup">{modelData.map(model => <img key={model.name} src={model.img} alt={model.name} />)}</div></section><section className="finance-test" id="financiamiento"><div className="finance-panel"><p className="section-kicker left">Financiamiento hecho para ti</p><div className="finance-options"><article><div className="big-symbol">▤</div><h3>Crédito</h3><p>Hasta 48 meses</p><small>Valores referenciales. Solicita evaluación personalizada.</small></article><article><div className="big-symbol">◉</div><h3>Compra inteligente</h3><ul><li>Pie desde 20%</li><li>Toma tu usado</li><li>Precio especial por financiamiento</li></ul></article></div></div><div className="test-panel" id="test-drive"><div className="interior-art"><div className="screen" /><div className="wheel-art" /><div className="console" /></div><div><h2>Vive la experiencia antes de decidir.</h2><a className="btn light" href={wsp('Hola Cristián, quiero reservar un test drive Jetour.')} target="_blank" rel="noreferrer">Contactar asesor</a></div></div></section><section className="credit-section"><CreditSimulator /></section><section className="location" id="contacto"><div className="dealer-art"><img src={IMG.t2} alt="Jetour showroom" /></div><div className="dealer-info"><h2>Guillermo Morales – Bilbao</h2><p>⌖ Av. Francisco Bilbao 2326, Providencia, Santiago</p><p>◷ Lunes a viernes 09:30 – 18:00 hrs</p><p>◷ Sábado 10:00 – 14:30 hrs</p><p>☎ +56 9 4505 5463</p><p>✉ cristianjimenezrc@gmail.com</p><a className="btn dark" href={wsp()} target="_blank" rel="noreferrer">Contactar asesor</a></div><div className="map-art"><span>Guillermo Morales Bilbao</span></div></section></main>
}

function ModelPage() {
  const { slug } = useParams()
  const model = modelData.find(item => item.slug === slug) || modelData[0]
  const gallery = [model.img, model.img, IMG.hero]
  return <main className="model-page"><section className="model-hero"><div><p className="eyebrow dark">Jetour {model.tag}</p><h1>{model.name}</h1><p>{model.desc}</p><strong>Precio contado desde {money(model.price)}</strong><div className="hero-actions"><a className="btn dark" href={wsp(`Hola Cristián, quiero cotizar el Jetour ${model.name}.`)} target="_blank" rel="noreferrer">Cotizar este modelo</a><a className="btn outline" href={wsp(`Hola Cristián, quiero agendar test drive del Jetour ${model.name}.`)} target="_blank" rel="noreferrer">Agendar test drive</a></div></div><img src={model.img} alt={model.name} /></section><section className="model-content"><div className="gallery"><h2>Galería</h2><div>{gallery.map((img, i) => <figure key={i}><img src={img} alt={`${model.name} imagen ${i + 1}`} /><figcaption>{i === 0 ? 'Exterior' : i === 1 ? 'Diseño' : 'Experiencia Jetour'}</figcaption></figure>)}</div></div><div className="tech-sheet"><h2>Ficha técnica resumida</h2><dl>{Object.entries(model.specs).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl><h3>Equipamiento destacado</h3><ul>{model.features.map(item => <li key={item}>{item}</li>)}</ul></div></section><section className="versions"><h2>Versiones y precio contado</h2><div className="version-table">{model.versions.map(version => <article key={version.code}><strong>{version.name}</strong><span>{version.code}</span><span>{version.motor} · {version.hp} HP</span><b>{money(version.price)}</b></article>)}</div><p>Pide a tu asesor precios especiales de financiamiento.</p></section><section className="credit-section"><CreditSimulator model={model} /></section></main>
}

export default function App() {
  return <><Header /><Routes><Route path="/" element={<Home />} /><Route path="/modelos/:slug" element={<ModelPage />} /></Routes><footer><div><strong>JETOUR</strong><span>Drive Your Future</span></div><div><strong>GUILLERMO MORALES</strong><span>Respaldo y garantía</span></div><div className="social"><span>IG</span><span>YT</span><span>TT</span></div><a href={wsp()} target="_blank" rel="noreferrer">WhatsApp</a></footer><a className="floating" href={wsp()} target="_blank" rel="noreferrer">WhatsApp</a></>
}
