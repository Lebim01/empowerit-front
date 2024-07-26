
import { Table } from "@/components/ui"
import TBody from "@/components/ui/Table/TBody"
import Td from "@/components/ui/Table/Td"
import Th from "@/components/ui/Table/Th"
import THead from "@/components/ui/Table/THead"
import Tr from "@/components/ui/Table/Tr"
import { getAllParticipations } from "@/services/Participations"
import { Participation } from "@/views/participations"
import { useEffect, useState } from "react"

export default function ParticipationsHistory() {

     const [participations, setParticipations] = useState<Participation[] | null>(null);

     useEffect(() => {
          getParticipations()
     }, [])

     const getParticipations = async () => {
          const participations = await getAllParticipations()
          if (participations) {
               setParticipations(participations as Participation[]) 
          }
     }


     return (
          <div>
               <Table>
                    <THead>
                         <Tr>
                              <Th>Nombre</Th>
                              <Th>Correo</Th>
                              <Th>Fecha Adquisición</Th>
                              <Th>Participación</Th>
                              <Th>Ganancias</Th>
                              <Th>Ganancia Límite</Th>
                              <Th>Proximo pago</Th>
                         </Tr>
                    </THead>
                    <TBody>

                         {participations && participations.map((row, index) => (
                              <Tr key={index} className={`${row.next_pay.toDate() > new Date() ? 'bg-gray-200'  : ''  }`} >
                                   <Td>{row.userName}</Td>
                                   <Td>{row.email}</Td>
                                   <Td>{row.starts_at.toDate().toLocaleDateString()}</Td>
                                   <Td>{row.participation_name}</Td>
                                   <Td>{row.participation_cap_current}</Td>
                                   <Td>{row.participation_cap_limit}</Td>
                                   <Td>{row.next_pay.toDate().toLocaleDateString()}</Td>
                              </Tr>
                         ))}
                    </TBody>
               </Table>
          </div>
     )
}
