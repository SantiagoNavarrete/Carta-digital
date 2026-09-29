import 'dotenv/config'
import process from 'node:process'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { HORARIOS, INSTAGRAM_URL, FACEBOOK_URL, WHATSAPP_NUMBER } from '../src/config.js'
import { menuSections } from '../src/data/menuData.js'
import { ZONAS_DELIVERY } from '../src/data/zonasDelivery.js'

const requiredVariables = [
  'VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID', 'FIREBASE_SEED_EMAIL', 'FIREBASE_SEED_PASSWORD',
]
const missingVariables = requiredVariables.filter((name) => !process.env[name])
if (missingVariables.length) {
  throw new Error(`Faltan variables en .env: ${missingVariables.join(', ')}`)
}

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
})
const auth = getAuth(app)
const db = getFirestore(app)

await signInWithEmailAndPassword(auth, process.env.FIREBASE_SEED_EMAIL, process.env.FIREBASE_SEED_PASSWORD)

function makeId(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const products = menuSections.flatMap((section, sectionIndex) => section.items.map((item, itemIndex) => ({
  id: `${makeId(section.title)}-${makeId(item.name)}`,
  data: {
    nombre: item.name,
    categoria: section.title,
    precio: item.price,
    descripcion: item.description || '',
    activo: true,
    picante: /picante|mexicana/i.test(item.name),
    vegetariano: /verduras|vegetariano|caprese/i.test(item.name),
    masPedido: false,
    orden: sectionIndex * 100 + itemIndex,
  },
})))

for (const product of products) {
  await setDoc(doc(db, 'productos', product.id), product.data)
}
for (const zone of ZONAS_DELIVERY) {
  await setDoc(doc(db, 'zonasDelivery', makeId(zone.zona)), zone)
}
await setDoc(doc(db, 'config', 'general'), {
  whatsappNumber: WHATSAPP_NUMBER,
  horarios: HORARIOS,
  instagramUrl: INSTAGRAM_URL,
  facebookUrl: FACEBOOK_URL,
})

console.log(`Carga terminada: ${products.length} productos, ${ZONAS_DELIVERY.length} zonas y configuración general.`)
process.exit(0)