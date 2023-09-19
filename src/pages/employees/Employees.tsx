import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  PlusCircle,
  Trash2,
  Eye,
  ArrowDownCircle,
  Pencil,
  EyeOff,
  ShieldAlert,
} from 'lucide-react'
import * as Table from '@/components/Table/table'
import * as Select from '@/components/Select/select'
import { cn } from '@/lib/utils'
import { Input } from '@/components/Input/input'
import { Button } from '@/components/Button/button'
import DialogDemo from '@/components/Modal/modal'
import EditModal from '@/components/Modal/modalEdit'
import { Link } from 'react-router-dom'
import { ipcRenderer } from 'electron'
import { Employee, EmployeeResgister } from '@/components/Modal/modal'
import { toast } from 'react-hot-toast'
import { useGetUser } from '@/context/pointContext'
import { optionsMounth } from '@/data/options'
import ModalDefault from '@/components/Modal/modalDefault'
import * as f from '@/functions/functionsHours'

const tableEmployeeSchema = z.object({
  newEmployee: z
    .string()
    .nonempty('Por favor, preencha esse campo com algum valor.')
    .toUpperCase(),
  workingTime: z
    .string()
    .nonempty('Coloque a carga horária')
    .regex(/\d{2}:\d{2}/, 'Formato inválido. Ex: 04:00'),
})

type TableEmployeeFields = z.infer<typeof tableEmployeeSchema>

interface EmployeesProps {
  id: string
  name: string
  workload: string
  working_time?: string
}

interface iAdminUser {
  id: number
  name: string
  password: string
}
export interface IUserDays {
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

export default function Employees() {
  const [employees, setEmployees] = useState<EmployeesProps[]>([])
  const [registerUser, setRegisterUser] = useState<EmployeeResgister[]>([])
  const [adminPassword, setAdminPassword] = useState('')
  const { handleSetAdmin } = useGetUser()
  const { admin } = useGetUser()
  const [userInModal, setUserInModal] = useState<Employee>({
    name: 'Jonathan Rodrigo',
    registered: [
      {
        id: 0,
        user_id: 0,
        day: 'Janeiro',
        month: 'Março',
        year: '2023',
        entry: '07:30',
        lunch_entry: '12:30',
        lunch_exit: '13:30',
        extra_entry: '00:00',
        extra_exit: '00:00',
        exit: '18:00',
        created_at: new Date().toLocaleDateString('pt-BR'),
      },
    ],
  })
  const [DaysInModal, setDaysInModal] = useState<IUserDays[]>([
    {
      id: 0,
      user_id: 0,
      day: 'Janeiro',
      month: 'Março',
      year: '2023',
      entry: '07:30',
      lunch_entry: '12:30',
      lunch_exit: '13:30',
      extra_entry: '00:00',
      extra_exit: '00:00',
      exit: '18:00',
      created_at: '24/08/2023',
    },
  ])
  const [handleShowPassword, setHandleShowPassword] = useState(false)
  const [handleYear, setHandleYear] = useState(String(new Date().getFullYear()))
  const [handleDay, setHandleDay] = useState(String(new Date().getDate() - 1))
  const [handleMounth, setHandleMounth] = useState(
    String(new Date().getMonth() + 1),
  )

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    watch,
    formState: { errors },
  } = useForm<TableEmployeeFields>({
    resolver: zodResolver(tableEmployeeSchema),
  })

  const handleAddEmployee: SubmitHandler<TableEmployeeFields> = async data => {
    const userCreated: EmployeesProps = await ipcRenderer.invoke(
      'createUser',
      data.newEmployee,
      '0',
      data.workingTime,
    )

    if (userCreated) {
      setFocus('newEmployee')
      reset()
      setEmployees(prevState => [...prevState, userCreated])
    }
  }

  let times = 0
  const handleDeleteUser = async (idUser: number) => {
    if (times < 1) {
      times += 1

      toast.error('Clique mais duas vez para confirmar á exclusão')
    } else if (times >= 1) {
      const { id } = await ipcRenderer.invoke('deleteData', idUser)

      const changedUsers = employees.filter(employee => employee.id !== id)

      setEmployees(changedUsers)
      toast.success('Usúario deletado com sucesso')
    }
  }

