import { useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { isPromoCurrent } from '../utils/promotions'
import './Admin.css'

const weekDays = [
  ['domingo', 'Domingo'], ['lunes', 'Lunes'], ['martes', 'Martes'],
  ['miercoles', 'Miércoles'], ['jueves', 'Jueves'], ['viernes', 'Viernes'], ['sabado', 'Sábado'],
]
const promoDays = [['0', 'Do'], ['1', 'Lu'], ['2', 'Ma'], ['3', 'Mi'], ['4', 'Ju'], ['5', 'Vi'], ['6', 'Sa']]
const blankProduct = { nombre: '', categoria: '', precio: '', descripcion: '', activo: true, picante: false, vegetariano: false, masPedido: false }
const blankPromo = { titulo: '', descripcion: '', tipo: 'porcentaje', valor: '', categoriaAplicable: '', dias: [], horaDesde: '', horaHasta: '', fechaInicio: '', fechaFin: '', activo: true }

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      window.location.replace('/admin')
    } catch {
      setError('No se pudo iniciar sesión. Verifica tu correo y contraseña.')
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login" onSubmit={handleSubmit}>
        <a className="admin-brand" href="/">ENTRENOS <span>ADMIN</span></a>
        <h1>Iniciar sesión</h1>
        <label>Correo electrónico<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Contraseña<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button className="admin-primary" type="submit" disabled={submitting}>{submitting ? 'Ingresando...' : 'Entrar'}</button>
        <a className="admin-back-link" href="/">Volver a la carta</a>
      </form>
    </main>
  )
}

function AdminLayout({ section, user, onLogout, children }) {
  const links = [
    ['dashboard', 'Resumen', '/admin'],
    ['productos', 'Productos', '/admin/productos'],
    ['promociones', 'Promociones', '/admin/promociones'],
    ['delivery', 'Zonas de delivery', '/admin/delivery'],
    ['configuracion', 'Configuración', '/admin/configuracion'],
  ]
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/admin">ENTRENOS <span>ADMIN</span></a>
        <nav aria-label="Administración">
          {links.map(([id, label, href]) => <a key={id} className={section === id ? 'is-current' : ''} href={href}>{label}</a>)}
        </nav>
        <div className="admin-account">
          <span title={user.email}>{user.email}</span>
          <button type="button" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  )
}

function AdminDashboard({ products, promos }) {
  const activePromos = promos.filter((promo) => isPromoCurrent(promo))
  return (
    <section>
      <div className="admin-page-heading"><div><p>ENTRENOS / ADMIN</p><h1>Resumen</h1></div><a className="admin-secondary" href="/">Ver carta</a></div>
      <div className="admin-stats">
        <article><span>Productos activos</span><strong>{products.filter((product) => product.activo).length}</strong></article>
        <article><span>Promociones vigentes</span><strong>{activePromos.length}</strong></article>
      </div>
      <div className="admin-overview-list">
        <h2>Promociones vigentes</h2>
        {activePromos.length ? activePromos.map((promo) => <p key={promo.id}>{promo.titulo}</p>) : <p>No hay promociones vigentes.</p>}
      </div>
    </section>
  )
}

