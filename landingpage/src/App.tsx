import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import Models from './components/Models'
import QuoteForm from './components/QuoteForm'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import Footer from './components/Footer'

function App() {
  const [selectedModel, setSelectedModel] = useState<string>('')

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Benefits />
      <Models onSelectModel={setSelectedModel} />
      <QuoteForm selectedModel={selectedModel} />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
