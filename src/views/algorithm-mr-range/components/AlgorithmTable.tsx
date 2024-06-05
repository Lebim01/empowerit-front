import { Table } from '@/components/ui'
import TBody from '@/components/ui/Table/TBody'
import THead from '@/components/ui/Table/THead'
import Td from '@/components/ui/Table/Td'
import Th from '@/components/ui/Table/Th'
import Tr from '@/components/ui/Table/Tr'
import { db } from '@/configs/firebaseConfig'
import { useAppSelector } from '@/store'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'

interface LicenseHistoryProps {
    id: string
    expires_at: Date
}

export default function AlgorithmTable() {

    const user = useAppSelector((state) => state.auth.user)
    const [licenses, setLicenses] = useState<LicenseHistoryProps[]>()

    useEffect(() => {
        getLicenseHistoryById()
    }, [user])

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
            setLicenses(licenseHistory)
        } catch (error) {
            console.error("Error retrieving license history: ", error);
        }
    }

    return (
        <div>
            {licenses && licenses.length > 0 && (
                <>
                    <h3 className="text-xl font-bold pb-4">Administra tus licencias</h3>
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
                                )
                            })}
                        </TBody>
                    </Table>
                </>
            )
            }
        </div>
    )
}
