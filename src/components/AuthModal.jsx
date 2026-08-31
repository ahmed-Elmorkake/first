import { X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'

function AuthModal({ onClose }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const submit = event => {
    event.preventDefault()
    if (mode === 'signup' && !form.name.trim()) return setError('Please enter your name.')
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Please enter a valid email address.')
    if (form.password.length < 8) return setError('Password must contain at least 8 characters.')
    try {
      mode === 'signin' ? signIn(form.email, form.password) : signUp(form.name.trim(), form.email, form.password)
      onClose()
    } catch (authError) {
      setError(authError.message)
    }
  }

  const switchMode = nextMode => { setMode(nextMode); setError('') }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-5" role="dialog" aria-modal="true" aria-labelledby="auth-title">
    <div className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl sm:p-9">
      <button className="absolute right-5 top-5 rounded-full p-2 text-slate-500 hover:bg-stone-100" type="button" onClick={onClose} aria-label="Close authentication dialog"><X size={20}/></button>
      <p className="text-xs font-bold tracking-[.2em] text-amber-700">AUREA PRIVATE ACCESS</p>
      <h2 id="auth-title" className="mt-3 font-serif text-4xl">{mode === 'signin' ? 'Welcome back.' : 'Create your account.'}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">Sign in to calculate your investment and send a viewing enquiry.</p>
      <form className="mt-7 space-y-5" onSubmit={submit} noValidate>
        {mode === 'signup' && <label className="block text-sm font-bold">Name<input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-amber-600" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} autoComplete="name" /></label>}
        <label className="block text-sm font-bold">Email<input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-amber-600" type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} autoComplete="email" /></label>
        <label className="block text-sm font-bold">Password<input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-amber-600" type="password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} /></label>
        {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
        <button className="w-full rounded-full bg-slate-900 px-6 py-4 text-sm font-bold text-white hover:bg-amber-700" type="submit">{mode === 'signin' ? 'Sign in' : 'Create account'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">{mode === 'signin' ? 'New to Aurea?' : 'Already have an account?'} <button className="font-bold text-amber-800 underline" type="button" onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}>{mode === 'signin' ? 'Create an account' : 'Sign in'}</button></p>
    </div>
  </div>
}

export default AuthModal
