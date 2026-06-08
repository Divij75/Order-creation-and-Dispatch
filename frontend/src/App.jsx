import { useState, useEffect, useCallback } from 'react';
import {
  Package, Truck, CheckCircle, Clock, Plus, Search,
  MapPin, X, Navigation, Calendar, AlertCircle, Check,
  ChevronRight, ArrowLeft
} from 'lucide-react';

/* ── Colors used throughout (subtle navy palette) ── */
const C = {
  bg:     '#10141f',
  card:   '#151b2c',
  border: '#1e2d45',
  input:  '#1a2035',
  inpBdr: '#2a3352',
  text1:  '#e2e8f0',
  text2:  '#94a3b8',
  text3:  '#576888',
  accent: '#3b6fd4',
  accentSoft: '#2b4e8e',
  green:  '#22a37a',
  amber:  '#d4993b',
  rose:   '#d45a5a',
  purple: '#7e5bd4',
};

/* ─────────────────── DRIVER MODAL ─────────────────── */
function DriverModal({ isOpen, order, drivers, onSelect, onClose }) {
  if (!isOpen) return null;
  const list = drivers.filter(d => d.available);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-in"
      style={{ background:'rgba(10,14,28,.88)', backdropFilter:'blur(10px)' }}>
      <div className="w-full max-w-md anim-up"
        style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:16, boxShadow:'0 20px 50px rgba(0,0,0,.5)' }}>
        {/* Top accent */}
        <div style={{ height:3, background:`linear-gradient(90deg, ${C.accent}, ${C.purple})`, borderRadius:'16px 16px 0 0' }} />
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom:`1px solid ${C.border}` }}>
          <div>
            <h3 className="text-base font-bold" style={{ color:C.text1 }}>Assign Driver</h3>
            <p className="text-xs mt-0.5" style={{ color:C.accent }}>Order #{order?.id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:'rgba(255,255,255,.04)', color:C.text3 }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Body */}
        <div className="p-5 max-h-72 overflow-y-auto space-y-2">
          {list.length === 0 ? (
            <div className="text-center py-10">
              <Truck className="w-8 h-8 mx-auto mb-3" style={{ color:C.text3 }} />
              <p className="text-sm font-semibold" style={{ color:C.text2 }}>No drivers available</p>
              <p className="text-xs mt-1" style={{ color:C.text3 }}>All drivers are currently on dispatch.</p>
            </div>
          ) : list.map(d => (
            <div key={d.id} className="flex items-center justify-between p-3.5 rounded-xl transition-all"
              style={{ background:'rgba(255,255,255,.02)', border:`1px solid ${C.border}` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent+'55'; e.currentTarget.style.background = 'rgba(59,111,212,.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = 'rgba(255,255,255,.02)'; }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: C.accent }}>
                  {d.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color:C.text1 }}>{d.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" style={{ color:C.text3 }} />
                    <span className="text-xs" style={{ color:C.text3 }}>{d.city}</span>
                    <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ background:'rgba(34,163,122,.12)', color:C.green, border:`1px solid rgba(34,163,122,.2)` }}>Available</span>
                  </div>
                </div>
              </div>
              <button onClick={() => onSelect(d)} className="btn-blue text-xs py-2 px-3.5">Assign</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── TOAST ─────────────────── */
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  const cfg = {
    success: { bg:'rgba(34,163,122,.1)',  border:'rgba(34,163,122,.25)', color:C.green, icon:<Check className="w-3.5 h-3.5" /> },
    error:   { bg:'rgba(212,90,90,.1)',   border:'rgba(212,90,90,.25)',  color:C.rose,  icon:<AlertCircle className="w-3.5 h-3.5" /> },
    info:    { bg:'rgba(59,111,212,.1)',   border:'rgba(59,111,212,.25)', color:C.accent,icon:<Package className="w-3.5 h-3.5" /> },
  }[type] || {};

  return (
    <div className="anim-toast flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold"
      style={{ background:cfg.bg, border:`1px solid ${cfg.border}`, backdropFilter:'blur(10px)', color:C.text1, minWidth:240 }}>
      <span style={{ color:cfg.color }}>{cfg.icon}</span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} style={{ color:C.text3 }}><X className="w-3 h-3" /></button>
    </div>
  );
}

/* ─────────────────── FIELD WRAPPER ─────────────────── */
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color:C.text3, letterSpacing:'.03em' }}>{label}</label>
      {children}
      {error && <p className="flex items-center gap-1 text-[11px] font-medium mt-1" style={{ color:C.rose }}><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toasts, setToasts] = useState([]);

  const [form, setForm] = useState({
    pickup_address:   { street:'', city:'', postal_code:'' },
    delivery_address: { street:'', city:'', postal_code:'' },
    package_description:'', pickup_time:'', priority:'Standard',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const toast = useCallback((msg, type='info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, message:msg, type }]);
  }, []);

  const fetchOrders = useCallback(async () => {
    try { setLoading(true); const r = await fetch('/api/orders'); const d = await r.json(); setOrders(Array.isArray(d) ? d.slice().reverse() : []); }
    catch { toast('Failed to load orders','error'); }
    finally { setLoading(false); }
  }, [toast]);

  const fetchDrivers = useCallback(async () => {
    try { const r = await fetch('/api/drivers'); const d = await r.json(); setDrivers(Array.isArray(d)?d:[]); } catch {}
  }, []);

  useEffect(() => { fetchOrders(); fetchDrivers(); }, [fetchOrders, fetchDrivers]);

  /* ── form helpers ── */
  const setField = (section, field, val) => {
    setForm(p => section ? { ...p, [section]:{ ...p[section], [field]:val } } : { ...p, [field]:val });
    const key = section ? `${section==='pickup_address'?'pu':'de'}_${field}` : field;
    setFormErrors(p => { const c={...p}; delete c[key]; if(field==='package_description') delete c.pkg; return c; });
  };

  const validate = () => {
    const e={};
    if(!form.pickup_address.street.trim())      e.pu_street='Required';
    if(!form.pickup_address.city.trim())         e.pu_city='Required';
    if(!form.pickup_address.postal_code.trim())  e.pu_postal_code='Required';
    if(!form.delivery_address.street.trim())     e.de_street='Required';
    if(!form.delivery_address.city.trim())        e.de_city='Required';
    if(!form.delivery_address.postal_code.trim()) e.de_postal_code='Required';
    if(!form.package_description.trim())          e.pkg='Required';
    if(!form.pickup_time)                         e.pickup_time='Required';
    setFormErrors(e);
    return Object.keys(e).length===0;
  };

  const handleCreate = async ev => {
    ev.preventDefault();
    if(!validate()){ toast('Please fill all required fields','error'); return; }
    setSubmitting(true);
    try {
      const r=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const d=await r.json();
      if(!r.ok){toast(d.error||'Failed','error');return;}
      setOrders(p=>[d,...p]);
      setForm({pickup_address:{street:'',city:'',postal_code:''},delivery_address:{street:'',city:'',postal_code:''},package_description:'',pickup_time:'',priority:'Standard'});
      setFormErrors({});
      setView('dashboard');
      toast(`Order #${d.id} created!`,'success');
    } catch{toast('Network error','error');}
    finally{setSubmitting(false);}
  };

  const handleAssign = async driver => {
    try {
      const r=await fetch('/api/orders/assign',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({order_id:selectedOrder.id,driver_id:driver.id})});
      const d=await r.json();
      if(!r.ok){toast(d.error||'Failed','error');return;}
      setOrders(p=>p.map(o=>o.id===d.id?d:o));
      setShowDriverModal(false); setSelectedOrder(null);
      await fetchDrivers();
      toast(`${driver.name} → Order #${d.id}`,'success');
    } catch{toast('Network error','error');}
  };

  const handleDeliver = async id => {
    try {
      const r=await fetch(`/api/orders/status?id=${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:'Delivered'})});
      const d=await r.json();
      if(!r.ok){toast(d.error||'Failed','error');return;}
      setOrders(p=>p.map(o=>o.id===d.id?d:o));
      await fetchDrivers();
      toast(`Order #${id} delivered ✓`,'success');
    } catch{toast('Network error','error');}
  };

  const handleDelete = async id => {
    try {
      const r=await fetch(`/api/orders?id=${id}`,{method:'DELETE'});
      const d=await r.json();
      if(!r.ok){toast(d.error||'Failed','error');return;}
      setOrders(p=>p.filter(o=>o.id!==id));
      await fetchDrivers();
      toast(`Order #${id} deleted`,'info');
    } catch{toast('Network error','error');}
  };

  /* ── Derived ── */
  const cnt = { total:orders.length, Pending:0, Dispatched:0, Delivered:0 };
  orders.forEach(o => { if(cnt[o.status]!==undefined)cnt[o.status]++; });
  const filtered = orders.filter(o => {
    const ms = statusFilter==='All' || o.status===statusFilter;
    const q = searchQuery.toLowerCase();
    const mt = !q || [o.id,o.package_description,o.pickup_address.city,o.delivery_address.city,o.assigned_driver?.name].some(v=>String(v??'').toLowerCase().includes(q));
    return ms&&mt;
  });

  const statusCfg = s => ({
    Pending:    { bg:'rgba(212,153,59,.1)',  color:C.amber,  border:'rgba(212,153,59,.2)' },
    Dispatched: { bg:'rgba(59,111,212,.1)',  color:C.accent, border:'rgba(59,111,212,.2)' },
    Delivered:  { bg:'rgba(34,163,122,.1)',  color:C.green,  border:'rgba(34,163,122,.2)' },
  }[s] || { bg:'rgba(87,104,136,.1)', color:C.text3, border:'rgba(87,104,136,.2)' });

  const prioCfg = p => ({
    'Same-day': { bg:'rgba(212,90,90,.1)',   color:C.rose,   border:'rgba(212,90,90,.2)' },
    Express:    { bg:'rgba(212,153,59,.1)',  color:C.amber,  border:'rgba(212,153,59,.2)' },
    Standard:   { bg:'rgba(59,111,212,.1)',  color:C.accent, border:'rgba(59,111,212,.2)' },
  }[p] || {});

  const fmtTime = t => { try{return new Date(t).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});}catch{return t;} };

  /* ═════════════════════ RENDER ═════════════════════ */
  return (
    <div className="min-h-screen" style={{ background: C.bg }}>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-40" style={{ background:'rgba(16,20,31,.92)', backdropFilter:'blur(16px)', borderBottom:`1px solid ${C.border}` }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:C.accent }}>
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold" style={{ color:C.text1 }}>DispatchLog</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background:'rgba(59,111,212,.12)', color:C.accent, border:`1px solid rgba(59,111,212,.18)` }}>v1.0</span>
          </div>

          <div className="flex gap-1 p-1 rounded-lg" style={{ background:'rgba(255,255,255,.03)', border:`1px solid ${C.border}` }}>
            {[{v:'dashboard',label:'Dashboard',icon:<Clock className="w-3.5 h-3.5"/>},
              {v:'create',label:'New Order',icon:<Plus className="w-3.5 h-3.5"/>}].map(({v,label,icon})=>{
              const active=view===v;
              return (
                <button key={v} onClick={()=>setView(v)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all"
                  style={active?{background:C.accent,color:'#fff'}:{color:C.text3}}>{icon}{label}</button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-6">

        {/* ══════════ DASHBOARD ══════════ */}
        {view==='dashboard' && (
          <div className="space-y-6 anim-up">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color:C.text1 }}>Shipment Overview</h2>
                <p className="text-xs mt-1" style={{ color:C.text3 }}>Monitor and manage all delivery orders</p>
              </div>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {label:'Total Orders', val:cnt.total,      icon:<Package className="w-4.5 h-4.5"/>, color:C.accent},
                {label:'Pending',      val:cnt.Pending,    icon:<Clock className="w-4.5 h-4.5"/>,   color:C.amber},
                {label:'In Transit',   val:cnt.Dispatched, icon:<Navigation className="w-4.5 h-4.5"/>,color:C.purple},
                {label:'Delivered',    val:cnt.Delivered,  icon:<CheckCircle className="w-4.5 h-4.5"/>,color:C.green},
              ].map(({label,val,icon,color})=>(
                <div key={label} className="flex items-center justify-between p-4 rounded-xl transition-all"
                  style={{ background:C.card, border:`1px solid ${C.border}` }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=color+'44';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;}}>
                  <div>
                    <p className="text-[11px] font-semibold uppercase" style={{ color:C.text3, letterSpacing:'.04em' }}>{label}</p>
                    <p className="text-2xl font-extrabold mt-0.5" style={{ color:C.text1 }}>{val}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background:color+'14', color, border:`1px solid ${color}22` }}>
                    {icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Orders Panel */}
            <div className="rounded-xl overflow-hidden" style={{ background:C.card, border:`1px solid ${C.border}` }}>
              {/* Toolbar */}
              <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <h3 className="text-sm font-bold" style={{ color:C.text1 }}>All Orders</h3>
                  <p className="text-[11px] mt-0.5" style={{ color:C.text3 }}>{filtered.length} result{filtered.length!==1?'s':''}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <div className="relative">
                    <input type="text" placeholder="Search…" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                      className="field-input px-4 py-2.5 text-sm" style={{ width:220, borderRadius:10 }} />
                  </div>
                  <div className="flex gap-1.5 p-1 rounded-lg" style={{ background:'rgba(255,255,255,.03)', border:`1px solid ${C.border}` }}>
                    {['All','Pending','Dispatched','Delivered'].map(s=>{
                      const a=statusFilter===s;
                      const sc=s!=='All'?statusCfg(s):null;
                      return <button key={s} onClick={()=>setStatusFilter(s)}
                        className="px-4 py-2.5 rounded-md text-xs font-bold transition-all"
                        style={a&&sc?{background:sc.bg,color:sc.color,border:`1px solid ${sc.border}`}:a?{background:'rgba(255,255,255,.06)',color:C.text1}:{color:C.text3,border:'1px solid transparent'}}>{s}</button>;
                    })}
                  </div>
                </div>
              </div>

              {/* Table body */}
              {loading ? (
                <div className="flex flex-col items-center py-20">
                  <div className="w-8 h-8 rounded-full border-2 animate-spin mb-2" style={{ borderColor:C.border, borderTopColor:C.accent }} />
                  <p className="text-xs" style={{ color:C.text3 }}>Loading…</p>
                </div>
              ) : filtered.length===0 ? (
                <div className="flex flex-col items-center py-20 text-center">
                  <Package className="w-10 h-10 mb-3" style={{ color:C.text3+'60' }} />
                  <p className="text-sm font-bold" style={{ color:C.text2 }}>No orders found</p>
                  <p className="text-xs mt-1" style={{ color:C.text3 }}>Try adjusting your filters or create a new order using the button above.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                        {['ID','Pickup','Delivery','Package','Schedule','Priority','Status','Driver','Created',''].map(h=>(
                          <th key={h} className="px-4 py-3 text-[10px] font-bold text-left" style={{ color:C.text3, letterSpacing:'.06em', textTransform:'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(o=>{
                        const sc=statusCfg(o.status); const pc=prioCfg(o.priority);
                        return (
                          <tr key={o.id} className="transition-colors" style={{ borderBottom:`1px solid ${C.border}33` }}
                            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.015)'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <td className="px-4 py-3.5"><span className="text-xs font-bold" style={{ color:C.accent }}>#{o.id}</span></td>
                            <td className="px-4 py-3.5" style={{ maxWidth:150 }}>
                              <p className="text-xs font-semibold truncate" style={{ color:C.text1 }}>{o.pickup_address.street}</p>
                              <p className="text-[11px] truncate" style={{ color:C.text3 }}>{o.pickup_address.city}, {o.pickup_address.postal_code}</p>
                            </td>
                            <td className="px-4 py-3.5" style={{ maxWidth:150 }}>
                              <p className="text-xs font-semibold truncate" style={{ color:C.text1 }}>{o.delivery_address.street}</p>
                              <p className="text-[11px] truncate" style={{ color:C.text3 }}>{o.delivery_address.city}, {o.delivery_address.postal_code}</p>
                            </td>
                            <td className="px-4 py-3.5" style={{ maxWidth:120 }}>
                              <p className="text-xs truncate" style={{ color:C.text2 }}>{o.package_description}</p>
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 flex-shrink-0" style={{ color:C.text3 }} />
                                <span className="text-[11px]" style={{ color:C.text2 }}>{fmtTime(o.pickup_time)}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background:pc.bg, color:pc.color, border:`1px solid ${pc.border}` }}>{o.priority}</span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold" style={{ background:sc.bg, color:sc.color, border:`1px solid ${sc.border}` }}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background:sc.color }} />
                                {o.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              {o.assigned_driver ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold text-white" style={{ background:C.accent }}>
                                    {o.assigned_driver.name.split(' ').map(n=>n[0]).join('')}
                                  </div>
                                  <span className="text-xs font-medium" style={{ color:C.text1 }}>{o.assigned_driver.name}</span>
                                </div>
                              ) : <span className="text-xs" style={{ color:C.text3+'80' }}>—</span>}
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 flex-shrink-0" style={{ color:C.text3 }} />
                                <span className="text-[11px]" style={{ color:C.text2 }}>{fmtTime(o.created_at)}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                {o.status==='Pending' && (
                                  <button onClick={()=>{setSelectedOrder(o);setShowDriverModal(true);}} className="btn-blue text-[11px] py-1.5 px-3">
                                    <Truck className="w-3 h-3" />Dispatch
                                  </button>
                                )}
                                {o.status==='Dispatched' && (
                                  <button onClick={()=>handleDeliver(o.id)} className="btn-green text-[11px] py-1.5 px-3">
                                    <CheckCircle className="w-3 h-3" />Delivered
                                  </button>
                                )}
                                <button onClick={()=>handleDelete(o.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                                  style={{ background:'rgba(212,90,90,.08)', color:C.rose, border:`1px solid rgba(212,90,90,.15)` }}
                                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,90,90,.18)'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,90,90,.08)'; }}>
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════ CREATE ORDER ══════════ */}
        {view==='create' && (
          <div className="max-w-2xl mx-auto anim-up">
            <button onClick={()=>setView('dashboard')} className="flex items-center gap-1.5 text-xs font-semibold mb-5 transition-colors"
              style={{ color:C.text3 }}
              onMouseEnter={e=>e.currentTarget.style.color=C.text2}
              onMouseLeave={e=>e.currentTarget.style.color=C.text3}>
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>

            <div className="rounded-xl overflow-hidden" style={{ background:C.card, border:`1px solid ${C.border}` }}>
              {/* Top accent */}
              <div style={{ height:3, background:`linear-gradient(90deg, ${C.accent}, ${C.purple})` }} />

              {/* Header */}
              <div className="px-7 py-5" style={{ borderBottom:`1px solid ${C.border}` }}>
                <h2 className="text-lg font-bold" style={{ color:C.text1 }}>Create Delivery Order</h2>
                <p className="text-xs mt-1" style={{ color:C.text3 }}>Fill in pickup, delivery, and cargo details below</p>
              </div>

              <form onSubmit={handleCreate} className="p-7 space-y-7">

                {/* ── Section 1: Pickup ── */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black text-white" style={{ background:C.accent }}>1</div>
                    <h3 className="text-xs font-bold" style={{ color:C.text1 }}>Pickup Address</h3>
                    <div className="flex-1 h-px" style={{ background:C.border }} />
                  </div>
                  <div className="grid grid-cols-6 gap-x-4 gap-y-3">
                    <div className="col-span-6">
                      <Field label="Street *" error={formErrors.pu_street}>
                        <input type="text" placeholder="e.g. 100 Transport Ave"
                          value={form.pickup_address.street} onChange={e=>setField('pickup_address','street',e.target.value)}
                          className={`field-input ${formErrors.pu_street?'err':''}`} />
                      </Field>
                    </div>
                    <div className="col-span-4">
                      <Field label="City *" error={formErrors.pu_city}>
                        <input type="text" placeholder="San Francisco"
                          value={form.pickup_address.city} onChange={e=>setField('pickup_address','city',e.target.value)}
                          className={`field-input ${formErrors.pu_city?'err':''}`} />
                      </Field>
                    </div>
                    <div className="col-span-2">
                      <Field label="Postal Code *" error={formErrors.pu_postal_code}>
                        <input type="text" placeholder="94103"
                          value={form.pickup_address.postal_code} onChange={e=>setField('pickup_address','postal_code',e.target.value)}
                          className={`field-input ${formErrors.pu_postal_code?'err':''}`} />
                      </Field>
                    </div>
                  </div>
                </section>

                {/* ── Section 2: Delivery ── */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black text-white" style={{ background:C.purple }}>2</div>
                    <h3 className="text-xs font-bold" style={{ color:C.text1 }}>Delivery Destination</h3>
                    <div className="flex-1 h-px" style={{ background:C.border }} />
                  </div>
                  <div className="grid grid-cols-6 gap-x-4 gap-y-3">
                    <div className="col-span-6">
                      <Field label="Street *" error={formErrors.de_street}>
                        <input type="text" placeholder="e.g. 200 Logistics Blvd"
                          value={form.delivery_address.street} onChange={e=>setField('delivery_address','street',e.target.value)}
                          className={`field-input ${formErrors.de_street?'err':''}`} />
                      </Field>
                    </div>
                    <div className="col-span-4">
                      <Field label="City *" error={formErrors.de_city}>
                        <input type="text" placeholder="Oakland"
                          value={form.delivery_address.city} onChange={e=>setField('delivery_address','city',e.target.value)}
                          className={`field-input ${formErrors.de_city?'err':''}`} />
                      </Field>
                    </div>
                    <div className="col-span-2">
                      <Field label="Postal Code *" error={formErrors.de_postal_code}>
                        <input type="text" placeholder="94607"
                          value={form.delivery_address.postal_code} onChange={e=>setField('delivery_address','postal_code',e.target.value)}
                          className={`field-input ${formErrors.de_postal_code?'err':''}`} />
                      </Field>
                    </div>
                  </div>
                </section>

                {/* ── Section 3: Cargo ── */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black text-white" style={{ background:C.green }}>3</div>
                    <h3 className="text-xs font-bold" style={{ color:C.text1 }}>Cargo &amp; Scheduling</h3>
                    <div className="flex-1 h-px" style={{ background:C.border }} />
                  </div>
                  <div className="grid grid-cols-6 gap-x-4 gap-y-3">
                    <div className="col-span-6">
                      <Field label="Package Description *" error={formErrors.pkg}>
                        <textarea rows={3} placeholder="Describe contents, handling requirements, weight…"
                          value={form.package_description} onChange={e=>setField(null,'package_description',e.target.value)}
                          className={`field-input resize-none ${formErrors.pkg?'err':''}`} />
                      </Field>
                    </div>
                    <div className="col-span-3">
                      <Field label="Pickup Date & Time *" error={formErrors.pickup_time}>
                        <input type="datetime-local"
                          value={form.pickup_time} onChange={e=>setField(null,'pickup_time',e.target.value)}
                          className={`field-input ${formErrors.pickup_time?'err':''}`} />
                      </Field>
                    </div>
                    <div className="col-span-3">
                      <Field label="Priority *">
                        <select value={form.priority} onChange={e=>setField(null,'priority',e.target.value)} className="field-input">
                          <option value="Standard">Standard</option>
                          <option value="Express">Express</option>
                          <option value="Same-day">Same-day</option>
                        </select>
                      </Field>
                    </div>
                  </div>
                </section>

                {/* ── Actions ── */}
                <div className="flex justify-end gap-3 pt-4" style={{ borderTop:`1px solid ${C.border}` }}>
                  <button type="button" onClick={()=>{setView('dashboard');setFormErrors({});}} className="btn-ghost text-xs">Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-blue text-xs">
                    {submitting ? <><div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"/>Submitting…</> : <><ChevronRight className="w-3.5 h-3.5"/>Submit Order</>}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}
      </main>

      {/* Modals & Toasts */}
      <DriverModal isOpen={showDriverModal} order={selectedOrder} drivers={drivers} onSelect={handleAssign}
        onClose={()=>{setShowDriverModal(false);setSelectedOrder(null);}} />

      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map(t=><Toast key={t.id} message={t.message} type={t.type} onClose={()=>setToasts(p=>p.filter(x=>x.id!==t.id))} />)}
      </div>
    </div>
  );
}
