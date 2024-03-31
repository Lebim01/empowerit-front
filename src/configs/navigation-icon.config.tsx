import {
  HiOutlineColorSwatch,
  HiOutlineDesktopComputer,
  HiOutlineTemplate,
  HiOutlineViewGridAdd,
  HiOutlineHome,
  HiOutlineAcademicCap,
  HiOutlinePencil,
} from 'react-icons/hi'
import { AiOutlineDashboard } from 'react-icons/ai'
import {
  BsAirplane,
  BsBarChartLine,
  BsBezier,
  BsFillAwardFill,
  BsTools,
  BsTrophy,
  BsPeople,
} from 'react-icons/bs'
import {
  FaCrown,
  FaHistory,
  FaMoneyBill,
  FaPeopleArrows,
  FaStore,
  FaVideo,
  FaMedal,
  FaRegMap,
} from 'react-icons/fa'
import { PiPackage } from 'react-icons/pi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
  home: <HiOutlineHome />,
  singleMenu: <HiOutlineViewGridAdd />,
  collapseMenu: <HiOutlineTemplate />,
  groupSingleMenu: <HiOutlineDesktopComputer />,
  groupCollapseMenu: <HiOutlineColorSwatch />,
  sales: <AiOutlineDashboard />,
  academy: <HiOutlineAcademicCap />,
  pencil: <HiOutlinePencil />,
  'direct-people': <FaPeopleArrows fontSize={18} />,
  memberships: <PiPackage />,
  binary: <BsBezier />,
  trophy: <BsFillAwardFill />,
  marketplace: <FaStore />,
  retiro: <BsAirplane />,
  history: <FaHistory />,
  leader: <FaCrown />,
  supreme: <BsTrophy />,
  tools: <BsTools />,
  system: <BsBarChartLine />,
  payroll: <FaMoneyBill />,
  users: <BsPeople />,
  videos: <FaVideo />,
  rank: <FaMedal />,
  map: <FaRegMap />,
}

export default navigationIcon
