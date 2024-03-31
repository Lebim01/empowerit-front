import { Checkbox } from '@/components/ui'
import Table from '@/components/ui/Table'
import TBody from '@/components/ui/Table/TBody'
import THead from '@/components/ui/Table/THead'
import Td from '@/components/ui/Table/Td'
import Th from '@/components/ui/Table/Th'
import Tr from '@/components/ui/Table/Tr'
import { db } from '@/configs/firebaseConfig'
import useUserModalStore from '@/zustand/userModal'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const AdminPayroll = () => {
  const userModal = useUserModalStore((state) => state)
  const [payrolls, setPayrolls] = useState<any[]>([])
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null)
  const [modal, setModal] = useState(false)

  useEffect(() => {
    getDocs(
      query(collection(db, 'payroll'), orderBy('created_at', 'desc'))
    ).then((r) => {
      const payrollsPromises = r.docs.map(async (d) => {
        const payrollData = d.data()
        const detailsSnapshot = await getDocs(collection(d.ref, 'details'))
        const details = detailsSnapshot.docs.map((_d) => _d.data())
        const createdAt = payrollData.created_at.toDate()
        const formattedDate = createdAt.toLocaleString()
        return { ...payrollData, details, formattedDate }
      })

      Promise.all(payrollsPromises).then((payrollsData) => {
        setPayrolls(payrollsData)
      })
    })
  }, [])

  const handleRowClick = (payroll: any) => {
    setSelectedPayroll(payroll)
    setModal(true)
  }

  return (
    <div className="flex flex-col items-end space-y-8">
      <div className="w-full">
        <Table>
          <THead>
            <Tr>
              <Th>
                <Checkbox />
              </Th>
              <Th>Fecha de pago</Th>
              <Th>Total BTC</Th>
              <Th>Total USD</Th>
            </Tr>
          </THead>
          <TBody>
            {payrolls.map((payroll) => (
              <Tr
                key={payroll.id}
                onClick={() => handleRowClick(payroll)}
                style={{ cursor: 'pointer' }}
              >
                <Td>
                  <Checkbox />
                </Td>
                <Td>{payroll?.formattedDate}</Td>
                <Td>{payroll?.total_btc} BTC</Td>
                <Td>{payroll?.total_usd} USD</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
      {modal && (
        <div
          style={{ zIndex: 21 }}
          className="modal max-w-sm md:max-w-full overflow-scrol"
        >
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setModal(false)}
              style={{ cursor: 'pointer' }}
            >
              {' '}
              &times;{' '}
            </span>
            <Table>
              <THead>
                <Tr>
                  <Th>Binario</Th>
                  <Th>Puntos Binario</Th>
                  <Th>Lado de binario cobrado</Th>
                  <Th>Puntos a la izquierda</Th>
                  <Th>Puntos a la derecha</Th>
                  <Th>Cantidad BTC</Th>
                  <Th>Directo</Th>
                  <Th>Directo segundo nivel</Th>
                  <Th>Starter primer nivel</Th>
                  <Th>Residual</Th>
                  <Th>Residual segundo nivel</Th>
                  <Th>Beca</Th>
                  <Th>Beca segundo nivel</Th>
                  <Th>Beca tercer nivel</Th>
                  <Th>Supreme</Th>
                  <Th>Supreme segundo nivel</Th>
                  <Th>Supreme tercer nivel</Th>
                  <Th>Supreme crypto elite primer nivel</Th>
                  <Th>Supreme crypto elite segundo nivel</Th>
                  <Th>Supreme toprice xpert primer nivel</Th>
                  <Th>Supreme toprice xpert segundo nivel</Th>
                  <Th>Nombre</Th>
                  <Th>Sub Total</Th>
                  <Th>Comisiones</Th>
                  <Th>Total</Th>
                </Tr>
              </THead>
              <TBody>
                {selectedPayroll &&
                  selectedPayroll?.details.map((detail: any) => (
                    <Tr key={detail?.id}>
                      <Td>{detail?.binary} USD</Td>
                      <Td>{detail?.binary_points}</Td>
                      <Td>{detail?.binary_side}</Td>
                      <Td>{detail?.left_points}</Td>
                      <Td>{detail?.right_points}</Td>
                      <Td>{detail?.btc_amount}</Td>
                      <Td>{detail?.direct} USD</Td>
                      <Td>{detail?.direct_second_level} USD</Td>
                      <Td>{detail?.bond_direct_starter_level_1} USD</Td>
                      <Td>{detail?.residual || 0} USD</Td>
                      <Td>{detail?.residual_second_level || 0} USD</Td>
                      <Td>{detail?.scholarship || 0} USD</Td>
                      <Td>{detail?.scholarship_second_level || 0} USD</Td>
                      <Td>{detail?.scholarship_third_level || 0} USD</Td>
                      <Td>{detail?.supreme || 0} USD</Td>
                      <Td>{detail?.supreme_second_level || 0} USD</Td>
                      <Td>{detail?.supreme_third_level || 0} USD</Td>
                      <Td>{detail?.bond_crypto_elite_level_1 || 0} USD</Td>
                      <Td>{detail?.bond_crypto_elite_level_2 || 0} USD</Td>
                      <Td>{detail?.bond_toprice_xpert_level_1 || 0} USD</Td>
                      <Td>{detail?.bond_toprice_xpert_level_2 || 0} USD</Td>
                      <Td>
                        <span
                          className="underline text-blue-500 hover:cursor-pointer"
                          onClick={() => userModal.openModal(detail.id)}
                        >
                          {detail?.name}
                        </span>
                      </Td>
                      <Td>{detail?.subtotal} USD</Td>
                      <Td>{detail?.fee} USD</Td>
                      <Td>{detail?.total} USD</Td>
                    </Tr>
                  ))}
              </TBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPayroll
