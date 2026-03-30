import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { loadDrumSamples } from '@drums/services/drumSounds'
import { unlockAudio } from '@shared/services/audioUnlock'

// On first user interaction, unlock all AudioContexts (mobile requires gesture)
// and preload drum samples so playback is instant.
const preload = () => {
  unlockAudio()
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
