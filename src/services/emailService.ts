import type { Task } from '../types/task'

export const sendTaskSummary = async (
  email: string,
  tasks: Task[],
) => {
  const response = await fetch('/api/send-summary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      tasks: tasks.map((task) => ({
        title: task.title,
        description: task.description,
        completed: task.completed,
      })),
    }),
  })

  if (!response.ok) {
    throw new Error('No se pudo enviar el resumen')
  }

  return response.json()
}
