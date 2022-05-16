import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/index.css'

// This is needed because the signIn function of NEAR asks for the global Buffer
import { Buffer as BufferPolyfill } from 'buffer'
declare var Buffer: typeof BufferPolyfill;
// @ts-ignore
globalThis.Buffer = BufferPolyfill

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
