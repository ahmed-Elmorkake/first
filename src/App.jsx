import Amenities from './components/Amenities'
import Calculator from './components/Calculator'
import Contact from './components/Contact'
import FloorPlans from './components/FloorPlans'
import Footer from './components/Footer'
import Gallery from './components/Gallery'
import Hero from './components/Hero'
import Navbar from './components/Navbar'

function App() {
  return <div className="overflow-x-hidden bg-stone-50 text-slate-900"><Navbar /><main><Hero /><Gallery /><FloorPlans /><Amenities /><Calculator /><Contact /></main><Footer /></div>
}
export default App
