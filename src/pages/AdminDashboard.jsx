import { Pencil, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const emptyProperty = {
  title: '',
  price: '',
  area: '',
  bedrooms: '',
  bathrooms: '',
  type: '2BR',
  image_url: '',
}

const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0)

function AdminDashboard() {
  const [properties, setProperties] = useState([])
  const [form, setForm] = useState(emptyProperty)
  const [editingId, setEditingId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const navigate = useNavigate()

  const fetchProperties = useCallback(async () => {
    const { data, error: fetchError } = await supabase.from('properties').select('*')
    if (fetchError) {
      setError(fetchError.message)
      return
    }
    setProperties(data ?? [])
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadProperties = async () => {
      const { data, error: fetchError } = await supabase.from('properties').select('*')
      if (!isMounted) return
      if (fetchError) setError(fetchError.message)
      else setProperties(data ?? [])
      setIsLoading(false)
    }

    loadProperties()
    const channel = supabase
      .channel('admin-properties')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, loadProperties)
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  const updateForm = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }))

  const resetForm = () => {
    setForm(emptyProperty)
    setEditingId(null)
  }

  const submitProperty = async event => {
    event.preventDefault()
    setError('')
    setNotice('')
    setIsSaving(true)

    const formData = {
      ...form,
      price: Number(form.price),
      area: Number(form.area),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
    }
    const query = editingId === null
      ? supabase.from('properties').insert([formData])
      : supabase.from('properties').update(formData).eq('id', editingId)
    const { error: saveError } = await query

    setIsSaving(false)
    if (saveError) {
      setError(saveError.message)
      return
    }

    setNotice(editingId === null ? 'Property added successfully.' : 'Property updated successfully.')
    resetForm()
    await fetchProperties()
  }

  const startEditing = property => {
    setForm({
      title: property.title ?? '',
      price: String(property.price ?? ''),
      area: String(property.area ?? ''),
      bedrooms: String(property.bedrooms ?? ''),
      bathrooms: String(property.bathrooms ?? ''),
      type: property.type ?? '2BR',
      image_url: property.image_url ?? '',
    })
    setEditingId(property.id)
    setError('')
    setNotice('')
    document.getElementById('property-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const deleteProperty = async id => {
    if (!window.confirm('Delete this property permanently?')) return

    setError('')
    setNotice('')
    const { error: deleteError } = await supabase.from('properties').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }

    if (editingId === id) resetForm()
    setNotice('Property deleted successfully.')
    await fetchProperties()
  }

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  return <div className="min-h-screen bg-stone-50 text-slate-900">
    <header className="bg-slate-950 text-white"><nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8"><a className="font-serif text-3xl" href="/">AUREA<span className="text-amber-300">.</span></a><button className="rounded-full bg-white/15 px-5 py-3 text-sm font-bold transition hover:bg-white/25" type="button" onClick={logout}>Logout</button></nav></header>
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div><p className="text-xs font-bold tracking-[.2em] text-amber-700">ADMINISTRATION</p><h1 className="mt-3 font-serif text-5xl">Property dashboard</h1></div>

      <section id="property-form" className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-serif text-3xl">{editingId === null ? 'Add a property' : 'Edit property'}</h2><p className="mt-1 text-sm text-slate-600">{editingId === null ? 'Create a residence for the homepage.' : 'Update the selected residence details.'}</p></div>{editingId !== null && <button className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-bold transition hover:bg-stone-100" type="button" onClick={resetForm}><X size={16} /> Cancel edit</button>}</div>
        <form className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4" onSubmit={submitProperty}>
          {Object.entries({ title: 'Title', price: 'Price', area: 'Area (m²)', bedrooms: 'Bedrooms', bathrooms: 'Bathrooms', image_url: 'Image URL' }).map(([name, label]) => <label key={name} className={name === 'title' || name === 'image_url' ? 'xl:col-span-2' : ''}><span className="text-sm font-bold">{label}</span><input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100" name={name} type={['price', 'area', 'bedrooms', 'bathrooms'].includes(name) ? 'number' : 'text'} min="0" step={name === 'price' ? '0.01' : '1'} value={form[name]} onChange={updateForm} required /></label>)}
          <label><span className="text-sm font-bold">Type</span><select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100" name="type" value={form.type} onChange={updateForm}><option>2BR</option><option>3BR</option><option>Penthouse</option><option>Villa</option></select></label>
          <div className="flex items-end"><button className="w-full rounded-full bg-slate-900 px-6 py-4 text-sm font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSaving}>{isSaving ? 'Saving…' : editingId === null ? 'Add property' : 'Update property'}</button></div>
        </form>
        {error && <p className="mt-5 text-sm text-red-700" role="alert">{error}</p>}{notice && <p className="mt-5 text-sm text-emerald-700" role="status">{notice}</p>}
      </section>

      <section className="mt-10 overflow-hidden rounded-3xl bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-200 px-6 py-5"><h2 className="font-serif text-3xl">Properties</h2><span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-bold text-slate-600">{properties.length}</span></div><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-stone-100 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-4">Title</th><th className="px-6 py-4">Type</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Details</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody>{isLoading ? <tr><td className="px-6 py-8 text-slate-600" colSpan="5">Loading properties…</td></tr> : properties.length === 0 ? <tr><td className="px-6 py-8 text-slate-600" colSpan="5">No properties yet.</td></tr> : properties.map(property => <tr className="border-t border-slate-100" key={property.id}><td className="px-6 py-4 font-bold text-slate-900">{property.title}</td><td className="px-6 py-4">{property.type}</td><td className="px-6 py-4">{money(property.price)}</td><td className="px-6 py-4 text-slate-600">{property.bedrooms} bed · {property.bathrooms} bath · {property.area} m²</td><td className="px-6 py-4"><div className="flex justify-end gap-3"><button className="inline-flex items-center gap-1.5 font-bold text-slate-700 transition hover:text-amber-700" type="button" onClick={() => startEditing(property)}><Pencil size={16} /> Edit</button><button className="inline-flex items-center gap-1.5 font-bold text-red-700 transition hover:text-red-900" type="button" onClick={() => deleteProperty(property.id)}><Trash2 size={16} /> Delete</button></div></td></tr>)}</tbody></table></div></section>
    </main>
  </div>
}

export default AdminDashboard
