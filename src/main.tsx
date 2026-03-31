import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { loadDrumSamples } from '@drums/services/drumSounds'

// On first user interaction, create the AudioContext (which auto-unlocks via
// registerAudioContext) and preload drum samples. iOS WebKit requires a
// buffer source .start() during a user gesture — loadDrumSamples() calls ctx()
// which handles this.
const preload = () => {
  loadDrumSamples().catch(() => {})
  document.removeEventListener('click', preload)
  document.removeEventListener('keydown', preload)
  document.removeEventListener('touchstart', preload)
  document.removeEventListener('touchend', preload)
}
document.addEventListener('click', preload)
document.addEventListener('keydown', preload)
document.addEventListener('touchstart', preload)
document.addEventListener('touchend', preload)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
