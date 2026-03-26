import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { loadDrumSamples } from './services/drumSounds'

// Preload drum samples on first user interaction (AudioContext needs gesture)
const preload = () => {
  loadDrumSamples()
  document.removeEventListener('click', preload)
  document.removeEventListener('keydown', preload)
}
document.addEventListener('click', preload, { once: true })
document.addEventListener('keydown', preload, { once: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
