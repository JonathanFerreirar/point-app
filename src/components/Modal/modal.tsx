import { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Table from '@/components/Table/table'
import { idGen } from '@/utils/generante-id'
import * as f from '@/functions/functionsHours'

export interface EmployeeResgister {
  created_at: string
  id: number
  user_id: number
  day: string
  month: string
  year: string
  entry?: string
  lunch_entry?: string
  lunch_exit?: string
  extra_entry?: string
  extra_exit?: string
  exit?: string
}

export interface Employee {
  name: string
  working_time?: string
  registered: EmployeeResgister[]
}

interface DialogDemoProps {
  children: ReactNode
  employee: Employee | undefined
}

const DialogDemo = ({ children, employee }: DialogDemoProps) => {
  const bank: string[] = []
  const getTotalHour = () => {
    let soma = 0
    bank.forEach(item => {
      soma += f.handleHourToMinut(item)
    })
    return f.handleMinutoToBank(soma)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] h-[85vh] w-[90vw] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-center text-[17px] font-medium">
            {employee?.name}
          </Dialog.Title>
          <div className="flex items-center justify-center overflow-auto">
            <Table.Root className="w-max">
              <Table.Header>
                <Table.Row>
                  <Table.Head>DATA</Table.Head>
                  <Table.Head>ENTRADA</Table.Head>
                  <Table.Head>SAIDA A</Table.Head>
                  <Table.Head>ENTRADA A</Table.Head>
                  <Table.Head>SAIDA EX</Table.Head>
                  <Table.Head>ENTRADA EX</Table.Head>
                  <Table.Head>SAIDA</Table.Head>
                  <Table.Head>HORAS TRAB.</Table.Head>
                  <Table.Head>HORAS Á TRAB.</Table.Head>
                  <Table.Head>BANCO DE HORAS</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {employee?.registered?.map(register => {
                  const hour = f.resultTime({
                    entry: f.handleHourToMinut(register.entry),
                    exitToLunch: f.handleHourToMinut(register.lunch_exit),
                    entryFromLunch: f.handleHourToMinut(register.lunch_entry),
                    exitExtraTime: f.handleHourToMinut(register.extra_exit),
                    entryExtraTime: f.handleHourToMinut(register.extra_entry),
                    exit: f.handleHourToMinut(register.exit),
                  })

                  const result = f.handleMinutoToHour(hour)
                  const bankTime = f.bankTime({
                    timeWork: f.handleHourToMinut(result),
                    timeAtWork: f.handleHourToMinut(employee.working_time),
                  })
                  const resultBankTime = f.handleMinutoToBank(bankTime)
                  bank.push(resultBankTime)

                  return (
                    <Table.Row key={idGen()} className="text-center">
                      <Table.Cell>{register.created_at}</Table.Cell>
                      <Table.Cell>{register?.entry || '00:00'}</Table.Cell>
                      <Table.Cell>{register?.lunch_exit || '00:00'}</Table.Cell>
                      <Table.Cell>
                        {register?.lunch_entry || '00:00'}
                      </Table.Cell>
                      <Table.Cell>{register?.extra_exit || '00:00'}</Table.Cell>
                      <Table.Cell>
                        {register?.extra_entry || '00:00'}
                      </Table.Cell>
                      <Table.Cell>{register?.exit || '00:00'}</Table.Cell>
                      <Table.Cell>{result || '00:00'}</Table.Cell>
                      <Table.Cell>
                        {employee.working_time || '00:00'}
                      </Table.Cell>
                      <Table.Cell>{resultBankTime || '00:00'}</Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table.Root>
          </div>

          <div className="mt-10 flex items-center justify-center">
            <span className="text-right font-semibold text-green-950">
              RESULTADO FINAL: {getTotalHour()} HORAS
            </span>
          </div>
          <div className="flex w-full justify-end">
            <Dialog.Close
              asChild
              className="focus:shadow-green7  my-9 inline-flex h-[35px] items-center rounded-[4px] border border-black px-[15px] font-medium leading-none hover:border-none focus:shadow-[0_0_0_2px] focus:outline-none"
            >
              <button>Fechar</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default DialogDemo
