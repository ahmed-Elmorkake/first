import { Menu, X } from 'lucide-react'
import { useState } from 'react'
const links = ['Overview', 'Gallery', 'Floor Plans', 'Calculator', 'Contact']
function Navbar() {
 const [open, setOpen] = useState(false); const close = () => setOpen(false)
 return <header className="absolute inset-x-0 top-0 z-20"><nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8" aria-label="Main navigation"><a className="font-serif text-3xl font-semibold text-white" href="#overview">AUREA<span className="text-amber-300">.</span></a><div className="hidden gap-8 lg:flex">{links.map(link => <a className="text-sm text-white/80 hover:text-white" key={link} href={`#${link.toLowerCase().replace(' ', '-')}`}>{link}</a>)}</div><a className="hidden rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-900 lg:block" href="#contact">Book a viewing</a><button className="text-white lg:hidden" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></nav>{open && <div className="mx-5 rounded-2xl bg-white p-5 shadow-2xl lg:hidden"><div className="flex flex-col gap-4">{links.map(link => <a className="font-medium" key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} onClick={close}>{link}</a>)}<a className="rounded-full bg-slate-900 px-5 py-3 text-center font-bold text-white" href="#contact" onClick={close}>Book a viewing</a></div></div>}</header>
}
export default Navbar
