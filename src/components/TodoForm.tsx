import { useState, type FormEvent } from 'react'
import { createTask } from '../services/taskService'
import { useAuth } from '../features/auth/AuthContext'

function TodoForm() {
  const { user } = useAuth()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('El título es obligatorio.')
      return
    }

    if (!user) {
      setError('Tenés que iniciar sesión para crear una tarea.')
      return
    }

    try {
      setLoading(true)

      await createTask(
        user.uid,
        title.trim(),
        description.trim(),
      )

      setTitle('')
      setDescription('')
    } catch {
      setError('No se pudo crear la tarea.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Nueva tarea</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Título</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej: Terminar proyecto"
          />
        </div>

        <div>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Agregá una descripción"
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear tarea'}
        </button>
      </form>
    </section>
  )
}

export default TodoForm
