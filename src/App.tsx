import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Emprendedores from './pages/Emprendedores'
import EmprendedorDetail from './pages/EmprendedorDetail'
import Noticias from './pages/Noticias'
import NoticiaDetail from './pages/NoticiaDetail'
import Unirse from './pages/Unirse'
import Admin from './pages/Admin'
import Checkout from './pages/Checkout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/emprendedores" element={<Emprendedores />} />
      <Route path="/emprendedor/:slug" element={<EmprendedorDetail />} />
      <Route path="/noticias" element={<Noticias />} />
      <Route path="/noticia/:slug" element={<NoticiaDetail />} />
      <Route path="/unirse" element={<Unirse />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
