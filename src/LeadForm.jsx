import {useState} from 'react'

export default function LeadForm({lead}){
  const endpoint=import.meta.env.VITE_LEAD_ENDPOINT||''
  const [status,setStatus]=useState('')
  const [form,setForm]=useState({nombre:'',rut:'',correo:'',telefono:'',renta:'',pieMaximo:''})
  const set=(k,v)=>setForm({...form,[k]:v})
  async function submit(e){
    e.preventDefault()
    const payload={fecha:new Date().toISOString(),...form,...lead}
    if(!endpoint){
      const text='Nueva simulación Jetour\n'+Object.entries(payload).map(([k,v])=>k+': '+v).join('\n')
      window.open('https://wa.me/56945055463?text='+encodeURIComponent(text),'_blank')
      setStatus('Solicitud lista para enviar por WhatsApp. Falta conectar endpoint de Google Sheet.')
      return
    }
    await fetch(endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)})
    setStatus('Solicitud enviada. El asesor validará condiciones finales.')
    setForm({nombre:'',rut:'',correo:'',telefono:'',renta:'',pieMaximo:''})
  }
  return <form className="lead-form" onSubmit={submit}>
    <h3>Enviar solicitud de cotización</h3>
    <p>Completa tus datos para validar la simulación con el asesor.</p>
    <div className="lead-grid">
      <label>Nombre<input required value={form.nombre} onChange={e=>set('nombre',e.target.value)}/></label>
      <label>RUT<input required value={form.rut} onChange={e=>set('rut',e.target.value)}/></label>
      <label>Correo<input required type="email" value={form.correo} onChange={e=>set('correo',e.target.value)}/></label>
      <label>Teléfono<input required value={form.telefono} onChange={e=>set('telefono',e.target.value)}/></label>
      <label>Renta líquida promedio<input required value={form.renta} onChange={e=>set('renta',e.target.value)}/></label>
      <label>Pie máximo disponible<input required value={form.pieMaximo} onChange={e=>set('pieMaximo',e.target.value)}/></label>
    </div>
    <button className="btn dark" type="submit">Enviar al asesor</button>
    {status&&<small className="lead-status">{status}</small>}
  </form>
}
