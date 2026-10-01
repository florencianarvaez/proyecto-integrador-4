import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import TodoForm from '../components/TodoForm'
import { createTask } from '../services/taskService'

vi.mock('../features/auth/AuthContext', () => ({
  useAuth: () => ({
    user: {
      uid: 'usuario-test',
      email: 'test@test.com',
    },
  }),
}))

vi.mock('../services/taskService', () => ({
  createTask: vi.fn(),
}))

describe('TodoForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra un error si se intenta crear una tarea sin titulo', async () => {
    render(<TodoForm />)

    fireEvent.click(
      screen.getByRole('button', { name: /crear tarea/i }),
    )

    expect(
      await screen.findByText('El título es obligatorio.'),
    ).toBeInTheDocument()

    expect(createTask).not.toHaveBeenCalled()
  })

  it('crea una tarea con titulo y descripcion', async () => {
    render(<TodoForm />)

    fireEvent.change(screen.getByLabelText('Título'), {
      target: { value: 'Terminar proyecto' },
    })

    fireEvent.change(screen.getByLabelText('Descripción'), {
      target: { value: 'Completar los tests' },
    })

    fireEvent.click(
      screen.getByRole('button', { name: /crear tarea/i }),
    )

    expect(createTask).toHaveBeenCalledWith(
      'usuario-test',
      'Terminar proyecto',
      'Completar los tests',
    )
  })
})