function ProductForm({ product, products, onSave, onCancel }) {
  const [form, setForm] = useState(() => product ? { ...blankProduct, ...product } : blankProduct)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const categories = [...new Set(products.map(({ categoria }) => categoria).filter(Boolean))]

  function change(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSave({
        nombre: form.nombre.trim(), categoria: form.categoria.trim(), precio: Number(form.precio),
        descripcion: form.descripcion.trim(), activo: form.activo, picante: form.picante,
        vegetariano: form.vegetariano, masPedido: form.masPedido, orden: product?.orden ?? products.length,
      })
      onCancel()
    } catch (saveError) {
      setError(`No se pudo guardar el producto: ${saveError.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <form className="admin-form admin-modal" onSubmit={submit}>
        <div className="admin-form-heading"><h2>{product ? 'Editar producto' : 'Nuevo producto'}</h2><button type="button" className="admin-icon-button" onClick={onCancel} aria-label="Cerrar">×</button></div>
        <label>Nombre<input required value={form.nombre} onChange={(event) => change('nombre', event.target.value)} /></label>
        <label>Categoría<input required list="product-categories" value={form.categoria} onChange={(event) => change('categoria', event.target.value)} /><datalist id="product-categories">{categories.map((category) => <option key={category} value={category} />)}</datalist></label>
        <label>Precio (MXN)<input required min="1" type="number" step="1" value={form.precio} onChange={(event) => change('precio', event.target.value)} /></label>
        <label>Descripción<textarea rows="3" value={form.descripcion} onChange={(event) => change('descripcion', event.target.value)} /></label>
        <div className="admin-checkbox-row"><label><input type="checkbox" checked={form.picante} onChange={(event) => change('picante', event.target.checked)} /> Picante</label><label><input type="checkbox" checked={form.vegetariano} onChange={(event) => change('vegetariano', event.target.checked)} /> Vegetariano</label><label><input type="checkbox" checked={form.masPedido} onChange={(event) => change('masPedido', event.target.checked)} /> Más pedido</label></div>
        <label className="admin-checkbox"><input type="checkbox" checked={form.activo} onChange={(event) => change('activo', event.target.checked)} /> Visible en la carta</label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <div className="admin-form-actions"><button className="admin-secondary" type="button" onClick={onCancel}>Cancelar</button><button className="admin-primary" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar producto'}</button></div>
      </form>
    </div>
  )
}

function AdminProducts({ products, addProduct, updateProduct, deleteProduct }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [error, setError] = useState('')
  const categories = [...new Set(products.map(({ categoria }) => categoria).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'))
  const filtered = products.filter((product) => {
    const matchesSearch = `${product.nombre} ${product.categoria}`.toLocaleLowerCase('es').includes(search.trim().toLocaleLowerCase('es'))
    return matchesSearch && (category === 'Todas' || product.categoria === category)
  }).sort((a, b) => (a.categoria || '').localeCompare(b.categoria || '', 'es') || (a.orden ?? 0) - (b.orden ?? 0))

  async function saveProduct(values) {
    if (editing) await updateProduct(editing.id, values)
    else await addProduct(values)
  }

  async function toggleProduct(product) {
    try {
      await updateProduct(product.id, { activo: !product.activo })
    } catch (saveError) {
      setError(`No se pudo actualizar: ${saveError.message}`)
    }
  }

  async function removeProduct(product) {
    if (!window.confirm(`¿Eliminar “${product.nombre}”? Esta acción no se puede deshacer.`)) return
    try {
      await deleteProduct(product.id)
      setError('')
    } catch (deleteError) {
      setError(`No se pudo eliminar: ${deleteError.message}`)
    }
  }

  return (
    <section>
      <div className="admin-page-heading"><div><p>ENTRENOS / ADMIN</p><h1>Productos</h1></div><button className="admin-primary" type="button" onClick={() => { setEditing(null); setFormOpen(true) }}>+ Nuevo producto</button></div>
      <div className="admin-toolbar"><input type="search" placeholder="Buscar producto" aria-label="Buscar producto" value={search} onChange={(event) => setSearch(event.target.value)} /><select aria-label="Filtrar por categoría" value={category} onChange={(event) => setCategory(event.target.value)}><option>Todas</option>{categories.map((value) => <option key={value}>{value}</option>)}</select></div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <div className="admin-table-wrap"><table><thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{filtered.map((product) => <tr key={product.id}><td><strong>{product.nombre}</strong>{product.descripcion && <small>{product.descripcion}</small>}</td><td>{product.categoria}</td><td>${Number(product.precio || 0).toLocaleString('es-MX')} MXN</td><td><button type="button" className={`admin-status ${product.activo ? 'is-active' : ''}`} onClick={() => toggleProduct(product)}>{product.activo ? 'Activo' : 'Oculto'}</button></td><td className="admin-row-actions"><button type="button" onClick={() => { setEditing(product); setFormOpen(true) }}>Editar</button><button type="button" className="is-danger" onClick={() => removeProduct(product)}>Eliminar</button></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="admin-empty">No hay productos que coincidan.</p>}</div>
      {formOpen && <ProductForm product={editing} products={products} onSave={saveProduct} onCancel={() => setFormOpen(false)} />}
    </section>
  )
}

function PromoForm({ promo, products, onSave, onCancel }) {
  const [form, setForm] = useState(() => promo ? { ...blankPromo, ...promo, dias: (promo.dias || []).map(String) } : blankPromo)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const categories = [...new Set(products.map(({ categoria }) => categoria).filter(Boolean))]
  function change(key, value) { setForm((current) => ({ ...current, [key]: value })) }
  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave({ ...form, valor: Number(form.valor || 0), dias: form.dias.map(Number), categoriaAplicable: form.categoriaAplicable || '', horaDesde: form.horaDesde || '', horaHasta: form.horaHasta || '', fechaInicio: form.fechaInicio || '', fechaFin: form.fechaFin || '' })
      onCancel()
    } catch (saveError) {
      setError(`No se pudo guardar la promoción: ${saveError.message}`)
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <form className="admin-form admin-modal" onSubmit={submit}>
        <div className="admin-form-heading"><h2>{promo ? 'Editar promoción' : 'Nueva promoción'}</h2><button type="button" className="admin-icon-button" onClick={onCancel} aria-label="Cerrar">×</button></div>
        <label>Título<input required value={form.titulo} onChange={(event) => change('titulo', event.target.value)} /></label>
        <label>Descripción<textarea required rows="3" value={form.descripcion} onChange={(event) => change('descripcion', event.target.value)} /></label>
        <div className="admin-form-grid"><label>Tipo<select value={form.tipo} onChange={(event) => change('tipo', event.target.value)}><option value="porcentaje">Porcentaje de descuento</option><option value="monto">Monto fijo</option><option value="texto">Combo / texto libre</option></select></label>{form.tipo !== 'texto' && <label>{form.tipo === 'porcentaje' ? 'Descuento (%)' : 'Monto (MXN)'}<input required min="0" type="number" value={form.valor} onChange={(event) => change('valor', event.target.value)} /></label>}</div>
        <label>Categoría aplicable (opcional)<select value={form.categoriaAplicable} onChange={(event) => change('categoriaAplicable', event.target.value)}><option value="">Todas las categorías</option>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
        <fieldset className="admin-days"><legend>Días de la semana</legend>{promoDays.map(([value, label]) => <label key={value}><input type="checkbox" checked={form.dias.includes(value)} onChange={(event) => change('dias', event.target.checked ? [...form.dias, value] : form.dias.filter((day) => day !== value))} /> {label}</label>)}</fieldset>
        <div className="admin-form-grid"><label>Desde<input type="time" value={form.horaDesde} onChange={(event) => change('horaDesde', event.target.value)} /></label><label>Hasta<input type="time" value={form.horaHasta} onChange={(event) => change('horaHasta', event.target.value)} /></label><label>Fecha de inicio<input type="date" value={form.fechaInicio} onChange={(event) => change('fechaInicio', event.target.value)} /></label><label>Fecha de fin<input type="date" value={form.fechaFin} onChange={(event) => change('fechaFin', event.target.value)} /></label></div>
        <label className="admin-checkbox"><input type="checkbox" checked={form.activo} onChange={(event) => change('activo', event.target.checked)} /> Activa</label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <div className="admin-form-actions"><button className="admin-secondary" type="button" onClick={onCancel}>Cancelar</button><button className="admin-primary" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar promoción'}</button></div>
      </form>
    </div>
  )
}

function AdminPromos({ promos, products, addPromo, updatePromo, deletePromo }) {
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [error, setError] = useState('')
  const currentPromos = useMemo(() => promos.filter((promo) => isPromoCurrent(promo)), [promos])
  async function savePromo(values) {
    if (editing) await updatePromo(editing.id, values)
    else await addPromo(values)
  }
  async function removePromo(promo) {
    if (!window.confirm(`¿Eliminar la promoción “${promo.titulo}”?`)) return
    try { await deletePromo(promo.id) } catch (deleteError) { setError(`No se pudo eliminar: ${deleteError.message}`) }
  }
  return (
    <section>
      <div className="admin-page-heading"><div><p>ENTRENOS / ADMIN</p><h1>Promociones</h1></div><button className="admin-primary" type="button" onClick={() => { setEditing(null); setFormOpen(true) }}>+ Nueva promoción</button></div>
      <p className="admin-section-note">{currentPromos.length} promociones vigentes ahora</p>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <div className="admin-promo-list">{promos.map((promo) => <article key={promo.id}><div><span className={`admin-status ${promo.activo ? 'is-active' : ''}`}>{promo.activo ? (isPromoCurrent(promo) ? 'Vigente' : 'Programada') : 'Inactiva'}</span><h2>{promo.titulo}</h2><p>{promo.descripcion}</p><small>{promo.tipo === 'porcentaje' ? `${promo.valor}% de descuento` : promo.tipo === 'monto' ? `$${promo.valor} MXN de descuento` : 'Combo / texto libre'}{promo.categoriaAplicable ? ` · ${promo.categoriaAplicable}` : ''}</small></div><div className="admin-row-actions"><button type="button" onClick={() => { setEditing(promo); setFormOpen(true) }}>Editar</button><button className="is-danger" type="button" onClick={() => removePromo(promo)}>Eliminar</button></div></article>)}{promos.length === 0 && <p className="admin-empty">Aún no hay promociones.</p>}</div>
      {formOpen && <PromoForm promo={editing} products={products} onSave={savePromo} onCancel={() => setFormOpen(false)} />}
    </section>
  )
}

function AdminDeliveryZones({ zones, addZone, updateZone, deleteZone }) {
  const [search, setSearch] = useState('')
  const [zoneName, setZoneName] = useState('')
  const [zoneCost, setZoneCost] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const filtered = zones.filter(({ zona }) => zona.toLocaleLowerCase('es').includes(search.trim().toLocaleLowerCase('es'))).sort((a, b) => a.zona.localeCompare(b.zona, 'es'))
  async function add(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await addZone({ zona: zoneName.trim(), costo: Number(zoneCost) })
      setZoneName('')
      setZoneCost('')
    } catch (saveError) { setError(`No se pudo agregar la zona: ${saveError.message}`) } finally { setSaving(false) }
  }
  async function saveCost(zone, value) {
    const costo = Number(value)
    if (!Number.isFinite(costo) || costo < 0 || costo === zone.costo) return
    try { await updateZone(zone.id, { costo }) } catch (saveError) { setError(`No se pudo actualizar la zona: ${saveError.message}`) }
  }
  async function remove(zone) {
    if (!window.confirm(`¿Eliminar la zona “${zone.zona}”?`)) return
    try { await deleteZone(zone.id) } catch (deleteError) { setError(`No se pudo eliminar la zona: ${deleteError.message}`) }
  }
  return (
    <section>
      <div className="admin-page-heading"><div><p>ENTRENOS / ADMIN</p><h1>Zonas de delivery</h1></div></div>
      <form className="admin-inline-form" onSubmit={add}><label>Nueva zona<input required value={zoneName} onChange={(event) => setZoneName(event.target.value)} /></label><label>Costo (MXN)<input required min="0" type="number" value={zoneCost} onChange={(event) => setZoneCost(event.target.value)} /></label><button className="admin-primary" type="submit" disabled={saving}>{saving ? 'Agregando...' : 'Agregar zona'}</button></form>
      <div className="admin-toolbar"><input type="search" placeholder="Buscar zona" aria-label="Buscar zona" value={search} onChange={(event) => setSearch(event.target.value)} /><span>{filtered.length} zonas</span></div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <div className="admin-zone-list">{filtered.map((zone) => <div key={zone.id}><strong>{zone.zona}</strong><label className="admin-zone-cost"><span>$</span><input aria-label={`Costo de ${zone.zona}`} type="number" min="0" defaultValue={zone.costo} key={`${zone.id}-${zone.costo}`} onBlur={(event) => saveCost(zone, event.target.value)} /><span>MXN</span></label><button type="button" className="admin-icon-button is-danger" aria-label={`Eliminar ${zone.zona}`} onClick={() => remove(zone)}>×</button></div>)}{filtered.length === 0 && <p className="admin-empty">No hay zonas que coincidan.</p>}</div>
    </section>
  )
}

function AdminSettings({ config, saveConfig }) {
  const [form, setForm] = useState(() => ({
    whatsappNumber: config?.whatsappNumber ?? '',
    instagramUrl: config?.instagramUrl ?? '',
    facebookUrl: config?.facebookUrl ?? '',
    horarios: Object.fromEntries(weekDays.map(([key]) => [key, config?.horarios?.[key]?.map(({ abre, cierra }) => `${abre}-${cierra}`).join(', ') ?? ''])),
  }))
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  function change(key, value) { setForm((current) => ({ ...current, [key]: value })) }
  async function submit(event) {
    event.preventDefault()
    const invalidHours = weekDays.some(([key]) => form.horarios[key].split(',').some((slot) => {
      const value = slot.trim()
      return value && !/^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/.test(value)
    }))
    if (invalidHours) {
      setStatus('Usa el formato HH:MM-HH:MM y separa los turnos con coma.')
      return
    }
    setSaving(true)
    setStatus('')
    const horarios = Object.fromEntries(weekDays.map(([key]) => {
      const slots = form.horarios[key].split(',').map((slot) => slot.trim()).filter(Boolean).map((slot) => {
        const [abre, cierra] = slot.split('-').map((part) => part.trim())
        return { abre, cierra }
      })
      return [key, slots.length ? slots : null]
    }))
    try {
      await saveConfig({ whatsappNumber: form.whatsappNumber.trim(), instagramUrl: form.instagramUrl.trim(), facebookUrl: form.facebookUrl.trim(), horarios })
      setStatus('Configuración guardada.')
    } catch (saveError) { setStatus(`No se pudo guardar: ${saveError.message}`) } finally { setSaving(false) }
  }
  return (
    <section>
      <div className="admin-page-heading"><div><p>ENTRENOS / ADMIN</p><h1>Configuración</h1></div></div>
      <form className="admin-form admin-settings-form" onSubmit={submit}>
        <h2>Contacto y redes</h2>
        <label>Número de WhatsApp<input required inputMode="tel" value={form.whatsappNumber} onChange={(event) => change('whatsappNumber', event.target.value)} /></label>
        <label>Instagram<input type="url" value={form.instagramUrl} onChange={(event) => change('instagramUrl', event.target.value)} /></label>
        <label>Facebook<input type="url" value={form.facebookUrl} onChange={(event) => change('facebookUrl', event.target.value)} /></label>
        <h2>Horarios de atención</h2>
        <p className="admin-section-note">Separa turnos con coma, por ejemplo: 12:00-15:00, 20:00-00:00. Deja vacío para cerrar.</p>
        <div className="admin-hours-list">{weekDays.map(([key, label]) => <label key={key}>{label}<input placeholder="12:00-15:00, 20:00-00:00" value={form.horarios[key]} onChange={(event) => setForm((current) => ({ ...current, horarios: { ...current.horarios, [key]: event.target.value } }))} /></label>)}</div>
        {status && <p className={status.startsWith('No se pudo') ? 'admin-error' : 'admin-success'} role="status">{status}</p>}
        <button className="admin-primary" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar configuración'}</button>
      </form>
    </section>
  )
}

export default function Admin({ data }) {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(!auth)
  const [authError, setAuthError] = useState(auth ? '' : 'Firebase Authentication no está configurado. Completa las variables de entorno para habilitar el acceso.')
  const path = window.location.pathname
  const isLogin = path === '/admin/login'

  useEffect(() => {
    if (!auth) return undefined
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setAuthReady(true)
    }, () => {
      setAuthError('No se pudo verificar la sesión. Revisa la conexión con Firebase.')
      setAuthReady(true)
    })
  }, [])

  useEffect(() => {
    if (!authReady || authError) return
    if (isLogin && user) window.location.replace('/admin')
    else if (!isLogin && !user) window.location.replace('/admin/login')
  }, [authReady, authError, isLogin, user])

  if (!authReady) return <main className="admin-loading">Verificando sesión...</main>
  if (authError) return <main className="admin-login-page"><section className="admin-login"><h1>Administración no disponible</h1><p className="admin-error" role="alert">{authError}</p><a className="admin-back-link" href="/">Volver a la carta</a></section></main>
  if (isLogin && !user) return <AdminLogin />
  if (!user) return <main className="admin-loading">Redirigiendo al inicio de sesión...</main>

  const section = path === '/admin' || path === '/admin/' ? 'dashboard'
    : path.includes('productos') ? 'productos'
      : path.includes('promociones') ? 'promociones'
        : path.includes('delivery') ? 'delivery' : 'configuracion'

  async function logout() {
    await signOut(auth)
    window.location.replace('/admin/login')
  }

  return (
    <AdminLayout section={section} user={user} onLogout={logout}>
      {data.loading ? <p className="admin-section-note">Cargando datos desde Firestore...</p> : data.error ? <p className="admin-error" role="alert">{data.error}</p> : <>
        {section === 'dashboard' && <AdminDashboard products={data.productos} promos={data.promociones} />}
        {section === 'productos' && <AdminProducts products={data.productos} addProduct={data.addProduct} updateProduct={data.updateProduct} deleteProduct={data.deleteProduct} />}
        {section === 'promociones' && <AdminPromos promos={data.promociones} products={data.productos} addPromo={data.addPromo} updatePromo={data.updatePromo} deletePromo={data.deletePromo} />}
        {section === 'delivery' && <AdminDeliveryZones zones={data.zonasDelivery} addZone={data.addZone} updateZone={data.updateZone} deleteZone={data.deleteZone} />}
        {section === 'configuracion' && <AdminSettings key={JSON.stringify(data.config)} config={data.config} saveConfig={data.saveConfig} />}
      </>}
    </AdminLayout>
  )
}