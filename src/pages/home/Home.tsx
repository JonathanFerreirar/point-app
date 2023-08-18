import { Button } from '@/components/Button/button'
import { useForm } from 'react-hook-form'
import { Clock, ClockProps } from '@/components/Clock/Clock'
import { Input } from '@/components/Input/input'
import { Link, useNavigate } from 'react-router-dom'
import { ipcRenderer } from 'electron'
import { useState, useEffect } from 'react'
import { UserPoint, useGetUser } from '@/context/pointContext'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

type HomePageFields = z.infer<typeof homePageSquema>

const homePageSquema = z.object({
  idEmployer: z
    .string()
    .nonempty('Por favor, preencha o campo.')
    .trim()
    .transform(value => Number(value)),
})

const getUsers = async () => {
  const result = await ipcRenderer.invoke('getUsers')
  return result
}

const Home = () => {
  const { handleSetUserPoint } = useGetUser()

  const navigate = useNavigate()
  const [users, setUsers] = useState<UserPoint[]>([])
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<HomePageFields>({
    resolver: zodResolver(homePageSquema),
  })

  const clockOptions: ClockProps['options'] = {
    hour: '2-digit',
    minute: '2-digit',
  }

  const onSubmit = (data: HomePageFields) => {
    const user = users.find(user => user.id === data.idEmployer)
    if (user) {
      handleSetUserPoint(user)
      navigate('/ponto')
      return
    }
    setError('idEmployer', { message: 'Usuário não encontrado' })
  }

  useEffect(() => {
    const getUsersFromData = async () => {
      const result = await getUsers()

      setUsers(result)
    }
    getUsersFromData()
  }, [])

  return (
    <section className="relative grid h-full grid-cols-[minmax(280px,600px)] items-center justify-center">
      <div className="flex flex-col gap-5">
        <Clock
          locales="pt-BR"
          options={clockOptions}
          className="mb-7 block text-center text-9xl font-bold text-white"
        />
        <form
          className="flex flex-col items-center gap-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Input
              placeholder="Digite seu Identificador..."
              autoComplete="off"
              className="mb-3 ml-2 text-center text-xl"
              {...register('idEmployer')}
              /* eslint-disable-next-line jsx-a11y/no-autofocus */
              autoFocus
            />
            {!!errors.idEmployer && (
              <p className="text-center font-semibold text-red-600">
                {errors.idEmployer.message}
              </p>
            )}
          </div>

          <Button
            className="rounded-2xl border-none bg-[#262626] px-6 py-2 text-sm font-semibold text-white focus-visible:text-black"
            type="submit"
          >
            Entrar
          </Button>
        </form>
      </div>
      <Button
        asChild
        className="absolute right-2 top-4 border-none font-semibold"
      >
        <Link to="/admin">Admin</Link>
      </Button>
    </section>
  )
}

export default Home
