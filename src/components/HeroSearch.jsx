import { MapPin, Search } from 'lucide-react'
import { useState } from 'react'

const initialFilters = { propertyType: 'All residences', location: 'Marina District, Dubai', budget: '$750k - $2m' }

function HeroSearch({ onSearch }) {
  const [filters, setFilters] = useState(initialFilters)
  const updateFilter = event => setFilters(current => ({ ...current, [event.target.name]: event.target.value }))

  const handleSubmit = event => {
    event.preventDefault()
    onSearch(filters)
    document.getElementById('floor-plans')?.scrollIntoView({ behavior: 'smooth' })
  }

  return <form className="grid gap-4 rounded-t-2xl bg-white p-5 text-slate-900 shadow-xl md:grid-cols-[1.2fr_1fr_1fr_auto]" onSubmit={handleSubmit}>
    <label className="flex items-center gap-3"><MapPin className="shrink-0 text-amber-600" /><span className="min-w-0 flex-1"><span className="block text-xs text-slate-500">Location</span><select className="w-full bg-transparent font-semibold outline-none" name="location" value={filters.location} onChange={updateFilter} aria-label="Location"><option>Marina District, Dubai</option><option>Downtown Dubai</option><option>Palm Jumeirah, Dubai</option></select></span></label>
    <label><span className="block text-xs text-slate-500">Property type</span><select className="w-full bg-transparent font-semibold outline-none" name="propertyType" value={filters.propertyType} onChange={updateFilter} aria-label="Property type"><option>All residences</option><option>2BR</option><option>3BR</option><option>Penthouse</option><option>Villa</option></select></label>
    <label><span className="block text-xs text-slate-500">Budget</span><select className="w-full bg-transparent font-semibold outline-none" name="budget" value={filters.budget} onChange={updateFilter} aria-label="Budget"><option>$750k - $2m</option><option>$2m - $5m</option></select></label>
    <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-sm font-bold text-white hover:bg-amber-700" type="submit"><Search size={18} />Search</button>
  </form>
}

export default HeroSearch
