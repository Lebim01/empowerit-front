import { Button, Dialog } from "@/components/ui";
import { db } from "@/configs/firebaseConfig";
import { useAppSelector } from "@/store";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";


export default function MartketplaceDigitalService() {

    const user = useAppSelector((state) => state.auth.user)

    const [openModal, setOpenModal] = useState(false)
    const [academyAccess, setAcademyAccess] = useState(false)

    useEffect(() => {
        if (user.academyAccess) {
            setAcademyAccess(true);
        } else {
            setAcademyAccess(false);
        }
    }, [user]);

    const enoughCredits = async() => {
        const usersRef = doc(db, `users/${user.uid}`);
        const res = await getDoc(usersRef)
        if(res.data()?.credits >= 0){
            return true
        }
        return false
    }

    const buyAcademyAccess = async () => {
        const usersRef = await doc(db, `users/${user.uid}`);
        const res = await getDoc(usersRef)
        const isEnoughtCredits = await enoughCredits()
        if(isEnoughtCredits){
            if (res.exists()) {
                const creditsLeft = res.data().credits
                await updateDoc(usersRef, {
                    academyAccess: true,
                    credits: creditsLeft - 100
                })
            }
            createHistoryCreditsDoc(100)
        }
        setOpenModal(false)
    }

    const createHistoryCreditsDoc = async (total: number) => {
        const docRef = await addDoc(collection(db,`users/${user.uid}/credits-history/`), {
            total,
            created_at: new Date(),
            concept: "Compra en Marketplace Servicios Digital"
          });
    } 

    return (
        <div>
            <p className="text-lg italic my-4">
                Arma tu carrito con nuestros productos digitales
            </p>
            <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4">
                <div
                    className="bg-gray-100 flex flex-col items-center rounded-lg px-4 pb-4"
                >
                    <img
                        src="/membership/crypto-elite.png"
                        className="w-[80%] flex-1 object-contain"
                    />
                    <div className="flex justify-start w-full text-lg">
                        <span className="font-bold">Acceso a academia</span>
                    </div>
                    <div className="flex justify-start w-full space-x-2">
                        <span className="font-medium">
                            100 créditos
                        </span>
                        <span className="line-through text-gray-400">
                            120 créditos
                        </span>
                    </div>
                    <div className="flex justify-start items-center w-full pb-4 space-x-2">
                        <div className="flex justify-start text-yellow-500 space-x-1">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                        </div>
                        <div>
                            <span className="font-medium">En existencia</span>
                        </div>
                    </div>
                    {user && typeof user.credits === 'number' ? (
                        user.credits <= 100 ? (
                            <Button
                                onClick={() => setOpenModal(true)}
                                disabled={true}
                                className="px-4 py-2 font-semibold rounded bg-gray-400 text-gray-700 cursor-not-allowed"
                            >
                                {academyAccess ? 'Membresía Obtenida' : 'Créditos insuficientes'}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setOpenModal(true)}
                                disabled={academyAccess}
                                className={`px-4 py-2 font-semibold rounded ${academyAccess ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                            >
                                {academyAccess ? 'Membresía Obtenida' : 'Comprar Membresía'}
                            </Button>
                        )
                    ) : (
                        <Button
                            onClick={() => setOpenModal(true)}
                            disabled={true}
                            className="px-4 py-2 font-semibold rounded bg-gray-400 text-gray-700 cursor-not-allowed"
                        >
                            Créditos insuficientes
                        </Button>
                    )}
                </div>
            </div>
            <Dialog isOpen={openModal} onClose={() => setOpenModal(false)} >
                <div>
                    <span className="pt-4">Desea comprar este producto por 100 créditos?</span>
                    <div className="flex justify-between w-full mt-4">
                        <Button onClick={() => buyAcademyAccess()}>
                            ACEPTAR
                        </Button>
                        <Button onClick={() => setOpenModal(true)}>
                            CERRAR
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
