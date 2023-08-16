import { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@/components/Select/select'
import { optionsMounth, optionsSelect } from '@/data/options'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Input } from '../Input/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ipcRenderer } from 'electron'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'

interface DialogDemoProps {
  children: ReactNode
}

const EditSchema = z.object({
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
  pontotype: z.enum([
    'entry',
    'lunch_exit',
    'lunch_entry',
    'extra_exit',
    'extra_entry',
    'exit',
  ]),
  id: z.string().nonempty('Por favor, preencha esse campo com algum valor.'),
  year: z.string().nonempty('Por favor, preencha esse campo com algum valor.'),
  day: z
    .string()
    .nonempty('Por favor, preencha esse campo com algum valor.')
    .refine(
      value => /^(?:[1-9]|[1-9][0-9]+)$/.test(value),
      'Não use 0 a esquerda.',
    ),
  //.regex(/^(?:[1-9]|0[1-9]|10)$/, 'Não coloque 0 a esquerda.'),
  time: z
    .string()
    .nonempty('Coloque a carga horária')
    .regex(/\d{2}:\d{2}/, 'Formato inválido. Ex: 04:00'),
})

type EditUsuarioType = z.infer<typeof EditSchema>

const EditModal = ({ children }: DialogDemoProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUsuarioType>({
    resolver: zodResolver(EditSchema),
  })

  const onSubmit: SubmitHandler<EditUsuarioType> = async data => {
    try {
      await ipcRenderer.invoke('updatingUser', {
        timeCurrent: data?.time,
        selectOption: data?.pontotype,
        userId: data?.id,
        day: data?.day,
        month: data?.mounth,
        year: data?.year,
      })
      toast.success('Sucesso ✅')

      setTimeout(() => {
        window.location.reload()
      }, 750)
    } catch (error) {
      console.log({ error })
      toast.error('Falha tente novamente mais tarde ✅')
    }
    reset()
  }
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] h-[85vh] w-[85vw]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-center text-[17px] font-medium">
            <>Edição</>
          </Dialog.Title>
          <div className="overflow-auto">
            {errors.time && (
              <p className="text-center font-semibold text-red-700">
                {errors.time.message}
              </p>
            )}
            {errors.day && (
              <p className="text-center font-semibold text-red-700">
                {errors.day.message}
              </p>
            )}
            <form
              className="flex flex-col items-center gap-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mt-5 flex gap-10">
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
                <Select.Root
                  {...register('pontotype')}
                  className={cn(
                    errors.pontotype &&
                      'bg-red-600 hover:bg-red-600 focus-visible:bg-red-600',
                  )}
                >
                  {optionsSelect.map(option => (
                    <Select.Option key={option.label} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select.Root>
              </div>
              <Input
                {...register('id')}
                className={cn(
                  errors.id &&
                    'border-red-600 hover:border-red-600 focus-visible:border-red-600',
                )}
                placeholder="Selecione o funcionario"
              />
              <Input
                {...register('year')}
                className={cn(
                  errors.year &&
                    'border-red-600 hover:border-red-600 focus-visible:border-red-600',
                )}
                {...register('year')}
                placeholder="Selecione o ano ex: 2023"
              />
              <Input
                {...register('day')}
                className={cn(
                  errors.day &&
                    'border-red-600 hover:border-red-600 focus-visible:border-red-600',
                )}
                {...register('day')}
                placeholder="Selecione o dia ex: 1 "
              />

              <Input
                placeholder="Selecione o Horario ex: 09:30"
                {...register('time')}
                className={cn(
                  errors.time &&
                    'border-red-600 hover:border-red-600 focus-visible:border-red-600',
                )}
                {...register('time')}
              />
              <div className="mt-[4%] flex gap-14">
                <button
                  type="submit"
                  className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] border border-black px-[15px] font-medium leading-none focus:shadow-[0_0_0_1px] focus:outline-none"
                >
                  Salvar
                </button>

                <Dialog.Close asChild>
                  <button className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] border border-black px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                    Cancelar
                  </button>
                </Dialog.Close>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default EditModal
