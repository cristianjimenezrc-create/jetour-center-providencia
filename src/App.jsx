import { Link, Route, Routes } from 'react-router-dom'
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

const models = [
  { slug: 'x50', name: 'X50', type: 'SUV Urbano', tag: 'Ciudad', img: IMG.x50, price: 12490000 },
  { slug: 'x70-plus', name: 'X70 PLUS', type: 'SUV Familiar', tag: 'Familia', img: IMG.x70, price: 20990000 },
  { slug: 'dashing', name: 'DASHING', type: 'SUV Deportivo', tag: 'Diseño', img: IMG.dashing, price: 16490000 },
  { slug: 't1', name: 'T1', type: 'SUV Adventure', tag: 'Adventure', img: IMG.t1, price: 22990000 },
  { slug: 't2', name: 'T2', type: 'SUV Off Road Premium', tag: 'Premium', img: IMG.t2, price: 29990000 }
]

const benefits = [
  { title: 'Diseño', text: 'Diseño internacional con líneas modernas.', icon: '☆' },
  { title: 'Tecnología', text: 'Pantallas panorámicas, Apple CarPlay, Android Auto, cámaras 360° y ADAS.', icon: '▣' },
  { title: 'Seguridad', text: 'Airbags, ESP, asistencias a la conducción y estructura reforzada.', icon: '◇' },
  { title: 'Garantía', text: 'Respaldo oficial y atención directa en Guillermo Morales Bilbao.', icon: '✺' }
]

function money(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value)
}

function wsp(message = 'Hola Cristián, quiero cotizar un Jetour y coordinar una visita a Bilbao.') {
  return `https://wa.me/${WSP}?text=${encodeURIComponent(message)}`
}

function Header() {
  return (
    <header className="nav">
      <Link className="brand" to="/"><strong>JETOUR</strong><span>Drive Your Future</span></Link>
      <nav>
        <a href="#modelos">Modelos</a><a href="#comparador">Comparador</a><a href="#financiamiento">Financiamiento</a><a href="#test-drive">Test Drive</a><a href="#contacto">Contacto</a>
      </nav>
      <div className="nav-actions"><a className="nav-cta" href={wsp()} target="_blank" rel="noreferrer">Cotizar ahora</a><a className="wsp-mini" href={wsp()} target="_blank" rel="noreferrer">☎</a><button className="menu" aria-label="Abrir menú">☰</button></div>
    </header>
  )
}

function ModelCard({ model, index }) {
  return (
    <motion.article className="model-card" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
      <div className="model-photo"><img src={model.img} alt={`Jetour ${model.name}`} loading="lazy" /></div>
      <div className="model-copy"><h3>{model.name}</h3><span>{model.type}</span><strong className="cash-price">Precio contado desde {money(model.price)}</strong><small>Pide a tu asesor precios especiales de financiamiento.</small><a href={wsp(`Hola Cristián, quiero información y precio especial de financiamiento para el Jetour ${model.name}.`)} target="_blank" rel="noreferrer">Ver modelo →</a></div>
    </motion.article>
  )
}

function Home() {
  return (
    <main>
      <section className="hero premium-hero" id="inicio">
        <div className="hero-bg"><img src={IMG.hero} alt="Jetour T2" /></div><div className="hero-mountains" /><div className="hero-overlay" />
        <motion.div className="hero-content" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1>Descubre la nueva generación de SUV Premium</h1><p className="lead">Tecnología, diseño y seguridad para quienes buscan más que un automóvil.</p>
          <div className="hero-actions"><a className="btn primary" href={wsp()} target="_blank" rel="noreferrer">Cotizar ahora</a><a className="btn light" href={wsp('Hola Cristián, quiero agendar un test drive Jetour.')} target="_blank" rel="noreferrer">▦ Agendar Test Drive</a></div>
        </motion.div>
      </section>

      <section className="section white" id="modelos"><p className="section-kicker">Nuestra gama</p><div className="model-grid">{models.map((model, index) => <ModelCard key={model.name} model={model} index={index} />)}</div></section>

      <section className="why"><h2>¿Por qué elegir Jetour?</h2><div className="why-grid">{benefits.map(({ title, text, icon }) => <article key={title}><div className="benefit-icon">{icon}</div><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="cinematic"><div><h2>Cada viaje merece un SUV diseñado para sorprender.</h2><button aria-label="Ver experiencia">▷</button></div></section>

      <section className="compare-strip" id="comparador"><div className="compare-copy"><div className="big-symbol">⚖</div><h2>¿No sabes cuál Jetour elegir?</h2><p>Compara toda la gama y solicita precios especiales de financiamiento con tu asesor.</p><a className="btn dark" href={wsp('Hola Cristián, quiero comparar modelos Jetour y conocer precios especiales de financiamiento.')} target="_blank" rel="noreferrer">Comparar modelos</a></div><div className="lineup">{models.map((model) => <img key={model.name} src={model.img} alt={model.name} />)}</div></section>

      <section className="finance-test" id="financiamiento"><div className="finance-panel"><p className="section-kicker left">Financiamiento hecho para ti</p><div className="finance-options"><article><div className="big-symbol">▤</div><h3>Crédito</h3><p>Hasta 48 meses</p><small>Valores referenciales. Solicita evaluación personalizada.</small></article><article><div className="big-symbol">◉</div><h3>Compra inteligente</h3><ul><li>Pie desde 20%</li><li>Toma tu usado</li><li>Precio especial por financiamiento</li></ul></article></div></div><div className="test-panel" id="test-drive"><div className="interior-art"><div className="screen" /><div className="wheel-art" /><div className="console" /></div><div><h2>Vive la experiencia antes de decidir.</h2><a className="btn light" href={wsp('Hola Cristián, quiero reservar un test drive Jetour.')} target="_blank" rel="noreferrer">Contactar asesor</a></div></div></section>

      <section className="location" id="contacto"><div className="dealer-art"><img src={IMG.t2} alt="Jetour showroom" /></div><div className="dealer-info"><h2>Guillermo Morales – Bilbao</h2><p>⌖ Av. Francisco Bilbao 2326, Providencia, Santiago</p><p>◷ Lunes a viernes 09:30 – 18:00 hrs</p><p>◷ Sábado 10:00 – 14:30 hrs</p><p>☎ +56 9 4505 5463</p><p>✉ cristianjimenezrc@gmail.com</p><a className="btn dark" href={wsp()} target="_blank" rel="noreferrer">Contactar asesor</a></div><div className="map-art"><span>Guillermo Morales Bilbao</span></div></section>
    </main>
  )
}

function ModelPage() { return <main className="simple-page"><section><p className="eyebrow">Próxima sección</p><h1>Modelos Jetour</h1><p className="lead">Las páginas internas se pueden desarrollar modelo por modelo con fotos reales, galería, ficha técnica y simulador de crédito.</p><a className="btn primary" href={wsp()} target="_blank" rel="noreferrer">Cotizar por WhatsApp</a></section></main> }

export default function App() {
  return <><Header /><Routes><Route path="/" element={<Home />} /><Route path="*" element={<ModelPage />} /></Routes><footer><div><strong>JETOUR</strong><span>Drive Your Future</span></div><div><strong>GUILLERMO MORALES</strong><span>Respaldo y garantía</span></div><div className="social"><span>IG</span><span>YT</span><span>TT</span></div><a href={wsp()} target="_blank" rel="noreferrer">WhatsApp</a></footer><a className="floating" href={wsp()} target="_blank" rel="noreferrer">WhatsApp</a></>
}
