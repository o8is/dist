import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GunProvider } from './providers/gun-provider'
import { Header } from './components/header'
import { HomePage } from './pages/home'
import { ViewGistPage } from './pages/view-gist'
import { MyGistsPage } from './pages/my-gists'
import { AboutPage } from './pages/about'
import 'github-markdown-css/github-markdown-dark.css'

function App() {
  return (
    <GunProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-o8-black text-o8-white font-sans selection:bg-o8-primary/30 relative pb-20">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/my" element={<MyGistsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/:id" element={<ViewGistPage />} />
            </Routes>
          </main>
          <footer className="site-footer">
            <a href="https://o8.is" target="_blank" rel="noopener noreferrer">Decentralize Everything</a>
          </footer>
        </div>
      </BrowserRouter>
    </GunProvider>
  )
}

export default App
