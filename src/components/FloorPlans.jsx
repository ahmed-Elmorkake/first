import { Bath, BedDouble, ChevronLeft, ChevronRight, Maximize } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'

const formatPrice = price => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(Number(price) || 0)

function ResidenceSkeleton() {
  return <div className="mt-12 grid animate-pulse gap-10 lg:grid-cols-2 lg:items-center">
    <div className="space-y-6"><div className="h-11 w-56 rounded-full bg-gray-200" /><div className="h-10 w-2/3 rounded bg-gray-200" /><div className="grid grid-cols-2 gap-4"><div className="h-24 rounded-2xl bg-gray-200" /><div className="h-24 rounded-2xl bg-gray-200" /><div className="h-24 rounded-2xl bg-gray-200" /><div className="h-24 rounded-2xl bg-gray-200" /></div></div>
    <div className="aspect-[4/3] rounded-3xl bg-gray-200" />
  </div>
}

function Spec({ icon: Icon, label, value }) {
  return <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400"><Icon size={16} strokeWidth={1.8} /> {label}</dt>
    <dd className="mt-3 text-xl font-bold text-gray-900 sm:text-2xl">{value}</dd>
  </div>
}

function FloorPlans({ searchFilters }) {
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedType, setSelectedType] = useState(null)
  const [selectedPropertyId, setSelectedPropertyId] = useState(null)

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
    const channel = supabase.channel('homepage-properties').on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, loadProperties).subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  const types = useMemo(() => [...new Set(properties.map(property => property.type).filter(Boolean))], [properties])
  const requestedType = searchFilters?.propertyType
  const activeType = types.includes(selectedType) ? selectedType : (types.includes(requestedType) ? requestedType : types[0])
  const residences = useMemo(() => properties.filter(property => property.type === activeType), [properties, activeType])
  const activeResidence = residences.find(property => property.id === selectedPropertyId) ?? residences[0]
  const activeIndex = Math.max(0, residences.findIndex(property => property.id === activeResidence?.id))
  const hasMultipleResidences = residences.length > 1

  const chooseType = type => {
    setSelectedType(type)
    setSelectedPropertyId(null)
  }

  const moveResidence = direction => {
    const nextIndex = (activeIndex + direction + residences.length) % residences.length
    setSelectedPropertyId(residences[nextIndex].id)
  }

  return <section id="floor-plans" className="bg-stone-50 py-24 sm:py-32"><div className="mx-auto max-w-7xl px-6 lg:px-8">
    <div className="max-w-3xl"><p className="text-xs font-bold tracking-[.22em] text-amber-700">FIND YOUR SPACE</p><h2 className="mt-3 font-serif text-5xl leading-none text-slate-900 sm:text-6xl">Made for the way <em className="font-normal">you live.</em></h2></div>

    {isLoading && <ResidenceSkeleton />}
    {!isLoading && error && <p className="mt-12 rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">Unable to load residences: {error}</p>}
    {!isLoading && !error && properties.length === 0 && <p className="mt-12 rounded-2xl bg-white p-8 text-gray-600 shadow-sm">No residences are available yet. Please check back soon.</p>}
    {!isLoading && !error && activeResidence && <div className="mt-12">
      <div className="flex gap-3 overflow-x-auto pb-2" role="tablist" aria-label="Residence types">
        {types.map(type => <button key={type} role="tab" aria-selected={activeType === type} onClick={() => chooseType(type)} className={`shrink-0 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${activeType === type ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{type} Residence</button>)}
      </div>

      <div key={activeResidence.id} className="residence-fade-in mt-10 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="max-w-xl">
          <div className="flex items-start justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-amber-700">{activeResidence.type} Collection</p><h3 className="mt-3 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">{activeResidence.title || `${activeResidence.type} Residence`}</h3></div><span className="shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">{hasMultipleResidences ? `Residence ${activeIndex + 1} of ${residences.length}` : 'Private residence'}</span></div>
          <p className="mt-5 max-w-lg leading-7 text-gray-600">Every residence has been carefully composed to bring light, calm and effortless functionality to your day.</p>

          <dl className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
            <Spec icon={Maximize} label="Area" value={`${activeResidence.area} m²`} />
            <Spec icon={BedDouble} label="Bedrooms" value={activeResidence.bedrooms} />
            <Spec icon={Bath} label="Bathrooms" value={activeResidence.bathrooms} />
            <Spec icon={Maximize} label="From" value={formatPrice(activeResidence.price)} />
          </dl>

          <a className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2" href="#contact">Enquire about this residence</a>
        </div>

        <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-gray-200 shadow-xl shadow-slate-900/15">
          <img className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]" src={activeResidence.image_url} alt={`${activeResidence.title || activeResidence.type} interior`} />
          {hasMultipleResidences && <div className="absolute bottom-5 right-5 flex gap-2"><button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white" type="button" onClick={() => moveResidence(-1)} aria-label="Previous residence"><ChevronLeft size={20} /></button><button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white" type="button" onClick={() => moveResidence(1)} aria-label="Next residence"><ChevronRight size={20} /></button></div>}
        </div>
      </div>
    </div>}
  </div></section>
}

export default FloorPlans
