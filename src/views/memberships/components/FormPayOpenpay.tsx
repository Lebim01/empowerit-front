import { Input } from '@/components/ui'
import { BsCash } from 'react-icons/bs'
import { useAppSelector } from '@/store'
import { formatNumberWithCommas } from '@/utils/format'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'

const FormPayOpenpay = ({ qr }: { qr: any }) => {
  const user = useAppSelector((state) => state.auth.user)

  const openModal = () => {
    window.open(qr.redirect_url)
  }

  const cancel = async () => {
    await updateDoc(doc(db, `openpay/${user?.openpay_link}`), {
      status: 'cancelled',
    })
    await updateDoc(doc(db, `users/${user?.uid}`), {
      openpay_link: null,
    })
  }

  return (
    <div className="flex flex-1 flex-col space-y-2 items-center">
      <span>{user.email}</span>

      <div className="w-full">
        <label>Método de pago</label>
        <Input readOnly value={'Openpay'} />
      </div>

      <div className="w-full">
        <label>Total a pagar</label>
        <Input
          readOnly
          prefix={<BsCash />}
          value={formatNumberWithCommas(qr.amount) + ' MXN'}
        />
      </div>

      <div className="flex justify-end w-full gap-2">
        <button
          className="rounded-md px-4 py-2 text-gray-400 text-base hover:bg-gray-400 hover:text-white border"
          onClick={() => cancel()}
        >
          Cancelar
        </button>
        <button
          className="bg-success rounded-md px-4 py-2 text-white text-xl hover:bg-green-800"
          onClick={() => openModal()}
        >
          Pagar
        </button>
      </div>
    </div>
  )
}

export default FormPayOpenpay
