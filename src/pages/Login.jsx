import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const C = { bg:"#0f1117", surface:"#181b23", border:"#2a2e3a", text:"#e8eaf0", textMuted:"#8b90a0", accent:"#c9a227" }
const font = "'DM Sans', sans-serif"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      const result = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password)

      if (!result) {
        setError('Authentication service is not available. Check your connection.')
        return
      }

      const { error: authError } = result

      if (authError) {
        setError(authError.message)
      } else if (isSignUp) {
        setMessage('Check your email for a confirmation link.')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <div style={{ width: '100%', maxWidth: 380, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent, boxShadow: `0 0 8px ${C.accent}` }}/>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.text, letterSpacing: '-0.01em' }}>THE JOURNEY</span>
        </div>
        <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700, color: C.text }}>
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            style={{ display: 'block', width: '100%', marginBottom: 12, padding: '10px 12px', fontSize: 13, fontFamily: font, color: C.text, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, outline: 'none', boxSizing: 'border-box' }}
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            style={{ display: 'block', width: '100%', marginBottom: 16, padding: '10px 12px', fontSize: 13, fontFamily: font, color: C.text, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, outline: 'none', boxSizing: 'border-box' }}
          />
          {error && <p style={{ color: '#ef4444', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}
          {message && <p style={{ color: '#22c55e', fontSize: 13, margin: '0 0 12px' }}>{message}</p>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px 16px', fontSize: 13, fontWeight: 600, fontFamily: font, background: loading ? '#a0891f' : C.accent, color: '#0f1117', border: 'none', borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        <button onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null) }}
          style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', color: C.textMuted, fontSize: 13, cursor: 'pointer', fontFamily: font }}>
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  )
}
