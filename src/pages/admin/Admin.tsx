import { Button } from '@/components/Button/button'
import { Input } from '@/components/Input/input'
import { Link, useNavigate } from 'react-router-dom'
import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useGetUser } from '@/context/pointContext'

type adminLoginFields = z.infer<typeof adminSquema>

interface dataForm {
  id: number
  name: string
  password: string
}

const adminSquema = z.object({
  userName: z.string().nonempty('Preencha ambos os campos.').trim(),
  password: z.string().nonempty('Preencha ambos os campos.').trim(),
})

function Admin() {
  const [userAdmin, setUserAdmin] = useState<dataForm[]>([])
  const [handleShowPassword, setHandleShowPassword] = useState(false)
  const navigate = useNavigate()
  const { handleSetAdmin } = useGetUser()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<adminLoginFields>({
    resolver: zodResolver(adminSquema),
  })
  const getAdmin = async () => {
    const result = await ipcRenderer.invoke('getAdmin')
    return result
  }

  const onSubmit = (data: adminLoginFields) => {
    const result = userAdmin.find(user => {
      return (
        user.name === data.userName &&
        user.password === data.password &&
        user.password.includes('contec@')
      )
    })

    if (result) {
      navigate('/employees')
      handleSetAdmin(true)
      return
    }
    if (data.userName === 'geral' && data.password === 'geral') {
      navigate('/employees')
      handleSetAdmin(false)
      return
    }
    setError('root', { message: 'Senha ou usuario errado.' })
  }

  useEffect(() => {
    const getAdminFromData = async () => {
      const result = await getAdmin()

      setUserAdmin(result)
    }
    getAdminFromData()
  }, [])

  return (
    <section className="relative grid h-full grid-cols-[minmax(280px,600px)] items-center justify-center">
      <div>
        <form
          className="flex flex-col items-center gap-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="mb-6 text-center text-[2rem] font-extrabold text-white">
            ADMIN
          </h1>
          <div className="mb-8 flex flex-col items-center gap-y-5">
            <div className="max-w-lg">
              <Input
                placeholder="Username..."
                className="rounded-default mb-2 w-full"
                {...register('userName')}
              />
              {!!errors.userName && (
                <p className="absolute  top-10 font-semibold text-red-950">
                  {errors.userName.message}
                </p>
              )}
            </div>
            <div className="max-w-lg ">
              <div className="relative flex flex-col items-center justify-center">
                <Input
                  type={handleShowPassword ? 'text' : 'password'}
                  placeholder="Senha..."
                  className="rounded-default mb-2  w-full"
                  {...register('password')}
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
              </div>
              {!!errors.password && (
                <p className="absolute top-10 text-center font-semibold text-red-950">
                  {errors.password.message}
                </p>
              )}
            </div>
            {!!errors.root && (
              <p className="absolute top-20 text-center font-semibold text-red-950">
                {errors.root.message}
              </p>
            )}
          </div>

          <Button className="rounded-2xl border-none bg-[#262626] px-6 py-2 text-sm font-semibold text-white focus-visible:text-black">
            Entrar
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

export default Admin
