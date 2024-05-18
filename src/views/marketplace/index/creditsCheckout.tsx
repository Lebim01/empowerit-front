import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from "@/configs/firebaseConfig"
import { useEffect, useState } from 'react'
import useClipboard from '@/utils/hooks/useClipboard'
import { useAppSelector } from '@/store'
import { useNavigate } from 'react-router-dom'

type MarketplaceCreditsCheckoutProps = {
    onBack: () => void
  }

export default function MarketplaceCreditsCheckout(props: MarketplaceCreditsCheckoutProps) {

    const holi = () =>{
        console.log(user)
    }

    const { copy } = useClipboard()
    const navigate = useNavigate()
    const user = useAppSelector((state) => state.auth.user)

    const [cart, setCart] = useState<any[]>([])
    const [total,setTotal] = useState<number>(0)

    useEffect(() => {
        getCart()
    }, [])

    useEffect(() => {
        getTotal()
    },[cart])

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
    const getTotal = () => {
        let total = 0;
        cart.filter((p) => p.quantity).map((p) => {
            total = total + (Math.ceil(p.sale_price / 17) * p.quantity)
        })
        let totalWithShipment = total + quantity
        setTotal(totalWithShipment)
    } 

    const quantity = cart.reduce((a, b) => a + b.quantity, 0)
    
    /* Crear una funcion que le reste los creditos al perfil */
    const substractCredits = async () => {
        /* 9CXMbcJt2sNWG40zqWwQSxH8iki2 */
        let endCredits = Number(user.credits) - Number(total)
        const userDocRef = doc(db,"users","9CXMbcJt2sNWG40zqWwQSxH8iki2")
        await updateDoc(userDocRef, {
            credits: endCredits
        })
        console.log('Se ha realizado la substraccion de los creditos')
        navigate("/home")
    }
    /* Crear una funcion que mande el cart a pending ships y de aqui tomare el ejemplo /users/1AGZxXU5gQUGUa6wnmWr7Fk1qXC3/pending-ships/cAXtJmp4sk049MvGs2NX */


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
                <span>200 créditos</span>
            </div>
            <div className="flex justify-between mt-8">
                <span className="underline hover:cursor-pointer" onClick={props.onBack}>
                    {'<'} Regresar al carrito
                </span>
                <button
                    className="bg-black text-white rounded-full px-6 py-2"
                    onClick={() => substractCredits()}
                >
                    Comprar
                </button>
                <button
                    className="bg-black text-white rounded-full px-6 py-2"
                    onClick={() => holi()}
                >
                    mostrar user
                </button>
            </div>
        </div>
        /* 
            /users/1AGZxXU5gQUGUa6wnmWr7Fk1qXC3/pending-ships/cAXtJmp4sk049MvGs2NX
         */
    )
}
