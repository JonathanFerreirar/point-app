import { ReactNode, createContext, useContext, useState } from 'react'

interface ProviderProps {
  children: ReactNode
}

export interface UserPoint {
  id: number
  name: string
  working_time: string
  workload: string
}

interface PointContext {
  userPoint: UserPoint
  handleSetUserPoint(user: UserPoint): void
}

const UserContext = createContext({} as PointContext)

export const UserProvider: React.FC<ProviderProps> = ({ children }) => {
  const [userPoint, setUserPoint] = useState<UserPoint>({
    id: 0,
    name: '',
    working_time: '07:30',
    workload: '0',
  })

  const handleSetUserPoint = (userInfos: UserPoint) => {
    setUserPoint(userInfos)
  }
  return (
    <UserContext.Provider value={{ userPoint, handleSetUserPoint }}>
      {children}
    </UserContext.Provider>
  )
}

export const useGetUser = () => useContext(UserContext)
