import { db } from '@/configs/firebaseConfig'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'

export const getAllExistantCredits = async () => {
  const usersRef = collection(db, 'users')
  const q = query(
    usersRef,
    where('credits', '>', 0),
    orderBy('credits', 'desc')
  )
  const querySnapshot = await getDocs(q)

  if (!querySnapshot.empty) {
    const data = querySnapshot.docs.map((doc) => ({
      name: doc.data().name,
      email: doc.data().email,
      credits: doc.data().credits,
    }))
    return data
  } else {
    return null
  }
}
