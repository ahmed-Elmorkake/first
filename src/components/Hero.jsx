import { ArrowRight } from 'lucide-react'
import HeroSearch from './HeroSearch'

function Hero({ onSearch }) {
  return <section id="overview" className="relative isolate min-h-[780px] overflow-hidden bg-slate-900 pt-32 text-white">
    <img className="absolute inset-0 -z-20 h-full w-full object-cover" src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=90" alt="Contemporary villa beside a pool" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-900/10" />
    <div className="mx-auto flex min-h-[620px] max-w-7xl flex-col justify-center px-6 pb-28 lg:px-8"><p className="mb-6 text-xs font-bold tracking-[.25em] text-amber-300">THE ART OF LIVING</p><h1 className="max-w-3xl font-serif text-6xl leading-[.9] sm:text-7xl lg:text-8xl">Architecture that feels like <em className="font-normal text-amber-200">home.</em></h1><p className="mt-7 max-w-lg text-lg leading-7 text-white/75">A singular collection of beautifully considered residences, made for a life lived without compromise.</p><a className="mt-10 flex w-fit items-center gap-3 rounded-full bg-amber-300 px-6 py-4 text-sm font-bold text-slate-900 hover:bg-white" href="#gallery">Explore the residences <ArrowRight size={18} /></a></div>
    <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 lg:px-8"><HeroSearch onSearch={onSearch} /></div>
  </section>
}

export default Hero
