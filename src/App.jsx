import { Link, Route, Routes } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, Car, Check, CircleDollarSign, Clock, Compass, Instagram, Mail, MapPin, Menu, Phone, Scale, ShieldCheck, Sparkles, Star, Users, WalletCards, Zap } from 'lucide-react'

const WSP = '56945055463'

const models = [
  { slug: 'x50', name: 'X50', type: 'SUV Urbano', tone: 'white', headline: 'Compacto, moderno e ideal para Santiago.', power: '1.5L / 1.5T', seats: '5', tag: 'Ciudad' },
  { slug: 'x70-plus', name: 'X70 PLUS', type: 'SUV Familiar', tone: 'graphite', headline: 'Más espacio, confort y presencia familiar.', power: '1.5T / 1.6T', seats: '7', tag: 'Familia' },
  { slug: 'dashing', name: 'DASHING', type: 'SUV Deportivo', tone: 'red', headline: 'Diseño futurista para destacar.', power: '1.5T / 1.6T', seats: '5', tag: 'Diseño' },
  { slug: 't1', name: 'T1', type: 'SUV Adventure', tone: 'green', headline: 'Robusto, outdoor y preparado para salir.', power: '1.5T / 2.0T', seats: '5', tag: 'Adventure' },
  { slug: 't2', name: 'T2', type: 'Off Road Premium', tone: 'black', headline: 'Presencia todoterreno con tecnología premium.', power: '2.0T / PHEV', seats: '5', tag: 'Premium' }
]

const benefits = [
  { title: 'Diseño', text: 'Líneas modernas, presencia premium y una identidad SUV pensada para destacar.', icon: Star },
  { title: 'Tecnología', text: 'Pantallas digitales, conectividad, cámara 360° y asistencias según versión.', icon: Zap },
  { title: 'Seguridad', text: 'Equipamiento activo y pasivo para viajar con confianza todos los días.', icon: ShieldCheck },
  { title: 'Garantía', text: 'Respaldo de marca y atención directa en Guillermo Morales Bilbao.', icon: Sparkles }
]

function wsp(message = 'Hola Cristián, quiero cotizar un Jetour y coordinar una visita a Bilbao.') {
  return `https://wa.me/${WSP}?text=${encodeURIComponent(message)}`
}

function Header() {
  return (
    <header className="nav">
      <Link className="brand" to="/">
        <strong>JETOUR</strong>
        <span>Drive Your Future</span>
      </Link>
      <nav>
        <a href="#modelos">Modelos</a>
        <a href="#comparador">Comparador</a>
        <a href="#financiamiento">Financiamiento</a>
        <a href="#test-drive">Test Drive</a>
        <a href="#contacto">Contacto</a>
      </nav>
      <div className="nav-actions">
        <a className="nav-cta" href={wsp()} target="_blank" rel="noreferrer">Cotizar ahora</a>
        <a className="wsp-mini" href={wsp()} target="_blank" rel="noreferrer"><Phone size={18}/></a>
        <button className="menu"><Menu size={22}/></button>
      </div>
    </header>
  )
}

function GeneratedSUV({ tone = 'black', label = 'T2' }) {
  return (
    <div className={`suv-scene ${tone}`}>
      <div className="sky" />
      <div className="peak peak-a" />
      <div className="peak peak-b" />
      <div className="peak peak-c" />
      <div className="dust dust-a" />
      <div className="dust dust-b" />
      <div className="vehicle">
        <div className="vehicle-roof" />
        <div className="vehicle-glass" />
        <div className="vehicle-body" />
        <div className="vehicle-grille"><span>J E T O U R</span></div>
        <div className="vehicle-light left" />
        <div className="vehicle-light right" />
        <div className="wheel front" />
        <div className="wheel rear" />
        <div className="plate">{label}</div>
      </div>
    </div>
  )
}

function ModelCard({ model, index }) {
  return (
    <motion.article className="model-card" initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.05}}>
      <GeneratedSUV tone={model.tone} label={model.name.replace(' PLUS','')} />
      <div className="model-copy">
        <p>{model.tag}</p>
        <h3>{model.name}</h3>
        <span>{model.type}</span>
        <a href={wsp(`Hola Cristián, quiero información del Jetour ${model.name}.`)} target="_blank" rel="noreferrer">Ver modelo <ArrowRight size={16}/></a>
      </div>
    </motion.article>
  )
}

