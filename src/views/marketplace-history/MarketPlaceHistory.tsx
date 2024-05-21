import { Table } from '@/components/ui'
import TBody from '@/components/ui/Table/TBody'
import THead from '@/components/ui/Table/THead'
import Td from '@/components/ui/Table/Td'
import Th from '@/components/ui/Table/Th'
import Tr from '@/components/ui/Table/Tr'
import { useAppSelector } from '@/store'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import { useState } from 'react'

function MarketPlaceHistory() {

    const user = useAppSelector((state) => state.auth.user)
    const [cart,setCart] = useState()

    /**
     * Los campos que utilizare seran created_at, sent del json sacar cuantos productos y el precio que se pago 
     */
    console.log(user)

    const getQuantityByid = async () => {
        console.log('desde getQuantityByid')
        const res = await getDoc(doc(db, `users/${user.uid}/pending-ships/LppNN2WpbncPPHtXpw0y`))
        if (res.exists()) {
            try {
                const _cart = JSON.parse(res.data().get('cart'))
                setCart(_cart)
            } catch (err) {
                console.error(err)
            }
        }
    }

    console.log(cart)



    const getPendingShips = async () => {
        const querySnapshot = await getDocs(collection(db,`users/${user.uid}/pending-ships`))
        const pendingShipsData = []
        querySnapshot.forEach((doc) => {
            console.log(doc.id)
            /* pendingShipsData.push({
                date: doc.data().created_at,
                is_sent: doc.data().sent,
                quantity: doc.data().sent,
            }) */
        })
    }

    return (
        <>
            <span className='font-bold text-2xl my-4'>Historial de Créditos</span>
            <Table>
                <THead>
                    <Tr>
                        <Th>#</Th>
                        <Th>Fecha</Th>
                        <Th>Cantidad de productos</Th>
                        <Th>Creditos Totales</Th>
                        <Th>Status</Th>
                    </Tr>
                </THead>
                <TBody>
                    <Tr>
                        <Td>1</Td>
                        <Td>1234</Td>
                        <Td>1234123</Td>
                        <Td>1234213</Td>
                        <Td>Enviado</Td>
                    </Tr>
                </TBody>
            </Table>
            <div className='flex space-between'>
                <button
                    onClick={ () => getPendingShips()}
                    className='bg-black text-white rounded mx-auto p-3'
                >
                    test
                </button>
                <button
                    onClick={ () => getQuantityByid()}
                    className='bg-black text-white rounded mx-auto p-3'
                >
                    getQuantityByid
                </button>
            </div>
        </>
    )
}

export default MarketPlaceHistory