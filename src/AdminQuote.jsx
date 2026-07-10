import {useMemo,useRef,useState} from 'react'
import {toPng} from 'html-to-image'
import {modelData} from './jetourData.js'
import './admin-quote.css'

const money=v=>'$'+String(v||'0').replace(/\D/g,'').replace(/\B(?=(\d{3})+(?!\d))/g,'.')
const clean=v=>String(v||'').replace(/\D/g,'')
const USERS_KEY='jetour_quote_users_v1'
const SESSION_KEY='jetour_quote_session_v1'

function Login({onLogin}){
  const [users,setUsers]=useState(()=>JSON.parse(localStorage.getItem(USERS_KEY)||'[]'))
  const [mode,setMode]=useState(users.length?'login':'setup')
  const [name,setName]=useState('')
  const [pass,setPass]=useState('')
  const [error,setError]=useState('')
  const submit=e=>{e.preventDefault();setError('');if(!name.trim()||pass.length<6){setError('Usa un nombre y una clave de al menos 6 caracteres.');return}
    if(mode==='setup'){const next=[{name:name.trim(),pass,admin:true}];localStorage.setItem(USERS_KEY,JSON.stringify(next));setUsers(next);localStorage.setItem(SESSION_KEY,name.trim());onLogin(name.trim());return}
    const found=users.find(u=>u.name.toLowerCase()===name.trim().toLowerCase()&&u.pass===pass);if(!found){setError('Usuario o clave incorrectos.');return}localStorage.setItem(SESSION_KEY,found.name);onLogin(found.name)}
  return <main className="admin-shell login-shell"><form className="login-card" onSubmit={submit}><span>JETOUR · Área privada</span><h1>{mode==='setup'?'Crear administrador':'Ingreso ejecutivo'}</h1><p>{mode==='setup'?'Configura el primer usuario de este dispositivo.':'Ingresa para crear cotizaciones comerciales.'}</p><label>Usuario<input value={name} onChange={e=>setName(e.target.value)} autoComplete="username"/></label><label>Contraseña<input type="password" value={pass} onChange={e=>setPass(e.target.value)} autoComplete="current-password"/></label>{error&&<div className="form-error">{error}</div>}<button className="admin-primary">{mode==='setup'?'Crear acceso':'Ingresar'}</button>{users.length>0&&<button type="button" className="text-btn" onClick={()=>setMode(mode==='login'?'setup':'login')}>{mode==='login'?'Crear otro usuario local':'Volver al ingreso'}</button>}</form></main>
}

function PaymentEditor({item,onChange,onRemove}){return <div className="payment-editor"><div className="payment-head"><select value={item.type} onChange={e=>onChange({...item,type:e.target.value})}><option>Crédito inteligente</option><option>Crédito convencional</option><option>Contado</option></select><button onClick={onRemove} type="button">Eliminar</button></div><div className="form-grid"><label>Precio oferta<input inputMode="numeric" value={item.price} onChange={e=>onChange({...item,price:clean(e.target.value)})}/></label>{item.type!=='Contado'&&<><label>Pie<input inputMode="numeric" value={item.down} onChange={e=>onChange({...item,down:clean(e.target.value)})}/></label><label>Plazo<input inputMode="numeric" value={item.months} onChange={e=>onChange({...item,months:clean(e.target.value)})}/></label><label>Valor cuota<input inputMode="numeric" value={item.installment} onChange={e=>onChange({...item,installment:clean(e.target.value)})}/></label></>}<label className="wide">Detalle<input value={item.note} onChange={e=>onChange({...item,note:e.target.value})} placeholder="Ej: sin seguro de cesantía"/></label></div></div>}

