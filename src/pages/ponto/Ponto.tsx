import * as Select from '@/components/Select/select'
import { Button } from '@/components/Button/button'
import { Clock, ClockProps } from '@/components/Clock/Clock'
import { Link } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { optionsSelect } from '@/data/options'
import { useGetUser } from '@/context/pointContext'
import { ipcRenderer } from 'electron'
import { useState } from 'react'
import { handleHourToMinut } from '@/functions/functionsHours'
import { toast } from 'react-hot-toast'

const clockOptions: ClockProps['options'] = {
  hour: '2-digit',
  minute: '2-digit',
}

const selectSchema = z.object({
  point_type: z.enum([
    'entry',
    'lunch_exit',
    'lunch_entry',
    'extra_exit',
    'extra_entry',
    'exit',
  ]),
})

type SelectFields = z.infer<typeof selectSchema>

const Ponto = () => {
  const { userPoint } = useGetUser()
  const [success, setSuccess] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SelectFields>({
    resolver: zodResolver(selectSchema),
  })

  const onSubmit: SubmitHandler<SelectFields> = async data => {
    const dateCurrent = new Date()

    const timeCurrent = dateCurrent.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    if (data.point_type === 'lunch_entry') {
      const result = await ipcRenderer.invoke('getRegister')
      result.map(async user => {
        if (
          user.created_at === new Date().toLocaleDateString('pt-BR') &&
          user.user_id === userPoint.id
        ) {
          const result =
            handleHourToMinut(user.lunch_entry) - handleHourToMinut(timeCurrent)
          if (result < 30) {
            toast.error('Faça no MINIMO 30 minutos de almoço')
            return
          }
          await ipcRenderer.invoke('create-register', {
            timeCurrent,
            created_at: new Date().toLocaleDateString('pt-BR'),
            selectOption: data.point_type,
            userId: userPoint.id,
            day: dateCurrent.getDate(),
            month: dateCurrent.getMonth() + 1,
            year: dateCurrent.getFullYear(),
          })
        }
      })
    }
    if (data.point_type !== 'lunch_entry') {
      try {
        setError('root', { message: '' })
        setSuccess('')
        await ipcRenderer.invoke('create-register', {
          timeCurrent,
          created_at: new Date().toLocaleDateString('pt-BR'),
          selectOption: data.point_type,
          userId: userPoint.id,
          day: dateCurrent.getDate(),
          month: dateCurrent.getMonth() + 1,
          year: dateCurrent.getFullYear(),
        })
        setSuccess('Ponto registrado com sucesso')
        console.log('sucess')
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
      <div>
        <p className="text-center font-semibold text-red-700">
          {errors.root?.message}
        </p>
        <p className="text-center font-semibold text-green-600">{success}</p>
        <h1 className="mb-6 text-center text-[2rem] font-extrabold text-white">
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
          <Select.Root {...register('point_type')}>
            {optionsSelect.map(option => (
              <Select.Option key={option.label} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select.Root>
          <Button
            type="submit"
            className="rounded-2xl border-none bg-[#262626] px-6 py-2 text-sm font-semibold text-white focus-visible:text-black"
          >
            Marcar
          </Button>
        </form>
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
