import { useNavigate } from 'react-router-dom'
import TodoForm from '../components/TodoForm'
import TodoItem from '../components/TodoItem'
import { useAuth } from '../features/auth/AuthContext'
import { useTasks } from '../hooks/useTasks'
import { logoutUser } from '../services/authService'

function TasksPage() {
  const { user } = useAuth()
  const { tasks, loading, error } = useTasks(user?.uid)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    navigate('/login')
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
    </main>
  )
}

export default TasksPage

