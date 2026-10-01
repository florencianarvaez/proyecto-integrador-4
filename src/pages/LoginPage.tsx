import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/authService'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Completá todos los campos.')
      return
    }

    try {
      setLoading(true)
      await loginUser(email, password)
      navigate('/tasks')
    } catch {
      setError('Email o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Iniciar sesión</h1>
      <p>Ingresá a tu cuenta para gestionar tus tareas.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Tu contraseña"
            required
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p>
        ¿No tenés una cuenta? <Link to="/register">Crear cuenta</Link>
      </p>
    </main>
  )
}

export default LoginPage

