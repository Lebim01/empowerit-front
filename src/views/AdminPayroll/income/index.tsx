import {
  collectionGroup,
  getDoc,
  getDocs,
  query,
  where,
  doc,
  orderBy,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { db } from '@/configs/firebaseConfig'
import dayjs from 'dayjs'

const IncomeReport = () => {
  const [outgoing, setOutgoing] = useState<any[]>([])

  const getData = async () => {
    const data = []
    const res = await getDocs(
      query(
        collectionGroup(db, `transactions`),
        where('data.event', '==', 'ADDRESS_COINS_TRANSACTION_CONFIRMED'),
        orderBy('created_at', 'desc')
      )
    )

    for (const _doc of res.docs) {
      data.push({
        ..._doc.data(),
        user: await getDoc(doc(db, `users/${_doc.ref.parent.parent?.id}`)).then(
          (r) => r.data()
        ),
      })
    }

    setOutgoing(data)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div>
      <table className="w-full">
        <tr>
          <th className="text-left">Usuario</th>
          <th className="text-left">Wallet</th>
          <th className="text-right">Amount</th>
          <th>Currency</th>
          <th>Dirección</th>
          <th className="text-left">Fecha</th>
        </tr>
        {outgoing.map((row) => (
          <tr key={row.id}>
            <td className="text-left">{row.user.email}</td>
            <td className="text-left">{row.data.item.address}</td>
            <td className="text-right">{row.data.item.amount}</td>
            <td className="text-center">{row.data.item.unit}</td>
            <td className="text-center text-green-600">Entrante</td>
            <td className="text-left">
              {dayjs(row.created_at.seconds * 1000).format(
                'YYYY-MM-DD HH:mm:ss'
              )}
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
}

export default IncomeReport
