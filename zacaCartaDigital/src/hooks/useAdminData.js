import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const collections = ['productos', 'promociones', 'zonasDelivery']

export default function useAdminData() {
  const [data, setData] = useState({
    productos: [],
    promociones: [],
    zonasDelivery: [],
    config: null,
  })
  const [loading, setLoading] = useState(Boolean(db))
  const [error, setError] = useState(db ? '' : 'Firebase no está configurado. Completa las variables VITE_FIREBASE_* para conectar la carta.')

  useEffect(() => {
    if (!db) return undefined

    let pending = 4
    const markLoaded = () => {
      pending -= 1
      if (pending === 0) setLoading(false)
    }
    const reportError = (snapshotError) => {
      setError(`No se pudo conectar con Firestore: ${snapshotError.message}`)
      setLoading(false)
    }
    const unsubscribers = collections.map((name) => onSnapshot(
      collection(db, name),
      (snapshot) => {
        setData((current) => ({
          ...current,
          [name]: snapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
        }))
        markLoaded()
        setError('')
      },
      reportError,
    ))
    unsubscribers.push(onSnapshot(doc(db, 'config', 'general'), (snapshot) => {
      setData((current) => ({ ...current, config: snapshot.exists() ? snapshot.data() : null }))
      markLoaded()
      setError('')
    }, reportError))

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe())
  }, [])

  function addRecord(collectionName, values) {
    if (!db) return Promise.reject(new Error('Firebase no está configurado.'))
    return addDoc(collection(db, collectionName), values)
  }

  function updateRecord(collectionName, id, values) {
    if (!db) return Promise.reject(new Error('Firebase no está configurado.'))
    return updateDoc(doc(db, collectionName, id), values)
  }

  function deleteRecord(collectionName, id) {
    if (!db) return Promise.reject(new Error('Firebase no está configurado.'))
    return deleteDoc(doc(db, collectionName, id))
  }

  function saveConfig(values) {
    if (!db) return Promise.reject(new Error('Firebase no está configurado.'))
    return setDoc(doc(db, 'config', 'general'), values, { merge: true })
  }

  return {
    ...data,
    loading,
    error,
    addProduct: (values) => addRecord('productos', values),
    updateProduct: (id, values) => updateRecord('productos', id, values),
    deleteProduct: (id) => deleteRecord('productos', id),
    addPromo: (values) => addRecord('promociones', values),
    updatePromo: (id, values) => updateRecord('promociones', id, values),
    deletePromo: (id) => deleteRecord('promociones', id),
    addZone: (values) => addRecord('zonasDelivery', values),
    updateZone: (id, values) => updateRecord('zonasDelivery', id, values),
    deleteZone: (id) => deleteRecord('zonasDelivery', id),
    saveConfig,
  }
}