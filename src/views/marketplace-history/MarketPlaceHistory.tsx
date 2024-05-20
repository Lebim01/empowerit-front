import { Table } from '@/components/ui'
import TBody from '@/components/ui/Table/TBody'
import THead from '@/components/ui/Table/THead'
import Td from '@/components/ui/Table/Td'
import Th from '@/components/ui/Table/Th'

function MarketPlaceHistory() {

  return (
    <>
        <span className='font-bold text-2xl my-4'>Historial de Créditos</span>
        <Table>
            <THead>
                <Th>columna uno</Th>
                <Th>columna dos</Th>
                <Th>columna tres</Th>
                <Th>columna cuatro</Th>
            </THead>
            <TBody>
                <Td>1234</Td>
                <Td>1234123</Td>
                <Td>1234213</Td>
            </TBody>
        </Table>
    </>
  )
}

export default MarketPlaceHistory