import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../services/firebase'
import type { Task } from '../types/task'

export const useTasks = (userId: string | undefined) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) {
      setTasks([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
    )

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasksData = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })) as Task[]

        setTasks(tasksData)
        setLoading(false)
      },
      () => {
        setError('No se pudieron cargar las tareas.')
        setLoading(false)
      },
    )

    return unsubscribe
  }, [userId])

  return {
    tasks,
    loading,
    error,
  }
}
