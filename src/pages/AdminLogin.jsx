import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setIsSubmitting(false)

    if (signInError || !data.session) {
      setError(signInError?.message || 'Could not create an authenticated session. Please try again.')
      return
    }

    const { data: isAdmin, error: roleError } = await supabase.rpc('is_admin')
    if (roleError || !isAdmin) {
      await supabase.auth.signOut()
      setError('This account does not have administrator access.')
      return
    }
    navigate('/admin', { replace: true })
  }

  return <main className="grid min-h-screen place-items-center bg-slate-950 px-6 py-12"><section className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl sm:p-9"><p className="text-xs font-bold tracking-[.2em] text-amber-700">AUREA RESIDENCES</p><h1 className="mt-3 font-serif text-5xl text-slate-900">Admin login</h1><p className="mt-3 text-sm leading-6 text-slate-600">Sign in with your authorized Supabase account to manage properties.</p><form className="mt-8 space-y-5" onSubmit={handleSubmit}><label className="block text-sm font-bold text-slate-800">Email<input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-amber-600" type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" required /></label><label className="block text-sm font-bold text-slate-800">Password<input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-amber-600" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label>{error && <p className="text-sm text-red-700" role="alert">{error}</p>}<button className="w-full rounded-full bg-slate-900 px-6 py-4 text-sm font-bold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button></form></section></main>
}

export default AdminLogin