  const handleDataToModal = (
    username: string,
    id: number,
    working_time?: string,
  ) => {
    const resulterUser: EmployeeResgister[] = registerUser.filter(
      register =>
        register.user_id === id &&
        register.month === handleMounth &&
        register.year === handleYear,
    )

    const resultOrdered = resulterUser.sort(
      (a, b) => Number(a.day) - Number(b.day),
    )

    setUserInModal({
      name: username,
      working_time: working_time,
      registered: [...resultOrdered],
    })
  }
  const getUser = (id: string) => employees.find(value => value?.id == id)
  const getDays = async () => {
    const allUserDays: IUserDays[] = await ipcRenderer.invoke(
      'getGegisterDay',
      {
        day: handleDay,
        month: handleMounth,
        year: handleYear,
      },
    )

    const userFinish = allUserDays.map(value => ({
      ...value,
      day: getUser(String(value.user_id))?.name,
      year: getUser(String(value.user_id))?.working_time,
    }))

    const sortUsers = userFinish.sort((a, b) => a.user_id - b.user_id)

    setDaysInModal(sortUsers as IUserDays[])
  }

  const handleDownloadFileExcel = async (
    id: number,
    name: string,
    working_time?: string,
  ) => {
    const resulterUser: EmployeeResgister[] = registerUser.filter(
      register =>
        register.user_id === id &&
        register.month === handleMounth &&
        register.year === handleYear,
    )

    const resultOrdered = resulterUser.sort(
      (a, b) => Number(a.day) - Number(b.day),
    )

    const user = { id, name, working_time, registered: resultOrdered }

    const result: boolean = await ipcRenderer.invoke('create-file', user)
    if (result) {
      toast.success('Arquivo criado com sucesso ✅')
      return
    }

    toast.error('Ocorreu algum erro inesperado :(')
  }

  const handleDownloadFileExcelAllBeforeDay = async (data: IUserDays[]) => {
    const result: boolean = await ipcRenderer.invoke('createFileAll', data)
    console.log({ result })
    if (result) {
      toast.success('Arquivo criado com sucesso ✅')
      return
    }

    toast.error('Ocorreu algum erro inesperado :(')
  }

  useEffect(() => {
    const getUsers = async () => {
      const users: EmployeesProps[] = await ipcRenderer.invoke('getUsers')
      if (users) {
        setEmployees(users)
      }
    }

    getUsers()
  }, [])

