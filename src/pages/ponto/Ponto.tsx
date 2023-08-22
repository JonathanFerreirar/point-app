import { Button } from '@/components/Button/button'
import { Clock, ClockProps } from '@/components/Clock/Clock'
import { Link, useNavigate } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetUser } from '@/context/pointContext'
import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import { handleHourToMinut } from '@/functions/functionsHours'
import { toast } from 'react-hot-toast'
import { Input } from '@/components/Input/input'

const clockOptions: ClockProps['options'] = {
  hour: '2-digit',
  minute: '2-digit',
}

const selectSchema = z.object({
  point_type: z.string(),
})

type SelectFields = z.infer<typeof selectSchema>

const Ponto = () => {
  const { userPoint } = useGetUser()
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    if (userPoint.name === '') navigate('/')
  }, [userPoint.name, navigate])
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SelectFields>({
    resolver: zodResolver(selectSchema),
  })

  const onSubmit: SubmitHandler<SelectFields> = async data => {
    let valuePont = ''
    switch (data.point_type) {
      case '1':
        valuePont = 'entry'
        break
      case '2':
        valuePont = 'lunch_exit'
        break
      case '3':
        valuePont = 'lunch_entry'
        break
      case '4':
        valuePont = 'extra_exit'
        break
      case '5':
        valuePont = 'extra_entry'
        break
      case '6':
        valuePont = 'exit'
        break
      default:
        break
    }
    const dateCurrent = new Date()

    const timeCurrent = dateCurrent.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    if (valuePont === 'lunch_entry' && valuePont) {
      const result = await ipcRenderer.invoke('getRegister')
      // eslint-disable-next-line
      // @ts-ignore
      result.map(async user => {
        if (
          user.created_at === new Date().toLocaleDateString('pt-BR') &&
          user.user_id === userPoint.id
        ) {
          const result =
            handleHourToMinut(user.lunch_exit) - handleHourToMinut(timeCurrent)

          if (result > -30) {
            toast.error('Faça no MINIMO 30 minutos de almoço')
            return
          }
          try {
            setError('root', { message: '' })
            setSuccess('')
            await ipcRenderer.invoke('create-register', {
              timeCurrent,
              created_at: new Date().toLocaleDateString('pt-BR'),
              selectOption: valuePont,
              userId: userPoint.id,
              day: dateCurrent.getDate(),
              month: dateCurrent.getMonth() + 1,
              year: dateCurrent.getFullYear(),
            })
            setSuccess('Ponto registrado com sucesso')
            setTimeout(() => {
              navigate('/')
            }, 200)
          } catch (error) {
            console.log(error)
            if (error instanceof Error) {
              setError('root', {
                message: 'O Ponto já roi resgitrado anteriormente',
              })
            }
          }
        }
      })
    }
    if (valuePont !== 'lunch_entry' && valuePont) {
      try {
        setError('root', { message: '' })
        setSuccess('')
        await ipcRenderer.invoke('create-register', {
          timeCurrent,
          created_at: new Date().toLocaleDateString('pt-BR'),
          selectOption: valuePont,
          userId: userPoint.id,
          day: dateCurrent.getDate(),
          month: dateCurrent.getMonth() + 1,
          year: dateCurrent.getFullYear(),
        })
        setSuccess('Ponto registrado com sucesso')
        setTimeout(() => {
          navigate('/')
        }, 1500)
      } catch (error) {
        console.log(error)
        if (error instanceof Error) {
          setError('root', {
            message: 'O Ponto já roi resgitrado anteriormente',
          })
        }
      }
    }
  }

  return (
    <section className="relative grid h-full grid-cols-[minmax(280px,600px)] items-center justify-center">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <p className="text-center font-semibold text-red-700">
            {errors.root?.message}
          </p>
          <p className="text-center font-semibold text-green-600">{success}</p>
          <h1 className="mb-6 text-center text-[3rem] font-extrabold text-white">
            {userPoint?.name}
          </h1>
          <Clock
            locales="pt-BR"
            options={clockOptions}
            className="mb-7  block text-center text-5xl font-bold text-white"
          />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-y-10"
          >
            <Input
              /* eslint-disable-next-line jsx-a11y/no-autofocus */
              autoFocus
              {...register('point_type')}
              placeholder="Digite um número"
              className="text-center text-xl"
            />
            <Button
              type="submit"
              className="rounded-2xl border-none bg-[#262626] px-6 py-2 text-sm font-semibold text-white focus-visible:text-black"
            >
              Marcar
            </Button>
          </form>
        </div>
        <div className="items-right absolute bottom-36 right-1 flex w-[200px] flex-col justify-center text-justify font-semibold text-white lt:bottom-60 lt:right-14 lt:w-[300px] lt:text-[22px]">
          <span>1 - ENTRADA</span>
          <span>2 - SAIDA ALMOÇO</span>
          <span>3 - ENTRADA ALMOÇO</span>
          <span>4 - SAIDA EXTRA</span>
          <span>5 - ENTRADA EXTRA</span>
          <span>6 - FIM EXPEDIENTE</span>
        </div>
      </div>
      <Button
        asChild
        className="absolute right-2 top-4 border-none font-semibold"
      >
        <Link to="/">Home</Link>
      </Button>
    </section>
  )
}

export default Ponto
