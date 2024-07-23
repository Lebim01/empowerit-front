import { db } from "@/configs/firebaseConfig"
import { collection, getDocs, orderBy, query } from "firebase/firestore"

export const getParticipations = async (id_user: string) => {
     let participations = []
     const queryRef = query(
          collection(db, `users/${id_user}/participations`),
          orderBy("next_pay", "asc")
      );
      const querySnapshot = await getDocs(queryRef);

     for (const doc of querySnapshot.docs) {
          participations.push(doc.data())
     }
     return participations
}