  useEffect(() => {
    const getRegister = async () => {
      try {
        const register: EmployeeResgister[] = await ipcRenderer.invoke(
          'getRegister',
        )

        setRegisterUser(register)
      } catch (error) {
        alert(
          'Desculpe: Nesse momento não foi possivel realizar requisições ao servidor, tente novamente mais tarde ',
        )
        console.log(error)
      }
    }

    getRegister()
  }, [])
  /*
Modal que mostra os usuarios por dia
  */
  const dayUser = (data: IUserDays[]) => (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>DATA</Table.Head>
          <Table.Head>NOME</Table.Head>
          <Table.Head>ENTRADA</Table.Head>
          <Table.Head>E. LUNCH</Table.Head>
          <Table.Head>S. LUNCH</Table.Head>
          <Table.Head>E. EXTRA</Table.Head>
          <Table.Head>S. EXTRA</Table.Head>
          <Table.Head>SAIDA</Table.Head>
          <Table.Head>RESULTADO</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map(userDay => {
          const hour = f.resultTime({
            entry: f.handleHourToMinut(userDay.entry),
            exitToLunch: f.handleHourToMinut(userDay.lunch_exit),
            entryFromLunch: f.handleHourToMinut(userDay.lunch_entry),
            exitExtraTime: f.handleHourToMinut(userDay.extra_exit),
            entryExtraTime: f.handleHourToMinut(userDay.extra_entry),
            exit: f.handleHourToMinut(userDay.exit),
          })

          const result = f.handleMinutoToHour(hour)
          const bankTime = f.bankTime({
            timeWork: f.handleHourToMinut(result),
            timeAtWork: f.handleHourToMinut(userDay.year),
          })
          const end = f.handleMinutoToBank(bankTime)

          return (
            <Table.Row key={userDay.id}>
              <Table.Cell className="max-w-[150px] truncate p-4">
                {userDay.created_at}
              </Table.Cell>

              <Table.Cell className="p-4">{userDay.day}</Table.Cell>
              <Table.Cell className="p-4">{userDay.entry}</Table.Cell>
              <Table.Cell className="p-4">{userDay.lunch_exit}</Table.Cell>
              <Table.Cell className="p-4">{userDay.lunch_entry}</Table.Cell>
              <Table.Cell className="p-4">{userDay.extra_exit}</Table.Cell>
              <Table.Cell className="p-4">{userDay.extra_entry}</Table.Cell>

              <Table.Cell className="p-4">{userDay.exit}</Table.Cell>
              <Table.Cell className="max-w-[30px] truncate p-4 font-semibold">
                {end}
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>

      <div className="flex w-full justify-start">
        <button
          onClick={() => handleDownloadFileExcelAllBeforeDay(data)}
          className="focus:shadow-green7  my-5 inline-flex h-[35px] items-center rounded-[4px] border border-black px-[15px] font-medium leading-none hover:border-none focus:shadow-[0_0_0_2px] focus:outline-none"
        >
          Baixar
        </button>
      </div>
    </Table.Root>
  )

  const formToAdmin = () => {
    const getAdmin = async () => {
      const result = await ipcRenderer.invoke('getAdmin')
      return result
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const result = await getAdmin().then(result => {
        return result.find((user: iAdminUser) => {
          return user.password === adminPassword
        })
      })

      if (result) {
        handleSetAdmin(true)
      } else {
        toast.error('Senha admin errada')
      }
      setAdminPassword('')
    }
    return (
      <div className="mt-10 flex h-full w-full items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="relative flex h-full flex-col items-center justify-center"
        >
          <Input
            type={handleShowPassword ? 'text' : 'password'}
            placeholder="Senha..."
            className="rounded-default mb-2  w-full"
            onChange={e => setAdminPassword(e.target.value)}
            value={adminPassword?.toUpperCase() || ''}
          />
          {handleShowPassword ? (
            <Eye
              size={18}
              className="absolute bottom-[23px] right-4 cursor-pointer text-gray-400"
              onClick={() => setHandleShowPassword(false)}
            />
          ) : (
            <EyeOff
              size={18}
              className="absolute bottom-[23px] right-4 my-auto cursor-pointer text-gray-400"
              onClick={() => setHandleShowPassword(true)}
            />
          )}
        </form>
      </div>
    )
  }

  return (
    <section className="relative grid h-full grid-cols-[minmax(280px,600px)] items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="flex items-center justify-center gap-10">
          {admin ? (
            <Input
              className={cn('w-10 px-0 text-center')}
              value={handleDay}
              onChange={e => setHandleDay(e.target.value)}
              placeholder="Dia"
            />
          ) : (
            <ModalDefault
              DateModal={formToAdmin()}
              title="ACESSAR PAINEL ADMIN"
              small
            >
              <button
                title="PAINEL ADMIN"
                className="flex cursor-default items-center justify-center rounded-md px-2 outline-black transition-colors duration-200  focus-visible:bg-gray-200"
              >
                <ShieldAlert />
              </button>
            </ModalDefault>
          )}
          <Select.Root onChange={e => setHandleMounth(e.target.value)}>
            {optionsMounth.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select.Root>
          <Input
            className={cn('text-center')}
            value={handleYear}
            onChange={e => setHandleYear(e.target.value)}
            placeholder="Selecione o ano ex: 2023"
          />
        </div>
        <div className="w-full rounded bg-white p-8">
          <form
            onSubmit={handleSubmit(handleAddEmployee)}
            className="flex flex-col gap-y-2 pb-4"
          >
            <div className="flex gap-x-3">
              {admin && (
                <>
                  <Input
                    placeholder="Novo funcionário"
                    className={cn(
                      'flex-1',
                      errors.newEmployee &&
                        'border-red-600 hover:border-red-600 focus-visible:border-red-600',
                    )}
                    {...register('newEmployee')}
                    value={watch('newEmployee')?.toUpperCase() || ''}
                  />
                  <Input
                    placeholder="Horas à trabalhar"
                    className={cn(
                      errors.workingTime &&
                        'border-red-600 hover:border-red-600 focus-visible:border-red-600',
                    )}
                    {...register('workingTime')}
                  />
                  <button
                    title="Adicionar funcionário"
                    type="submit"
                    className="flex items-center justify-center rounded-md px-2 outline-black transition-colors duration-200 hover:bg-gray-200 focus-visible:bg-gray-200"
                  >
                    <PlusCircle />
                  </button>
                  <ModalDefault
                    DateModal={dayUser(DaysInModal)}
                    title="Vizualização diaria"
                  >
                    <Button onClick={getDays} className="border-none">
                      <Eye size={20} />
                    </Button>
                  </ModalDefault>
                </>
              )}
            </div>
            {errors.newEmployee && (
              <p className="text-red-700 underline">
                *{errors.newEmployee.message}
              </p>
            )}
            {!!errors.workingTime && (
              <p className="text-red-700 underline">
                *{errors.workingTime.message}
              </p>
            )}
          </form>
          <div className="scroll-type-1 max-h-96 w-full overflow-auto pr-2">
            {employees.length === 0 && <p>Nenhum funcionário cadastrado...</p>}
            {employees.length > 0 && (
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>ID</Table.Head>
                    <Table.Head>NOME</Table.Head>
                    <Table.Head>HORAS</Table.Head>
                    <Table.Head></Table.Head>
                    <Table.Head></Table.Head>
                    <Table.Head></Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {employees.map(employee => (
                    <Table.Row key={employee.id}>
                      <Table.Cell className="max-w-[150px] truncate p-4">
                        {employee.id}
                      </Table.Cell>
                      <Table.Cell className="max-w-[30px] truncate p-4">
                        {employee.name}
                      </Table.Cell>
                      <Table.Cell className="p-4">
                        {employee.working_time}
                      </Table.Cell>
                      {admin && (
                        <Table.Cell>
                          <button
                            onDoubleClick={() =>
                              handleDeleteUser(Number(employee.id))
                            }
                            title="Excluir funcionário"
                            type="button"
                            className="rounded-md px-2 py-2 outline-black transition-colors duration-200 hover:bg-white"
                          >
                            <Trash2 size={20} className="text-red-600" />
                          </button>
                        </Table.Cell>
                      )}

                      <Table.Cell>
                        <DialogDemo employee={userInModal}>
                          <button
                            onClick={() =>
                              handleDataToModal(
                                employee.name,
                                Number(employee.id),
                                employee.working_time,
                              )
                            }
                            title="Visualizar"
                            type="button"
                            className="rounded-md px-2 py-2 outline-black transition-colors duration-200 hover:bg-white"
                          >
                            <Eye size={20} className="text-blue-600" />
                          </button>
                        </DialogDemo>
                      </Table.Cell>
                      <Table.Cell>
                        <button
                          onClick={() =>
                            handleDownloadFileExcel(
                              Number(employee.id),
                              employee.name,
                              employee.working_time,
                            )
                          }
                          title="Fazer download"
                          type="button"
                          className="rounded-md px-2 py-2 outline-black transition-colors duration-200 hover:bg-white"
                        >
                          <ArrowDownCircle
                            size={20}
                            className="text-green-600"
                          />
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </div>
        </div>
      </div>
      <EditModal>
        {admin && (
          <Button
            title="Visualizar"
            type="button"
            className="absolute left-2 top-4"
          >
            <Pencil size={20} className="text-blue-600" />
          </Button>
        )}
      </EditModal>
      <Button className="absolute right-2 top-4" asChild>
        <Link to={'/'}>Sair</Link>
      </Button>
    </section>
  )
}
