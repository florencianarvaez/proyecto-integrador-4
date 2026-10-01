import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TodoForm from '../components/TodoForm'
import TodoItem from '../components/TodoItem'
import { useAuth } from '../features/auth/AuthContext'
import { useTasks } from '../hooks/useTasks'
import { logoutUser } from '../services/authService'
import { sendTaskSummary } from '../services/emailService'

function TasksPage() {
  const { user } = useAuth()
  const { tasks, loading, error } = useTasks(user?.uid)
  const navigate = useNavigate()

  const [emailMessage, setEmailMessage] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)

  const handleLogout = async () => {
    await logoutUser()
    navigate('/login')
  }

  const handleSendSummary = async () => {
    if (!user?.email) {
      setEmailMessage('No se encontró el email del usuario.')
      return
    }

    try {
      setSendingEmail(true)
      setEmailMessage('')

      await sendTaskSummary(user.email, tasks)

      setEmailMessage('Resumen enviado correctamente.')
    } catch {
      setEmailMessage('No se pudo enviar el resumen.')
    } finally {
      setSendingEmail(false)
    }
  }

  return (
    <main>
      <header>
        <h1>Mis tareas</h1>
        <p>Sesión iniciada como: {user?.email}</p>

        <button onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <TodoForm />

      <section>
        <h2>Lista de tareas</h2>

        {loading && <p>Cargando tareas...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && !error && tasks.length === 0 && (
          <p>Todavía no tenés tareas.</p>
        )}

        {!loading &&
          tasks.map((task) => (
            <TodoItem
              key={task.id}
              task={task}
            />
          ))}
      </section>

      <section>
        <h2>Resumen por email</h2>

        <button
          onClick={handleSendSummary}
          disabled={sendingEmail || loading}
        >
          {sendingEmail
            ? 'Enviando...'
            : 'Enviar resumen por email'}
        </button>

        {emailMessage && <p>{emailMessage}</p>}
      </section>
    </main>
  )
}

export default TasksPage

