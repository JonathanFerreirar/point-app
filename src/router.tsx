import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'

import App from './App'
import Loading from './loading'

const Home = lazy(() => import('./pages/home/Home'))
const Ponto = lazy(() => import('./pages/ponto/Ponto'))
const Admin = lazy(() => import('./pages/admin/Admin'))
const Employees = lazy(() => import('./pages/employees/Employees'))

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<Loading />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/ponto"
            element={
              <Suspense fallback={<Loading />}>
                <Ponto />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<Loading />}>
                <Admin />
              </Suspense>
            }
          />
          <Route
            path="/employees"
            element={
              <Suspense fallback={<Loading />}>
                <Employees />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