function Home() {
  return (
    <main>
      <section className="hero" id="inicio">
        <GeneratedSUV tone="black" label="T2" />
        <div className="hero-overlay" />
        <motion.div className="hero-content" initial={{opacity:0,y:26}} animate={{opacity:1,y:0}} transition={{duration:.8}}>
          <p className="eyebrow">Jetour Center Providencia</p>
          <h1>Descubre la nueva generación de SUV Premium</h1>
          <p className="lead">Tecnología, diseño y seguridad para quienes buscan más que un automóvil.</p>
          <div className="hero-actions">
            <a className="btn primary" href={wsp()} target="_blank" rel="noreferrer">Cotizar ahora</a>
            <a className="btn light" href={wsp('Hola Cristián, quiero agendar un test drive Jetour.')} target="_blank" rel="noreferrer"><CalendarDays size={18}/> Agendar Test Drive</a>
          </div>
        </motion.div>
      </section>

      <section className="section white" id="modelos">
        <p className="section-kicker">Nuestra gama</p>
        <div className="model-grid">
          {models.map((model, index) => <ModelCard key={model.name} model={model} index={index}/>) }
        </div>
      </section>

      <section className="why">
        <h2>¿Por qué elegir Jetour?</h2>
        <div className="why-grid">
          {benefits.map(({title,text,icon:Icon}) => (
            <article key={title}>
              <Icon size={32}/>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cinematic">
        <div>
          <h2>Cada viaje merece un SUV diseñado para sorprender.</h2>
          <button aria-label="Ver experiencia"><ArrowRight size={24}/></button>
        </div>
      </section>

      <section className="compare-strip" id="comparador">
        <div className="compare-copy">
          <Scale size={34}/>
          <h2>¿No sabes cuál Jetour elegir?</h2>
          <p>Compara toda la gama y encuentra el SUV perfecto para ciudad, familia o aventura.</p>
          <a className="btn dark" href={wsp('Hola Cristián, quiero comparar modelos Jetour.')} target="_blank" rel="noreferrer">Comparar modelos</a>
        </div>
        <div className="lineup">
          {models.map((model) => <div key={model.name} className={`mini-car ${model.tone}`}><GeneratedSUV tone={model.tone} label={model.name.split(' ')[0]}/></div>)}
        </div>
      </section>

      <section className="finance-test" id="financiamiento">
        <div className="finance-panel">
          <p className="section-kicker left">Financiamiento hecho para ti</p>
          <div className="finance-options">
            <article><WalletCards size={34}/><h3>Crédito</h3><p>Opciones de financiamiento y evaluación según perfil.</p><strong>Hasta 84 meses</strong></article>
            <article><CircleDollarSign size={34}/><h3>Compra inteligente</h3><ul><li>Bonos</li><li>Toma tu usado</li><li>Leasing</li></ul></article>
          </div>
        </div>
        <div className="test-panel" id="test-drive">
          <div className="interior-art">
            <div className="screen"/><div className="wheel-art"/><div className="console"/>
          </div>
          <div>
            <h2>Vive la experiencia antes de decidir.</h2>
            <a className="btn light" href={wsp('Hola Cristián, quiero reservar un test drive Jetour.')} target="_blank" rel="noreferrer">Contactar asesor</a>
          </div>
        </div>
      </section>

      <section className="location" id="contacto">
        <div className="dealer-art"><GeneratedSUV tone="black" label="JETOUR" /></div>
        <div className="dealer-info">
          <h2>Guillermo Morales – Bilbao</h2>
          <p><MapPin size={18}/> Av. Francisco Bilbao 2326, Providencia, Santiago</p>
          <p><Clock size={18}/> Lunes a viernes 09:00 – 19:00 hrs · Sábado 10:00 – 14:00 hrs</p>
          <p><Phone size={18}/> +56 9 4505 5463</p>
          <p><Mail size={18}/> cristianjimenezrc@gmail.com</p>
          <a className="btn dark" href={wsp()} target="_blank" rel="noreferrer">Contactar asesor</a>
        </div>
        <div className="map-art"><span>Guillermo Morales Bilbao</span></div>
      </section>
    </main>
  )
}

function ModelPage() {
  return (
    <main className="simple-page">
      <section>
        <p className="eyebrow">Próxima sección</p>
        <h1>Modelos Jetour</h1>
        <p className="lead">El Home premium ya está listo. Las páginas internas se pueden desarrollar modelo por modelo con fotos reales cuando lleguen los autos al local.</p>
        <a className="btn primary" href={wsp()} target="_blank" rel="noreferrer">Cotizar por WhatsApp</a>
      </section>
    </main>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<ModelPage />} />
      </Routes>
      <footer>
        <div><strong>JETOUR</strong><span>Drive Your Future</span></div>
        <div><strong>GUILLERMO MORALES</strong><span>Respaldo y garantía</span></div>
        <div className="social"><Instagram size={18}/><Users size={18}/><Car size={18}/></div>
        <a href={wsp()} target="_blank" rel="noreferrer">WhatsApp</a>
      </footer>
      <a className="floating" href={wsp()} target="_blank" rel="noreferrer">WhatsApp</a>
    </>
  )
}
