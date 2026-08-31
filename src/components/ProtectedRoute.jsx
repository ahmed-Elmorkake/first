import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    let isMounted = true

    const loadAccess = async currentSession => {
      if (!currentSession) {
        if (isMounted) {
          setSession(null)
          setIsAdmin(false)
          setIsLoading(false)
        }
        return
      }

      const { data: adminRole } = await supabase.rpc('is_admin')
      if (isMounted) {
        setSession(currentSession)
        setIsAdmin(Boolean(adminRole))
        setIsLoading(false)
      }
    }

    const loadSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      loadAccess(currentSession)
    }

    loadSession()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => loadAccess(nextSession))

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (isLoading) return <div className="grid min-h-screen place-items-center bg-stone-50 text-slate-700">Checking your session...</div>
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />
  if (!isAdmin) return <main className="grid min-h-screen place-items-center bg-stone-50 px-6 text-center"><div><p className="text-xs font-bold tracking-[.2em] text-amber-700">AUREA RESIDENCES</p><h1 className="mt-3 font-serif text-5xl">Access denied</h1><p className="mt-4 text-slate-600">This account does not have administrator access.</p><button className="mt-7 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white" type="button" onClick={() => supabase.auth.signOut()}>Sign out</button></div></main>

  return children
}

export default ProtectedRoute
