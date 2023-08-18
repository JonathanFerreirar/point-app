import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, Trash2, Eye, ArrowDownCircle, Pencil } from 'lucide-react'
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

const tableEmployeeSchema = z.object({
  mounth: z.enum([
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ]),
  year: z.string().nonempty('Por favor, preencha esse campo com algum valor.'),
  newEmployee: z
    .string()
    .nonempty('Por favor, preencha esse campo com algum valor.'),
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

export default function Employees() {
  const [employees, setEmployees] = useState<EmployeesProps[]>([])
  const [registerUser, setRegisterUser] = useState<EmployeeResgister[]>([])
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
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
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

    console.log({ userCreated })

    if (userCreated) {
      setFocus('newEmployee')
      reset()
      setEmployees(prevState => [...prevState, userCreated])
    }
  }

  const handleDeleteUser = async (idUser: number) => {
    const { id } = await ipcRenderer.invoke('deleteData', idUser)

    const changedUsers = employees.filter(employee => employee.id !== id)

    setEmployees(changedUsers)
  }

  const handleDataToModal = (
    username: string,
    id: number,
    working_time?: string,
  ) => {
    const resulterUser: EmployeeResgister[] = registerUser.filter(
      register => register.user_id === id,
    )

    setUserInModal({
      name: username,
      working_time: working_time,
      registered: [...resulterUser],
    })
  }

  const handleDownloadFileExcel = async (
    id: number,
    name: string,
    working_time?: string,
  ) => {
    const resulterUser: EmployeeResgister[] = registerUser.filter(
      register => register.user_id === id,
    )

    const user = { id, name, working_time, registered: resulterUser }

    const result: boolean = await ipcRenderer.invoke('create-file', user)
    if (result) {
      toast.success('Arquivo criado com sucesso 🚀')
      return
    }

    toast.error('Ocorreu algum erro inesperado :(')
  }

  useEffect(() => {
    const getUsers = async () => {
      const users: EmployeesProps[] = await ipcRenderer.invoke('getUsers')
      console.log({ users })
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

  return (
    <section className="relative grid h-full grid-cols-[minmax(280px,600px)] items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="flex items-center justify-center gap-10">
          <Input
            {...register('year')}
            className={cn(
              'text-center',
              errors.year &&
                'border-red-600 hover:border-red-600 focus-visible:border-red-600',
            )}
            {...register('year')}
            placeholder="Selecione o ano ex: 2023"
          />
          <Select.Root
            {...register('mounth')}
            className={cn(
              errors.mounth &&
                'bg-red-600 hover:bg-red-600 focus-visible:bg-red-600',
            )}
          >
            {optionsMounth.map(option => (
              <Select.Option key={option.label} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select.Root>
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
                            onClick={() =>
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
