import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from "@/configs/firebaseConfig"
import { useEffect, useState } from 'react'
import useClipboard from '@/utils/hooks/useClipboard'
import { useAppSelector } from '@/store'
import { useNavigate } from 'react-router-dom'

type MarketplaceCreditsCheckoutProps = {
    onBack: () => void
  }

export default function MarketplaceCreditsCheckout(props: MarketplaceCreditsCheckoutProps) {

    const { copy } = useClipboard()
    const navigate = useNavigate()
    const user = useAppSelector((state) => state.auth.user)

    const [cart, setCart] = useState<any[]>([])
    const [total,setTotal] = useState<number>(0)
    const [cartComplete, setCartComplete] = useState<DocumentData>()

    useEffect(() => {
        getCart()
    }, [])

    useEffect(() => {
        getTotal()
    },[cart])

    const getCart = async () => {
        const res = await getDoc(doc(db, `users/${user.uid}/cart/1`))
        if (res.exists()) {
            const documentData = res.data()
            setCartComplete(documentData)
            try {
                const _cart = JSON.parse(res.get('json'))
                setCart(_cart)
            } catch (err) {
                console.error(err)
            }
        }
    }
    const getTotal = () => {
        let total = 0;
        cart.filter((p) => p.quantity).map((p) => {
            total = total + (Math.ceil(p.sale_price / 17) * p.quantity)
        })
        let totalWithShipment = total + quantity
        setTotal(totalWithShipment)
    } 

    const quantity = cart.reduce((a, b) => a + b.quantity, 0)
    
    const substractCredits = async () => {
        let endCredits = Number(user.credits) - Number(total)
        const userDocRef = doc(db,`users/${user.uid}`)
        await updateDoc(userDocRef, {
            credits: endCredits
        })
        navigate("/home")
    }
    const createPendingShip = async () => {
        const docRef = await addDoc(collection(db,`users/${user.uid}/pending-ships/`), {
            cart: cartComplete,
            cartId: "1",
            created_at: new Date(),
            pack: "none",
            sent: "false"
          });
          console.log(docRef)
    }
    const deleteCart = async () => {
        await deleteDoc(doc(db,`users/${user.uid}/cart/1`))
    }
    const completeBuyProcess = async () => {
        await createPendingShip()
        await deleteCart()
        await substractCredits()
    }

    return (
        <div>
            <p className="font-bold underline underline-offset-8 mb-2 text-lg">
                Lista de compra
            </p>
            <div className="grid grid-cols-[min-content_1fr] gap-2 mb-8">
                {cart
                    .filter((p) => p.quantity)
                    .map((p) => (
                        <>
                            <span className="font-bold">x{p.quantity}</span>
                            <span>{p.name}</span>
                        </>
                    ))}
            </div>
            <p className="font-bold underline underline-offset-8 mb-2 text-lg">
                Total a pagar
            </p>
            <div>
                <span>{total} créditos</span>
            </div>
            <div className="flex justify-between mt-8">
                <span className="underline hover:cursor-pointer" onClick={props.onBack}>
                    {'<'} Regresar al carrito
                </span>
                <button
                    className="bg-black text-white rounded-full px-6 py-2"
                    onClick={() => completeBuyProcess()}
                >
                    Comprar
                </button>
            </div>
        </div>
    )
}
