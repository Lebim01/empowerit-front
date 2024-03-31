import { Button, Checkbox } from '@/components/ui'
import Table from '@/components/ui/Table'
import TBody from '@/components/ui/Table/TBody'
import THead from '@/components/ui/Table/THead'
import Td from '@/components/ui/Table/Td'
import Th from '@/components/ui/Table/Th'
import Tr from '@/components/ui/Table/Tr'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'

const AdminPayroll = () => {
  const [users, setUsers] = useState<any[]>([])
  const [fee, setFee] = useState('')
  const [loadingFee, setLoadingFee] = useState(false)
  const [loadingPayment, setLoadingPayment] = useState(false)

  const getFees = async () => {
    try {
      setLoadingFee(true)
      const res = await axios.get(
        process.env.NODE_ENV == ''
          ? ''
          : `${import.meta.env.VITE_API_URL}/getFees`
      )
      setFee(res.data.standard)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingFee(false)
    }
  }

  const execPayroll = async () => {
    try {
      setLoadingPayment(true)
      await fetch(
        `${import.meta.env.VITE_API_URL}/admin/payroll?blockchain=litecoin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      window.location.reload()
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingPayment(false)
    }
  }

  const getPayroll = async () => {
    try {
      setLoadingPayment(true)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/payroll`
      ).then((r) => r.json())
      setUsers(response)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingPayment(false)
    }
  }

  useEffect(() => {
    getPayroll()
  }, [])

  return (
    <div className="flex flex-col items-end space-y-8">
      <div className="flex space-x-4 items-center">
        <span>{fee}</span>
        {/*<Button loading={loadingFee} onClick={getFees}>
          Calcular Fees
        </Button>*/}
        <Button variant="solid" loading={loadingPayment} onClick={execPayroll}>
          REALIZAR PAGOS
        </Button>
      </div>
      <div className="w-full">
        <Table>
          <THead>
            <Tr>
              <Th>
                <Checkbox />
              </Th>
              <Th>Socio</Th>
              <Th>Bono Directo</Th>
              <Th>Bono Directo Segundo nivel </Th>
              <Th>Bono Starter Primer nivel </Th>
              <Th>Bono Residual</Th>
              <Th>Bono Residual Segundo nivel </Th>
              <Th>Bono Residual Tercer nivel </Th>
              <Th>Bono Beca</Th>
              <Th>Bono beca Segundo nivel </Th>
              <Th>Bono beca Tercer nivel </Th>
              <Th>Bono Supreme</Th>
              <Th>Bono Supreme Segundo nivel </Th>
              <Th>Bono Supreme Tercer nivel </Th>
              <Th>Bono Crypto Elite Segundo nivel </Th>
              <Th>Bono Crypto Elite Primer nivel </Th>
              <Th>Bono Toprice Xpert Primer nivel </Th>
              <Th>Bono Toprice Xpert Segundo nivel </Th>
              <Th>Bono Binario</Th>
              <Th>5% fee</Th>
              <Th>Total (D+B-F)</Th>
              <Th>Wallet</Th>
            </Tr>
          </THead>
          <TBody>
            <Tr>
              <Td></Td>
              <Td>
                <b className="whitespace-nowrap">TOTAL</b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  ${users.reduce((a, b) => a + b?.direct || 0, 0)} usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  ${users.reduce((a, b) => a + b?.direct_second_level || 0, 0)}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  $
                  {users.reduce(
                    (a, b) => a + b?.bond_direct_starter_level_1 || 0,
                    0
                  )}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  ${users.reduce((a, b) => a + b?.residual || 0, 0)} usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  $
                  {users.reduce((a, b) => a + b?.residual_second_level || 0, 0)}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  ${users.reduce((a, b) => a + b?.residual_third_level || 0, 0)}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  ${users.reduce((a, b) => a + b?.scholarship || 0, 0)} usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  $
                  {users.reduce(
                    (a, b) => a + b?.scholarship_second_level || 0,
                    0
                  )}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  $
                  {users.reduce(
                    (a, b) => a + b?.scholarship_third_level || 0,
                    0
                  )}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  ${users.reduce((a, b) => a + b?.supreme || 0, 0)} usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  ${users.reduce((a, b) => a + b?.supreme_second_level || 0, 0)}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  ${users.reduce((a, b) => a + b?.supreme_third_level || 0, 0)}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  $
                  {users.reduce(
                    (a, b) => a + b?.bond_crypto_elite_level_1 || 0,
                    0
                  )}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  $
                  {users.reduce(
                    (a, b) => a + b?.bond_crypto_elite_level_2 || 0,
                    0
                  )}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  $
                  {users.reduce(
                    (a, b) => a + b?.bond_toprice_xpert_level_1 || 0,
                    0
                  )}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  $
                  {users.reduce(
                    (a, b) => a + b?.bond_toprice_xpert_level_2 || 0,
                    0
                  )}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  ${users.reduce((a, b) => a + b?.binary || 0, 0)} usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  ${users.reduce((a, b) => a + b?.fee || 0, 0)} usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  ${users.reduce((a, b) => a + b?.total || 0, 0)} usd
                </b>
              </Td>
              <Td></Td>
            </Tr>
            {users
              .sort((a, b) => b.total - a.total)
              .map((user) => (
                <Tr key={user.id}>
                  <Td>
                    <Checkbox
                      disabled={!user.wallet_bitcoin || user.total < 40}
                    />
                  </Td>
                  <Td>{user.name}</Td>
                  <Td>{user?.direct || 0} USD</Td>
                  <Td>{user?.direct_second_level || 0} USD</Td>
                  <Td>{user?.bond_direct_starter_level_1 || 0} USD</Td>
                  <Td>{user?.residual || 0} USD</Td>
                  <Td>{user?.residual_second_level || 0} USD</Td>
                  <Td>{user?.residual_third_level || 0} USD</Td>
                  <Td>{user?.scholarship || 0} USD</Td>
                  <Td>{user?.scholarship_second_level || 0} USD</Td>
                  <Td>{user?.scholarship_third_level || 0} USD</Td>
                  <Td>{user?.supreme || 0} USD</Td>
                  <Td>{user?.supreme_second_level || 0} USD</Td>
                  <Td>{user?.supreme_third_level || 0} USD</Td>
                  <Td>{user?.bond_crypto_elite_level_1 || 0} USD</Td>
                  <Td>{user?.bond_crypto_elite_level_2 || 0} USD</Td>
                  <Td>{user?.bond_toprice_xpert_level_1 || 0} USD</Td>
                  <Td>{user?.bond_toprice_zpert_elite_level_1 || 0} USD</Td>
                  <Td>{user?.binary || 0} USD</Td>
                  <Td>-{user?.fee || 0} USD</Td>
                  <Td>{user?.total || 0} USD</Td>
                  <Td>
                    {user.wallet_bitcoin ? (
                      <FaCheck className="text-green-400" />
                    ) : (
                      <FaTimes className="text-red-400" />
                    )}
                  </Td>
                </Tr>
              ))}
          </TBody>
        </Table>
      </div>
    </div>
  )
}

export default AdminPayroll
