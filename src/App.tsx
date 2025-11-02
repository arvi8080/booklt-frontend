import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Details from './pages/Details'
import Checkout from './pages/Checkout'
import Result from './pages/Result'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experience/:id" element={<Details />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
