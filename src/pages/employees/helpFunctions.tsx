/*

import * as Table from '@/components/Table/table'
import * as Select from '@/components/Select/select'

interface IUserDays {
  id: number
  user_id: number
  day: string
  month: string
  year: string
  entry: string
  lunch_entry: string
  lunch_exit: string
  extra_entry: string
  extra_exit: string
  exit: string
  created_at: string
}

export const dayUser = (data: IUserDays[]) => {
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>DATA</Table.Head>
          <Table.Head>ID</Table.Head>
          <Table.Head>NOME</Table.Head>
          <Table.Head>ENTRADA</Table.Head>
          <Table.Head>E. LUNCH</Table.Head>
          <Table.Head>S. LUNCH</Table.Head>
          <Table.Head>E. EXTRA</Table.Head>
          <Table.Head>S. EXTRA</Table.Head>
          <Table.Head>SAIDA</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map(userDay => (
          <Table.Row key={userDay.id}>
            <Table.Cell className="max-w-[150px] truncate p-4">
              {userDay.created_at}
            </Table.Cell>
            <Table.Cell className="max-w-[30px] truncate p-4">
              {userDay.user_id}
            </Table.Cell>
            <Table.Cell className="p-4">
              {getUser(String(userDay.user_id))?.name}
            </Table.Cell>
            <Table.Cell className="p-4">{userDay.entry}</Table.Cell>

            <Table.Cell>{userDay.lunch_entry}</Table.Cell>
            <Table.Cell>{userDay.lunch_exit}</Table.Cell>
            <Table.Cell>{userDay.extra_entry}</Table.Cell>
            <Table.Cell>{userDay.extra_exit}</Table.Cell>
            <Table.Cell>{userDay.exit}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}

*/
