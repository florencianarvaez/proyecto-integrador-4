import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authService'

function RegisterPage() {
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

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    try {
      setLoading(true)
      await registerUser(email, password)
      navigate('/tasks')
    } catch {
      setError('No se pudo crear la cuenta. Revisá los datos ingresados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Crear cuenta</h1>
      <p>Registrate para comenzar a gestionar tus tareas.</p>

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
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Registrarme'}
        </button>
      </form>

      <p>
        ¿Ya tenés una cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </main>
  )
}

export default RegisterPage
