import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold">FlowPay</h1>
          <nav>
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-gray-900 mr-4">
              Home
            </Link>
            <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              About
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
