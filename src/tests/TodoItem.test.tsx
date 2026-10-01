import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import TodoItem from '../components/TodoItem'
import {
  deleteTask,
  toggleTask,
  updateTask,
} from '../services/taskService'
import type { Task } from '../types/task'

vi.mock('../services/taskService', () => ({
  deleteTask: vi.fn(),
  toggleTask: vi.fn(),
  updateTask: vi.fn(),
}))

const task: Task = {
  id: 'tarea-1',
  userId: 'usuario-test',
  title: 'Estudiar React',
  description: 'Repasar componentes y hooks',
  completed: false,
  createdAt: {} as Task['createdAt'],
  updatedAt: {} as Task['updatedAt'],
}

describe('TodoItem', () => {
  it('muestra la informacion de la tarea', () => {
    render(<TodoItem task={task} />)

    expect(
      screen.getByText('Estudiar React'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Repasar componentes y hooks'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Estado: Pendiente'),
    ).toBeInTheDocument()
  })

  it('permite marcar una tarea como completada', () => {
    render(<TodoItem task={task} />)

    fireEvent.click(
      screen.getByRole('button', {
        name: /marcar como completada/i,
      }),
    )

    expect(toggleTask).toHaveBeenCalledWith(
      'tarea-1',
      true,
    )
  })

  it('permite eliminar una tarea', () => {
    render(<TodoItem task={task} />)

    fireEvent.click(
      screen.getByRole('button', { name: /eliminar/i }),
    )

    expect(deleteTask).toHaveBeenCalledWith('tarea-1')
  })

  it('permite editar una tarea', async () => {
    render(<TodoItem task={task} />)

    fireEvent.click(
      screen.getByRole('button', { name: /editar/i }),
    )

    const titleInput = screen.getByLabelText('Título')

    fireEvent.change(titleInput, {
      target: { value: 'Estudiar TypeScript' },
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: /guardar cambios/i,
      }),
    )

    expect(updateTask).toHaveBeenCalledWith(
      'tarea-1',
      'Estudiar TypeScript',
      'Repasar componentes y hooks',
    )
  })
})

