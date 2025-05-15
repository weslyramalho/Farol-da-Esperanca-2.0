

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import HistoriasDeSucesso from './pages/HistoriasDeSucesso'
import Oportunidades from './pages/Oportunidades'
import RecursosEApoio from './pages/RecursosEApoio'
import SobreNos from './pages/SobreNos'
import Home from './pages/Home'

function App() {
 

  return (
    
    <BrowserRouter>
    <div className='container'>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/historiasdesucesso' element={<HistoriasDeSucesso />} />
        <Route path='/oportunidades' element={<Oportunidades/>}/>
        <Route path='/recursoseapoio' element={<RecursosEApoio/>}/>
        <Route path='/sobrenos' element={<SobreNos/>}/>
      </Routes>
     
      <Footer />
    </div>
    </BrowserRouter>
  )
}

export default App
