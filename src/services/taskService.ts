import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'

const tasksCollection = collection(db, 'tasks')

export const createTask = async (
  userId: string,
  title: string,
  description: string,
) => {
  return addDoc(tasksCollection, {
    userId,
    title,
    description,
    completed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const updateTask = async (
  taskId: string,
  title: string,
  description: string,
) => {
  const taskRef = doc(db, 'tasks', taskId)

  return updateDoc(taskRef, {
    title,
    description,
    updatedAt: serverTimestamp(),
  })
}

export const toggleTask = async (
  taskId: string,
  completed: boolean,
) => {
  const taskRef = doc(db, 'tasks', taskId)

  return updateDoc(taskRef, {
    completed,
    updatedAt: serverTimestamp(),
  })
}

export const deleteTask = async (taskId: string) => {
  const taskRef = doc(db, 'tasks', taskId)

  return deleteDoc(taskRef)
}

