import { Button, Dialog, Table } from '@/components/ui';
import TBody from '@/components/ui/Table/TBody';
import THead from '@/components/ui/Table/THead';
import Td from '@/components/ui/Table/Td';
import Th from '@/components/ui/Table/Th';
import Tr from '@/components/ui/Table/Tr';
import { db } from '@/configs/firebaseConfig';
import { useAppSelector } from '@/store';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { ChangeEvent, useEffect, useState } from 'react';
import { LicenseHistoryProps } from './AlgorithmTable';


export default function AlgorithmTable() {

    const user = useAppSelector((state) => state.auth.user);
    const [licenses, setLicenses] = useState<LicenseHistoryProps[]>();
    const [modal, setModal] = useState(false);
    const [inputValue, setInputValue] = useState<number | ''>('');
    const [confirmModal, setConfirmModal] = useState(false);


    useEffect(() => {
        getLicenseHistoryById();
        if (!user.algorithmId) {
            setModal(true);
        }
    }, [user]);

    const getLicenseHistoryById = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, `users/${user.uid}/algorithm-license-history`));
            const licenseHistory: LicenseHistoryProps[] = [];

            querySnapshot.forEach((doc) => {
                licenseHistory.push({
                    id: doc.id,
                    expires_at: doc.data().expires_at.toDate()
                });
            });
            setLicenses(licenseHistory);
        } catch (error) {
            console.error("Error retrieving license history: ", error);
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setInputValue(value === '' ? '' : parseFloat(value));
    };

    const setAlgorithmId = async () => {
        const docRef = doc(db, `users/${user.uid}`);
        await updateDoc(docRef, {
            algorithmId: inputValue
        });
        await updateAlgorithmId()
        setConfirmModal(false);
    };

    const updateAlgorithmId = async () => {
        try {
            const userId = user.uid;
            const q = query(
                collection(db, "algorithm-license-history"),
                where("userId", "==", userId)
            );


            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (docu) => {
                console.log(docu.id, " => ", docu.data());
                const docRef = doc(db,`algorithm-license-history/${docu.id}`)
                await updateDoc(docRef, {
                    algorithmId: inputValue
                });
            });
            console.log("Algorithm Id updated successfully");
        } catch (error) {
            console.error("Error updating algorithm Id: ", error);
            throw new Error("Error updating algorithm Id");
        }
    };

    return (
        <div className='flex flex-col justify-center'>
            {licenses && licenses.length > 0 && (
                <>
                    <div className='flex flex-col pb-4 space-x-5'>
                        <h3 className="text-xl font-bold mb-2">Administra tus licencias </h3>
                        {user.algorithmId ? (
                            <Table>
                            <THead>
                                <Tr>
                                    <Th>#</Th>
                                    <Th>Licencia</Th>
                                    <Th>Expira</Th>
                                </Tr>
                            </THead>
                            <TBody>
                                {licenses && licenses.map((license, index) => {
                                    return (
                                        <Tr key={index}>
                                            <Td>{index}</Td>
                                            <Td>{license.id}</Td>
                                            <Td>{license.expires_at.toLocaleDateString()}</Td>
                                        </Tr>
                                    );
                                })}
                            </TBody>
                        </Table>
                        ) : (
                            <>
                                <input
                                    type="number"
                                    value={inputValue}
                                    placeholder='Ingresa tu cuenta de IC Markets Ejemplo: 51697086'
                                    className='min-w-[400px] p-1'
                                    onChange={handleInputChange} />
                                <button
                                    className={`border rounded-lg px-3 py-1 mx-2 shadow-sm text-center ${!inputValue ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                                    disabled={!inputValue}
                                    onClick={() => setConfirmModal(true)}
                                >
                                    Registrar
                                </button>
                            </>

                        )}
                        <Dialog isOpen={confirmModal} onClose={() => setConfirmModal(false)}>
                            <div className='flex flex-col items-center text-center'>
                                <span className='justify-center w-[90%] text-xl font-black'>
                                    Es correcta tu cuenta de IC Markets?
                                </span>
                                <span className='justify-center w-[90%] text-lg'>{inputValue}</span>
                                <span className='justify-center w-[90%] text-lg'>
                                    Una vez registrada, no podrá ser modificada
                                </span>
                                <Button className='w-[90%] mt-4' onClick={() => setAlgorithmId()}>
                                    Aceptar
                                </Button>
                            </div>
                        </Dialog>
                    </div>
                    
                </>
            )}
            <Dialog isOpen={modal} onClose={() => setModal(false)}>
                <div className='flex flex-col items-center'>

                    <span className='justify-center text-left w-[90%]' style={{ textAlign: 'justify' }}>
                        Una vez creada la cuenta de IC Markets deberas registrarla en el apartado de "Administra tus Licencias" para un correcto funcionamiento y acceso a tus licencias
                    </span>
                    <Button className='w-[90%] mt-4' onClick={() => setModal(false)}>
                        Aceptar
                    </Button>
                </div>
            </Dialog>
        </div>
    );
}
