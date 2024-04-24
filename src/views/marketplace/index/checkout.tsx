import { db } from "@/configs/firebaseConfig"
import { useAppSelector } from "@/store"
import { currencyIcon } from "@/views/memberships/components/ButtonSwapCurrency"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { FiCopy } from "react-icons/fi"
import useClipboard from '@/utils/hooks/useClipboard'
import { BsWallet } from "react-icons/bs"
import { Input } from "@/components/ui"

const MarketplaceCheckout = () => {
  const { copy } = useClipboard()
  const user = useAppSelector((state) => state.auth.user)

  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [paymentLink, setPaymentLink] = useState({
    address: '',
    amount: 0,
    currency: 'LTC',
    qr: '',
  })

  useEffect(() => {
    getLink()
    getCart()
  }, [])

  const getCart = async () => {
    const res = await getDoc(doc(db, `users/${user.uid}/cart/1`))
    if (res.exists()) {
      try {
        const _cart = JSON.parse(res.get('json'))
        setCart(_cart)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const getLink = async () => {
    try {
      const paymentLink = await fetch(
        `${import.meta.env.VITE_API_URL}/cart/pay`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_user: user.uid,
          }),
        }
      ).then((r) => r.json())
      setPaymentLink(paymentLink)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <p className="font-bold underline underline-offset-8 mb-2 text-lg">Lista de compra</p>
      <div className="grid grid-cols-[min-content_1fr] gap-2 mb-8">
        {cart.filter(p => p.quantity).map((p) => (
          <>
            <span className="font-bold">x{p.quantity}</span>
            <span>{p.name}</span>
          </>
        ))}
      </div>
      <div className="flex flex-1 flex-col space-y-2 items-center max-w-[500px] w-full">
        <img src={paymentLink.qr} />

        <span>{user.email}</span>

        <Input
          readOnly
          prefix={<BsWallet />}
          value={paymentLink.address}
          suffix={
            <div
              className="bg-gray-200 p-2 rounded-lg hover:cursor-pointer hover:bg-gray-300"
              onClick={() => copy(paymentLink.address)}
            >
              <FiCopy />
            </div>
          }
        />

        <div className={'grid gap-x-4 w-full'}>
          <Input
            readOnly
            prefix={currencyIcon['LTC']}
            value={paymentLink.amount.toFixed(8)}
            suffix={
              <div className="flex items-center space-x-2">
                <span>LTC</span>{' '}
                <div
                  className="bg-gray-200 p-2 rounded-lg hover:cursor-pointer hover:bg-gray-300"
                  onClick={() => copy(paymentLink.amount.toFixed(8) || '')}
                >
                  <FiCopy />
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}

export default MarketplaceCheckout