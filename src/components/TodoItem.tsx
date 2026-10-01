import { useState, type FormEvent } from 'react'
import type { Task } from '../types/task'
import {
  deleteTask,
  toggleTask,
  updateTask,
} from '../services/taskService'

interface TodoItemProps {
  task: Task
}

function TodoItem({ task }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [error, setError] = useState('')

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('El título es obligatorio.')
      return
    }

    try {
      await updateTask(
        task.id,
        title.trim(),
        description.trim(),
      )

      setIsEditing(false)
    } catch {
      setError('No se pudo actualizar la tarea.')
    }
  }

  const handleCancel = () => {
    setTitle(task.title)
    setDescription(task.description)
    setError('')
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <article>
        <form onSubmit={handleUpdate}>
          <div>
            <label htmlFor={`title-${task.id}`}>
              Título
            </label>

            <input
              id={`title-${task.id}`}
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor={`description-${task.id}`}>
              Descripción
            </label>

            <textarea
              id={`description-${task.id}`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          {error && <p role="alert">{error}</p>}

          <button type="submit">
            Guardar cambios
          </button>

          <button type="button" onClick={handleCancel}>
            Cancelar
          </button>
        </form>
      </article>
    )
  }

  return (
    <article>
      <h3>{task.title}</h3>

      {task.description && (
        <p>{task.description}</p>
      )}

      <p>
        Estado: {task.completed ? 'Completada' : 'Pendiente'}
      </p>

      <button
        onClick={() => toggleTask(task.id, !task.completed)}
      >
        {task.completed
          ? 'Marcar como pendiente'
          : 'Marcar como completada'}
      </button>

      <button onClick={() => setIsEditing(true)}>
        Editar
      </button>

      <button onClick={() => deleteTask(task.id)}>
        Eliminar
      </button>
    </article>
  )
}

export default TodoItem

