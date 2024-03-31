import React, { useState, useEffect } from 'react'
import { Table, Badge } from '@/components/ui'
import dayjs from 'dayjs'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  QueryDocumentSnapshot,
  endBefore,
  endAt,
} from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'

const { Tr, Th, Td, THead, TBody } = Table

const statusColor: Record<string, string> = {
  paid: 'bg-emerald-500',
  pending: 'bg-amber-400',
}

interface RowData {
  id: string
  item: string
  status: string
  date: number
  amount: number
}

interface BillingHistoryProps {
  data: RowData[]
}

const History: React.FC<BillingHistoryProps> = ({ data = [], ...rest }) => {
  const [users, setUsers] = useState<any>([])
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(
    null
  )
  const [firstVisible, setFirstVisible] =
    useState<QueryDocumentSnapshot | null>(null)
  const pageSize = 1000

  const loadPage = async (isNextPage: boolean) => {
    try {
      let _query = null

      if (isNextPage && lastVisible) {
        _query = query(
          collection(db, 'users'),
          orderBy('created_at'),
          limit(pageSize),
          startAfter(lastVisible)
        )
      } else if (!isNextPage && firstVisible) {
        _query = query(
          collection(db, 'users'),
          orderBy('created_at'),
          limit(pageSize),
          endAt(firstVisible)
        )
      } else {
        _query = query(
          collection(db, 'users'),
          orderBy('created_at'),
          limit(pageSize)
        )
      }

      const snapshot = await getDocs(_query!)
      const newUsers: any[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        date: doc.data().created_at
          ? dayjs(doc.data().created_at.seconds * 1000).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          : null,
        sponsor: doc.data().sponsor,
        upline: doc.data().parent_binary_user_id,
        position: doc.data().position,
        pay_status: doc.data().subscription_status,
        pay_status_link: doc.data().payment_link ? doc.data().payment_link : {},
      }))

      setUsers(newUsers)

      if (snapshot.docs.length > 0) {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1])
        setFirstVisible(snapshot.docs[0])
      }
    } catch (error) {
      console.error('Error loading page:', error)
    }
  }

  useEffect(() => {
    loadPage(true)
  }, [])

  return (
    <div {...rest} className="ov overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha y hora
            </th>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Correo
            </th>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sponsor
            </th>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Upline
            </th>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Posición
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((item: any, key: number) => {
            return (
              <tr
              key={key}
                className="hover:bg-gray-100 transition-colors text-center"
              >
                <td className="py-4 whitespace-nowrap">{item.date}</td>
                <td className="py-4 whitespace-nowrap">{item.name}</td>
                <td className="py-4 whitespace-nowrap">
                  {item.pay_status ? (
                    <span className="text-green-500">Pagado</span>
                  ) : item.pay_status_link.status === 'pending' ? (
                    <span className=" text-yellow-500">Pendiente Pago</span>
                  ) : item.pay_status_link.status === 'confitming' ? (
                    <span className="text-yellow-500">Confirmando Pago</span>
                  ) : (
                    <span className="text-red-500">----------</span>
                  )}
                </td>
                <td className="py-4 whitespace-nowrap">{item.email}</td>
                <td className="py-4 whitespace-nowrap">{item.sponsor}</td>
                <td className="py-4 whitespace-nowrap">{item.upline}</td>
                <td className="py-4 whitespace-nowrap">
                  {item.position === 'right' ? (
                    <span>Derecha</span>
                  ) : item.position === 'left' ? (
                    <span>Izquierda</span>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <div className="flex justify-center mt-4">
          {/*  <button
          className="px-4 py-2 mx-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200"
          onClick={() => loadPage(false)} disabled={!firstVisible}
        >
          Anterior
        </button>
        <button
          className="px-4 py-2 mx-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200"
          onClick={() => loadPage(true)} disabled={!lastVisible}
        >
          Siguiente
        </button> */}
        </div>
      </div>
    </div>
  )
}

export default History
