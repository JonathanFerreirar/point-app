import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function App() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') navigate('/')
    }

    document
      .querySelector('body')
      ?.addEventListener('keydown', event => handleKeyDown(event))

    return document
      .querySelector('body')
      ?.removeEventListener('keydown', event => handleKeyDown(event))
  }, [navigate])
  return (
    <main className="h-screen p-4">
      <Outlet />
    </main>
  )
}