export default function AdminQuote(){
 const [user,setUser]=useState(()=>localStorage.getItem(SESSION_KEY)||'')
 const [client,setClient]=useState('Cliente Premium')
 const [slug,setSlug]=useState(modelData[0].slug)
 const [version,setVersion]=useState(modelData[0].versions?.[0]?.name||'')
 const [validity,setValidity]=useState('Oferta sujeta a evaluación crediticia y disponibilidad de stock.')
 const [payments,setPayments]=useState([{id:1,type:'Crédito inteligente',price:'12490000',down:'2600000',months:'36',installment:'358521',note:'Valores sin seguro de cesantía'}])
 const [busy,setBusy]=useState(false)
 const quoteRef=useRef(null)
 const model=useMemo(()=>modelData.find(m=>m.slug===slug)||modelData[0],[slug])
 const addPayment=()=>setPayments(p=>[...p,{id:Date.now(),type:'Crédito convencional',price:'',down:'',months:'36',installment:'',note:'Valores sin seguro de cesantía'}])
 const exportPng=async()=>{if(!quoteRef.current)return;setBusy(true);try{const data=await toPng(quoteRef.current,{cacheBust:true,pixelRatio:2,backgroundColor:'#08111f'});const a=document.createElement('a');a.download=`cotizacion-${client||'cliente'}-${model.slug}.png`;a.href=data;a.click()}finally{setBusy(false)}}
 if(!user)return <Login onLogin={setUser}/>
 return <main className="admin-shell"><section className="admin-top"><div><span>Panel privado</span><h1>Generador de cotizaciones</h1><p>Completa los datos, revisa la vista previa y descarga la imagen.</p></div><button className="logout" onClick={()=>{localStorage.removeItem(SESSION_KEY);setUser('')}}>Cerrar sesión</button></section><section className="admin-layout"><div className="quote-form"><div className="panel"><h2>Cliente y vehículo</h2><div className="form-grid"><label>Nombre del cliente<input value={client} onChange={e=>setClient(e.target.value)}/></label><label>Modelo<select value={slug} onChange={e=>{setSlug(e.target.value);const m=modelData.find(x=>x.slug===e.target.value);setVersion(m?.versions?.[0]?.name||'')}}>{modelData.map(m=><option value={m.slug} key={m.slug}>Jetour {m.name}</option>)}</select></label><label className="wide">Versión<input value={version} onChange={e=>setVersion(e.target.value)} /></label></div></div><div className="panel"><div className="section-row"><h2>Formas de pago</h2><button type="button" className="mini-btn" onClick={addPayment}>+ Agregar</button></div>{payments.map((p,i)=><PaymentEditor key={p.id} item={p} onChange={n=>setPayments(arr=>arr.map((x,j)=>j===i?n:x))} onRemove={()=>setPayments(arr=>arr.filter((_,j)=>j!==i))}/>)}</div><div className="panel"><h2>Condiciones</h2><textarea value={validity} onChange={e=>setValidity(e.target.value)} rows="3"/></div><button className="admin-primary export" onClick={exportPng} disabled={busy}>{busy?'Generando imagen…':'Descargar cotización PNG'}</button></div><div className="preview-wrap"><div className="quote-card" ref={quoteRef}><div className="quote-hero"><div className="quote-brand"><strong>JETOUR</strong><span>Drive Your Future</span></div><div className="premium-pill">COTIZACIÓN COMERCIAL</div><img src={model.img} alt={model.name}/><div className="hero-fade"/><div className="quote-title"><small>Preparada para</small><h2>{client||'Cliente'}</h2><h1>JETOUR {model.name}</h1><p>{version}</p></div></div><div className="quote-body"><div className="offer-grid">{payments.map(p=><article key={p.id}><span>{p.type}</span><strong>{money(p.price)}</strong>{p.type!=='Contado'&&<div className="offer-data"><p><b>Pie</b>{money(p.down)}</p><p><b>{p.months||'—'} meses</b>{money(p.installment)} / mes</p></div>}{p.note&&<small>{p.note}</small>}</article>)}</div><div className="quote-note">{validity}</div><div className="advisor"><div><span>ASESOR COMERCIAL</span><strong>Cristián Jiménez</strong><small>Guillermo Morales Bilbao · Providencia</small></div><div><b>+56 9 4505 5463</b><small>cjimenez@guillermomorales.cl</small></div></div></div></div></div></section></main>
}