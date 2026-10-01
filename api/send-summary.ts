import {
  SESClient,
  SendEmailCommand,
} from '@aws-sdk/client-ses'

interface TaskSummary {
  title: string
  description?: string
  completed: boolean
}

interface RequestBody {
  email: string
  tasks: TaskSummary[]
}

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
})

export default async function handler(
  request: any,
  response: any,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({
      error: 'Metodo no permitido',
    })
  }

  try {
    const { email, tasks } = request.body as RequestBody

    if (!email) {
      return response.status(400).json({
        error: 'El email es obligatorio',
      })
    }

    if (!Array.isArray(tasks)) {
      return response.status(400).json({
        error: 'Las tareas son obligatorias',
      })
    }

    const taskList =
      tasks.length === 0
        ? 'No tenes tareas registradas.'
        : tasks
            .map(
              (task, index) =>
                `${index + 1}. ${task.title}
Estado: ${task.completed ? 'Completada' : 'Pendiente'}
${task.description ? `Descripcion: ${task.description}` : ''}`,
            )
            .join('\n\n')

    const command = new SendEmailCommand({
      Source: process.env.SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: 'Resumen de tus tareas',
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: `Hola!

Este es el resumen de tus tareas:

${taskList}

Enviado desde Gestor Estrategico de Tareas.`,
            Charset: 'UTF-8',
          },
        },
      },
    })

    await sesClient.send(command)

    return response.status(200).json({
      message: 'Resumen enviado correctamente',
    })
  } catch (error) {
    console.error('Error enviando email:', error)

    return response.status(500).json({
      error: 'No se pudo enviar el resumen',
    })
  }
}

