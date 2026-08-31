import { LockKeyhole } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

function AccessGate({ onSignIn, children, roles = ['member', 'admin'] }) {
  const { hasRole } = useAuth()
  if (hasRole(...roles)) return children
  return <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl bg-white p-8 text-center text-slate-900">
    <LockKeyhole className="text-amber-700" size={34}/>
    <h3 className="mt-5 font-serif text-3xl">Private access required</h3>
    <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">Create a complimentary Aurea account to access this private service.</p>
    <button className="mt-6 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-amber-700" type="button" onClick={onSignIn}>Sign in or create an account</button>
  </div>
}

export default AccessGate
